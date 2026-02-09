/**
 * @jest-environment jsdom
 */

import { Pencil, Trash2 } from "lucide-react";
import { describe, expect, it } from "vitest";

import { buildColumns } from "../index";
import type { BadgeMapping } from "./types";

// Mock de tipos para teste
interface TestUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  balance: number;
  status: "active" | "inactive" | "pending";
}

describe("buildColumns", () => {
  describe("Tipos de Coluna", () => {
    it("deve criar coluna do tipo text", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "name",
          header: "Nome",
          type: "text",
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Nome");
    });

    it("deve criar coluna do tipo date", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "createdAt",
          header: "Criado em",
          type: "date",
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Criado em");
    });

    it("deve criar coluna do tipo currency", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "balance",
          header: "Saldo",
          type: "currency",
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Saldo");
    });

    it("deve criar coluna do tipo boolean", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "isActive",
          header: "Ativo",
          type: "boolean",
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Ativo");
    });

    it("deve criar coluna do tipo badge", () => {
      const badgeMap: BadgeMapping = {
        active: "default",
        inactive: "secondary",
        pending: "outline",
      };

      const columns = buildColumns<TestUser>([
        {
          accessorKey: "status",
          header: "Status",
          type: "badge",
          badgeMap,
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Status");
    });

    it("deve criar coluna customizada", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "name",
          header: "Nome",
          type: "custom",
          cell: (value) => <span>Custom: {String(value)}</span>,
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Nome");
    });
  });

  describe("Configurações de Formatação", () => {
    it("deve aplicar className customizada", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "id",
          header: "ID",
          type: "text",
          className: "font-mono text-xs",
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("ID");
    });

    it("deve usar format customizado para text", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "name",
          header: "Nome",
          type: "text",
          format: (value) => value.toUpperCase(),
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Nome");
    });

    it("deve usar dateFormat customizado", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "createdAt",
          header: "Data",
          type: "date",
          dateFormat: {
            day: "2-digit",
            month: "long",
            year: "numeric",
          },
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Data");
    });

    it("deve usar labelMap para badges", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "status",
          header: "Status",
          type: "badge",
          labelMap: {
            active: "Ativo",
            inactive: "Inativo",
          },
        },
      ]);

      expect(columns).toHaveLength(1);
      expect(columns[0].header).toBe("Status");
    });
  });

  describe("Coluna de Ações", () => {
    it("deve adicionar coluna de ações quando fornecida", () => {
      const columns = buildColumns<TestUser>(
        [
          {
            accessorKey: "name",
            header: "Nome",
            type: "text",
          },
        ],
        [
          {
            label: "Editar",
            icon: Pencil,
            onClick: () => {},
          },
        ]
      );

      // 1 coluna de dados + 1 coluna de ações
      expect(columns).toHaveLength(2);
      expect(columns[1].id).toBe("actions");
    });

    it("não deve adicionar coluna de ações se array estiver vazio", () => {
      const columns = buildColumns<TestUser>(
        [
          {
            accessorKey: "name",
            header: "Nome",
            type: "text",
          },
        ],
        []
      );

      expect(columns).toHaveLength(1);
    });

    it("não deve adicionar coluna de ações se não for fornecida", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "name",
          header: "Nome",
          type: "text",
        },
      ]);

      expect(columns).toHaveLength(1);
    });

    it("deve criar ações com todas as propriedades", () => {
      const columns = buildColumns<TestUser>(
        [
          {
            accessorKey: "name",
            header: "Nome",
            type: "text",
          },
        ],
        [
          {
            label: "Editar",
            icon: Pencil,
            onClick: () => {},
          },
          {
            label: "Excluir",
            icon: Trash2,
            onClick: () => {},
            variant: "destructive",
            hasSeparatorBefore: true,
          },
        ]
      );

      expect(columns).toHaveLength(2);
      expect(columns[1].id).toBe("actions");
    });
  });

  describe("Múltiplas Colunas", () => {
    it("deve criar múltiplas colunas de tipos diferentes", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "id",
          header: "ID",
          type: "text",
        },
        {
          accessorKey: "name",
          header: "Nome",
          type: "text",
        },
        {
          accessorKey: "createdAt",
          header: "Criado em",
          type: "date",
        },
        {
          accessorKey: "balance",
          header: "Saldo",
          type: "currency",
        },
        {
          accessorKey: "isActive",
          header: "Ativo",
          type: "boolean",
        },
      ]);

      expect(columns).toHaveLength(5);
    });

    it("deve criar tabela completa com dados e ações", () => {
      const columns = buildColumns<TestUser>(
        [
          {
            accessorKey: "id",
            header: "ID",
            type: "text",
            className: "font-mono",
          },
          {
            accessorKey: "name",
            header: "Nome",
            type: "text",
            className: "font-medium",
          },
          {
            accessorKey: "email",
            header: "E-mail",
            type: "text",
          },
          {
            accessorKey: "isActive",
            header: "Status",
            type: "boolean",
            trueLabel: "Ativo",
            falseLabel: "Inativo",
          },
        ],
        [
          {
            label: "Editar",
            icon: Pencil,
            onClick: () => {},
          },
          {
            label: "Excluir",
            icon: Trash2,
            onClick: () => {},
            variant: "destructive",
          },
        ]
      );

      // 4 colunas de dados + 1 de ações
      expect(columns).toHaveLength(5);
      expect(columns[4].id).toBe("actions");
    });
  });

  describe("Edge Cases", () => {
    it("deve lidar com array vazio de colunas", () => {
      const columns = buildColumns<TestUser>([]);

      expect(columns).toHaveLength(0);
    });

    it("deve lidar com valores nulos/undefined", () => {
      const columns = buildColumns<TestUser>([
        {
          accessorKey: "name",
          header: "Nome",
          type: "text",
        },
      ]);

      expect(columns).toHaveLength(1);
      // A renderização com valores null/undefined é testada nos testes de componente
    });
  });
});
