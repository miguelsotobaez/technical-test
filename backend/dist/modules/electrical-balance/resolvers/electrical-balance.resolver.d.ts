import { ElectricalBalanceService } from '../services/electrical-balance.service';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
export declare class ElectricalBalanceResolver {
    private readonly electricalBalanceService;
    constructor(electricalBalanceService: ElectricalBalanceService);
    getBalanceByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]>;
    fetchBalanceByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]>;
}
