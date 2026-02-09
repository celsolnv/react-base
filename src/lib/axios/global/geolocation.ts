const URL = (uf: string) =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`;

export const municipalities = async (uf: string) => {
  const response = await fetch(URL(uf));
  const data = await response.json();

  if (uf === "sp") data.push({ nome: "São Paulo" });

  return data
    .map((municipality: { nome: string }) => ({
      label: municipality.nome,
      value: municipality?.nome?.toLowerCase(),
    }))
    .sort((a: { label: string }, b: { label: string }) =>
      a.label.localeCompare(b.label)
    );
};
