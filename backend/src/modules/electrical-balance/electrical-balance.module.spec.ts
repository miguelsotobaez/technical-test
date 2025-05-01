import { ElectricalBalanceModule } from './electrical-balance.module';
import { ElectricalBalanceService } from './services/electrical-balance.service';
import { ElectricalBalanceResolver } from './resolvers/electrical-balance.resolver';
import { ElectricalBalanceRepository } from './repositories/electrical-balance.repository';
import { HttpModule } from '@nestjs/axios';

// Mock all NestJS decorator functions
jest.mock('@nestjs/mongoose', () => ({
  Prop: jest.fn(() => jest.fn()),
  Schema: jest.fn(() => jest.fn()),
  SchemaFactory: {
    createForClass: jest.fn().mockReturnValue({})
  },
  MongooseModule: {
    forFeature: jest.fn().mockReturnValue({})
  },
  InjectModel: jest.fn(() => jest.fn())
}));

jest.mock('@nestjs/graphql', () => ({
  ObjectType: jest.fn(() => jest.fn()),
  Field: jest.fn(() => jest.fn()),
  Args: jest.fn(() => jest.fn()),
  Query: jest.fn(() => jest.fn()),
  Resolver: jest.fn(() => jest.fn()),
  InputType: jest.fn(() => jest.fn()),
  Mutation: jest.fn(() => jest.fn()),
  GraphQLModule: {
    forRoot: jest.fn().mockReturnValue({})
  }
}));

jest.mock('@nestjs/apollo', () => ({
  ApolloDriver: jest.fn(),
  ApolloDriverConfig: jest.fn()
}));

jest.mock('@nestjs/common', () => {
  const original = jest.requireActual('@nestjs/common');
  return {
    ...original,
    Injectable: jest.fn(() => jest.fn()),
    Module: jest.fn((options) => {
      return (target) => {
        // Almacenar los metadatos para que podamos recuperarlos en las pruebas
        Reflect.defineMetadata('imports', options.imports || [], target);
        Reflect.defineMetadata('providers', options.providers || [], target);
        Reflect.defineMetadata('exports', options.exports || [], target);
        Reflect.defineMetadata('__nestModule', true, target);
      };
    })
  };
});

jest.mock('./repositories/electrical-balance.repository', () => ({
  ElectricalBalanceRepository: class MockRepository {}
}));

jest.mock('./resolvers/electrical-balance.resolver', () => ({
  ElectricalBalanceResolver: class MockResolver {}
}));

jest.mock('./services/electrical-balance.service', () => ({
  ElectricalBalanceService: class MockService {}
}));

describe('ElectricalBalanceModule', () => {
  it('should be defined as a class', () => {
    expect(ElectricalBalanceModule).toBeDefined();
    expect(typeof ElectricalBalanceModule).toBe('function');
  });

  it('should have module metadata', () => {
    // Verificar que tiene decorador de módulo
    const metadata = Reflect.getMetadata('__nestModule', ElectricalBalanceModule);
    expect(metadata).toBeDefined();
  });

  it('should contain HttpModule in imports', () => {
    const metadata = Reflect.getMetadata('imports', ElectricalBalanceModule);
    expect(metadata).toBeDefined();
    expect(metadata).toContain(HttpModule);
  });

  it('should provide the correct services', () => {
    const metadata = Reflect.getMetadata('providers', ElectricalBalanceModule);
    expect(metadata).toBeDefined();
    expect(metadata).toContain(ElectricalBalanceService);
    expect(metadata).toContain(ElectricalBalanceResolver);
    expect(metadata).toContain(ElectricalBalanceRepository);
  });

  it('should export ElectricalBalanceService', () => {
    const metadata = Reflect.getMetadata('exports', ElectricalBalanceModule);
    expect(metadata).toBeDefined();
    expect(metadata).toContain(ElectricalBalanceService);
  });
}); 