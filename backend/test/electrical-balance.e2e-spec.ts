import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { 
  ElectricalBalance,
  ElectricalBalanceSchema 
} from '../src/modules/electrical-balance/schemas/electrical-balance.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ElectricalBalanceResolver } from '../src/modules/electrical-balance/resolvers/electrical-balance.resolver';
import { ElectricalBalanceService } from '../src/modules/electrical-balance/services/electrical-balance.service';
import { ElectricalBalanceRepository } from '../src/modules/electrical-balance/repositories/electrical-balance.repository';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';

// Increase the timeout for the whole test suite significantly
jest.setTimeout(120000);

describe('ElectricalBalanceModule (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let electricalBalanceModel: Model<ElectricalBalance>;
  
  // Helper function to generate random electrical balance data using faker
  const generateFakeElectricalBalance = () => ({
    timestamp: faker.date.between({ 
      from: new Date('2023-01-01'), 
      to: new Date('2023-12-31') 
    }),
    generation: faker.number.int({ min: 15000, max: 40000 }),
    demand: faker.number.int({ min: 15000, max: 40000 }),
    imports: faker.number.int({ min: 0, max: 5000 }),
    exports: faker.number.int({ min: 0, max: 5000 }),
    balance: 0, // Will be calculated on save
    details: {
      renewable: faker.number.int({ min: 5000, max: 20000 }),
      nonRenewable: faker.number.int({ min: 5000, max: 20000 }),
      nuclear: faker.number.int({ min: 1000, max: 5000 }),
      hydro: faker.number.int({ min: 1000, max: 5000 }),
      wind: faker.number.int({ min: 1000, max: 5000 }),
      solar: faker.number.int({ min: 1000, max: 5000 }),
      thermal: faker.number.int({ min: 1000, max: 5000 }),
      storage: 0
    }
  });
  
  // Set up all test resources before any tests run
  beforeAll(async () => {
    jest.setTimeout(90000); // 90 seconds just for this hook
    
    try {
      // Create an in-memory MongoDB server
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      
      console.log('Using MongoDB Memory Server URI:', mongoUri);
      
      // Create a simplified testing module
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          // Set up config for tests
          ConfigModule.forRoot({ 
            isGlobal: true,
            ignoreEnvFile: true,
            load: [() => ({ 
              MONGODB_URI: mongoUri,
              NODE_ENV: 'test'
            })],
          }),
          
          // Connect to the in-memory database
          MongooseModule.forRoot(mongoUri),
          
          // Set up the model
          MongooseModule.forFeature([
            { name: 'ElectricalBalance', schema: ElectricalBalanceSchema }
          ]),
          
          // Set up HTTP for service
          HttpModule,
          
          // Set up GraphQL with minimal config for testing
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            playground: false,
          }),
        ],
        // Register necessary providers
        providers: [
          ElectricalBalanceService,
          ElectricalBalanceResolver,
          ElectricalBalanceRepository
        ]
      }).compile();
      
      // Create the application
      app = moduleFixture.createNestApplication();
      await app.init();
      
      // Get the model
      electricalBalanceModel = moduleFixture.get<Model<ElectricalBalance>>(
        getModelToken('ElectricalBalance')
      );
      
      console.log('Test setup completed successfully');
    } catch (error) {
      console.error('Error during test setup:', error);
      throw error;
    }
  }, 90000); // 90 second timeout for setup

  // Clean up all resources after all tests finish
  afterAll(async () => {
    console.log('Running test cleanup...');
    try {
      if (app) {
        await app.close();
        console.log('App closed successfully');
      }
      if (mongod) {
        await mongod.stop();
        console.log('MongoDB memory server stopped successfully');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, 30000); // 30 second timeout for teardown

  // Simple test just to verify GraphQL endpoint is working
  it('should query GraphQL endpoint', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          {
            __schema {
              types {
                name
              }
            }
          }
        `
      });
      
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  }, 30000); // 30 second timeout
}); 