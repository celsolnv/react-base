import { isValidPhoneNumber } from "react-phone-number-input";

import { isAfter, isValid, parseISO, startOfDay } from "date-fns";
import z from "zod";

import masks from "@/utils/masks";

// Overload para a função string
export function string(name: string, g?: string, required?: true): z.ZodString;
export function string(
  name: string,
  g: string,
  required: false
): z.ZodOptional<z.ZodNullable<z.ZodString>>;

export function string(
  name: string,
  g: string | undefined = "o",
  required: boolean = true
): z.ZodTypeAny {
  if (required) {
    return z
      .string({
        message: `${name} é obrigatóri${g}.`,
      })
      .min(1, { message: `${name} deve ter pelo menos 1 caractere.` })
      .max(255, { message: `${name} deve ter no máximo 255 caracteres.` });
  }
  return z
    .string({ message: `${name} é obrigatóri${g}.` })
    .nullable()
    .transform((val) => val ?? null)
    .optional();
}

export const phone = (name: string, required: boolean = true) => {
  const transform = (value: string | null | undefined) => {
    if (!value) return null;
    const cleanValue = masks.removeNonNumbers(value);
    return `+${cleanValue}`;
  };
  if (required) {
    return z
      .string({ message: `${name} é obrigatório.` })
      .refine(isValidPhoneNumber, {
        message: "Telefone inválido. Deve conter 11 dígitos.",
      })
      .transform(transform);
  }
  return z
    .string({ message: `${name} é obrigatório.` })
    .nullable()
    .refine(
      (value) => {
        if (!value) return true; // Permitir nulo/undefined se não for obrigatório
        return isValidPhoneNumber(value);
      },
      {
        message: "Telefone inválido. Deve conter 11 dígitos.",
      }
    )
    .transform(transform);
};
export const cpf = () => {
  return z
    .string({ message: "CPF é obrigatório." })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "");
        return cleanValue.length === 11;
      },
      { message: "CPF inválido." }
    )
    .transform((value) => {
      return masks.removeNonNumbers(value);
    });
};
export const cnpj = (name = "CNPJ") => {
  return z.string({ message: `${name} é obrigatório.` }).refine(
    (value) => {
      const cleanValue = value.replace(/\D/g, "");
      return cleanValue.length === 14;
    },
    { message: "CNPJ inválido." }
  );
};

export const zipCode = (name = "CEP") => {
  return z
    .string({ message: `${name} é obrigatório.` })
    .refine(
      (value) => {
        const cleanValue = masks.removeNonNumbers(value);
        return cleanValue.length === 8;
      },
      { message: `${name} inválido.` }
    )
    .transform((value) => {
      return masks.removeNonNumbers(value);
    });
};

export const number = (name: string) => {
  return z.number({ message: `${name} é obrigatório.` });
};

export const numberTransform = (_name: string, required = true) => {
  return z
    .any()
    .refine(
      (value) => {
        if (!value && required) {
          return false;
        }
        return true;
      },
      { message: "Campo obrigatório" }
    )
    .refine(
      (value) => {
        if (!value && !required) {
          return true;
        }
        if (typeof value === "number") {
          if (!required) return true;
          return !isNaN(value);
        }
        const cleanValue = value?.replace(/\D/g, "");
        return !isNaN(Number(cleanValue));
      },
      { message: "Valor inválido" }
    )
    .transform((value) => {
      if (typeof value === "number") {
        return value;
      }
      const cleanValue = masks.maskIntoNumber(value);
      return cleanValue;
    });
};

export const email = (name: string) => {
  return z
    .email({ message: `${name} é obrigatório.` })
    .min(1, { message: `${name} é obrigatório.` })
    .max(255, { message: `${name} deve ter no máximo 255 caracteres.` });
};

export const text = (name: string) => {
  return z
    .string({ message: `${name} é obrigatório.` })
    .nullable()
    .transform((val) => val ?? null)
    .optional();
};

export const select = (name: string, g = "o", required = true) => {
  if (required) {
    return z
      .string({ message: `${name} é obrigatóri${g}.` })
      .min(1, { message: `${name} é obrigatóri${g}.` });
  }
  return z
    .string({ message: `${name} é obrigatóri${g}.` })
    .nullable()
    .transform((val) => val ?? null)
    .optional();
};

export const password = z
  .string({ message: "Senha é obrigatória" })
  .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
  .refine((value) => /[A-Z]/.test(value), {
    message: "A senha deve conter pelo menos uma letra maiúscula.",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "A senha deve conter pelo menos uma letra minúscula.",
  })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
    message: "A senha deve conter pelo menos um caractere especial.",
  });

export const dateNotFuture = z
  .string({
    error: "A data é obrigatória",
  })
  .refine(
    (dateString) => {
      // parseISO é ideal para o formato YYYY-MM-DD
      const date = parseISO(dateString);

      // Se a string não for uma data válida, o refine falha
      if (!isValid(date)) return false;

      const today = startOfDay(new Date());

      // Retorna true se a data NÃO for depois de hoje
      // (ou seja, hoje ou passado)
      return !isAfter(date, today);
    },
    {
      message: "A data não pode ser uma data futura",
    }
  );

export const dateFutureAllowed = z.string({
  message: "A data é obrigatória",
});

export const dateOnlyFuture = z
  .string({
    error: "A data é obrigatória",
  })
  .refine(
    (dateString) => {
      const date = parseISO(dateString);

      // Garante que a string é uma data válida antes de comparar
      if (!isValid(date)) return false;

      const today = startOfDay(new Date());

      // Verifica se a data fornecida é estritamente posterior a hoje (00:00)
      return isAfter(date, today);
    },
    {
      message: "A data deve ser uma data futura",
    }
  );

export const date = (name = "date") =>
  z.string({
    message: `${name} é obrigatória`,
  });

export const boolean = (name: string) => {
  return z.boolean({ message: `${name} é obrigatório.` });
};

export const money = (name: string, required = true) => {
  if (required) {
    return z
      .string({ message: `${name} é obrigatório.` })
      .refine(
        (value) => {
          const cleanValue = value.replace(/\D/g, "");
          return !isNaN(Number(cleanValue));
        },
        { message: "Valor inválido" }
      )
      .transform((value) => {
        const cleanValue = value.replace(/[^\d.,]/g, "");
        const newValue = cleanValue.replaceAll(".", "").replaceAll(",", ".");
        return newValue;
      });
  }
  return z
    .string({ message: `${name} é obrigatório.` })
    .nullable()
    .transform((value) => {
      if (!value) {
        return null;
      }
      const cleanValue = value.replace(/[^\d.,]/g, "");
      const newValue = cleanValue.replaceAll(".", "").replaceAll(",", ".");
      return newValue;
    })
    .optional();
};

// Helper para arrays de arquivos (File nativo ou metadados do backend)
// O transform filtra apenas instâncias de File para envio ao backend
export const fileArray = (_name: string, required = false) => {
  const baseSchema = z.array(z.any()).transform((items) => {
    if (!items || !Array.isArray(items)) return [];
    // Filtrar apenas File nativos, ignorar metadados de arquivos existentes
    return items.filter((item) => item instanceof File);
  });

  if (required) {
    return baseSchema.refine((files) => files.length > 0, {
      message: "Pelo menos um arquivo é obrigatório.",
    });
  }

  return baseSchema.optional();
};

export const file = (name: string, required = false) => {
  const baseSchema = z.any().transform((value) => {
    if (!value) return undefined;
    if (value instanceof File) return value;
    return undefined;
  });

  if (required) {
    return baseSchema.refine((file) => file instanceof File, {
      message: `${name} é obrigatório.`,
    });
  }

  return baseSchema.optional();
};
