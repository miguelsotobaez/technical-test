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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricalBalanceResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const electrical_balance_service_1 = require("../services/electrical-balance.service");
const electrical_balance_type_1 = require("../types/electrical-balance.type");
let ElectricalBalanceResolver = class ElectricalBalanceResolver {
    electricalBalanceService;
    constructor(electricalBalanceService) {
        this.electricalBalanceService = electricalBalanceService;
    }
    async getBalanceByDateRange(startDate, endDate) {
        return this.electricalBalanceService.getBalanceByDateRange(startDate, endDate);
    }
    async fetchBalanceByDateRange(startDate, endDate) {
        return this.electricalBalanceService.fetchAndStoreDataByDateRange(startDate, endDate);
    }
};
exports.ElectricalBalanceResolver = ElectricalBalanceResolver;
__decorate([
    (0, graphql_1.Query)(() => [electrical_balance_type_1.ElectricalBalanceType]),
    __param(0, (0, graphql_1.Args)('startDate', { type: () => Date })),
    __param(1, (0, graphql_1.Args)('endDate', { type: () => Date })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], ElectricalBalanceResolver.prototype, "getBalanceByDateRange", null);
__decorate([
    (0, graphql_1.Mutation)(() => [electrical_balance_type_1.ElectricalBalanceType]),
    __param(0, (0, graphql_1.Args)('startDate', { type: () => Date })),
    __param(1, (0, graphql_1.Args)('endDate', { type: () => Date })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], ElectricalBalanceResolver.prototype, "fetchBalanceByDateRange", null);
exports.ElectricalBalanceResolver = ElectricalBalanceResolver = __decorate([
    (0, graphql_1.Resolver)(() => electrical_balance_type_1.ElectricalBalanceType),
    __metadata("design:paramtypes", [electrical_balance_service_1.ElectricalBalanceService])
], ElectricalBalanceResolver);
//# sourceMappingURL=electrical-balance.resolver.js.map