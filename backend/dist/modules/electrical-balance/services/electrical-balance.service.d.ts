import { OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ElectricalBalanceRepository } from '../repositories/electrical-balance.repository';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
export declare class ElectricalBalanceService implements OnModuleInit {
    private readonly httpService;
    private readonly electricalBalanceRepository;
    private readonly logger;
    private readonly REE_API_BASE_URL;
    constructor(httpService: HttpService, electricalBalanceRepository: ElectricalBalanceRepository);
    onModuleInit(): Promise<void>;
    private fetchAndStoreDataByDateRangeInternal;
    fetchAndStoreDataByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]>;
    getBalanceByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]>;
    getBalanceByDateRangeInternal(startDate: Date, endDate: Date): Promise<ElectricalBalance[]>;
    private transformREEData;
    private getValuesByType;
    private getValueForTimestamp;
    private getSpecificGeneration;
    private getInternationalBalance;
}
