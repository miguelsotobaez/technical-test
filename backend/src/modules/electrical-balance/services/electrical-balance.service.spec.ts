import { Test, TestingModule } from '@nestjs/testing';
import { ElectricalBalanceService } from './electrical-balance.service';
import { HttpService } from '@nestjs/axios';
import { ElectricalBalanceRepository } from '../repositories/electrical-balance.repository';
import { firstValueFrom, of } from 'rxjs';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
import { Model } from 'mongoose';

describe('ElectricalBalanceService', () => {
  let service: ElectricalBalanceService;
  let httpService: HttpService;
  let repository: ElectricalBalanceRepository;

  const mockREEData = {
    data: {
      type: 'Balance de energía eléctrica',
      id: 'bal1',
      attributes: {
        title: 'Balance de energía eléctrica',
        'last-update': '2025-01-28T18:25:35.000+01:00',
        description: 'Balance eléctrico: asignación de unidades de producción según combustible principal.'
      }
    },
    included: [
      {
        type: 'Renovable',
        id: 'Renovable',
        attributes: {
          title: 'Renovable',
          content: [
            {
              type: 'Hidráulica',
              attributes: {
                values: [
                  {
                    value: 4063907.231,
                    datetime: '2024-04-01T00:00:00.000+02:00'
                  }
                ]
              }
            },
            {
              type: 'Eólica',
              attributes: {
                values: [
                  {
                    value: 4705864.428,
                    datetime: '2024-04-01T00:00:00.000+02:00'
                  }
                ]
              }
            },
            {
              type: 'Solar fotovoltaica',
              attributes: {
                values: [
                  {
                    value: 4027609.21,
                    datetime: '2024-04-01T00:00:00.000+02:00'
                  }
                ]
              }
            }
          ]
        }
      },
      {
        type: 'No-Renovable',
        id: 'No-Renovable',
        attributes: {
          title: 'No-Renovable',
          content: [
            {
              type: 'Nuclear',
              attributes: {
                values: [
                  {
                    value: 3525863.763,
                    datetime: '2024-04-01T00:00:00.000+02:00'
                  }
                ]
              }
            }
          ]
        }
      },
      {
        type: 'Demanda',
        id: 'Demanda en b.c.',
        attributes: {
          title: 'Demanda',
          content: [
            {
              type: 'Demanda en b.c.',
              attributes: {
                values: [
                  {
                    value: 19292564.304,
                    datetime: '2024-04-01T00:00:00.000+02:00'
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectricalBalanceService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnValue(of({ data: mockREEData }))
          }
        },
        {
          provide: ElectricalBalanceRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findByDateRange: jest.fn().mockResolvedValue([])
          }
        }
      ]
    }).compile();

    service = module.get<ElectricalBalanceService>(ElectricalBalanceService);
    httpService = module.get<HttpService>(HttpService);
    repository = module.get<ElectricalBalanceRepository>(ElectricalBalanceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAndStoreDataByDateRange', () => {
    it('should fetch and transform data from REE API', async () => {
      const startDate = new Date('2024-04-01');
      const endDate = new Date('2024-04-30');

      const result = await service.fetchAndStoreDataByDateRange(startDate, endDate);

      expect(httpService.get).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('API Error');
      });

      const startDate = new Date('2024-04-01');
      const endDate = new Date('2024-04-30');

      await expect(service.fetchAndStoreDataByDateRange(startDate, endDate)).rejects.toThrow('API Error');
    });
  });

  describe('getBalanceByDateRange', () => {
    it('should return balance data for the given date range', async () => {
      const mockBalanceData = [
        {
          _id: '123',
          timestamp: new Date('2024-04-01'),
          generation: 1000,
          demand: 2000,
          imports: 100,
          exports: 50,
          balance: 950,
          details: {
            renewable: 500,
            nonRenewable: 500,
            nuclear: 200,
            hydro: 100,
            wind: 150,
            solar: 50,
            thermal: 100
          }
        } as ElectricalBalance
      ];

      jest.spyOn(repository, 'findByDateRange').mockResolvedValue(mockBalanceData);

      const startDate = new Date('2024-04-01');
      const endDate = new Date('2024-04-30');

      const result = await service.getBalanceByDateRange(startDate, endDate);

      expect(repository.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toEqual(mockBalanceData);
    });
  });
}); 