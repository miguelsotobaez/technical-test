import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { ElectricalBalanceService } from './services/electrical-balance.service';
import { ElectricalBalanceResolver } from './resolvers/electrical-balance.resolver';
import { ElectricalBalanceRepository } from './repositories/electrical-balance.repository';
import { ElectricalBalanceSchema } from './schemas/electrical-balance.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'ElectricalBalance', schema: ElectricalBalanceSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
  ],
  providers: [
    ElectricalBalanceService,
    ElectricalBalanceResolver,
    ElectricalBalanceRepository,
  ],
  exports: [ElectricalBalanceService],
})
export class ElectricalBalanceModule {}
