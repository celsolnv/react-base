import * as React from "react";

export interface IOption {
  label: string;
  value: string;
}

interface ICreatableSelectBaseProps {
  options: IOption[];
  placeholder?: string;
  onCreateOption?: (inputValue: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

interface ISingleProps extends ICreatableSelectBaseProps {
  multiple?: false;
  value: IOption | null;
  onChange: (value: IOption | null) => void;
}

interface IMultiProps extends ICreatableSelectBaseProps {
  multiple: true;
  value: IOption[];
  onChange: (value: IOption[]) => void;
}

export type TCreatableSelectProps = ISingleProps | IMultiProps;

export function useCreatableSelect(props: TCreatableSelectProps) {
  const {
    options,
    placeholder = "Selecione...",
    onCreateOption,
    multiple,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selectedSet = React.useMemo(() => {
    if (multiple) {
      return new Set(
        (props.value as IOption[]).map((v) => v.value.toLowerCase())
      );
    }
    const single = props.value as IOption | null;
    return single ? new Set([single.value.toLowerCase()]) : new Set<string>();
  }, [multiple, props.value]);

  const filtered = React.useMemo(() => {
    return options.filter((opt) => {
      const matchesSearch = opt.label
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      if (multiple) {
        return matchesSearch && !selectedSet.has(opt.value.toLowerCase());
      }
      return matchesSearch;
    });
  }, [options, inputValue, multiple, selectedSet]);

  const trimmed = inputValue.trim();
  const hasExactMatch = options.some(
    (opt) => opt.label.toLowerCase() === trimmed.toLowerCase()
  );
  const isAlreadySelected = selectedSet.has(trimmed.toLowerCase());
  const showCreate = trimmed !== "" && !hasExactMatch && !isAlreadySelected;

  const handleSelect = React.useCallback(
    (opt: IOption) => {
      if (multiple) {
        (props.onChange as (v: IOption[]) => void)([...props.value, opt]);
      } else {
        (props.onChange as (v: IOption | null) => void)(opt);
        setOpen(false);
      }
      setInputValue("");
    },
    [multiple, props.onChange, props.value]
  );

  const handleCreate = React.useCallback(() => {
    if (!trimmed) return;
    const newOpt: IOption = { label: trimmed, value: trimmed };
    if (multiple) {
      (props.onChange as (v: IOption[]) => void)([
        ...(props.value as IOption[]),
        newOpt,
      ]);
    } else {
      (props.onChange as (v: IOption | null) => void)(newOpt);
      setOpen(false);
    }
    onCreateOption?.(trimmed);
    setInputValue("");
  }, [trimmed, multiple, props.onChange, props.value, onCreateOption]);

  const handleRemove = React.useCallback(
    (optValue: string) => {
      if (multiple) {
        (props.onChange as (v: IOption[]) => void)(
          (props.value as IOption[]).filter((v) => v.value !== optValue)
        );
      } else {
        (props.onChange as (v: IOption | null) => void)(null);
      }
    },
    [multiple, props.onChange, props.value]
  );

  return {
    open,
    setOpen,
    inputValue,
    setInputValue,
    selectedSet,
    filtered,
    showCreate,
    handleSelect,
    handleCreate,
    handleRemove,
    placeholder,
    multiple,
    value: props.value,
  };
}
