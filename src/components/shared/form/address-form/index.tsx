import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { MapPin } from "lucide-react";

import { CardForm, InputForm, SelectForm } from "@/components/shared";
import { countriesOptions } from "@/constants/countries";
import { ufOptions } from "@/constants/ufs";
import { getCep } from "@/lib/axios/global/cep";
import masks from "@/utils/masks";

interface IAddressFormProps {
  prefix?: string;
}
export function AddressForm({ prefix = "" }: Readonly<IAddressFormProps>) {
  const form = useFormContext();
  const cep = form.watch(`${prefix}zip_code`);
  useEffect(() => {
    const cepRegex = /^\d{5}-\d{3}$/;

    if (cepRegex.test(cep)) {
      const setFields = async () => {
        const data = await getCep(cep);
        if (data?.erro) return;
        form.setValue(`${prefix}city`, data.localidade ?? "");
        form.setValue(`${prefix}street`, data.logradouro ?? "");
        form.setValue(`${prefix}neighborhood`, data.bairro ?? "");
        form.setValue(`${prefix}state`, data.uf ?? "");
      };
      setFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  return (
    <CardForm
      title="Endereço"
      description="Defina o endereço do usuário."
      icon={<MapPin className="text-foreground/80 h-5 w-5" />}
    >
      <InputForm
        control={form.control}
        label="CEP"
        name={`${prefix}zip_code`}
        placeholder="CEP"
        className="col-span-12 sm:col-span-4"
        mask={masks.cep}
        required
      />
      <div className="col-span-12 sm:col-span-8" />
      <InputForm
        control={form.control}
        label="Rua"
        name={`${prefix}street`}
        placeholder="Rua"
        required
        className="col-span-12 sm:col-span-10"
      />
      <InputForm
        control={form.control}
        label="Número"
        name={`${prefix}number`}
        placeholder="Número"
        className="col-span-12 sm:col-span-2"
      />
      <InputForm
        control={form.control}
        label="Complemento"
        name={`${prefix}complement`}
        placeholder="Complemento"
        required={false}
        className="col-span-12 sm:col-span-6"
      />
      <InputForm
        control={form.control}
        label="Bairro"
        name={`${prefix}neighborhood`}
        placeholder="Bairro"
        required
        className="col-span-12 sm:col-span-6"
      />
      <InputForm
        control={form.control}
        label="Cidade"
        name={`${prefix}city`}
        placeholder="Cidade"
        required
        className="col-span-12 sm:col-span-4"
      />
      <SelectForm
        label="Estado"
        name={`${prefix}state`}
        options={ufOptions}
        placeholder="Estado"
        required
        className="col-span-12 sm:col-span-2"
      />
      <SelectForm
        label="País"
        name={`${prefix}country`}
        placeholder="País"
        options={countriesOptions}
        required
        disabled
        className="col-span-12 sm:col-span-4"
      />
    </CardForm>
  );
}
