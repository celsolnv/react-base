# ConfirmDialog

Sistema global de confirmação usando Zustand + AlertDialog do shadcn/ui.

## Visão Geral

O `ConfirmDialog` é um componente global que permite exibir dialogs de confirmação em qualquer lugar da aplicação usando uma API simples baseada em Promises, sem necessidade de gerenciar estados locais de `isOpen`.

## Características

- ✅ **API Baseada em Promise**: Use `await confirm(...)` diretamente
- ✅ **Estado Global (Zustand)**: Sem prop drilling ou estados locais
- ✅ **Variantes Estilizadas**: Suporte a `default` e `destructive`
- ✅ **Acessível**: Usa AlertDialog do Radix UI
- ✅ **TypeScript**: Tipagem completa
- ✅ **Clean Code**: Interface simples e intuitiva

## Instalação

O componente já está instalado no layout principal (`__root.tsx`), pronto para uso em toda a aplicação.

## Uso Básico

### Importar o Hook

```typescript
import { useConfirmStore } from "@/hooks/use-confirm-store";
```

### Exemplo Simples

```typescript
const confirm = useConfirmStore((state) => state.confirm);

const handleDelete = async () => {
  const confirmed = await confirm(
    "Excluir Item",
    "Tem certeza que deseja excluir este item?"
  );

  if (confirmed) {
    // Usuário confirmou
    console.log("Item excluído");
  } else {
    // Usuário cancelou
    console.log("Cancelado");
  }
};
```

### Com Variante Destructive

```typescript
const confirm = useConfirmStore((state) => state.confirm);

const handleDelete = async () => {
  const confirmed = await confirm(
    "Excluir Permanentemente",
    "Esta ação não pode ser desfeita. Deseja continuar?",
    "destructive" // Botão vermelho
  );

  if (!confirmed) return;

  // Executar exclusão
  await deleteItem();
};
```

## API

### `confirm(title, message, variant?)`

Exibe um dialog de confirmação e retorna uma Promise que resolve com a resposta do usuário.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `title` | `string` | ✅ | - | Título do dialog |
| `message` | `string` | ✅ | - | Mensagem/descrição |
| `variant` | `"default" \| "destructive"` | ❌ | `"default"` | Estilo do botão de ação |

**Retorno:**

- `Promise<boolean>` - `true` se confirmado, `false` se cancelado

## Exemplos Práticos

### 1. Confirmação Básica

```typescript
export function SaveButton() {
  const confirm = useConfirmStore((state) => state.confirm);

  const handleSave = async () => {
    const confirmed = await confirm(
      "Salvar Alterações",
      "Deseja salvar as alterações feitas?"
    );

    if (confirmed) {
      await saveChanges();
    }
  };

  return <Button onClick={handleSave}>Salvar</Button>;
}
```

### 2. Ação Destrutiva

```typescript
export function DeleteButton({ itemId }: { itemId: string }) {
  const confirm = useConfirmStore((state) => state.confirm);
  const deleteMutation = useDeleteItem();

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Excluir Item",
      "Esta ação não pode ser desfeita. Tem certeza?",
      "destructive"
    );

    if (!confirmed) return;

    await deleteMutation.mutateAsync(itemId);
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Excluir
    </Button>
  );
}
```

### 3. Com React Query

```typescript
export function useDeleteWithConfirm() {
  const confirm = useConfirmStore((state) => state.confirm);
  const deleteMutation = useDeleteMutation();

  const deleteWithConfirm = async (id: string, name: string) => {
    const confirmed = await confirm(
      "Excluir Registro",
      `Deseja excluir "${name}"? Esta ação não pode ser desfeita.`,
      "destructive"
    );

    if (!confirmed) return;

    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Registro excluído com sucesso!");
      },
    });
  };

  return { deleteWithConfirm, isDeleting: deleteMutation.isPending };
}
```

### 4. Múltiplas Confirmações

```typescript
export function ComplexFlow() {
  const confirm = useConfirmStore((state) => state.confirm);

  const handleComplexAction = async () => {
    // Primeira confirmação
    const step1 = await confirm(
      "Iniciar Processo",
      "Deseja iniciar o processo?"
    );

    if (!step1) return;

    await executeStep1();

    // Segunda confirmação
    const step2 = await confirm(
      "Continuar?",
      "Primeira etapa concluída. Continuar para a segunda?",
      "destructive"
    );

    if (!step2) return;

    await executeStep2();

    toast.success("Processo concluído!");
  };

  return <Button onClick={handleComplexAction}>Iniciar</Button>;
}
```

## Variantes

### Default (Padrão)

Usado para ações normais (salvar, continuar, etc.)

```typescript
await confirm("Salvar", "Deseja salvar?", "default");
// ou simplesmente
await confirm("Salvar", "Deseja salvar?");
```

### Destructive

Usado para ações destrutivas (excluir, descartar, etc.)

```typescript
await confirm(
  "Excluir",
  "Esta ação não pode ser desfeita",
  "destructive"
);
```

## Boas Práticas

### ✅ Faça

1. **Use mensagens claras** - Explique exatamente o que vai acontecer
2. **Use `destructive` para ações irreversíveis** - Deletar, descartar, etc.
3. **Verifique o retorno** - Sempre valide se `confirmed` é `true`
4. **Combine com toasts** - Dê feedback após a ação
5. **Use em funções assíncronas** - Aproveite o poder do `await`

```typescript
// ✅ Bom
const confirmed = await confirm(
  "Excluir Conta",
  "Sua conta e todos os dados serão permanentemente removidos.",
  "destructive"
);

if (!confirmed) return;

await deleteAccount();
toast.success("Conta excluída");
```

### ❌ Evite

1. **Não ignore o retorno** - Sempre verifique se foi confirmado
2. **Não use para informações** - Use toast ou alert para isso
3. **Não aninhe demais** - Evite múltiplas confirmações seguidas

```typescript
// ❌ Ruim - Ignora o retorno
await confirm("Excluir", "Tem certeza?");
deleteItem(); // Executa sempre!

// ✅ Bom
const confirmed = await confirm("Excluir", "Tem certeza?");
if (confirmed) deleteItem();
```

## Arquitetura

### Store (Zustand)

A store gerencia o estado global do dialog:

```typescript
interface IConfirmStore {
  isOpen: boolean;
  title: string;
  message: string;
  variant: "default" | "destructive";
  confirm: (title, message, variant?) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}
```

### Fluxo de Execução

1. Componente chama `confirm(title, message, variant)`
2. Store abre o dialog e retorna uma Promise
3. Usuário clica em "Confirmar" ou "Cancelar"
4. Promise resolve com `true` ou `false`
5. Store reseta o estado

## Testes

O sistema possui cobertura completa de testes:

- ✅ Store Zustand (`use-confirm-store.test.ts`)
- ✅ Componente ConfirmDialog (`confirm-dialog.test.tsx`)
- ✅ Integração com usuário
- ✅ Variantes de estilo

Execute os testes:

```bash
npm test use-confirm-store
npm test confirm-dialog
```

## Comparação com `window.confirm`

### Antes (window.confirm)

```typescript
// ❌ Feio, não estilizado, bloqueia a thread
if (window.confirm("Tem certeza?")) {
  deleteItem();
}
```

### Depois (ConfirmDialog)

```typescript
// ✅ Bonito, acessível, assíncrono
const confirmed = await confirm(
  "Excluir Item",
  "Esta ação não pode ser desfeita",
  "destructive"
);

if (confirmed) {
  await deleteItem();
}
```

## Acessibilidade

O componente é totalmente acessível:

- ✅ Foco automático no botão de ação
- ✅ ESC fecha o dialog (cancela)
- ✅ Trap de foco dentro do dialog
- ✅ Roles ARIA apropriados
- ✅ Suporte a leitores de tela

## Troubleshooting

### O dialog não aparece

Certifique-se de que o `<ConfirmDialog />` está adicionado no layout raiz (`__root.tsx`).

### Promise não resolve

Verifique se está usando `await` antes de `confirm()` ou usando `.then()`.

### Estilo não está correto

Certifique-se de que está passando a variante correta: `"default"` ou `"destructive"`.
