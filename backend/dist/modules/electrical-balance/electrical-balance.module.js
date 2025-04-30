"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricalBalanceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const axios_1 = require("@nestjs/axios");
const path_1 = require("path");
const electrical_balance_service_1 = require("./services/electrical-balance.service");
const electrical_balance_resolver_1 = require("./resolvers/electrical-balance.resolver");
const electrical_balance_repository_1 = require("./repositories/electrical-balance.repository");
const electrical_balance_schema_1 = require("./schemas/electrical-balance.schema");
let ElectricalBalanceModule = class ElectricalBalanceModule {
};
exports.ElectricalBalanceModule = ElectricalBalanceModule;
exports.ElectricalBalanceModule = ElectricalBalanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([
                { name: 'ElectricalBalance', schema: electrical_balance_schema_1.ElectricalBalanceSchema }
            ]),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
            }),
        ],
        providers: [
            electrical_balance_service_1.ElectricalBalanceService,
            electrical_balance_resolver_1.ElectricalBalanceResolver,
            electrical_balance_repository_1.ElectricalBalanceRepository,
        ],
        exports: [electrical_balance_service_1.ElectricalBalanceService],
    })
], ElectricalBalanceModule);
//# sourceMappingURL=electrical-balance.module.js.map