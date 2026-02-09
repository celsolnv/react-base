export interface ICepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
export interface ICepError {
  erro: boolean;
}

export async function getCep(cep: string) {
  const formatCep = cep.replace(/\D/g, "");

  const response = await fetch(`https://viacep.com.br/ws/${formatCep}/json/`);
  const data = await response.json();
  return data;
}
