import * as React from "react";
import { useForm } from "react-hook-form";

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Form } from "@/components/ui/form";

import { AddressForm } from "./index";

// Mock da função getCep
const mockGetCep = vi.fn();
vi.mock("@/lib/axios/global/cep", () => ({
  getCep: (...args: unknown[]) => mockGetCep(...args),
}));

// Mock do console.log para evitar logs nos testes
const originalConsoleLog = console.log;

// Helper para criar um componente wrapper com form
const TestWrapper = ({
  children,
  defaultValues = {},
  onFormReady,
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
  onFormReady?: (form: ReturnType<typeof useForm>) => void;
}) => {
  const form = useForm({
    defaultValues,
  });

  React.useEffect(() => {
    if (onFormReady) {
      onFormReady(form);
    }
  }, [form, onFormReady]);

  return <Form {...form}>{children}</Form>;
};

describe("AddressForm", () => {
  beforeEach(() => {
    console.log = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    console.log = originalConsoleLog;
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render address form with all fields", () => {
      render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      expect(screen.getByText("Endereço")).toBeInTheDocument();
      expect(
        screen.getByText("Defina o endereço do usuário.")
      ).toBeInTheDocument();
      // Verifica se os labels estão presentes
      expect(screen.getByText("CEP")).toBeInTheDocument();
      expect(screen.getByText("Rua")).toBeInTheDocument();
      expect(screen.getByText("Número")).toBeInTheDocument();
      expect(screen.getByText("Complemento")).toBeInTheDocument();
      expect(screen.getByText("Bairro")).toBeInTheDocument();
      expect(screen.getByText("Cidade")).toBeInTheDocument();
      // Pode haver múltiplos elementos com o mesmo texto
      expect(screen.getAllByText("Estado").length).toBeGreaterThan(0);
      expect(screen.getAllByText("País").length).toBeGreaterThan(0);
    });

    it("should render with prefix", () => {
      render(
        <TestWrapper>
          <AddressForm prefix="address_" />
        </TestWrapper>
      );

      expect(screen.getByText("CEP")).toBeInTheDocument();
      expect(screen.getByText("Rua")).toBeInTheDocument();
    });

    it("should render CardForm with icon", () => {
      const { container } = render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      // Verifica se o ícone MapPin está presente (lucide-react renderiza como SVG)
      const icon = container.querySelector(".lucide-map-pin");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Form Fields", () => {
    it("should render all form field labels", () => {
      render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      expect(screen.getByText("CEP")).toBeInTheDocument();
      expect(screen.getByText("Rua")).toBeInTheDocument();
      expect(screen.getByText("Número")).toBeInTheDocument();
      expect(screen.getByText("Complemento")).toBeInTheDocument();
      expect(screen.getByText("Bairro")).toBeInTheDocument();
      expect(screen.getByText("Cidade")).toBeInTheDocument();
      // Pode haver múltiplos elementos com o mesmo texto
      expect(screen.getAllByText("Estado").length).toBeGreaterThan(0);
      expect(screen.getAllByText("País").length).toBeGreaterThan(0);
    });

    it("should render input fields", () => {
      const { container } = render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      // Verifica se há inputs no formulário (pode ser type="text" ou sem type definido)
      const inputs = container.querySelectorAll("input");
      expect(inputs.length).toBeGreaterThan(0);
    });

    it("should render select fields", () => {
      render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      // Verifica se há comboboxes (SelectForm renderiza como combobox)
      const comboboxes = screen.queryAllByRole("combobox");
      expect(comboboxes.length).toBeGreaterThanOrEqual(2); // Estado e País
    });
  });

  describe("CEP Auto-fill", () => {
    it("should fetch CEP data when valid CEP is entered", async () => {
      const mockCepData = {
        localidade: "São Paulo",
        logradouro: "Rua Teste",
        bairro: "Centro",
        uf: "SP",
      };

      mockGetCep.mockResolvedValue(mockCepData);

      let formInstance: ReturnType<typeof useForm> | null = null;

      render(
        <TestWrapper
          defaultValues={{ zip_code: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <AddressForm />
        </TestWrapper>
      );

      // Aguarda o form estar pronto
      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      // Set o valor diretamente no form para disparar o watch
      await act(async () => {
        formInstance?.setValue("zip_code", "12345-678");
      });

      // Aguarda o useEffect executar
      await waitFor(
        () => {
          expect(mockGetCep).toHaveBeenCalledWith("12345-678");
        },
        { timeout: 5000 }
      );
    }, 10000);

    it("should not fetch CEP data when CEP format is invalid", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      const cepInput = document.querySelector(
        'input[name="zip_code"]'
      ) as HTMLInputElement;
      expect(cepInput).toBeInTheDocument();

      await user.type(cepInput, "12345");

      // Aguarda um pouco para garantir que não foi chamado
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(mockGetCep).not.toHaveBeenCalled();
    });

    it("should auto-fill fields when CEP is fetched successfully", async () => {
      const mockCepData = {
        localidade: "São Paulo",
        logradouro: "Rua Teste",
        bairro: "Centro",
        uf: "SP",
      };

      mockGetCep.mockResolvedValue(mockCepData);

      let formInstance: ReturnType<typeof useForm> | null = null;

      render(
        <TestWrapper
          defaultValues={{ zip_code: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <AddressForm />
        </TestWrapper>
      );

      // Aguarda o form estar pronto
      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      // Set o valor diretamente no form para disparar o watch
      await act(async () => {
        formInstance?.setValue("zip_code", "12345-678");
      });

      // Aguarda o useEffect executar e a API ser chamada
      await waitFor(
        () => {
          expect(mockGetCep).toHaveBeenCalledWith("12345-678");
        },
        { timeout: 5000 }
      );

      // Aguarda os campos serem preenchidos via form.setValue
      await waitFor(
        () => {
          const cityInput = document.querySelector(
            'input[name="city"]'
          ) as HTMLInputElement;
          const streetInput = document.querySelector(
            'input[name="street"]'
          ) as HTMLInputElement;
          const neighborhoodInput = document.querySelector(
            'input[name="neighborhood"]'
          ) as HTMLInputElement;

          expect(cityInput?.value).toBe("São Paulo");
          expect(streetInput?.value).toBe("Rua Teste");
          expect(neighborhoodInput?.value).toBe("Centro");
        },
        { timeout: 5000 }
      );
    }, 15000);

    it("should not auto-fill fields when CEP API returns error", async () => {
      const mockCepError = {
        erro: true,
      };

      mockGetCep.mockResolvedValue(mockCepError);

      let formInstance: ReturnType<typeof useForm> | null = null;

      render(
        <TestWrapper
          defaultValues={{ zip_code: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <AddressForm />
        </TestWrapper>
      );

      // Aguarda o form estar pronto
      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      // Set o valor diretamente no form para disparar o watch
      await act(async () => {
        formInstance?.setValue("zip_code", "12345-678");
      });

      // Aguarda a API ser chamada
      await waitFor(
        () => {
          expect(mockGetCep).toHaveBeenCalledWith("12345-678");
        },
        { timeout: 5000 }
      );

      // Aguarda um pouco para garantir que não preencheu
      await new Promise((resolve) => setTimeout(resolve, 500));

      const cityInput = document.querySelector(
        'input[name="city"]'
      ) as HTMLInputElement;
      expect(cityInput?.value || "").toBe("");
    }, 10000);

    it("should handle missing fields in CEP response", async () => {
      const mockCepData = {
        localidade: null,
        logradouro: null,
        bairro: null,
        uf: null,
      };

      mockGetCep.mockResolvedValue(mockCepData);

      let formInstance: ReturnType<typeof useForm> | null = null;

      render(
        <TestWrapper
          defaultValues={{ zip_code: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <AddressForm />
        </TestWrapper>
      );

      // Aguarda o form estar pronto
      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      // Set o valor diretamente no form para disparar o watch
      await act(async () => {
        formInstance?.setValue("zip_code", "12345-678");
      });

      // Aguarda a API ser chamada
      await waitFor(
        () => {
          expect(mockGetCep).toHaveBeenCalledWith("12345-678");
        },
        { timeout: 5000 }
      );

      // Campos devem estar vazios quando valores são null
      await new Promise((resolve) => setTimeout(resolve, 500));

      const cityInput = document.querySelector(
        'input[name="city"]'
      ) as HTMLInputElement;
      const streetInput = document.querySelector(
        'input[name="street"]'
      ) as HTMLInputElement;
      expect(cityInput?.value || "").toBe("");
      expect(streetInput?.value || "").toBe("");
    }, 10000);

    it("should use prefix in field names when prefix is provided", async () => {
      const mockCepData = {
        localidade: "São Paulo",
        logradouro: "Rua Teste",
        bairro: "Centro",
        uf: "SP",
      };

      mockGetCep.mockResolvedValue(mockCepData);

      let formInstance: ReturnType<typeof useForm> | null = null;

      render(
        <TestWrapper
          defaultValues={{ address_zip_code: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <AddressForm prefix="address_" />
        </TestWrapper>
      );

      // Verifica se os campos têm o prefix no name
      const cepInput = document.querySelector(
        'input[name="address_zip_code"]'
      ) as HTMLInputElement;
      expect(cepInput).toBeInTheDocument();

      // Aguarda o form estar pronto
      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      // Set o valor diretamente no form para disparar o watch
      await act(async () => {
        formInstance?.setValue("address_zip_code", "12345-678");
      });

      // Aguarda a API ser chamada
      await waitFor(
        () => {
          expect(mockGetCep).toHaveBeenCalledWith("12345-678");
        },
        { timeout: 5000 }
      );
    }, 10000);
  });

  describe("Field Layout", () => {
    it("should apply correct grid classes", () => {
      const { container } = render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      // Verifica se há classes de grid aplicadas
      const cepField = container
        .querySelector('input[name="zip_code"]')
        ?.closest('[class*="col-span"]');
      expect(cepField).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty prefix", () => {
      render(
        <TestWrapper>
          <AddressForm prefix="" />
        </TestWrapper>
      );

      const cepInput = document.querySelector('input[name="zip_code"]');
      expect(cepInput).toBeInTheDocument();
    });

    it("should handle CEP with only numbers (no mask)", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      const cepInput = document.querySelector(
        'input[name="zip_code"]'
      ) as HTMLInputElement;
      await user.type(cepInput, "12345678");

      // CEP sem máscara não deve passar na validação do regex
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(mockGetCep).not.toHaveBeenCalled();
    });

    it("should handle API error gracefully", async () => {
      // Silencia console.error para evitar logs de erro não tratado
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockGetCep.mockRejectedValue(new Error("Network error"));

      let formInstance: ReturnType<typeof useForm> | null = null;

      render(
        <TestWrapper
          defaultValues={{ zip_code: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <AddressForm />
        </TestWrapper>
      );

      const cepInput = document.querySelector(
        'input[name="zip_code"]'
      ) as HTMLInputElement;
      expect(cepInput).toBeInTheDocument();

      // Aguarda o form estar pronto
      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      // Set o valor diretamente no form para disparar o watch
      await act(async () => {
        formInstance?.setValue("zip_code", "12345-678");
      });

      // Aguarda a API ser chamada (mesmo que falhe)
      await waitFor(
        () => {
          expect(mockGetCep).toHaveBeenCalledWith("12345-678");
        },
        { timeout: 5000 }
      );

      // Aguarda um pouco para que o erro seja processado
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Componente não deve quebrar com erro da API
      expect(cepInput).toBeInTheDocument();

      // Restaura console.error
      consoleErrorSpy.mockRestore();
      expect(cepInput).toBeInTheDocument();
    }, 10000);

    it("should handle partial CEP input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AddressForm />
        </TestWrapper>
      );

      const cepInput = document.querySelector(
        'input[name="zip_code"]'
      ) as HTMLInputElement;
      await user.type(cepInput, "12345");

      // CEP parcial não deve disparar busca
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(mockGetCep).not.toHaveBeenCalled();
    });
  });
});
