export interface IPagination {
  totalItems: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface IIndexResponse<T> {
  status: number;
  success: boolean;
  message: string;
  code: string;
  data: { items: T[]; pagination: IPagination; [key: string]: unknown };
}
