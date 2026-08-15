export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiMeta {
  apiVersion: string;
  requestId: string;
  generatedAt: string;
  page?: PageMeta;
}

export interface PageMeta {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: PageMeta;
}

export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  code: string;
  detail: string;
  instance: string;
  requestId: string;
  errors?: FieldError[];
}

export type QueryParams = Record<string, string | number | boolean | readonly string[] | null | undefined>;

export const DEFAULT_PAGE_SIZE = 20;

export const PAGE_SIZE_OPTIONS: readonly number[] = [10, 20, 50, 100];

export const EMPTY_PAGE: PageMeta = {
  number: 0,
  size: DEFAULT_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
};
