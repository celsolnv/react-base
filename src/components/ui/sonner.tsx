import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = "system";
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "font-inter group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "!bg-red-500 !border-red-500 !text-red-foreground",
          success: "!bg-[#5b8a5a] !text-[#fdf7ed] !border-[#f1cf96]",
          // success: "!bg-[#E79F4A] !text-[#351f07] !border-[#E79F4A]",
          // success: "!bg-green-600 !text-gray-50 !border-green-500",
          info: "group-[.toast]:bg-blue-500 group-[.toast]:text-blue-foreground",
          warning:
            "group-[.toast]:bg-yellow-500 group-[.toast]:text-yellow-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
