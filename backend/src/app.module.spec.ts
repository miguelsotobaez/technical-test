import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectricalBalanceModule } from './modules/electrical-balance/electrical-balance.module';

// Mock dependencies
jest.mock('@nestjs/mongoose', () => ({
  MongooseModule: {
    forRootAsync: jest.fn().mockReturnValue({
      module: class MockMongooseModule {},
    }),
  },
}));

jest.mock('@nestjs/config', () => ({
  ConfigModule: {
    forRoot: jest.fn().mockReturnValue({
      module: class MockConfigModule {},
    }),
  },
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue('mongodb://localhost:27017/test'),
  })),
}));

jest.mock('./modules/electrical-balance/electrical-balance.module', () => ({
  ElectricalBalanceModule: class MockElectricalBalanceModule {},
}));

describe('AppModule', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('should compile the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
}); 