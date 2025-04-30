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
var ElectricalBalanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricalBalanceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const electrical_balance_repository_1 = require("../repositories/electrical-balance.repository");
let ElectricalBalanceService = ElectricalBalanceService_1 = class ElectricalBalanceService {
    httpService;
    electricalBalanceRepository;
    logger = new common_1.Logger(ElectricalBalanceService_1.name);
    REE_API_BASE_URL = 'https://apidatos.ree.es/es/datos/balance/balance-electrico';
    constructor(httpService, electricalBalanceRepository) {
        this.httpService = httpService;
        this.electricalBalanceRepository = electricalBalanceRepository;
    }
    async onModuleInit() {
        this.logger.log('Inicializando datos históricos de los últimos 5 años...');
        const currentYear = new Date().getFullYear();
        try {
            for (let year = currentYear; year >= currentYear - 10; year--) {
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31);
                const existingData = await this.electricalBalanceRepository.findByDateRange(startDate, endDate);
                if (existingData.length > 0) {
                    this.logger.log(`Ya existen ${existingData.length} registros para el año ${year}, omitiendo carga...`);
                    continue;
                }
                this.logger.log(`Cargando datos del año ${year}...`);
                await this.fetchAndStoreDataByDateRangeInternal(startDate, endDate);
                if (year > currentYear - 4) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            this.logger.log('Datos históricos cargados correctamente');
        }
        catch (error) {
            this.logger.error('Error al cargar datos históricos', error);
        }
    }
    async fetchAndStoreDataByDateRangeInternal(startDate, endDate) {
        try {
            if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
                throw new Error('Invalid start date');
            }
            if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
                throw new Error('Invalid end date');
            }
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            const url = `${this.REE_API_BASE_URL}?start_date=${formattedStartDate}&end_date=${formattedEndDate}&time_trunc=month&type=balance&widget=balance-electrico&defaultMagnitude=MWh`;
            this.logger.log(`Fetching data from REE API: ${url}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const balanceData = this.transformREEData(response.data);
            const validBalanceData = balanceData.filter((data) => {
                return Boolean(data && data.timestamp instanceof Date && !isNaN(data.timestamp.getTime()));
            });
            if (validBalanceData.length > 0) {
                this.logger.log(`Storing ${validBalanceData.length} valid records in database`);
                validBalanceData.forEach(data => {
                    this.logger.debug(`Processing record for timestamp: ${data.timestamp.toISOString()}`);
                });
                return Promise.all(validBalanceData.map(data => this.electricalBalanceRepository.upsertByTimestamp(data)));
            }
            else {
                this.logger.warn('No valid data was transformed from the API response');
                return [];
            }
        }
        catch (error) {
            this.logger.error('Error fetching data from REE API', error);
            throw error;
        }
    }
    async fetchAndStoreDataByDateRange(startDate, endDate) {
        try {
            if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
                throw new Error('Invalid start date');
            }
            if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
                throw new Error('Invalid end date');
            }
            return this.fetchAndStoreDataByDateRangeInternal(startDate, endDate);
        }
        catch (error) {
            this.logger.error('Error fetching data from REE API', error);
            throw error;
        }
    }
    async getBalanceByDateRange(startDate, endDate) {
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            throw new Error('Invalid start date');
        }
        if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
            throw new Error('Invalid end date');
        }
        return this.electricalBalanceRepository.findByDateRange(startDate, endDate);
    }
    async getBalanceByDateRangeInternal(startDate, endDate) {
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            throw new Error('Invalid start date');
        }
        if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
            throw new Error('Invalid end date');
        }
        return this.electricalBalanceRepository.findByDateRange(startDate, endDate);
    }
    transformREEData(apiData) {
        const transformedData = [];
        const included = apiData.included || [];
        this.logger.log('Available types in API response:');
        included.forEach(item => {
            this.logger.log(`- ${item.type}`);
        });
        const renewableData = included.find((item) => item.type === 'Renovable');
        const nonRenewableData = included.find((item) => item.type === 'No-Renovable');
        const storageData = included.find((item) => item.type === 'Almacenamiento');
        const demandData = included.find((item) => item.type === 'Demanda');
        if (!renewableData || !nonRenewableData || !demandData) {
            this.logger.warn('Missing required data in API response');
            this.logger.warn(`Renovable data found: ${!!renewableData}`);
            this.logger.warn(`No-Renovable data found: ${!!nonRenewableData}`);
            this.logger.warn(`Almacenamiento data found: ${!!storageData}`);
            this.logger.warn(`Demanda data found: ${!!demandData}`);
            return transformedData;
        }
        const renewableValues = this.getValuesByType(renewableData, 'Renovable');
        const nonRenewableValues = this.getValuesByType(nonRenewableData, 'No-Renovable');
        const storageValues = storageData ? this.getValuesByType(storageData, 'Almacenamiento') : [];
        const demandValues = this.getValuesByType(demandData, 'Demanda');
        this.logger.log(`Found renewable values: ${renewableValues.length}`);
        this.logger.log(`Found non-renewable values: ${nonRenewableValues.length}`);
        this.logger.log(`Found storage values: ${storageValues.length}`);
        this.logger.log(`Found demand values: ${demandValues.length}`);
        const allTimestamps = new Set();
        [renewableValues, nonRenewableValues, storageValues, demandValues].forEach(values => {
            values.forEach(value => {
                if (value.datetime) {
                    allTimestamps.add(value.datetime);
                }
            });
        });
        this.logger.log(`Found ${allTimestamps.size} unique timestamps`);
        Array.from(allTimestamps).forEach(datetimeStr => {
            try {
                const timestamp = new Date(datetimeStr);
                if (isNaN(timestamp.getTime())) {
                    this.logger.warn(`Invalid date format: ${datetimeStr}`);
                    return;
                }
                const renewableGeneration = this.getValueForTimestamp(renewableValues, timestamp);
                const nonRenewableGeneration = this.getValueForTimestamp(nonRenewableValues, timestamp);
                const storageGeneration = this.getValueForTimestamp(storageValues, timestamp);
                const demandValue = this.getValueForTimestamp(demandValues, timestamp);
                const nuclear = this.getSpecificGeneration(nonRenewableData, 'Nuclear', timestamp);
                const hydro = this.getSpecificGeneration(renewableData, 'Hidráulica', timestamp);
                const wind = this.getSpecificGeneration(renewableData, 'Eólica', timestamp);
                const solar = this.getSpecificGeneration(renewableData, 'Solar fotovoltaica', timestamp);
                const thermal = this.getSpecificGeneration(nonRenewableData, 'Ciclo combinado', timestamp);
                const internationalBalance = this.getInternationalBalance(demandData, timestamp);
                const totalGeneration = renewableGeneration + nonRenewableGeneration + storageGeneration;
                const balance = demandValue ? totalGeneration - demandValue : 0;
                const record = {
                    timestamp,
                    generation: totalGeneration,
                    demand: demandValue || 0,
                    imports: internationalBalance > 0 ? internationalBalance : 0,
                    exports: internationalBalance < 0 ? Math.abs(internationalBalance) : 0,
                    balance,
                    details: {
                        renewable: renewableGeneration,
                        nonRenewable: nonRenewableGeneration,
                        storage: storageGeneration,
                        nuclear,
                        hydro,
                        wind,
                        solar,
                        thermal,
                    },
                };
                if (record.timestamp instanceof Date && !isNaN(record.timestamp.getTime())) {
                    transformedData.push(record);
                    this.logger.debug(`Added record for timestamp: ${record.timestamp.toISOString()}`);
                }
                else {
                    this.logger.warn(`Skipping record with invalid timestamp: ${datetimeStr}`);
                }
            }
            catch (error) {
                this.logger.error(`Error processing timestamp ${datetimeStr}:`, error);
            }
        });
        this.logger.log(`Successfully transformed ${transformedData.length} records`);
        return transformedData;
    }
    getValuesByType(data, type) {
        if (!data?.attributes?.content) {
            return [];
        }
        const content = data.attributes.content.find((content) => content.type === type);
        if (!content?.attributes?.values) {
            const otherContent = data.attributes.content[0];
            if (otherContent?.attributes?.values) {
                return otherContent.attributes.values;
            }
            return [];
        }
        return content.attributes.values;
    }
    getValueForTimestamp(values, timestamp) {
        if (!values || values.length === 0) {
            return 0;
        }
        const value = values.find((value) => new Date(value.datetime).getTime() === timestamp.getTime());
        return value?.value || 0;
    }
    getSpecificGeneration(data, type, timestamp) {
        if (!data)
            return 0;
        try {
            const content = data.attributes.content.find((content) => content.type === type);
            if (!content?.attributes?.values) {
                return 0;
            }
            const value = content.attributes.values.find((value) => new Date(value.datetime).getTime() === timestamp.getTime());
            return value?.value || 0;
        }
        catch (error) {
            this.logger.warn(`Error getting specific generation for ${type}:`, error);
            return 0;
        }
    }
    getInternationalBalance(demandData, timestamp) {
        if (!demandData)
            return 0;
        try {
            const content = demandData.attributes.content.find((content) => content.type === 'Saldo I. internacionales');
            if (!content?.attributes?.values) {
                for (const c of demandData.attributes.content) {
                    if (c.type.includes('internacional') && c.attributes?.values) {
                        const value = c.attributes.values.find((v) => new Date(v.datetime).getTime() === timestamp.getTime());
                        if (value) {
                            return value.value;
                        }
                    }
                }
                return 0;
            }
            const value = content.attributes.values.find((value) => new Date(value.datetime).getTime() === timestamp.getTime());
            return value?.value || 0;
        }
        catch (error) {
            this.logger.warn('Error getting international balance:', error);
            return 0;
        }
    }
};
exports.ElectricalBalanceService = ElectricalBalanceService;
exports.ElectricalBalanceService = ElectricalBalanceService = ElectricalBalanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        electrical_balance_repository_1.ElectricalBalanceRepository])
], ElectricalBalanceService);
//# sourceMappingURL=electrical-balance.service.js.map