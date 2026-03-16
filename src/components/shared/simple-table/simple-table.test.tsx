import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SimpleTable } from "./simple-table";

interface ITestData {
  name: string;
  age: number;
  email: string;
}

describe("SimpleTable", () => {
  const columns = ["Nome", "Idade", "Email"];
  const dataKeys: (keyof ITestData)[] = ["name", "age", "email"];

  it("deve renderizar as colunas corretamente", () => {
    const data: ITestData[] = [];
    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
      />
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Idade")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("deve renderizar os dados corretamente", () => {
    const data: ITestData[] = [
      { name: "João", age: 30, email: "joao@example.com" },
      { name: "Maria", age: 25, email: "maria@example.com" },
    ];

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
      />
    );

    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("joao@example.com")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("maria@example.com")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não há dados", () => {
    const data: ITestData[] = [];
    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
      />
    );

    expect(screen.getByText("Nenhum registro encontrado.")).toBeInTheDocument();
  });

  it("deve exibir mensagem customizada quando não há dados", () => {
    const data: ITestData[] = [];
    const customMessage = "Não há usuários cadastrados.";

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        emptyMessage={customMessage}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("deve exibir estado de carregamento", () => {
    const data: ITestData[] = [];
    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        isLoading={true}
      />
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar valores nulos como hífen", () => {
    const data = [
      { name: "João", age: null, email: undefined },
    ] as unknown as ITestData[];

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
      />
    );

    expect(screen.getByText("João")).toBeInTheDocument();
    const hyphens = screen.getAllByText("-");
    expect(hyphens.length).toBe(2);
  });

  it("deve usar renderCell customizado quando fornecido", () => {
    const data: ITestData[] = [
      { name: "João", age: 30, email: "joao@example.com" },
    ];

    const renderCell = (key: keyof ITestData, value: unknown) => {
      if (key === "age") {
        return `${value} anos`;
      }
      return String(value);
    };

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        renderCell={renderCell}
      />
    );

    expect(screen.getByText("30 anos")).toBeInTheDocument();
  });

  it("deve renderizar coluna de ações quando fornecida", () => {
    const data: ITestData[] = [
      { name: "João", age: 30, email: "joao@example.com" },
    ];

    const handleAction = vi.fn();

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        actions={(row) => (
          <button onClick={() => handleAction(row)} type="button">
            Deletar
          </button>
        )}
      />
    );

    expect(screen.getByText("Ações")).toBeInTheDocument();
    expect(screen.getByText("Deletar")).toBeInTheDocument();
  });

  it("deve chamar ação ao clicar no botão de ação", async () => {
    const data: ITestData[] = [
      { name: "João", age: 30, email: "joao@example.com" },
    ];

    const handleAction = vi.fn();
    const user = userEvent.setup();

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        actions={(row) => (
          <button onClick={() => handleAction(row)} type="button">
            Deletar
          </button>
        )}
      />
    );

    const actionButton = screen.getByText("Deletar");
    await user.click(actionButton);

    expect(handleAction).toHaveBeenCalledWith(data[0]);
  });

  it("deve usar label customizado para coluna de ações", () => {
    const data: ITestData[] = [
      { name: "João", age: 30, email: "joao@example.com" },
    ];

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        actions={() => <button type="button">Editar</button>}
        actionsLabel="Opções"
      />
    );

    expect(screen.getByText("Opções")).toBeInTheDocument();
    expect(screen.queryByText("Ações")).not.toBeInTheDocument();
  });

  it("deve renderizar múltiplas ações por linha", () => {
    const data: ITestData[] = [
      { name: "João", age: 30, email: "joao@example.com" },
    ];

    render(
      <SimpleTable<ITestData>
        columns={columns}
        data={data}
        dataKeys={dataKeys}
        actions={() => (
          <>
            <button type="button">Editar</button>
            <button type="button">Deletar</button>
          </>
        )}
      />
    );

    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Deletar")).toBeInTheDocument();
  });
});
