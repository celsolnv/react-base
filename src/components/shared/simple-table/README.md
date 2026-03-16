# SimpleTable

Componente de tabela genérico e leve para exibição de dados tabulares simples.

## Quando Usar

- **Use `SimpleTable`** quando você precisa exibir dados em formato tabular sem necessidade de funcionalidades complexas (ordenação, filtros, paginação).
- **Use `DataTable`** quando você precisa de funcionalidades avançadas como ordenação, filtros, seleção de linhas, etc.

## Características

- ✅ **Tipagem Genérica**: Suporta qualquer tipo de dado com TypeScript
- ✅ **Renderização Customizada**: Permite personalizar como cada célula é renderizada
- ✅ **Estado de Loading**: Suporte built-in para estados de carregamento
- ✅ **Empty State**: Mensagens customizáveis quando não há dados
- ✅ **Dark Mode**: Totalmente compatível com tema dark usando tokens semânticos
- ✅ **Acessibilidade**: Usa componentes Shadcn/UI com suporte a acessibilidade

## Props

```typescript
interface ISimpleTableProps<TData extends Record<string, unknown>> {
  columns: readonly string[];           // Nomes das colunas
  data: readonly TData[];               // Array de dados
  dataKeys: readonly (keyof TData)[];   // Chaves dos dados (mesma ordem das colunas)
  emptyMessage?: string;                // Mensagem quando vazio (padrão: "Nenhum registro encontrado.")
  isLoading?: boolean;                  // Estado de carregamento
  renderCell?: (                        // Função customizada para renderizar células
    key: keyof TData,
    value: unknown,
    row: TData
  ) => React.ReactNode;
  actions?: (row: TData) => React.ReactNode;  // Função para renderizar ações por linha
  actionsLabel?: string;                // Título da coluna de ações (padrão: "Ações")
}
```

## Exemplos de Uso

### Uso Básico

```tsx
interface IUser extends Record<string, unknown> {
  name: string;
  email: string;
}

const users: IUser[] = [
  { name: "João", email: "joao@example.com" },
];

<SimpleTable<IUser>
  columns={["Nome", "Email"]}
  data={users}
  dataKeys={["name", "email"]}
/>
```

### Com Renderização Customizada

```tsx
const renderCell = (key: keyof IProduct, value: unknown) => {
  if (key === "price") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value as number);
  }
  return String(value);
};

<SimpleTable<IProduct>
  columns={["Produto", "Preço"]}
  data={products}
  dataKeys={["name", "price"]}
  renderCell={renderCell}
/>
```

### Com React Query

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});

<SimpleTable<IUser>
  columns={["Nome", "Email"]}
  data={data ?? []}
  dataKeys={["name", "email"]}
  isLoading={isLoading}
/>
```

### Com Coluna de Ações

```tsx
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui";

<SimpleTable<IUser>
  columns={["Nome", "Email"]}
  data={users}
  dataKeys={["name", "email"]}
  actions={(row) => (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleEdit(row)}
        title="Editar"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(row)}
        title="Excluir"
      >
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>
    </>
  )}
/>
```

### Com Label Customizado para Ações

```tsx
<SimpleTable<IUser>
  columns={["Nome", "Email"]}
  data={users}
  dataKeys={["name", "email"]}
  actions={(row) => (
    <Button onClick={() => handleAction(row)}>
      Ver Detalhes
    </Button>
  )}
  actionsLabel="Opções"
/>
```

## Boas Práticas

1. **Sempre estenda `Record<string, unknown>`** na interface de dados para compatibilidade com o componente
2. **Mantenha a ordem**: `columns`, `data` e `dataKeys` devem estar na mesma ordem
3. **Use `renderCell`** para formatações complexas (datas, moedas, badges, etc.)
4. **Prefira `SimpleTable`** para listas simples e `DataTable` para tabelas complexas

## Arquitetura

O componente segue os princípios de:

- **Single Responsibility**: Apenas renderiza dados tabulares, sem lógica de negócio
- **Composição**: Usa componentes primitivos do Shadcn/UI
- **Tokens Semânticos**: Usa variáveis CSS para suporte a Dark Mode
- **TypeScript Strict**: Tipagem genérica forte para segurança de tipos

## Testes

O componente possui cobertura completa de testes em `simple-table.test.tsx`:

- ✅ Renderização de colunas
- ✅ Renderização de dados
- ✅ Estado vazio
- ✅ Estado de loading
- ✅ Valores nulos/undefined
- ✅ Renderização customizada

Execute os testes com:

```bash
npm test simple-table
```
