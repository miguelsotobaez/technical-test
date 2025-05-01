import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';

@Injectable()
export class ElectricalBalanceRepository {
  private readonly logger = new Logger(ElectricalBalanceRepository.name);

  constructor(
    @InjectModel('ElectricalBalance')
    private readonly electricalBalanceModel: Model<ElectricalBalance>,
  ) {}

  async create(data: Partial<ElectricalBalance>): Promise<ElectricalBalance> {
    try {
      const createdBalance = new this.electricalBalanceModel(data);
      return createdBalance.save();
    } catch (error) {
      this.logger.error('Error creating balance record', error);
      throw error;
    }
  }

  async upsertByTimestamp(
    data: Partial<ElectricalBalance>,
  ): Promise<ElectricalBalance> {
    try {
      if (!data.timestamp) {
        throw new Error('Timestamp is required for upsert operation');
      }

      this.logger.log(
        `Upserting balance record for timestamp: ${data.timestamp}`,
      );

      return this.electricalBalanceModel
        .findOneAndUpdate({ timestamp: data.timestamp }, data, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        })
        .exec();
    } catch (error) {
      this.logger.error('Error upserting balance record', error);
      throw error;
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ElectricalBalance[]> {
    try {
      // Asegurarse de que las fechas sean válidas
      if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error('Invalid start date');
      }
      if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error('Invalid end date');
      }

      this.logger.log(
        `Finding balance records between ${startDate.toISOString()} and ${endDate.toISOString()}`,
      );

      return this.electricalBalanceModel
        .find({
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ timestamp: 1 })
        .exec();
    } catch (error) {
      this.logger.error('Error finding balance records', error);
      throw error;
    }
  }

  async findLatest(): Promise<ElectricalBalance | null> {
    try {
      return this.electricalBalanceModel
        .findOne()
        .sort({ timestamp: -1 })
        .exec();
    } catch (error) {
      this.logger.error('Error finding latest balance record', error);
      throw error;
    }
  }
}
