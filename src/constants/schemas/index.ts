import { isAfter, isBefore, isSameDay, parseISO, startOfDay } from "date-fns";
import { z } from "zod";

import masks from "@/utils/masks";

export const string = (name: string, g = "o", required = true) => {
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
};

export const phone = (name: string) => {
  return z.string({ message: `${name} é obrigatório.` }).refine(
    (value) => {
      const cleanValue = value.replace(/\D/g, "");
      return cleanValue.length > 10 && cleanValue.length <= 11;
    },
    { message: "Telefone inválido. Deve conter 11 dígitos." }
  );
};
export const cpf = () => {
  return z.string({ message: "CPF é obrigatório." }).refine(
    (value) => {
      const cleanValue = value.replace(/\D/g, "");
      return cleanValue.length === 11;
    },
    { message: "CPF inválido." }
  );
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
    .string({ message: `${name} é obrigatório.` })
    .min(1, { message: `${name} é obrigatório.` })
    .email({ message: "E-mail inválido." })
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
    message: "A data é obrigatória",
  })
  .refine(
    (dateString) => {
      try {
        const date = parseISO(dateString);
        const today = startOfDay(new Date());
        const dateToCheck = startOfDay(date);
        return isBefore(dateToCheck, today) || isSameDay(dateToCheck, today);
      } catch {
        return false;
      }
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
    message: "A data é obrigatória",
  })
  .refine(
    (dateString) => {
      try {
        const date = parseISO(dateString);
        const today = startOfDay(new Date());
        const dateToCheck = startOfDay(date);
        return isAfter(dateToCheck, today);
      } catch {
        return false;
      }
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
