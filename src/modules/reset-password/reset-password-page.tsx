import { FormProvider } from "react-hook-form";

import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { ButtonForm, InputPasswordForm } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useResetPassword } from "./use-reset-password";

interface IResetPasswordPageProps {
  code: string;
}
export function ResetPasswordPage({ code }: Readonly<IResetPasswordPageProps>) {
  const { hookform, handleSubmit, requirements } = useResetPassword(code);

  return (
    <Card className="shadow-card border-border">
      <FormProvider {...hookform}>
        <form onSubmit={hookform.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-5 pt-6 pb-6">
            <div className="space-y-2 text-center">
              <h2 className="text-foreground text-lg font-semibold">
                Criar nova senha
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Digite sua nova senha abaixo.
              </p>
            </div>
            <div>
              <InputPasswordForm
                name="password"
                control={hookform.control}
                label="Nova senha"
                placeholder="Digite sua nova senha"
              />
              <div className="space-y-1.5 pt-2">
                {requirements?.map((req) => (
                  <div
                    key={req.label}
                    className="flex items-center gap-2 text-xs"
                  >
                    {req.met ? (
                      <CheckCircle className="text-success h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="text-muted-foreground h-3.5 w-3.5" />
                    )}
                    <span
                      className={
                        req.met ? "text-success" : "text-muted-foreground"
                      }
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <InputPasswordForm
              name="password_confirm"
              control={hookform.control}
              label="Confirmar senha"
              placeholder="Digite sua nova senha novamente"
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <ButtonForm
              control={hookform.control}
              type="submit"
              className="h-10 w-full"
            >
              Salvar nova senha
            </ButtonForm>
            <Button variant="ghost" className="h-10 w-full" asChild>
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para login
              </Link>
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}
