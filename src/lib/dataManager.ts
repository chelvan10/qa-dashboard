import { 
  AllFormData, 
  RealTimeConfig, 
  DataSourceConfig
} from '@/types/forms';

// Data Management Service
export class DataManagerService {
  private static instance: DataManagerService;
  private realTimeConfig: RealTimeConfig;
  private formData: Map<string, AllFormData> = new Map();
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map();

  private constructor() {
    this.realTimeConfig = {
      enabled: false,
      dataSources: []
    };
    this.loadStoredConfiguration();
  }

  public static getInstance(): DataManagerService {
    if (!DataManagerService.instance) {
      DataManagerService.instance = new DataManagerService();
    }
    return DataManagerService.instance;
  }

  // Real-time Configuration Management
  public setRealTimeMode(enabled: boolean): void {
    this.realTimeConfig.enabled = enabled;
    this.saveConfiguration();
    this.notifySubscribers('realTimeMode', { enabled });
    
    if (enabled) {
      this.startRealTimeDataFetching();
    } else {
      this.stopRealTimeDataFetching();
    }
  }

  public isRealTimeEnabled(): boolean {
    return this.realTimeConfig.enabled;
  }

  public addDataSource(config: DataSourceConfig): void {
    this.realTimeConfig.dataSources.push(config);
    this.saveConfiguration();
  }

  public removeDataSource(name: string): void {
    this.realTimeConfig.dataSources = this.realTimeConfig.dataSources.filter(
      source => source.name !== name
    );
    this.saveConfiguration();
  }

  public getDataSources(): DataSourceConfig[] {
    return this.realTimeConfig.dataSources;
  }

  // Form Data Management
  public saveFormData(formType: string, data: AllFormData): void {
    this.formData.set(formType, data);
    this.saveToLocalStorage(formType, data);
    this.notifySubscribers(formType, data);
  }

  public getFormData(formType: string): AllFormData | null {
    return this.formData.get(formType) || this.loadFromLocalStorage(formType);
  }

  public getAllFormData(): Map<string, AllFormData> {
    return new Map(this.formData);
  }

  // Data Subscription System
  public subscribe(dataType: string, callback: (data: unknown) => void): () => void {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set());
    }
    this.subscribers.get(dataType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(dataType)?.delete(callback);
    };
  }

  private notifySubscribers(dataType: string, data: unknown): void {
    this.subscribers.get(dataType)?.forEach(callback => callback(data));
  }

  // Real-time Data Fetching
  private async startRealTimeDataFetching(): Promise<void> {
    for (const dataSource of this.realTimeConfig.dataSources) {
      if (dataSource.enabled) {
        this.scheduleDataFetch(dataSource);
      }
    }
  }

  private stopRealTimeDataFetching(): void {
    // Clear all intervals and stop fetching
    // Implementation would clear timers here
  }

  private scheduleDataFetch(dataSource: DataSourceConfig): void {
    const fetchData = async () => {
      try {
        const data = await this.fetchFromDataSource(dataSource);
        this.processRealTimeData(dataSource, data);
      } catch (error) {
        console.error(`Failed to fetch from ${dataSource.name}:`, error);
        // Fall back to form data
        this.fallbackToFormData(dataSource);
      }
    };

    // Initial fetch
    fetchData();

    // Schedule periodic fetches
    setInterval(fetchData, dataSource.refreshInterval * 60 * 1000);
  }

  private async fetchFromDataSource(dataSource: DataSourceConfig): Promise<Record<string, unknown>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication headers based on auth method
    switch (dataSource.authMethod) {
      case 'token':
        headers['Authorization'] = `Bearer ${this.getToken(dataSource.name)}`;
        break;
      case 'apikey':
        headers['X-API-Key'] = this.getApiKey(dataSource.name);
        break;
      case 'basic':
        const credentials = this.getBasicCredentials(dataSource.name);
        headers['Authorization'] = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
        break;
    }

    const response = await fetch(dataSource.apiEndpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json() as Record<string, unknown>;
  }

  private processRealTimeData(dataSource: DataSourceConfig, rawData: Record<string, unknown>): void {
    const processedData: Record<string, unknown> = {};

    for (const fieldMapping of dataSource.fields) {
      try {
        let value = this.extractFieldValue(rawData, fieldMapping.sourceField);
        
        if (fieldMapping.transformation) {
          value = this.applyTransformation(value, fieldMapping.transformation);
        }
        
        processedData[fieldMapping.dashboardField] = value;
      } catch (error) {
        console.error(`Failed to process field ${fieldMapping.dashboardField}:`, error);
        
        if (fieldMapping.fallbackToForm) {
          // Use form data as fallback
          const formData = this.getFormDataForField(fieldMapping.dashboardField);
          if (formData) {
            processedData[fieldMapping.dashboardField] = formData;
          }
        }
      }
    }

    // Notify subscribers with processed data
    this.notifySubscribers(`realtime-${dataSource.name}`, processedData);
  }

  private extractFieldValue(data: Record<string, unknown>, fieldPath: string): unknown {
    return fieldPath.split('.').reduce((obj: unknown, key: string) => 
      (obj && typeof obj === 'object' && key in obj) ? (obj as Record<string, unknown>)[key] : undefined, 
      data
    );
  }

  private applyTransformation(value: unknown, transformation: string): unknown {
    // Implementation for data transformations
    // This could include mathematical operations, data type conversions, etc.
    const numValue = typeof value === 'number' ? value : Number(value);
    
    switch (transformation) {
      case 'percentage':
        return Math.round(numValue * 100);
      case 'milliseconds':
        return Math.round(numValue);
      case 'round':
        return Math.round(numValue);
      default:
        return value;
    }
  }

  private fallbackToFormData(dataSource: DataSourceConfig): void {
    const fallbackData: Record<string, unknown> = {};
    
    for (const fieldMapping of dataSource.fields) {
      if (fieldMapping.fallbackToForm) {
        const formValue = this.getFormDataForField(fieldMapping.dashboardField);
        if (formValue !== null) {
          fallbackData[fieldMapping.dashboardField] = formValue;
        }
      }
    }

    if (Object.keys(fallbackData).length > 0) {
      this.notifySubscribers(`fallback-${dataSource.name}`, fallbackData);
    }
  }

  private getFormDataForField(fieldName: string): unknown {
    // Extract specific field from stored form data
    for (const [, data] of this.formData) {
      if (data && typeof data === 'object' && fieldName in data) {
        return (data as unknown as Record<string, unknown>)[fieldName];
      }
    }
    return null;
  }

  // Storage Management
  private saveConfiguration(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('realTimeConfig', JSON.stringify(this.realTimeConfig));
    }
  }

  private loadStoredConfiguration(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('realTimeConfig');
      if (stored) {
        try {
          this.realTimeConfig = JSON.parse(stored);
        } catch (error) {
          console.error('Failed to load real-time configuration:', error);
        }
      }
    }
  }

  private saveToLocalStorage(formType: string, data: AllFormData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`formData-${formType}`, JSON.stringify(data));
    }
  }

  private loadFromLocalStorage(formType: string): AllFormData | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`formData-${formType}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error(`Failed to load form data for ${formType}:`, error);
        }
      }
    }
    return null;
  }

  // Authentication Token Management
  private getToken(sourceName: string): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`token-${sourceName}`) || '';
    }
    return '';
  }

  private getApiKey(sourceName: string): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`apikey-${sourceName}`) || '';
    }
    return '';
  }

  private getBasicCredentials(sourceName: string): { username: string; password: string } {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`credentials-${sourceName}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error(`Failed to load credentials for ${sourceName}:`, error);
        }
      }
    }
    return { username: '', password: '' };
  }

  public setCredentials(sourceName: string, authMethod: string, credentials: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
  }): void {
    if (typeof window !== 'undefined') {
      switch (authMethod) {
        case 'token':
          if (credentials.token) {
            localStorage.setItem(`token-${sourceName}`, credentials.token);
          }
          break;
        case 'apikey':
          if (credentials.apiKey) {
            localStorage.setItem(`apikey-${sourceName}`, credentials.apiKey);
          }
          break;
        case 'basic':
          if (credentials.username && credentials.password) {
            localStorage.setItem(`credentials-${sourceName}`, JSON.stringify({
              username: credentials.username,
              password: credentials.password
            }));
          }
          break;
      }
    }
  }
}

// Export singleton instance - only create on client side
export const dataManager = typeof window !== 'undefined' ? DataManagerService.getInstance() : null;
