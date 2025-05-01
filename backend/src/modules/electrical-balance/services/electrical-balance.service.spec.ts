import { Test, TestingModule } from '@nestjs/testing';
import { ElectricalBalanceService } from './electrical-balance.service';
import { HttpService } from '@nestjs/axios';
import { ElectricalBalanceRepository } from '../repositories/electrical-balance.repository';
import { of } from 'rxjs';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
import { mockREEData, mockBalance } from '../__mocks__/mockData';

describe('ElectricalBalanceService', () => {
  let service: ElectricalBalanceService;
  let httpService: HttpService;
  let repository: ElectricalBalanceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectricalBalanceService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnValue(of({ data: mockREEData })),
          },
        },
        {
          provide: ElectricalBalanceRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            upsertByTimestamp: jest.fn().mockResolvedValue(mockBalance),
            findByDateRange: jest.fn().mockResolvedValue([mockBalance]),
          },
        },
      ],
    }).compile();

    service = module.get<ElectricalBalanceService>(ElectricalBalanceService);
    httpService = module.get<HttpService>(HttpService);
    repository = module.get<ElectricalBalanceRepository>(
      ElectricalBalanceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAndStoreDataByDateRange', () => {
    it('should fetch and transform data from REE API', async () => {
      const startDate = new Date('2024-04-01');
      const endDate = new Date('2024-04-30');

      const result = await service.fetchAndStoreDataByDateRange(
        startDate,
        endDate,
      );

      expect(httpService.get).toHaveBeenCalled();
      expect(repository.upsertByTimestamp).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('API Error');
      });

      const startDate = new Date('2024-04-01');
      const endDate = new Date('2024-04-30');

      await expect(
        service.fetchAndStoreDataByDateRange(startDate, endDate),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getBalanceByDateRange', () => {
    it('should return balance data for the given date range', async () => {
      const mockBalanceData = [
        {
          _id: '123',
          ...mockBalance,
          timestamp: new Date('2024-04-01'),
        } as ElectricalBalance,
      ];

      jest
        .spyOn(repository, 'findByDateRange')
        .mockResolvedValue(mockBalanceData);

      const startDate = new Date('2024-04-01');
      const endDate = new Date('2024-04-30');

      const result = await service.getBalanceByDateRange(startDate, endDate);

      expect(repository.findByDateRange).toHaveBeenCalledWith(
        startDate,
        endDate,
      );
      expect(result).toEqual(mockBalanceData);
    });
  });
});
