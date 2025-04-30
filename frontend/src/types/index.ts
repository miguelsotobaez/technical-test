export interface ElectricalBalanceDetails {
  renewable: number;
  nonRenewable: number;
  storage: number;
  nuclear: number;
  hydro: number;
  wind: number;
  solar: number;
  thermal: number;
}

export interface ElectricalBalance {
  _id: string;
  timestamp: string;
  generation: number;
  demand: number;
  imports: number;
  exports: number;
  balance: number;
  details: ElectricalBalanceDetails;
} 