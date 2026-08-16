import { AppEnvironment } from '../../shared/models/enums';

export interface AppConfig {
  appName: string;
  environment: AppEnvironment;
  apiBaseUrl: string;
  useMockApi: boolean;
  apiTimeoutMs: number;
}

export const APP_CONFIG_URL = 'config/config.json';

export const FALLBACK_APP_CONFIG: AppConfig = {
  appName: 'Thai Holiday Control',
  environment: 'DEV',
  apiBaseUrl: '/api/v1/portal',
  useMockApi: true,
  apiTimeoutMs: 30000,
};
