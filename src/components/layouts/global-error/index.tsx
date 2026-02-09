import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCcw, RotateCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IGlobalErrorProps {
  error: Error;
  reset?: () => void;
}

export function GlobalErrorComponent({
  error,
  reset,
}: Readonly<IGlobalErrorProps>) {
  const router = useRouter();

  const handleReset = () => {
    reset?.();
    router.invalidate();
  };

  const isDev = import.meta.env.VITE_NODE_ENV === "development";

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl py-4">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Ops! Algo deu errado</CardTitle>
              <CardDescription className="mt-1.5">
                Encontramos um erro inesperado ao processar sua solicitação.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isDev && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                Detalhes do erro (ambiente de desenvolvimento)
              </AlertTitle>
              <AlertDescription className="mt-2">
                <code className="bg-background/50 block rounded-md p-3 font-mono text-xs break-all whitespace-pre-wrap">
                  {error.message}
                </code>
                {error.stack && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium hover:underline">
                      Ver stack trace completo
                    </summary>
                    <code className="bg-background/50 mt-2 block rounded-md p-3 font-mono text-xs break-all whitespace-pre-wrap">
                      {error.stack}
                    </code>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-muted-foreground space-y-2 text-sm">
            <p>Você pode tentar:</p>
            <ul className="ml-2 list-inside list-disc space-y-1">
              <li>Recarregar a página usando o botão abaixo</li>
              <li>Voltar para a página inicial</li>
              <li>Verificar sua conexão com a internet</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleReset}
            className="w-full sm:w-auto"
            variant="default"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>

          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
            variant="secondary"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Recarregar página
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
