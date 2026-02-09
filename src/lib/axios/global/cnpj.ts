const url = "https://brasilapi.com.br/api/cnpj/v1";
import axios from "axios";

export const getCnpj = async (cnpj?: string) => {
  if (!cnpj) return;

  try {
    const replaced = cnpj.replace(/\D/g, "");
    const { data } = await axios.get(`${url}/${replaced}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
