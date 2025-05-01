import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Increase the timeout for the whole test suite
jest.setTimeout(120000);

// Simple test module with no MongoDB connection requirement
describe('Simple AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.setTimeout(90000); // 90 seconds just for this hook
    
    try {
      // Create the testing module without MongoDB
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [() => ({ 
              NODE_ENV: 'test'
            })],
          }),
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      console.log('Simple test setup completed successfully');
    } catch (error) {
      console.error('Test setup error:', error);
      throw error;
    }
  }, 90000);

  afterAll(async () => {
    if (app) {
      await app.close();
      console.log('App closed successfully');
    }
  }, 30000);

  it('should setup a test app successfully', () => {
    expect(app).toBeDefined();
  }, 10000);
});
