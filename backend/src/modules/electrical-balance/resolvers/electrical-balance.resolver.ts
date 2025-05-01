import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ElectricalBalanceService } from '../services/electrical-balance.service';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
import { ElectricalBalanceType } from '../types/electrical-balance.type';

@Resolver(() => ElectricalBalanceType)
export class ElectricalBalanceResolver {
  constructor(
    private readonly electricalBalanceService: ElectricalBalanceService,
  ) {}

  @Query(() => [ElectricalBalanceType])
  async getBalanceByDateRange(
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date,
  ): Promise<ElectricalBalance[]> {
    return this.electricalBalanceService.getBalanceByDateRange(
      startDate,
      endDate,
    );
  }

  @Mutation(() => [ElectricalBalanceType])
  async fetchBalanceByDateRange(
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date,
  ): Promise<ElectricalBalance[]> {
    return this.electricalBalanceService.fetchAndStoreDataByDateRange(
      startDate,
      endDate,
    );
  }
}
