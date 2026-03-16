import { Link } from "@tanstack/react-router";
import { ShieldPlus, Upload } from "lucide-react";

import type { TPermission } from "@/types/IPermission";
import { Button } from "@/ui/button";

import { Can } from "../can";

interface IHeaderListProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonLink?: string;
  importTemplateRoute?: string;
  importEndpoint?: string;
  createPermission?: TPermission;
  handleImport?: () => void;
}

export function HeaderList({
  title,
  description,
  buttonText = "Novo",
  buttonIcon = <ShieldPlus className="mr-2 h-4 w-4" />,
  buttonLink,
  createPermission,
  handleImport,
}: Readonly<IHeaderListProps>) {
  const renderButton = () => {
    if (!buttonLink) return null;

    const button = (
      <Button asChild>
        <Link to={buttonLink}>
          {buttonIcon}
          {buttonText}
        </Link>
      </Button>
    );

    // Se tem permissão definida, envolve com Can
    if (createPermission) {
      return <Can I={createPermission}>{button}</Can>;
    }

    // Sem permissão = sempre visível
    return button;
  };
  const renderImportButton = () => {
    if (!handleImport) return null;

    const button = (
      <Button onClick={handleImport}>
        <Upload />
        Importar
      </Button>
    );

    // Se tem permissão definida, envolve com Can
    if (createPermission) {
      return <Can I={createPermission}>{button}</Can>;
    }

    // Sem permissão = sempre visível
    return button;
  };

  const importButton = renderImportButton();
  const button = renderButton();

  return (
    <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <div className="flex gap-2">
        {importButton}
        {button}
      </div>
    </div>
  );
}
