export interface SystemData {
    name: string;
    completionRanking: number;
    accessibility: number;
    documentation: number;
    dataQuality: number;
    criticalIssues: number;
    lastUpdated: string;
    users: number;
}

export interface SystemMetrics {
    totalSystems: number;
    totalUsers: number;
    averageDataQuality: number;
    totalCriticalIssues: number;
}

export type SystemSortFields = keyof SystemData;
export type SortDirection = 'asc' | 'desc';

export interface SystemFilters {
    search?: string;
    minDataQuality?: number;
    maxCriticalIssues?: number;
    dateRange?: {
        start: string;
        end: string;
    };
}