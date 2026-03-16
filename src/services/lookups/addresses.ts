// src/services/lookups/addresses.ts

import api from "@/lib/axios";
import type { IGenericObject } from "@/types/Common";
import { removeFalsyValuesFromObject } from "@/utils/func";

const baseUrl = "/public";
/**
 * Busca estados do seu próprio backend
 */
export const fetchStateOptions = async () => {
  const {
    data: {
      data: { data },
    },
  } = await api.get(`${baseUrl}/states/index`);
  return data.map((state: IGenericObject) => ({
    label: state.name,
    value: state.id, // Ou sigla, conforme seu banco
  }));
};

/**
 * Busca cidades baseadas no ID do estado.
 * UF é obrigatório.
 * Retorna objeto com array de nomes das cidades e um Map nome -> ID para buscar bairros.
 */
export const fetchCityOptions = async (
  uf: string,
  search?: string
): Promise<{
  cities: string[];
  cityIdMap: Map<string, string | number>;
}> => {
  if (!uf) return { cities: [], cityIdMap: new Map() };
  const query = removeFalsyValuesFromObject({ uf, search });
  const {
    data: {
      data: { data },
    },
  } = await api.get(`${baseUrl}/cities/index`, {
    params: query,
  });

  const cityNames = data.map((city: IGenericObject) => city.name);
  const map = new Map<string, string | number>();
  data.forEach((city: IGenericObject) => {
    map.set(city.name, city.id);
  });

  return { cities: cityNames, cityIdMap: map };
};

/**
 * Busca bairros baseados no ID da cidade.
 * Retorna array de strings para ser usado com InputAutocompleteForm.
 */
export const fetchNeighborhoodOptions = async (
  cityId: string | number
): Promise<string[]> => {
  if (!cityId) return [];
  const {
    data: {
      data: { data },
    },
  } = await api.get(`${baseUrl}/neighborhoods/index`, {
    params: { city_id: cityId },
  });
  return data.map((neighborhood: IGenericObject) => neighborhood.name);
};
