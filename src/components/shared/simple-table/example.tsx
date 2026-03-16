/**
 * EXEMPLO DE USO DO COMPONENTE SimpleTable
 *
 * Este arquivo demonstra diferentes formas de usar o SimpleTable.
 * NÃO é para ser importado - é apenas documentação por código.
 */

import { Edit, Trash2 } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";

import { SimpleTable } from "./simple-table";

// ============================================
// EXEMPLO 1: Uso Básico
// ============================================
interface IUser extends Record<string, unknown> {
  name: string;
  email: string;
  role: string;
}

export function BasicExample() {
  const users: IUser[] = [
    { name: "João Silva", email: "joao@example.com", role: "Admin" },
    { name: "Maria Santos", email: "maria@example.com", role: "User" },
  ];

  return (
    <SimpleTable<IUser>
      columns={["Nome", "Email", "Função"]}
      data={users}
      dataKeys={["name", "email", "role"]}
    />
  );
}

// ============================================
// EXEMPLO 2: Com Renderização Customizada
// ============================================
interface IProduct extends Record<string, unknown> {
  name: string;
  price: number;
  stock: number;
  status: "available" | "out_of_stock";
}

export function CustomRenderExample() {
  const products: IProduct[] = [
    { name: "Notebook", price: 3500, stock: 10, status: "available" },
    { name: "Mouse", price: 50, stock: 0, status: "out_of_stock" },
  ];

  const renderCell = (key: keyof IProduct, value: unknown) => {
    // Formatar preço
    if (key === "price") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value as number);
    }

    // Renderizar status com Badge
    if (key === "status") {
      return (
        <Badge variant={value === "available" ? "default" : "destructive"}>
          {value === "available" ? "Disponível" : "Esgotado"}
        </Badge>
      );
    }

    // Destacar estoque baixo
    if (key === "stock") {
      const stockValue = value as number;
      return (
        <span
          className={
            stockValue === 0
              ? "text-destructive font-semibold"
              : stockValue < 5
                ? "text-warning font-semibold"
                : ""
          }
        >
          {stockValue}
        </span>
      );
    }

    return String(value);
  };

  return (
    <SimpleTable<IProduct>
      columns={["Produto", "Preço", "Estoque", "Status"]}
      data={products}
      dataKeys={["name", "price", "stock", "status"]}
      renderCell={renderCell}
    />
  );
}

// ============================================
// EXEMPLO 3: Com Estado de Loading
// ============================================
export function LoadingExample() {
  const isLoading = true; // Simular loading
  const data: IUser[] = [];

  return (
    <SimpleTable<IUser>
      columns={["Nome", "Email", "Função"]}
      data={data}
      dataKeys={["name", "email", "role"]}
      isLoading={isLoading}
    />
  );
}

// ============================================
// EXEMPLO 4: Com Mensagem Customizada
// ============================================
export function EmptyStateExample() {
  const data: IUser[] = [];

  return (
    <SimpleTable<IUser>
      columns={["Nome", "Email", "Função"]}
      data={data}
      dataKeys={["name", "email", "role"]}
      emptyMessage="Nenhum usuário cadastrado. Clique em 'Adicionar' para começar."
    />
  );
}

// ============================================
// EXEMPLO 5: Integração com React Query
// ============================================
/*
export function WithReactQueryExample() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <SimpleTable<IUser>
      columns={["Nome", "Email", "Função"]}
      data={data ?? []}
      dataKeys={["name", "email", "role"]}
      isLoading={isLoading}
      emptyMessage="Nenhum usuário encontrado."
    />
  );
}
*/

// ============================================
// EXEMPLO 6: Com Coluna de Ações
// ============================================
export function WithActionsExample() {
  const users: IUser[] = [
    { name: "João Silva", email: "joao@example.com", role: "Admin" },
    { name: "Maria Santos", email: "maria@example.com", role: "User" },
  ];

  const handleEdit = (user: IUser) => {
    console.log("Editando usuário:", user);
  };

  const handleDelete = (user: IUser) => {
    if (window.confirm(`Deseja excluir ${user.name}?`)) {
      console.log("Deletando usuário:", user);
    }
  };

  return (
    <SimpleTable<IUser>
      columns={["Nome", "Email", "Função"]}
      data={users}
      dataKeys={["name", "email", "role"]}
      actions={(row) => (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row)}
            title="Editar usuário"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row)}
            title="Excluir usuário"
          >
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </>
      )}
    />
  );
}

// ============================================
// EXEMPLO 7: Ações com Estados Diferentes
// ============================================
export function WithConditionalActionsExample() {
  const users: IUser[] = [
    { name: "João Silva", email: "joao@example.com", role: "Admin" },
    { name: "Maria Santos", email: "maria@example.com", role: "User" },
  ];

  const isDeleting = false; // Simular estado de loading

  const handleDelete = (user: IUser) => {
    console.log("Deletando:", user);
  };

  return (
    <SimpleTable<IUser>
      columns={["Nome", "Email", "Função"]}
      data={users}
      dataKeys={["name", "email", "role"]}
      actions={(row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(row)}
          disabled={isDeleting}
          title="Excluir"
        >
          <Trash2 className="text-destructive h-4 w-4" />
        </Button>
      )}
      actionsLabel="Opções"
    />
  );
}
