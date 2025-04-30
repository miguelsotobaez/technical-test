import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ElectricalBalanceRepository } from '../repositories/electrical-balance.repository';
import { ElectricalBalance } from '../schemas/electrical-balance.schema';
import { REEApiResponse, REEDataItem, REEDataValue } from '../dto/ree-api-response.dto';

interface BalanceRecord {
  timestamp: Date;
  generation: number;
  demand: number;
  imports: number;
  exports: number;
  balance: number;
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

@Injectable()
export class ElectricalBalanceService {
  private readonly logger = new Logger(ElectricalBalanceService.name);
  private readonly REE_API_BASE_URL = 'https://apidatos.ree.es/es/datos/balance/balance-electrico';

  constructor(
    private readonly httpService: HttpService,
    private readonly electricalBalanceRepository: ElectricalBalanceRepository,
  ) {}

  async fetchAndStoreDataByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]> {
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
      
      const response = await firstValueFrom(
        this.httpService.get<REEApiResponse>(url),
      );

      const balanceData = this.transformREEData(response.data);
      
      // Validar cada registro y filtrar aquellos que no tienen timestamp válido
      const validBalanceData: BalanceRecord[] = balanceData.filter((data): data is BalanceRecord => {
        return Boolean(data && data.timestamp instanceof Date && !isNaN(data.timestamp.getTime()));
      });
      
      if (validBalanceData.length > 0) {
        this.logger.log(`Storing ${validBalanceData.length} valid records in database`);
        validBalanceData.forEach(data => {
          this.logger.debug(`Processing record for timestamp: ${data.timestamp.toISOString()}`);
        });
        
        return Promise.all(validBalanceData.map(data => 
          this.electricalBalanceRepository.upsertByTimestamp(data)
        ));
      } else {
        this.logger.warn('No valid data was transformed from the API response');
        return [];
      }
    } catch (error) {
      this.logger.error('Error fetching data from REE API', error);
      throw error;
    }
  }

  async getBalanceByDateRange(startDate: Date, endDate: Date): Promise<ElectricalBalance[]> {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new Error('Invalid start date');
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new Error('Invalid end date');
    }

    return this.electricalBalanceRepository.findByDateRange(startDate, endDate);
  }

  private transformREEData(apiData: REEApiResponse): Partial<ElectricalBalance>[] {
    const transformedData: Partial<ElectricalBalance>[] = [];
    
    // Extract data from the API response
    const included = apiData.included || [];
    
    // Log available types for debugging
    this.logger.log('Available types in API response:');
    included.forEach(item => {
      this.logger.log(`- ${item.type}`);
    });
    
    // Find all required data types
    const renewableData = included.find((item: REEDataItem) => item.type === 'Renovable');
    const nonRenewableData = included.find((item: REEDataItem) => item.type === 'No-Renovable');
    const storageData = included.find((item: REEDataItem) => item.type === 'Almacenamiento');
    const demandData = included.find((item: REEDataItem) => item.type === 'Demanda');

    if (!renewableData || !nonRenewableData || !demandData) {
      this.logger.warn('Missing required data in API response');
      this.logger.warn(`Renovable data found: ${!!renewableData}`);
      this.logger.warn(`No-Renovable data found: ${!!nonRenewableData}`);
      this.logger.warn(`Almacenamiento data found: ${!!storageData}`);
      this.logger.warn(`Demanda data found: ${!!demandData}`);
      return transformedData;
    }

    // Collect all values from each source
    const renewableValues = this.getValuesByType(renewableData, 'Renovable');
    const nonRenewableValues = this.getValuesByType(nonRenewableData, 'No-Renovable');
    const storageValues = storageData ? this.getValuesByType(storageData, 'Almacenamiento') : [];
    const demandValues = this.getValuesByType(demandData, 'Demanda');

    // Log found values for debugging
    this.logger.log(`Found renewable values: ${renewableValues.length}`);
    this.logger.log(`Found non-renewable values: ${nonRenewableValues.length}`);
    this.logger.log(`Found storage values: ${storageValues.length}`);
    this.logger.log(`Found demand values: ${demandValues.length}`);

    // Extract all unique timestamps from all data sources
    const allTimestamps = new Set<string>();
    
    [renewableValues, nonRenewableValues, storageValues, demandValues].forEach(values => {
      values.forEach(value => {
        if (value.datetime) {
          allTimestamps.add(value.datetime);
        }
      });
    });

    this.logger.log(`Found ${allTimestamps.size} unique timestamps`);

    // Process each unique timestamp
    Array.from(allTimestamps).forEach(datetimeStr => {
      try {
        const timestamp = new Date(datetimeStr);
        if (isNaN(timestamp.getTime())) {
          this.logger.warn(`Invalid date format: ${datetimeStr}`);
          return;
        }

        // Get all values for this timestamp
        const renewableGeneration = this.getValueForTimestamp(renewableValues, timestamp);
        const nonRenewableGeneration = this.getValueForTimestamp(nonRenewableValues, timestamp);
        const storageGeneration = this.getValueForTimestamp(storageValues, timestamp);
        const demandValue = this.getValueForTimestamp(demandValues, timestamp);

        // Get specific generation values for this timestamp
        const nuclear = this.getSpecificGeneration(nonRenewableData, 'Nuclear', timestamp);
        const hydro = this.getSpecificGeneration(renewableData, 'Hidráulica', timestamp);
        const wind = this.getSpecificGeneration(renewableData, 'Eólica', timestamp);
        const solar = this.getSpecificGeneration(renewableData, 'Solar fotovoltaica', timestamp);
        const thermal = this.getSpecificGeneration(nonRenewableData, 'Ciclo combinado', timestamp);

        // Get international balance
        const internationalBalance = this.getInternationalBalance(demandData, timestamp);

        // Calculate total generation including storage
        const totalGeneration = renewableGeneration + nonRenewableGeneration + storageGeneration;

        // Calculate balance (if demand is available)
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

        // Verificar que el timestamp sea válido
        if (record.timestamp instanceof Date && !isNaN(record.timestamp.getTime())) {
          transformedData.push(record);
          this.logger.debug(`Added record for timestamp: ${record.timestamp.toISOString()}`);
        } else {
          this.logger.warn(`Skipping record with invalid timestamp: ${datetimeStr}`);
        }
      } catch (error) {
        this.logger.error(`Error processing timestamp ${datetimeStr}:`, error);
      }
    });

    this.logger.log(`Successfully transformed ${transformedData.length} records`);
    return transformedData;
  }

  private getValuesByType(data: REEDataItem, type: string): REEDataValue[] {
    if (!data?.attributes?.content) {
      return [];
    }
    
    const content = data.attributes.content.find((content) => 
      content.type === type
    );
    
    if (!content?.attributes?.values) {
      const otherContent = data.attributes.content[0];
      if (otherContent?.attributes?.values) {
        return otherContent.attributes.values;
      }
      return [];
    }
    
    return content.attributes.values;
  }

  private getValueForTimestamp(values: REEDataValue[], timestamp: Date): number {
    if (!values || values.length === 0) {
      return 0;
    }
    
    const value = values.find((value) => 
      new Date(value.datetime).getTime() === timestamp.getTime()
    );
    
    return value?.value || 0;
  }

  private getSpecificGeneration(data: REEDataItem, type: string, timestamp: Date): number {
    if (!data) return 0;
    
    try {
      const content = data.attributes.content.find((content) => 
        content.type === type
      );
      
      if (!content?.attributes?.values) {
        return 0;
      }
      
      const value = content.attributes.values.find((value) => 
        new Date(value.datetime).getTime() === timestamp.getTime()
      );
      
      return value?.value || 0;
    } catch (error) {
      this.logger.warn(`Error getting specific generation for ${type}:`, error);
      return 0;
    }
  }

  private getInternationalBalance(demandData: REEDataItem, timestamp: Date): number {
    if (!demandData) return 0;
    
    try {
      const content = demandData.attributes.content.find((content) => 
        content.type === 'Saldo I. internacionales'
      );
      
      if (!content?.attributes?.values) {
        // Buscar en otros contenidos
        for (const c of demandData.attributes.content) {
          if (c.type.includes('internacional') && c.attributes?.values) {
            const value = c.attributes.values.find((v) => 
              new Date(v.datetime).getTime() === timestamp.getTime()
            );
            if (value) {
              return value.value;
            }
          }
        }
        return 0;
      }
      
      const value = content.attributes.values.find((value) => 
        new Date(value.datetime).getTime() === timestamp.getTime()
      );
      
      return value?.value || 0;
    } catch (error) {
      this.logger.warn('Error getting international balance:', error);
      return 0;
    }
  }
} 