# 🔍 Lookups Service

Este diretório centraliza as funções de busca de dados compartilhados (Lookups) do sistema. O objetivo principal é permitir a comunicação entre diferentes domínios sem ferir o princípio de Isolamento de Módulos.

## 📌 Por que usamos este padrão?

Em nossa arquitetura de Vertical Slices, cada módulo (ex: usuarios, setores, produtos) deve ser o mais independente possível. No entanto, é comum que o formulário de um módulo precise de dados de outro (ex: um select de "Setores" dentro da tela de "Usuários").

Sem o padrão de Lookups, teríamos dois problemas de escalabilidade:

- **Dependências Circulares**: O Módulo A importa do Módulo B, que futuramente precisa importar algo do Módulo A, quebrando o build.
- **Acoplamento Forte**: Para usar um simples Select, você acaba importando lógicas pesadas de API e tipos internos de outro módulo.

Ao usar Lookups, seguimos uma das melhores práticas do Feature-Sliced Design (FSD): criamos uma camada shared (compartilhada) que serve de ponte entre as funcionalidades.

## 🏗️ Como funciona

Cada arquivo aqui deve representar um domínio de busca e exportar funções assíncronas otimizadas para componentes como o `AsyncComboboxForm`.

### Regras de Ouro

- **Unidirecionalidade**: Os módulos podem importar de `services/lookups`, mas os Lookups nunca importam nada de dentro da pasta `modules`.

- **Leveza**: As rotas de API chamadas aqui devem ser, preferencialmente, endpoints de `/options` (que retornam apenas o básico: `label` e `value`) em vez de listagens completas.

- **Padronização**: O retorno deve ser sempre compatível com a interface esperada pelos nossos componentes de UI.

## 💻 Exemplo de Implementação

Para adicionar um novo lookup de "Setores":

**Crie o arquivo `src/services/lookups/sectors.ts`:**

```typescript
import { api } from "../api";

export const fetchSectorOptions = async (query: string) => {
  // Chamada para um endpoint otimizado
  const { data } = await api.get(`/sectors/options`, {
    params: { q: query }
  });
  
  return data; // Esperado: Array<{ label: string, value: string }>
};
```

**Uso no componente dentro de um módulo:**

```typescript
import { fetchSectorOptions } from "@/services/lookups/sectors";

<AsyncComboboxForm
  label="Setor"
  fetchOptions={fetchSectorOptions}
  control={form.control}
  name="sector_id"
/>
```

## 🚀 Benefícios para o Time

- **Autonomia**: Você pode trabalhar no módulo de Usuarios sem precisar conhecer a estrutura interna do módulo de Sectors.

- **Performance**: Facilita a implementação de cache global via TanStack Query para seletores que raramente mudam.

- **Refatoração Segura**: Podemos mudar a lógica interna de um módulo sem quebrar os seletores espalhados pelo sistema.

## 💡 Dica para os Devs

Se você perceber que está importando uma função de API de dentro de outro módulo apenas para preencher um Select, pare! É hora de mover essa função para cá.
