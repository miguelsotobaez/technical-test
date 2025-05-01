import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class ElectricalBalanceDetails {
  @Field(() => Float)
  renewable: number;

  @Field(() => Float)
  nonRenewable: number;

  @Field(() => Float)
  storage: number;

  @Field(() => Float)
  nuclear: number;

  @Field(() => Float)
  hydro: number;

  @Field(() => Float)
  wind: number;

  @Field(() => Float)
  solar: number;

  @Field(() => Float)
  thermal: number;
}

@ObjectType()
export class ElectricalBalanceType {
  @Field()
  _id: string;

  @Field()
  timestamp: Date;

  @Field(() => Float)
  generation: number;

  @Field(() => Float)
  demand: number;

  @Field(() => Float)
  imports: number;

  @Field(() => Float)
  exports: number;

  @Field(() => Float)
  balance: number;

  @Field(() => ElectricalBalanceDetails)
  details: ElectricalBalanceDetails;
}
