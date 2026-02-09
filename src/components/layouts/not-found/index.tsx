import { useEffect } from "react";

import { Link, useLocation } from "@tanstack/react-router";

import { Button } from "@/components/ui/button"; // Opcional: usando seu botão Shadcn

const NotFound = () => {
  // O hook useLocation funciona de forma similar, mas vem do TanStack
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">
          Oops! Página não encontrada
        </p>

        {/* Usando o Link do TanStack Router */}
        {/* O asChild no Button permite que o Link controle a navegação mantendo o estilo do botão */}
        <Button
          asChild
          variant="link"
          className="text-base text-blue-500 hover:text-blue-700"
        >
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
