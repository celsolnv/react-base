export interface IPagination<T> {
  data: T[];
  page: number;
  pages: number;
  count: number;
}

export interface IQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IManyAction {
  params: {
    id?: string | string[];
  };
  query?: {
    status?: boolean;
  };
}
