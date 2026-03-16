import type { IStaff, IUser, IUserAttachment } from "@/types";
import { getFileUrl } from "@/utils/file";
import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateISO } from "@/utils/formatters/date";
import masks from "@/utils/masks";

import type { TUpdateUserSchema } from "./schema";

export const formatUserResponse = (
  user: IStaff & { user: IUser }
): TUpdateUserSchema => {
  // Vamos agrupar os attachments por tipo; Todos vão ser arrays
  const existingAttachments =
    user?.staff_attachments?.map((attachment) => attachment?.id) || [];
  const attachments: Record<string, (IUserAttachment & { url: string })[]> =
    user?.staff_attachments?.reduce(
      (acc, attachment) => {
        const format = {
          ...attachment,
          url: getFileUrl(attachment?.key),
        };
        acc[attachment?.type] = [...(acc[attachment?.type] || []), format];
        return acc;
      },
      {} as Record<string, (IUserAttachment & { url: string })[]>
    ) || {};
  const formattedUser = {
    ...user,
    name: user?.user?.name,
    email: user?.user?.email,
    phone: user?.user?.phone,
    password: undefined,
    birth_date: formatDateISO(user?.birth_date),
    hiring_date: formatDateISO(user?.hiring_date),
    salary: formatCurrency(user?.salary),
    profile_picture: user?.profile_picture
      ? getFileUrl(user?.profile_picture)
      : null,

    benefits:
      user?.benefits?.map((benefit) => ({
        ...benefit,
        value: formatCurrency(benefit?.value),
      })) || [],
    address: {
      ...user?.staff_addresses,
      country: "Brasil",
      zip_code: masks.cep(user?.staff_addresses?.zip_code),
    },
    promotions_history:
      user?.staff_promotion_histories?.map((promo) => ({
        ...promo,
        date: formatDateISO(promo?.date),
        last_salary: formatCurrency(promo?.last_salary),
        new_salary: formatCurrency(promo?.new_salary),
      })) || [],
    commission_history:
      user?.staff_commission_histories?.map((commission) => ({
        ...commission,
        date: formatDateISO(commission?.date),
        last_commission: formatCurrency(commission?.last_commission),
        new_commission: formatCurrency(commission?.new_commission),
      })) || [],
    vacations_history:
      user?.staff_vacation_histories?.map((vacation) => ({
        ...vacation,
        start_date: formatDateISO(vacation?.start_date),
        end_date: formatDateISO(vacation?.end_date),
      })) || [],
    professional_history:
      user?.staff_professional_histories?.map((prof) => ({
        ...prof,
        start_date: formatDateISO(prof?.start_date),
        end_date: formatDateISO(prof?.end_date),
      })) || [],
    // O schema Zod espera File[], mas o FileForm aceita TFileItem[] (File | IExistingFile)
    // Na prática, o schema aceita qualquer array (z.array(z.any())), mas o TypeScript infere File[]
    // Fazemos o cast para satisfazer o TypeScript, pois o FileForm aceita arquivos existentes
    identity_docs: (attachments?.DOCUMENT || []) as unknown as File[],
    residence_docs: (attachments?.PROOF_OF_ADDRESS || []) as unknown as File[],
    other_attachments: (attachments?.OTHER || []) as unknown as File[],
    existing_attachments: existingAttachments,
  } as TUpdateUserSchema;

  return formattedUser;
};
