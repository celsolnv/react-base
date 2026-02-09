import { FormProvider } from "react-hook-form";

import { Link } from "@tanstack/react-router";

import { Card, CardContent, CardFooter } from "@/components/shadcn";
import { ButtonForm, InputForm, InputPasswordForm } from "@/components/shared";
import { useLogin } from "@/modules/login/use-login";

export function LoginPage() {
  const { hookform, handleSubmit } = useLogin();

  return (
    <Card className="shadow-card border-border">
      <FormProvider {...hookform}>
        <form onSubmit={hookform.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-5 pt-6 pb-6">
            <InputForm
              control={hookform.control}
              name="email"
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="username"
            />

            <InputPasswordForm
              control={hookform.control}
              name="password"
              label="Senha"
              placeholder="********"
              autoComplete="current-password"
            />

            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 transition-colors hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </CardContent>

          <CardFooter>
            <ButtonForm
              control={hookform.control}
              type="submit"
              className="h-10 w-full"
            >
              Entrar
            </ButtonForm>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}
