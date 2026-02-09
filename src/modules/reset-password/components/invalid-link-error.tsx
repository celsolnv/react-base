import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function InvalidLinkError() {
  return (
    <Card className="shadow-card border-border">
      <CardContent className="space-y-5 pt-6 pb-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <AlertCircle className="text-destructive h-12 w-12" />
          </div>
          <h2 className="text-foreground text-lg font-semibold">
            Link expirado ou inválido
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            O link de redefinição de senha expirou ou é inválido. Por favor,
            solicite um novo link para redefinir sua senha.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button variant="default" className="h-10 w-full" asChild>
          <Link to="/forgot-password">Solicitar novo link</Link>
        </Button>
        <Button variant="ghost" className="h-10 w-full" asChild>
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
