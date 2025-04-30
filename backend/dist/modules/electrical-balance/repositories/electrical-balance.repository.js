"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ElectricalBalanceRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricalBalanceRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ElectricalBalanceRepository = ElectricalBalanceRepository_1 = class ElectricalBalanceRepository {
    electricalBalanceModel;
    logger = new common_1.Logger(ElectricalBalanceRepository_1.name);
    constructor(electricalBalanceModel) {
        this.electricalBalanceModel = electricalBalanceModel;
    }
    async create(data) {
        try {
            const createdBalance = new this.electricalBalanceModel(data);
            return createdBalance.save();
        }
        catch (error) {
            this.logger.error('Error creating balance record', error);
            throw error;
        }
    }
    async upsertByTimestamp(data) {
        try {
            if (!data.timestamp) {
                throw new Error('Timestamp is required for upsert operation');
            }
            this.logger.log(`Upserting balance record for timestamp: ${data.timestamp}`);
            return this.electricalBalanceModel.findOneAndUpdate({ timestamp: data.timestamp }, data, { upsert: true, new: true, setDefaultsOnInsert: true }).exec();
        }
        catch (error) {
            this.logger.error('Error upserting balance record', error);
            throw error;
        }
    }
    async findByDateRange(startDate, endDate) {
        try {
            if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
                throw new Error('Invalid start date');
            }
            if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
                throw new Error('Invalid end date');
            }
            this.logger.log(`Finding balance records between ${startDate.toISOString()} and ${endDate.toISOString()}`);
            return this.electricalBalanceModel
                .find({
                timestamp: {
                    $gte: startDate,
                    $lte: endDate,
                },
            })
                .sort({ timestamp: 1 })
                .exec();
        }
        catch (error) {
            this.logger.error('Error finding balance records', error);
            throw error;
        }
    }
    async findLatest() {
        try {
            return this.electricalBalanceModel
                .findOne()
                .sort({ timestamp: -1 })
                .exec();
        }
        catch (error) {
            this.logger.error('Error finding latest balance record', error);
            throw error;
        }
    }
};
exports.ElectricalBalanceRepository = ElectricalBalanceRepository;
exports.ElectricalBalanceRepository = ElectricalBalanceRepository = ElectricalBalanceRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('ElectricalBalance')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ElectricalBalanceRepository);
//# sourceMappingURL=electrical-balance.repository.js.map