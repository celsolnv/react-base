import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Skeleton } from "../skeleton";

interface IFreeTextAutocompleteProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> {
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  loading?: boolean;
}

const InputAutoComplete = React.forwardRef<
  HTMLInputElement,
  IFreeTextAutocompleteProps
>(
  (
    { value = "", onChange, options, className, loading, ...inputProps },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const listboxId = React.useId();

    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    const filtered = React.useMemo(
      () =>
        inputValue
          ? options.filter((o) =>
              o.toLowerCase().includes(inputValue.toLowerCase())
            )
          : options,
      [inputValue, options]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      onChange(val);
      setIsOpen(true);
    };

    const handleSelect = (option: string) => {
      setInputValue(option);
      onChange(option);
      setIsOpen(false);
    };

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
      return <Skeleton loading={loading} className="min-h-[40px]" />;
    }
    return (
      <div ref={containerRef} className="relative w-full">
        <Input
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={cn(className)}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-autocomplete="list"
          {...inputProps}
        />
        {isOpen && filtered.length > 0 && (
          <div
            id={listboxId}
            aria-label="Opções de autocomplete"
            className="border-border bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border p-1 shadow-md"
          >
            {filtered.map((option) => (
              <button
                key={option}
                type="button"
                className="hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
InputAutoComplete.displayName = "InputAutoComplete";

export { InputAutoComplete };
