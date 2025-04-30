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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricalBalanceType = exports.ElectricalBalanceDetails = void 0;
const graphql_1 = require("@nestjs/graphql");
let ElectricalBalanceDetails = class ElectricalBalanceDetails {
    renewable;
    nonRenewable;
    storage;
    nuclear;
    hydro;
    wind;
    solar;
    thermal;
};
exports.ElectricalBalanceDetails = ElectricalBalanceDetails;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "renewable", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "nonRenewable", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "storage", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "nuclear", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "hydro", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "wind", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "solar", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceDetails.prototype, "thermal", void 0);
exports.ElectricalBalanceDetails = ElectricalBalanceDetails = __decorate([
    (0, graphql_1.ObjectType)()
], ElectricalBalanceDetails);
let ElectricalBalanceType = class ElectricalBalanceType {
    _id;
    timestamp;
    generation;
    demand;
    imports;
    exports;
    balance;
    details;
};
exports.ElectricalBalanceType = ElectricalBalanceType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ElectricalBalanceType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ElectricalBalanceType.prototype, "timestamp", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceType.prototype, "generation", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceType.prototype, "demand", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceType.prototype, "imports", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceType.prototype, "exports", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ElectricalBalanceType.prototype, "balance", void 0);
__decorate([
    (0, graphql_1.Field)(() => ElectricalBalanceDetails),
    __metadata("design:type", ElectricalBalanceDetails)
], ElectricalBalanceType.prototype, "details", void 0);
exports.ElectricalBalanceType = ElectricalBalanceType = __decorate([
    (0, graphql_1.ObjectType)()
], ElectricalBalanceType);
//# sourceMappingURL=electrical-balance.type.js.map