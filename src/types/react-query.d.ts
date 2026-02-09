/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface UseMutationOptions<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown,
  > {
    onError?: (error: {
      data: {
        code: string;
        entity: string;
        error: string;
        errors: {
          query: Record<string, string>;
          params: Record<string, string>;
          body: Record<string, string>;
        };
        status: number;
        success: boolean;
        type: number;
      };
    }) => void;
  }

  interface UseMutationResult<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown,
  > extends Omit<
    UseMutationResult<TData, TError, TVariables, TContext>,
    "error"
  > {
    error: TError | null;
  }

  interface MutationFunction<TData = unknown, TVariables = void> {
    (variables?: TVariables): Promise<TData>;
  }

  function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown,
  >(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationResult<TData, TError, TVariables, TContext>;
}
