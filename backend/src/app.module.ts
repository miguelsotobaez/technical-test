import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectricalBalanceModule } from './modules/electrical-balance/electrical-balance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/electrical-balance',
      }),
    }),
    ElectricalBalanceModule,
  ],
})
export class AppModule {
  /**
   * Creates a version of the AppModule suitable for testing
   * without connecting to MongoDB (connection is handled separately in tests)
   */
  static forTest(mongoUri?: string): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // Set test environment variables
          ignoreEnvFile: true,
          load: [() => ({ 
            MONGODB_URI: mongoUri || 'mongodb://localhost:27017/test-db',
            NODE_ENV: 'test'
          })],
        }),
        // Set up MongoDB with the test URI
        MongooseModule.forRoot(mongoUri || 'mongodb://localhost:27017/test-db'),
        // Import the electrical balance module
        ElectricalBalanceModule,
      ],
    };
  }
}
