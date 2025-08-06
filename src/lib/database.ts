/**
 * Simple lightweight database system for storing form data with timestamps
 * Uses localStorage for client-side persistence with backup to indexedDB
 */

// Types for database operations
export interface FormDataType {
  [key: string]: unknown;
}

export interface ApplicationStatusType {
  health: 'excellent' | 'good' | 'warning' | 'critical';
  ragColor: 'red' | 'amber' | 'green';
  sprint?: string;
  daysLeft?: number;
  testCoverage?: number;
  testsPassed?: number;
  [key: string]: unknown;
}

export interface DatabaseRecord {
  id: string;
  type: string;
  data: FormDataType;
  timestamp: Date;
  version: number;
  metadata?: {
    userId?: string;
    sessionId?: string;
    source?: 'manual' | 'realtime' | 'import';
  };
}

export interface ApplicationStatusRecord {
  id: string;
  applicationName: string;
  status: ApplicationStatusType;
  timestamp: Date;
  version: number;
}

export interface DatabaseQuery {
  type?: string;
  fromDate?: Date;
  toDate?: Date;
  userId?: string;
  limit?: number;
}

export interface ExportData {
  formData: DatabaseRecord[];
  appStatus: ApplicationStatusRecord[];
  exportedAt: Date;
  version: number;
}

class SimpleDatabase {
  private dbName = 'qa-dashboard-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for form data
        if (!db.objectStoreNames.contains('formData')) {
          const formStore = db.createObjectStore('formData', { keyPath: 'id' });
          formStore.createIndex('type', 'type', { unique: false });
          formStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create object store for application status
        if (!db.objectStoreNames.contains('appStatus')) {
          const appStore = db.createObjectStore('appStatus', { keyPath: 'id' });
          appStore.createIndex('applicationName', 'applicationName', { unique: false });
          appStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Save form data with timestamp
  async saveFormData(type: string, data: FormDataType, metadata?: Partial<DatabaseRecord['metadata']>): Promise<string> {
    const record: DatabaseRecord = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      version: 1,
      metadata: {
        source: 'manual',
        sessionId: this.getSessionId(),
        ...metadata
      }
    };

    // Save to localStorage as backup
    this.saveToLocalStorage(record);

    // Save to IndexedDB
    if (this.db) {
      await this.saveToIndexedDB('formData', record);
    }

    return record.id;
  }

  // Save application status with RAG colors
  async saveApplicationStatus(applicationName: string, status: Partial<ApplicationStatusType>): Promise<string> {
    const record: ApplicationStatusRecord = {
      id: `app-${applicationName}-${Date.now()}`,
      applicationName,
      status: {
        health: status.health || 'good',
        ragColor: status.ragColor || 'green',
        sprint: status.sprint || 'Current Sprint',
        daysLeft: status.daysLeft || 0,
        testCoverage: status.testCoverage || 0,
        testsPassed: status.testsPassed || 0,
        ...status
      },
      timestamp: new Date(),
      version: 1
    };

    // Save to localStorage
    const appStatusKey = 'app-status';
    const existingStatus = JSON.parse(localStorage.getItem(appStatusKey) || '{}');
    existingStatus[applicationName] = record;
    localStorage.setItem(appStatusKey, JSON.stringify(existingStatus));

    // Save to IndexedDB
    if (this.db) {
      await this.saveToIndexedDB('appStatus', record);
    }

    return record.id;
  }

  // Get form data with filtering
  async getFormData(query: DatabaseQuery = {}): Promise<DatabaseRecord[]> {
    const records: DatabaseRecord[] = [];

    // Try IndexedDB first
    if (this.db) {
      try {
        const dbRecords = await this.queryIndexedDB('formData', query);
        records.push(...dbRecords);
      } catch (error) {
        console.warn('IndexedDB query failed, falling back to localStorage:', error);
      }
    }

    // Fallback to localStorage
    if (records.length === 0) {
      const localRecords = this.queryLocalStorage(query);
      records.push(...localRecords);
    }

    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get latest form data by type
  async getLatestFormData(type: string): Promise<DatabaseRecord | null> {
    const records = await this.getFormData({ type, limit: 1 });
    return records.length > 0 ? records[0] : null;
  }

  // Get application status
  getApplicationStatus(applicationName?: string): ApplicationStatusRecord | Record<string, ApplicationStatusRecord> | null {
    const appStatusKey = 'app-status';
    const allStatus = JSON.parse(localStorage.getItem(appStatusKey) || '{}');
    
    if (applicationName) {
      return allStatus[applicationName] || null;
    }
    
    return allStatus;
  }

  // Get all application statuses with timestamps
  getAllApplicationStatuses(): ApplicationStatusRecord[] {
    const allStatus = this.getApplicationStatus() as Record<string, ApplicationStatusRecord>;
    if (!allStatus) return [];
    
    return Object.values(allStatus).sort((a: ApplicationStatusRecord, b: ApplicationStatusRecord) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Helper methods
  private saveToLocalStorage(record: DatabaseRecord): void {
    const key = `form-data-${record.type}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(record);
    
    // Keep only last 50 records per type
    if (existing.length > 50) {
      existing.splice(0, existing.length - 50);
    }
    
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private async saveToIndexedDB(storeName: string, record: DatabaseRecord | ApplicationStatusRecord): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async queryIndexedDB(storeName: string, query: DatabaseQuery): Promise<DatabaseRecord[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const records: DatabaseRecord[] = [];

      let request: IDBRequest;
      
      if (query.type) {
        const index = store.index('type');
        request = index.openCursor(IDBKeyRange.only(query.type));
      } else {
        request = store.openCursor();
      }

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const record = cursor.value;
          
          // Apply date filters
          if (query.fromDate && new Date(record.timestamp) < query.fromDate) {
            cursor.continue();
            return;
          }
          if (query.toDate && new Date(record.timestamp) > query.toDate) {
            cursor.continue();
            return;
          }

          records.push(record);
          
          // Apply limit
          if (query.limit && records.length >= query.limit) {
            resolve(records);
            return;
          }
          
          cursor.continue();
        } else {
          resolve(records);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private queryLocalStorage(query: DatabaseQuery): DatabaseRecord[] {
    const allRecords: DatabaseRecord[] = [];
    
    // Get all form data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('form-data-')) {
        try {
          const records = JSON.parse(localStorage.getItem(key) || '[]');
          allRecords.push(...records);
        } catch (error) {
          console.warn(`Failed to parse localStorage data for key: ${key}`, error);
        }
      }
    }

    // Apply filters
    let filteredRecords = allRecords;

    if (query.type) {
      filteredRecords = filteredRecords.filter(record => record.type === query.type);
    }

    if (query.fromDate) {
      filteredRecords = filteredRecords.filter(record => 
        new Date(record.timestamp) >= query.fromDate!
      );
    }

    if (query.toDate) {
      filteredRecords = filteredRecords.filter(record => 
        new Date(record.timestamp) <= query.toDate!
      );
    }

    if (query.limit) {
      filteredRecords = filteredRecords.slice(0, query.limit);
    }

    return filteredRecords;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('qa-dashboard-session');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('qa-dashboard-session', sessionId);
    }
    return sessionId;
  }

  // Export data for backup/analysis
  async exportAllData(): Promise<ExportData> {
    const formData = await this.getFormData();
    const appStatus = this.getAllApplicationStatuses();
    
    return {
      formData,
      appStatus,
      exportedAt: new Date(),
      version: this.version
    };
  }

  // Clear old data (keep last 30 days)
  async cleanupOldData(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Cleanup localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('form-data-')) {
        try {
          const records = JSON.parse(localStorage.getItem(key) || '[]');
          const filteredRecords = records.filter((record: DatabaseRecord) => 
            new Date(record.timestamp) > thirtyDaysAgo
          );
          localStorage.setItem(key, JSON.stringify(filteredRecords));
        } catch (error) {
          console.warn(`Failed to cleanup localStorage data for key: ${key}`, error);
        }
      }
    }
  }
}

// Export singleton instance
export const database = new SimpleDatabase();

// Default application status configurations
export const defaultApplicationStatuses: Record<string, ApplicationStatusType> = {
  'SAP S/4 Hana': { health: 'excellent', ragColor: 'green', testCoverage: 95, testsPassed: 87 },
  'SAP CC B2B': { health: 'good', ragColor: 'green', testCoverage: 92, testsPassed: 84 },
  'SAP CC B2C': { health: 'warning', ragColor: 'amber', testCoverage: 78, testsPassed: 72 },
  'Mule 4.4': { health: 'good', ragColor: 'green', testCoverage: 88, testsPassed: 81 },
  'GKPOS': { health: 'excellent', ragColor: 'green', testCoverage: 96, testsPassed: 92 },
  'Pacsoft': { health: 'good', ragColor: 'green', testCoverage: 85, testsPassed: 79 },
  '1Centre': { health: 'warning', ragColor: 'amber', testCoverage: 73, testsPassed: 68 },
  'AS400': { health: 'good', ragColor: 'green', testCoverage: 82, testsPassed: 76 },
  'Tradehub Hybris': { health: 'excellent', ragColor: 'green', testCoverage: 94, testsPassed: 89 }
} as const;

// RAG Status utilities
export const ragColors = {
  red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800', icon: '🔴' },
  amber: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-800', icon: '🟡' },
  green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800', icon: '🟢' }
};

export const getRAGStatus = (health: string): keyof typeof ragColors => {
  switch (health) {
    case 'excellent': return 'green';
    case 'good': return 'green';
    case 'warning': return 'amber';
    case 'critical': return 'red';
    default: return 'amber';
  }
};
