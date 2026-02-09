"use client";

import { FormProvider } from "react-hook-form";

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button, Card, CardContent, CardFooter } from "@/components/shadcn";
import { ButtonForm, InputForm } from "@/components/shared";

import { useForgotPassword } from "./use-forgot-password";

export function ForgotPasswordPage() {
  const { hookform, handleSubmit } = useForgotPassword();

  return (
    <Card className="shadow-card border-border">
      <FormProvider {...hookform}>
        <form onSubmit={hookform.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-5 pt-6 pb-6">
            <div className="space-y-2 text-center">
              <h2 className="text-foreground text-lg font-semibold">
                Esqueceu sua senha?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
            </div>

            <InputForm
              control={hookform.control}
              name="email"
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <ButtonForm
              control={hookform.control}
              type="submit"
              className="h-10 w-full"
            >
              Enviar link de recuperacao
            </ButtonForm>
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-full"
              asChild
            >
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
