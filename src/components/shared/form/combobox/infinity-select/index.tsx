import * as React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDown, LoaderCircle, Trash } from "lucide-react";
import { twMerge } from "tailwind-merge";

import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContentInModal,
  PopoverTrigger,
} from "@/components/shadcn";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/axios/api";
import { cn } from "@/lib/utils";
import { removeFalsyValuesFromObject } from "@/utils/func";

import type { IIndexResponse } from "./types";

export interface IInfinitySelectProps<T> {
  value: string | string[];
  onChange: (value: string | string[], item?: T | T[]) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  url: string;
  formatter: (items: T[]) => { label: string; value: string; item?: T }[];
  searchParam?: string;
  fallbackValue?: string;
  queryParams?: Record<string, string>;
  customData?: T[];
  dataCallback?: (data: T[]) => void;
  clearable?: boolean;
  customSelect?: (item?: T, fallbackValue?: string) => string;
  multiple?: boolean;
  callOnOpen?: boolean;
}

const InfinitySelectInner = <T,>(
  {
    value,
    onChange,
    className,
    placeholder = "Selecione uma opção",
    disabled = false,
    url = "/private/companies/list",
    formatter,
    searchParam = "search",
    fallbackValue,
    queryParams = {},
    customData,
    dataCallback,
    clearable = true,
    customSelect,
    multiple = false,
    callOnOpen = false,
  }: Readonly<IInfinitySelectProps<T>>,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const input = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const inputDebounced = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm !== inputDebounced;

  const [internalSelections, setInternalSelections] = React.useState<string[]>(
    []
  );

  const valueArray = React.useMemo(() => {
    if (!multiple) return [];
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  }, [multiple, value]);

  React.useEffect(() => {
    if (multiple && open) {
      setInternalSelections(valueArray);
    }
  }, [multiple, open, valueArray]);

  const index = useInfiniteQuery<{ data: IIndexResponse<T> }>({
    queryKey: [url, { ...queryParams, [searchParam]: inputDebounced }],
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam = 1 }) => {
      const cleanedQueryParams = removeFalsyValuesFromObject(queryParams);
      const params: Record<string, string | number> = {
        page: pageParam,
        ...cleanedQueryParams,
      };
      if (inputDebounced) {
        params[searchParam] = inputDebounced;
      }

      return api.get(url, { params });
    },
    getNextPageParam: (lastPage: { data: IIndexResponse<T> }) =>
      lastPage?.data?.data?.pagination?.currentPage <
      lastPage?.data?.data?.pagination?.lastPage
        ? lastPage?.data?.data?.pagination?.currentPage + 1
        : undefined,
    initialPageParam: 1,
    enabled: !customData && (callOnOpen ? open : true),
  });

  const data = React.useMemo(
    () =>
      customData ||
      (index.data?.pages.flatMap((page) => page.data.data.items) ?? []),
    [customData, index.data?.pages]
  );

  const items = React.useMemo(() => formatter(data), [data, formatter]);

  const currentSelections = multiple ? internalSelections : valueArray;
  const selected = React.useMemo(() => {
    if (multiple) {
      return items.filter((item) => currentSelections.includes(item.value));
    }
    return items.find((item) => item.value === value);
  }, [multiple, items, currentSelections, value]);

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isAtBottom && index.hasNextPage && !index.isFetchingNextPage) {
        index.fetchNextPage();
      }
    },
    [index]
  );

  React.useEffect(() => {
    if (!index.isPending) dataCallback?.(data);
  }, [data, dataCallback, index.isPending]);

  const handleSelect = React.useCallback(
    (selectedValue: string, selectedItem?: T) => {
      if (multiple) {
        setInternalSelections((prev) =>
          prev.includes(selectedValue)
            ? prev.filter((v) => v !== selectedValue)
            : [...prev, selectedValue]
        );
      } else {
        const newValue = selectedValue === value ? "" : selectedValue;
        onChange(newValue, selectedItem);
        setOpen(false);
      }
    },
    [multiple, value, onChange]
  );

  const handleApplySelections = React.useCallback(() => {
    if (multiple) {
      const selectedItems = items.filter((item) =>
        internalSelections.includes(item.value)
      );
      onChange(internalSelections, selectedItems.map((i) => i.item) as T[]);
      setOpen(false);
    }
  }, [multiple, internalSelections, items, onChange]);

  const renderButtonContent = React.useMemo(() => {
    if (multiple) {
      if (valueArray.length > 0) {
        return (
          <span className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {valueArray.length}
            </Badge>
            <span className="line-clamp-1 truncate">
              {valueArray.length > 1
                ? " itens selecionados"
                : " item selecionado"}
            </span>
          </span>
        );
      }
      return placeholder;
    }

    if (!value) {
      return placeholder;
    }

    const selectedItem = Array.isArray(selected)
      ? selected[0]?.item
      : selected?.item;
    const selectedLabel = Array.isArray(selected)
      ? selected[0]?.label
      : selected?.label;

    return (
      customSelect?.(selectedItem, fallbackValue) ||
      selectedLabel ||
      fallbackValue ||
      value
    );
  }, [
    multiple,
    valueArray,
    placeholder,
    selected,
    value,
    customSelect,
    fallbackValue,
  ]);

  const renderListItem = React.useCallback(
    (item: { label: string; value: string; item?: T }) => {
      const isSelected = multiple
        ? currentSelections.includes(item.value)
        : value === item.value;

      return (
        <CommandItem
          key={`${item.value}-${item.label}`}
          value={item.value}
          onSelect={() => {
            handleSelect(item.value, item.item);
          }}
        >
          {multiple && (
            <div
              className={cn(
                "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                isSelected ? "bg-primary border-primary" : "border-input"
              )}
            >
              {isSelected && (
                <CheckIcon className="text-primary-foreground h-3 w-3" />
              )}
            </div>
          )}
          {item.label}
          {!multiple && (
            <CheckIcon
              className={cn(
                "ml-auto",
                isSelected ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </CommandItem>
      );
    },
    [multiple, currentSelections, value, handleSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          ref={ref}
          variant="outline"
          aria-expanded={open}
          disabled={disabled}
          className={twMerge(
            "w-full justify-between disabled:hover:bg-transparent",
            className
          )}
        >
          <span
            className={twMerge(
              "flex items-center gap-2 text-left text-sm font-normal",
              (!value || (Array.isArray(value) && value.length === 0)) &&
                "text-muted-foreground"
            )}
          >
            {renderButtonContent}
          </span>

          {!disabled && <ChevronsUpDown className="text-muted-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContentInModal className="max-h-80 w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false}>
          <span className="relative p-2">
            <CommandInput
              ref={input}
              maxLength={50}
              placeholder={"Pesquisar..."}
              style={{ width: "calc(100% - 3rem)" }}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {clearable && (
              <span className="absolute top-2 right-1 flex items-center justify-center">
                <button
                  className="hover:bg-muted flex h-10 w-8 cursor-pointer items-center justify-center rounded-md"
                  key={`clear-search`}
                  onClick={() => {
                    setSearchTerm("");
                    onChange(multiple ? [] : "");
                    setOpen(false);
                  }}
                >
                  <Trash className="text-destructive h-4 w-4" />
                </button>
              </span>
            )}
          </span>

          <CommandList
            className="max-h-64 overflow-auto"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onScroll={handleScroll}
          >
            {(index.isLoading || isDebouncing) &&
              items.length === 0 &&
              !customData && (
                <span className="flex w-full items-center justify-center p-4">
                  <LoaderCircle className="animate-spin" size={20} />
                </span>
              )}

            {!index.isLoading && !isDebouncing && data.length === 0 && (
              <CommandEmpty>Não encontramos nenhum resultado</CommandEmpty>
            )}

            <CommandGroup>
              {items.map(renderListItem)}

              {index.isFetchingNextPage && !customData && (
                <div className="flex items-center justify-center p-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground ml-2 text-sm">
                    Carregando mais...
                  </span>
                </div>
              )}
            </CommandGroup>
          </CommandList>
          {multiple && (
            <div className="flex justify-end gap-2 border-t p-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleApplySelections}
              >
                Aplicar ({internalSelections.length})
              </Button>
            </div>
          )}
        </Command>
      </PopoverContentInModal>
    </Popover>
  );
};

export const InfinitySelect = React.forwardRef(InfinitySelectInner) as <T>(
  props: Readonly<
    IInfinitySelectProps<T> & {
      ref?: React.ForwardedRef<HTMLButtonElement>;
    }
  >
) => React.ReactElement;
