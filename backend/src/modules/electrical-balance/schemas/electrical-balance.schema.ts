import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ElectricalBalance extends Document {
  @Prop({ required: true, index: true, unique: true })
  timestamp: Date;

  @Prop({ required: true })
  generation: number;

  @Prop({ required: true })
  demand: number;

  @Prop({ required: true })
  imports: number;

  @Prop({ required: true })
  exports: number;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: Object })
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

export const ElectricalBalanceSchema =
  SchemaFactory.createForClass(ElectricalBalance);
