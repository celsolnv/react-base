import { Building2, Phone } from "lucide-react";

import {
  CardForm,
  InputForm,
  InputPhone,
  SelectForm,
} from "@/components/shared";
import { Separator } from "@/components/ui";
import masks from "@/utils/masks";

import { partnerCategoryOptions } from "../constants/options";

const PREFIX = "partner_details";
export const PartnerForm = () => {
  return (
    <>
      <CardForm
        title="Dados do parceiro"
        icon={<Building2 className="h-4 w-4" />}
        description="Defina os dados corporativos do cliente."
      >
        <InputForm
          label="Razão social"
          name={`${PREFIX}.reason_social`}
          className="col-span-6"
          placeholder="Digite a razão social"
          required
        />
        <InputForm
          label="Nome fantasia"
          name={`${PREFIX}.fantasy_name`}
          className="col-span-6"
          placeholder="Digite o nome fantasia"
          required
        />
        <InputForm
          label="CNPJ"
          name={`${PREFIX}.cnpj`}
          className="col-span-6"
          mask={masks.cnpj}
          placeholder="00.000.000/0000-00"
          required
        />
        <SelectForm
          label="Categoria"
          name={`${PREFIX}.category`}
          className="col-span-6"
          options={partnerCategoryOptions}
          placeholder="Digite a categoria"
          required
        />
      </CardForm>
      <CardForm
        title="Contato"
        icon={<Phone className="h-4 w-4" />}
        description="Defina os dados de contato do cliente."
      >
        <div className="border-primary col-span-12 mb-5 border-l-2 py-0.5 pl-3">
          <span className="text-foreground text-sm font-semibold">
            Contato do Responsável
          </span>
        </div>
        <InputForm
          label="Nome"
          name={`${PREFIX}.responsible_name`}
          className="col-span-12"
          placeholder="Digite o nome do responsável"
          required
        />
        <InputPhone
          name={`${PREFIX}.responsible_phone`}
          className="col-span-6"
          required
        />
        <InputForm
          label="Email"
          name={`${PREFIX}.responsible_email`}
          className="col-span-6"
          placeholder="Digite o email do responsável"
          type="email"
          required
        />
        <Separator className="col-span-12 my-5" />
        <div className="border-primary col-span-12 mb-5 border-l-2 py-0.5 pl-3">
          <span className="text-foreground text-sm font-semibold">
            Contato do Financeiro
          </span>
        </div>
        <InputForm
          label="Nome"
          name={`${PREFIX}.financial_name`}
          className="col-span-12"
          placeholder="Digite o nome do financeiro"
          required
        />
        <InputPhone
          name={`${PREFIX}.financial_phone`}
          className="col-span-6"
          required
        />
        <InputForm
          label="Email"
          name={`${PREFIX}.financial_email`}
          className="col-span-6"
          placeholder="Digite o email do financeiro"
          type="email"
          required
        />
      </CardForm>
    </>
  );
};
