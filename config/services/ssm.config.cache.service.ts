import { Injectable } from '@nestjs/common';
import { SSM } from '@aws-sdk/client-ssm';
import { GlobalLogger } from 'logger/global.logger.service';

// Loads parameters from SSM and keeps them in a cache for a defined time
// Intended to be used with parameters that could constantly change

@Injectable()
export class SSMConfigService {
  private cache: Map<string, string> = new Map(); 
  private cacheExpiration: number = 0;
  private readonly cacheTTL: number = 3600000
  private parameterList: Set<string> = new Set([
    
  ]);
  private isRefreshing: boolean = false; 
  private ssmClient

  constructor(private logger: GlobalLogger) {
    this.cacheTTL =  3600000; 
    this.initializeCache();
    this.ssmClient = new SSM()
  }


  private async initializeCache(): Promise<void> {
    try {
      await this.refreshConfig();
      this.logger.debug('SSMConfigService: Initial cache populated.');
    } catch (error) {
      this.logger.error('SSMConfigService: Failed to initialize cache.', error);
    }
  }


  async getConfigValue(key: string): Promise<string | undefined> {
    const now = Date.now();


    if (now > this.cacheExpiration) {
      await this.refreshConfig();
    }


    if (!this.parameterList.has(key)) {
      this.parameterList.add(key);
      await this.fetchParameters([key]);
    }

    return this.cache.get(key);
  }


  private async refreshConfig(): Promise<void> {
    if (this.isRefreshing) {
      this.logger.warn('SSMConfigService: Refresh already in progress.');
      return;
    }

    this.isRefreshing = true;
    const now = Date.now();
    const parameterArray = Array.from(this.parameterList);
    const batches: string[][] = [];


    for (let i = 0; i < parameterArray.length; i += 10) {
      batches.push(parameterArray.slice(i, i + 10));
    }

    try {
      const fetchPromises = batches.map(batch => this.fetchParameters(batch));
      await Promise.all(fetchPromises);
      this.cacheExpiration = now + this.cacheTTL;
      this.logger.debug('SSMConfigService: Cache refreshed successfully.');
    } catch (error) {
      this.logger.error('SSMConfigService: Error refreshing cache.', error);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Fetch a batch of parameters and update the cache
  private async fetchParameters(batch: string[]): Promise<void> {
    const params = {
      Names: batch,
      WithDecryption: true,
    };

    try {
      const data = await this.ssmClient.getParameters(params);
      data.Parameters?.forEach(param => {
        if (param.Name && param.Value !== undefined) {
          this.cache.set(param.Name, param.Value);
        }
      });

      // Log missing parameters
      const fetchedNames = data.Parameters?.map(p => p.Name) || [];
      const missing = batch.filter(name => !fetchedNames.includes(name));
      if (missing.length > 0) {
        this.logger.warn(`SSMConfigService: Missing parameters: ${missing.join(', ')}`);
      }
    } catch (error) {
      this.logger.error(`SSMConfigService: Failed to fetch parameters: ${batch.join(', ')}`, error);
      throw error;
    }
  }
}
