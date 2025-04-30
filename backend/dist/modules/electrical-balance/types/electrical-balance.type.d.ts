export declare class ElectricalBalanceDetails {
    renewable: number;
    nonRenewable: number;
    storage: number;
    nuclear: number;
    hydro: number;
    wind: number;
    solar: number;
    thermal: number;
}
export declare class ElectricalBalanceType {
    _id: string;
    timestamp: Date;
    generation: number;
    demand: number;
    imports: number;
    exports: number;
    balance: number;
    details: ElectricalBalanceDetails;
}
