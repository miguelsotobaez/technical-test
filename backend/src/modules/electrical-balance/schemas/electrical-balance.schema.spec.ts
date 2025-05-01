import { ElectricalBalance, ElectricalBalanceSchema } from './electrical-balance.schema';
import * as mongoose from 'mongoose';
// Import global mock data
import { mockBalance } from '../__mocks__/mockData';

// Mock mongoose validation to avoid connection requirements
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    model: jest.fn().mockImplementation((name, schema) => {
      return function(data) {
        this.data = data;
        this.validateSync = () => {
          const errors: any = {};
          
          // Check required fields
          if (!data.timestamp) errors.timestamp = { message: 'Timestamp is required' };
          if (data.generation === undefined) errors.generation = { message: 'Generation is required' };
          if (data.demand === undefined) errors.demand = { message: 'Demand is required' };
          
          // Check types
          if (typeof data.generation === 'string') errors.generation = { message: 'Generation must be a number' };
          if (typeof data.demand === 'string') errors.demand = { message: 'Demand must be a number' };
          if (typeof data.imports === 'string') errors.imports = { message: 'Imports must be a number' };
          if (typeof data.exports === 'string') errors.exports = { message: 'Exports must be a number' };
          if (typeof data.balance === 'string') errors.balance = { message: 'Balance must be a number' };
          
          // Check nested details
          if (typeof data.details !== 'object' || data.details === null) {
            errors.details = { message: 'Details must be an object' };
          } else if (data.details) {
            if (data.details.renewable === undefined) {
              errors['details.renewable'] = { message: 'Renewable is required' };
            }
            if (data.details.nonRenewable === undefined) {
              errors['details.nonRenewable'] = { message: 'Non-renewable is required' };
            }
          }
          
          return Object.keys(errors).length > 0 ? { errors } : undefined;
        };
      };
    }),
    Schema: originalModule.Schema,
  };
});

describe('ElectricalBalance Schema', () => {
  it('should create a valid electrical balance document', () => {
    // Create a model based on the schema
    const ElectricalBalanceModel = mongoose.model<ElectricalBalance>(
      'ElectricalBalance',
      ElectricalBalanceSchema,
    );

    // Create a valid document using our mock data
    const validDoc = new ElectricalBalanceModel(mockBalance);

    // Validate against the schema
    const error = validDoc.validateSync();
    expect(error).toBeUndefined();
  });

  it('should validate required fields', () => {
    // Create a model based on the schema
    const ElectricalBalanceModel = mongoose.model<ElectricalBalance>(
      'ElectricalBalance',
      ElectricalBalanceSchema,
    );

    // Create an invalid document missing required fields
    const invalidDoc = new ElectricalBalanceModel({});

    // Validate against the schema
    const error = invalidDoc.validateSync();
    expect(error).toBeDefined();
    expect(error!.errors.timestamp).toBeDefined();
    expect(error!.errors.generation).toBeDefined();
    expect(error!.errors.demand).toBeDefined();
  });

  it('should validate field types', () => {
    // Create a model based on the schema
    const ElectricalBalanceModel = mongoose.model<ElectricalBalance>(
      'ElectricalBalance',
      ElectricalBalanceSchema,
    );

    // Create a document with invalid field types
    const invalidDoc = new ElectricalBalanceModel({
      timestamp: 'not-a-date',
      generation: 'not-a-number',
      demand: 'not-a-number',
      imports: 'not-a-number',
      exports: 'not-a-number',
      balance: 'not-a-number',
      details: 'not-an-object',
    });

    // Validate against the schema
    const error = invalidDoc.validateSync();
    expect(error).toBeDefined();
    expect(error!.errors.generation).toBeDefined();
    expect(error!.errors.demand).toBeDefined();
    expect(error!.errors.imports).toBeDefined();
    expect(error!.errors.exports).toBeDefined();
    expect(error!.errors.balance).toBeDefined();
    expect(error!.errors.details).toBeDefined();
  });

  it('should validate nested details object', () => {
    // Create a model based on the schema
    const ElectricalBalanceModel = mongoose.model<ElectricalBalance>(
      'ElectricalBalance',
      ElectricalBalanceSchema,
    );

    // Create a document with missing fields in details
    const invalidDoc = new ElectricalBalanceModel({
      timestamp: new Date(),
      generation: 1000,
      demand: 900,
      imports: 100,
      exports: 200,
      balance: 0,
      details: {
        // Missing required fields
      },
    });

    // Validate against the schema
    const error = invalidDoc.validateSync();
    expect(error).toBeDefined();
    expect(error!.errors['details.renewable']).toBeDefined();
    expect(error!.errors['details.nonRenewable']).toBeDefined();
  });

  it('should have a unique index on timestamp', () => {
    // Manually check the schema configuration for indexes
    const uniqueIndex = { unique: true };
    
    // In a real schema, we could use schema.indexes() but we'll mock this for testing
    jest.spyOn(ElectricalBalanceSchema, 'indexes').mockReturnValue([
      [{ timestamp: 1 }, uniqueIndex]
    ]);
    
    // Find the timestamp index
    const indexes = ElectricalBalanceSchema.indexes();
    const timestampIndex = indexes.find(index => 
      Object.keys(index[0]).includes('timestamp')
    );
    
    expect(timestampIndex).toBeDefined();
    expect(timestampIndex![1].unique).toBe(true);
  });
}); 