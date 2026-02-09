import type { IUser, IUserAttachment } from "@/types";
import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateISO } from "@/utils/formatters/date";
import masks from "@/utils/masks";

import type { TUpdateUserSchema } from "../constants/update-schema";

export const formatUserResponse = (user: IUser): TUpdateUserSchema => {
  // Vamos agrupar os attachments por tipo; Todos vão ser arrays
  const existingAttachments =
    user?.user_attachments?.map((attachment) => attachment?.id) || [];
  const attachments: Record<string, (IUserAttachment & { url: string })[]> =
    user?.user_attachments?.reduce(
      (acc, attachment) => {
        const format = {
          ...attachment,
          url: `${import.meta.env.VITE_FILE_URL}/${attachment?.key}`,
        };
        acc[attachment?.type] = [...(acc[attachment?.type] || []), format];
        return acc;
      },
      {} as Record<string, (IUserAttachment & { url: string })[]>
    ) || {};
  const formattedUser = {
    ...user,
    password: undefined,
    birth_date: formatDateISO(user?.birth_date),
    hiring_date: formatDateISO(user?.hiring_date),
    salary: formatCurrency(user?.salary),
    profile_picture: attachments?.PROFILE_IMAGE?.[0]?.url,

    benefits:
      user?.benefits?.map((benefit) => ({
        ...benefit,
        value: formatCurrency(benefit?.value),
      })) || [],
    address: {
      ...user?.user_addresses,
      country: "Brasil",
      zip_code: masks.cep(user?.user_addresses?.zip_code),
    },
    promotions_history:
      user?.user_promotion_histories?.map((promo) => ({
        ...promo,
        date: formatDateISO(promo?.date),
        last_salary: formatCurrency(promo?.last_salary),
        new_salary: formatCurrency(promo?.new_salary),
      })) || [],
    commission_history:
      user?.user_commission_histories?.map((commission) => ({
        ...commission,
        date: formatDateISO(commission?.date),
        last_commission: formatCurrency(commission?.last_commission),
        new_commission: formatCurrency(commission?.new_commission),
      })) || [],
    vacations_history:
      user?.user_vacation_histories?.map((vacation) => ({
        ...vacation,
        start_date: formatDateISO(vacation?.start_date),
        end_date: formatDateISO(vacation?.end_date),
      })) || [],
    professional_history:
      user?.user_professional_histories?.map((prof) => ({
        ...prof,
        start_date: formatDateISO(prof?.start_date),
        end_date: formatDateISO(prof?.end_date),
      })) || [],
    identity_docs: attachments?.DOCUMENT,
    residence_docs: attachments?.PROOF_OF_ADDRESS,
    other_attachments: attachments?.OTHER,
    existingAttachments,
  } as TUpdateUserSchema;

  return formattedUser;
};
