import { Test, TestingModule } from '@nestjs/testing';
import { ElectricalBalanceResolver } from './electrical-balance.resolver';
import { ElectricalBalanceService } from '../services/electrical-balance.service';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
// Import global mock data
import { mockBalance } from '../__mocks__/mockData';

describe('ElectricalBalanceResolver', () => {
  let resolver: ElectricalBalanceResolver;
  let service: ElectricalBalanceService;
  
  // Create array of mock balances for testing
  const mockBalances = [mockBalance as ElectricalBalance];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectricalBalanceResolver,
        {
          provide: ElectricalBalanceService,
          useValue: {
            getBalanceByDateRange: jest.fn().mockResolvedValue(mockBalances),
            fetchAndStoreDataByDateRange: jest.fn().mockResolvedValue(mockBalances),
          },
        },
      ],
    }).compile();

    resolver = module.get<ElectricalBalanceResolver>(ElectricalBalanceResolver);
    service = module.get<ElectricalBalanceService>(ElectricalBalanceService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getBalanceByDateRange', () => {
    it('should return an array of electrical balance entries', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const result = await resolver.getBalanceByDateRange(startDate, endDate);
      
      expect(service.getBalanceByDateRange).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toEqual(mockBalances);
    });

    it('should handle errors from the service', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const error = new Error('Service error');
      
      jest.spyOn(service, 'getBalanceByDateRange').mockRejectedValueOnce(error);
      
      await expect(resolver.getBalanceByDateRange(startDate, endDate)).rejects.toThrow(error);
    });
  });

  describe('fetchBalanceByDateRange', () => {
    it('should fetch and store balance data for a date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const result = await resolver.fetchBalanceByDateRange(startDate, endDate);
      
      expect(service.fetchAndStoreDataByDateRange).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toEqual(mockBalances);
    });

    it('should handle errors from the service', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const error = new Error('Service error');
      
      jest.spyOn(service, 'fetchAndStoreDataByDateRange').mockRejectedValueOnce(error);
      
      await expect(resolver.fetchBalanceByDateRange(startDate, endDate)).rejects.toThrow(error);
    });
  });
}); 