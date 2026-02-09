import type { Pagination, Query } from "./Pagination";

export interface IUseCallerProps<T, R = unknown> {
  filters?: Query;
  enabled?: boolean;
  id?: string | null;
  show?: boolean;
  callbacks?: {
    list?: {
      onSuccess?: (data: Pagination<T>) => void;
      onError?: () => void;
    };
    dashboard?: {
      onSuccess?: (data: T) => void;
      onError?: () => void;
    };
    show?: {
      onSuccess?: (data: R) => void;
      onError?: () => void;
    };
    create?: {
      onSuccess?: (data: T) => void;
      onError?: () => void;
    };
    update?: {
      onSuccess?: (data: T) => void;
      onError?: (error?: unknown) => void;
    };
    destroy?: {
      onSuccess?: (data: Pagination<T> | T[]) => void;
      onError?: () => void;
    };
    status?: {
      onSuccess?: (data: Pagination<T> | T[]) => void;
      onError?: () => void;
    };
  };
}
