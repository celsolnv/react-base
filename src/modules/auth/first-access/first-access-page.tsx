import { FormProvider } from "react-hook-form";

import { CheckCircle, XCircle } from "lucide-react";

import { ButtonForm } from "@/components/shared/form/button";
import { InputPasswordForm } from "@/components/shared/form/input/input-password";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useFirstAccess } from "./use-first-access";

interface IFirstAccessPageProps {
  code: string;
}
export function FirstAccessPage({ code }: Readonly<IFirstAccessPageProps>) {
  const { hookform, handleSubmit, requirements } = useFirstAccess(code);

  return (
    <Card className="shadow-card border-border">
      <FormProvider {...hookform}>
        <form onSubmit={hookform.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-5 pt-6 pb-6">
            <div className="space-y-2 text-center">
              <h2 className="text-foreground text-lg font-semibold">
                Primeiro acesso
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Digite sua senha abaixo.
              </p>
            </div>
            <div>
              <InputPasswordForm
                name="password"
                label="Senha"
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
              Salvar senha
            </ButtonForm>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}
