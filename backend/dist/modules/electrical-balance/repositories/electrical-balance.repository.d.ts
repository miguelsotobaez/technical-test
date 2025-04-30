import { Model } from 'mongoose';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
export declare class ElectricalBalanceRepository {
    private readonly electricalBalanceModel;
    private readonly logger;
    constructor(electricalBalanceModel: Model<ElectricalBalance>);
    create(data: Partial<ElectricalBalance>): Promise<ElectricalBalance>;
    upsertByTimestamp(data: Partial<ElectricalBalance>): Promise<ElectricalBalance>;
    findByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]>;
    findLatest(): Promise<ElectricalBalance | null>;
}
