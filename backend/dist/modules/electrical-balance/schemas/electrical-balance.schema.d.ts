import { Document } from 'mongoose';
export declare class ElectricalBalance extends Document {
    timestamp: Date;
    generation: number;
    demand: number;
    imports: number;
    exports: number;
    balance: number;
    details: {
        renewable: number;
        nonRenewable: number;
        storage: number;
        nuclear: number;
        hydro: number;
        wind: number;
        solar: number;
        thermal: number;
    };
}
export declare const ElectricalBalanceSchema: import("mongoose").Schema<ElectricalBalance, import("mongoose").Model<ElectricalBalance, any, any, any, Document<unknown, any, ElectricalBalance, any> & ElectricalBalance & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ElectricalBalance, Document<unknown, {}, import("mongoose").FlatRecord<ElectricalBalance>, {}> & import("mongoose").FlatRecord<ElectricalBalance> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
