import { describe, expect, it } from "vitest";

import Mask from "./index";

describe("Mask", () => {
  describe("maxLength", () => {
    it("deve retornar a string completa quando o tamanho é menor ou igual ao máximo", () => {
      expect(Mask.maxLength("abc", 5)).toBe("abc");
      expect(Mask.maxLength("abc", 3)).toBe("abc");
    });

    it("deve truncar a string quando o tamanho é maior que o máximo", () => {
      expect(Mask.maxLength("abcdef", 3)).toBe("abc");
      expect(Mask.maxLength("123456789", 5)).toBe("12345");
    });
  });

  describe("phone", () => {
    it("deve retornar string vazia quando input é undefined", () => {
      expect(Mask.phone()).toBe("");
    });

    it("deve retornar string vazia quando input é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.phone(null)).toBe("");
    });

    it("deve retornar string vazia quando input é string vazia", () => {
      expect(Mask.phone("")).toBe("");
    });

    it("deve formatar número de telefone com DDI 55", () => {
      expect(Mask.phone("5511999999999")).toBe("+55 (11) 9 9999-9999");
      expect(Mask.phone("5511987654321")).toBe("+55 (11) 9 8765-4321");
    });

    it("deve formatar número de telefone sem DDI", () => {
      expect(Mask.phone("11999999999")).toBe("(11) 9 9999-9999");
      expect(Mask.phone("11987654321")).toBe("(11) 9 8765-4321");
    });

    it("deve formatar número parcial com 2 dígitos", () => {
      expect(Mask.phone("11")).toBe("(11");
    });

    it("deve formatar número parcial com 3 dígitos", () => {
      expect(Mask.phone("119")).toBe("(11) 9");
    });

    it("deve formatar número parcial com 6 dígitos", () => {
      expect(Mask.phone("119999")).toBe("(11) 9 999");
    });

    it("deve formatar número parcial com 10 dígitos", () => {
      expect(Mask.phone("1199999999")).toBe("(11) 9 9999-999");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.phone("(11) 99999-9999")).toBe("(11) 9 9999-9999");
      expect(Mask.phone("11-99999-9999")).toBe("(11) 9 9999-9999");
      expect(Mask.phone("abc11999999999def")).toBe("(11) 9 9999-9999");
    });

    it("deve lidar com números muito longos", () => {
      expect(Mask.phone("119999999999999")).toBe("(11) 9 9999-9999");
    });
  });

  describe("cpf", () => {
    it("deve retornar string vazia quando value é undefined", () => {
      // @ts-expect-error - Testing undefined input
      expect(Mask.cpf(undefined)).toBe("");
    });

    it("deve retornar string vazia quando value é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.cpf(null)).toBe("");
    });

    it("deve retornar string vazia quando value é string vazia", () => {
      expect(Mask.cpf("")).toBe("");
    });

    it("deve formatar CPF completo", () => {
      expect(Mask.cpf("12345678901")).toBe("123.456.789-01");
    });

    it("deve formatar CPF parcial com até 3 dígitos", () => {
      expect(Mask.cpf("123")).toBe("123");
    });

    it("deve formatar CPF parcial com 4 a 6 dígitos", () => {
      expect(Mask.cpf("1234")).toBe("123.4");
      expect(Mask.cpf("123456")).toBe("123.456");
    });

    it("deve formatar CPF parcial com 7 a 9 dígitos", () => {
      expect(Mask.cpf("1234567")).toBe("123.456.7");
      expect(Mask.cpf("123456789")).toBe("123.456.789");
    });

    it("deve formatar CPF parcial com 10 a 11 dígitos", () => {
      expect(Mask.cpf("1234567890")).toBe("123.456.789-0");
      expect(Mask.cpf("12345678901")).toBe("123.456.789-01");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.cpf("123.456.789-01")).toBe("123.456.789-01");
      expect(Mask.cpf("abc12345678901def")).toBe("123.456.789-01");
    });
  });

  describe("cnpj", () => {
    it("deve retornar string vazia quando value é undefined", () => {
      expect(Mask.cnpj()).toBe("");
    });

    it("deve retornar string vazia quando value é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.cnpj(null)).toBe("");
    });

    it("deve retornar o valor quando não é string (number)", () => {
      // @ts-expect-error - Testing number input
      expect(Mask.cnpj(123)).toBe(123);
    });

    it("deve formatar CNPJ completo", () => {
      expect(Mask.cnpj("12345678000190")).toBe("12.345.678/0001-90");
    });

    it("deve formatar CNPJ parcial", () => {
      expect(Mask.cnpj("12")).toBe("12");
      expect(Mask.cnpj("12345")).toBe("12.345");
      expect(Mask.cnpj("12345678")).toBe("12.345.678");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.cnpj("12.345.678/0001-90")).toBe("12.345.678/0001-90");
      expect(Mask.cnpj("abc12345678000190def")).toBe("12.345.678/0001-90");
    });

    it("deve limitar a 14 dígitos", () => {
      expect(Mask.cnpj("12345678000190123")).toBe("12.345.678/0001-90");
    });
  });

  describe("money", () => {
    it("deve retornar string vazia quando param é undefined", () => {
      expect(Mask.money()).toBe("");
    });

    it("deve retornar string vazia quando param é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.money(null)).toBe("");
    });

    it("deve retornar string vazia quando param é string vazia", () => {
      expect(Mask.money("")).toBe("");
    });

    it("deve formatar número como string", () => {
      // toLocaleString retorna com espaço não separável (NBSP)
      expect(Mask.money(1234.56)).toMatch(/R\$\s?1\.234,56/);
      expect(Mask.money(100)).toMatch(/R\$\s?100,00/);
      expect(Mask.money(0)).toMatch(/R\$\s?0,00/);
    });

    it("deve formatar string numérica", () => {
      // toLocaleString retorna com espaço não separável (NBSP)
      expect(Mask.money("123456")).toMatch(/R\$\s?1\.234,56/);
      expect(Mask.money("10000")).toMatch(/R\$\s?100,00/);
    });

    it("deve retornar R$ 0,00 quando value é apenas 'R$'", () => {
      expect(Mask.money("R$")).toBe("R$ 0,00");
    });

    it("deve retornar R$ 0,00 quando input contém apenas espaços", () => {
      expect(Mask.money("   ")).toBe("R$ 0,00");
    });

    it("deve remover caracteres não numéricos", () => {
      // toLocaleString retorna com espaço não separável (NBSP)
      expect(Mask.money("R$ 1.234,56")).toMatch(/R\$\s?1\.234,56/);
      expect(Mask.money("abc123456def")).toMatch(/R\$\s?1\.234,56/);
    });

    it("deve lidar com valores decimais", () => {
      // toLocaleString retorna com espaço não separável (NBSP)
      expect(Mask.money("12345")).toMatch(/R\$\s?123,45/);
      expect(Mask.money("1")).toMatch(/R\$\s?0,01/);
    });

    it("deve lidar com valores zero", () => {
      // toLocaleString retorna com espaço não separável (NBSP)
      expect(Mask.money(0)).toMatch(/R\$\s?0,00/);
      expect(Mask.money("0")).toMatch(/R\$\s?0,00/);
    });
  });

  describe("cep", () => {
    it("deve retornar string vazia quando cep não é string", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.cep(null)).toBe("");
      // @ts-expect-error - Testing number input
      expect(Mask.cep(12345678)).toBe("");
    });

    it("deve retornar CEP sem formatação quando length < 8", () => {
      expect(Mask.cep("12345")).toBe("12345");
      expect(Mask.cep("1234567")).toBe("1234567");
    });

    it("deve formatar CEP completo", () => {
      expect(Mask.cep("12345678")).toBe("12345-678");
      expect(Mask.cep("01234567")).toBe("01234-567");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.cep("12345-678")).toBe("12345-678");
      expect(Mask.cep("abc12345678def")).toBe("12345-678");
    });

    it("deve lidar com CEPs muito longos (não limita tamanho)", () => {
      expect(Mask.cep("123456789012")).toBe("12345-6789012");
    });
  });

  describe("number", () => {
    it("deve remover todos os caracteres não numéricos", () => {
      expect(Mask.number("123abc456")).toBe("123456");
      expect(Mask.number("abc")).toBe("");
      expect(Mask.number("12-34.56")).toBe("123456");
    });

    it("deve retornar apenas números", () => {
      expect(Mask.number("123456")).toBe("123456");
      expect(Mask.number("0")).toBe("0");
    });
  });

  describe("justNumber", () => {
    it("deve retornar '0,00' quando value é undefined", () => {
      expect(Mask.justNumber()).toBe("0,00");
    });

    it("deve formatar número com vírgula", () => {
      expect(Mask.justNumber("123,45")).toBe("123,45");
      expect(Mask.justNumber("12,34,56")).toBe("12,3456");
    });

    it("deve formatar número sem vírgula", () => {
      expect(Mask.justNumber("12345")).toBe("12345");
      expect(Mask.justNumber("0")).toBe("0");
    });

    it("deve substituir ponto por vírgula", () => {
      expect(Mask.justNumber("123.45")).toBe("123,45");
    });

    it("deve remover caracteres não numéricos exceto vírgula e menos", () => {
      expect(Mask.justNumber("abc123,45def")).toBe("123,45");
      // O método substitui ponto por vírgula primeiro, então "1.234,56" vira "1,23456"
      expect(Mask.justNumber("R$ 1.234,56")).toBe("1,23456");
    });

    it("deve permitir apenas uma vírgula", () => {
      expect(Mask.justNumber("12,34,56")).toBe("12,3456");
    });
  });

  describe("removeNonNumbers", () => {
    it("deve retornar '0' quando value é undefined", () => {
      expect(Mask.removeNonNumbers()).toBe("0");
    });

    it("deve retornar '0' quando value é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.removeNonNumbers(null)).toBe("0");
    });

    it("deve retornar '0' quando value é string vazia", () => {
      expect(Mask.removeNonNumbers("")).toBe("0");
    });

    it("deve remover todos os caracteres não numéricos", () => {
      expect(Mask.removeNonNumbers("123abc456")).toBe("123456");
      expect(Mask.removeNonNumbers("abc")).toBe("");
      expect(Mask.removeNonNumbers("12-34.56")).toBe("123456");
    });

    it("deve retornar apenas números", () => {
      expect(Mask.removeNonNumbers("123456")).toBe("123456");
      expect(Mask.removeNonNumbers("0")).toBe("0");
    });
  });

  describe("percent", () => {
    it("deve retornar '0,00' quando value é undefined", () => {
      // @ts-expect-error - Testing undefined input
      expect(Mask.percent(undefined)).toBe("0,00");
    });

    it("deve retornar '0,00' quando value é string vazia", () => {
      expect(Mask.percent("")).toBe("0,00");
    });

    it("deve retornar '0,00' quando value contém apenas espaços", () => {
      expect(Mask.percent("   ")).toBe("0,00");
    });

    it("deve formatar percentual corretamente", () => {
      expect(Mask.percent("5000")).toBe("50,00");
      expect(Mask.percent("10000")).toBe("100,00");
      expect(Mask.percent("1")).toBe("0,01");
    });

    it("deve limitar a 100 quando valor excede 100", () => {
      expect(Mask.percent("15000")).toBe("100,00");
      expect(Mask.percent("20000")).toBe("100,00");
      expect(Mask.percent("999999")).toBe("100,00");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.percent("abc5000def")).toBe("50,00");
      expect(Mask.percent("50%")).toBe("0,50");
    });
  });

  describe("decimal", () => {
    it("deve retornar '0,00' quando value é undefined", () => {
      // @ts-expect-error - Testing undefined input
      expect(Mask.decimal(undefined)).toBe("0,00");
    });

    it("deve retornar '0,00' quando value é string vazia", () => {
      expect(Mask.decimal("")).toBe("0,00");
    });

    it("deve retornar '0,00' quando value contém apenas espaços", () => {
      expect(Mask.decimal("   ")).toBe("0,00");
    });

    it("deve formatar decimal corretamente", () => {
      expect(Mask.decimal("12345")).toBe("123,45");
      expect(Mask.decimal("10000")).toBe("100,00");
      expect(Mask.decimal("1")).toBe("0,01");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.decimal("abc12345def")).toBe("123,45");
      expect(Mask.decimal("R$ 1.234,56")).toBe("1234,56");
    });
  });

  describe("decimalWithNegative", () => {
    it("deve retornar '0,00' quando value é undefined", () => {
      // @ts-expect-error - Testing undefined input
      expect(Mask.decimalWithNegative(undefined)).toBe("0,00");
    });

    it("deve retornar '0,00' quando value é string vazia", () => {
      expect(Mask.decimalWithNegative("")).toBe("0,00");
    });

    it("deve retornar '0,00' quando value contém apenas espaços", () => {
      expect(Mask.decimalWithNegative("   ")).toBe("0,00");
    });

    it("deve formatar decimal positivo corretamente", () => {
      expect(Mask.decimalWithNegative("12345")).toBe("123,45");
      expect(Mask.decimalWithNegative("10000")).toBe("100,00");
    });

    it("deve formatar decimal negativo corretamente", () => {
      expect(Mask.decimalWithNegative("-12345")).toBe("-123,45");
      expect(Mask.decimalWithNegative("-10000")).toBe("-100,00");
    });

    it("deve detectar sinal negativo no início", () => {
      expect(Mask.decimalWithNegative("- 12345")).toBe("-123,45");
      expect(Mask.decimalWithNegative("   -12345")).toBe("-123,45");
    });

    it("deve remover caracteres não numéricos mantendo o sinal negativo", () => {
      expect(Mask.decimalWithNegative("-abc12345def")).toBe("-123,45");
    });
  });

  describe("maskIntoNumber", () => {
    it("deve retornar 0 quando value é undefined", () => {
      // @ts-expect-error - Testing undefined input
      expect(Mask.maskIntoNumber(undefined)).toBe(0);
    });

    it("deve retornar 0 quando value é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.maskIntoNumber(null)).toBe(0);
    });

    it("deve retornar 0 quando value é string vazia", () => {
      expect(Mask.maskIntoNumber("")).toBe(0);
    });

    it("deve retornar 0 quando filteredInput é vazio", () => {
      expect(Mask.maskIntoNumber("abc")).toBe(0);
      expect(Mask.maskIntoNumber("!@#")).toBe(0);
    });

    it("deve converter string formatada para número", () => {
      expect(Mask.maskIntoNumber("123,45")).toBe(123.45);
      expect(Mask.maskIntoNumber("1234,56")).toBe(1234.56);
      expect(Mask.maskIntoNumber("0,00")).toBe(0);
    });

    it("deve remover caracteres não numéricos exceto vírgula", () => {
      expect(Mask.maskIntoNumber("abc123,45def")).toBe(123.45);
      expect(Mask.maskIntoNumber("R$ 1.234,56")).toBe(1234.56);
    });
  });

  describe("capitalize", () => {
    it("deve retornar string vazia quando input é undefined", () => {
      expect(Mask.capitalize()).toBe("");
    });

    it("deve retornar string vazia quando input é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.capitalize(null)).toBe("");
    });

    it("deve retornar string vazia quando input é string vazia", () => {
      expect(Mask.capitalize("")).toBe("");
    });

    it("deve capitalizar primeira letra de cada palavra", () => {
      expect(Mask.capitalize("joão silva")).toBe("João Silva");
      expect(Mask.capitalize("MARIA DOS SANTOS")).toBe("Maria Dos Santos");
    });

    it("deve lidar com palavras em minúsculas", () => {
      expect(Mask.capitalize("teste")).toBe("Teste");
      expect(Mask.capitalize("teste de exemplo")).toBe("Teste De Exemplo");
    });

    it("deve lidar com palavras em maiúsculas", () => {
      expect(Mask.capitalize("TESTE")).toBe("Teste");
      expect(Mask.capitalize("TESTE DE EXEMPLO")).toBe("Teste De Exemplo");
    });
  });

  describe("normalize", () => {
    it("deve retornar string vazia quando input é undefined", () => {
      expect(Mask.normalize()).toBe("");
    });

    it("deve retornar string vazia quando input é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.normalize(null)).toBe("");
    });

    it("deve retornar string vazia quando input é string vazia", () => {
      expect(Mask.normalize("")).toBe("");
    });

    it("deve remover caracteres especiais mantendo apenas letras e números", () => {
      expect(Mask.normalize("abc123")).toBe("abc123");
      expect(Mask.normalize("abc-123")).toBe("abc123");
      expect(Mask.normalize("abc.123")).toBe("abc123");
      expect(Mask.normalize("abc_123")).toBe("abc123");
      expect(Mask.normalize("abc 123")).toBe("abc123");
    });

    it("deve manter letras maiúsculas e minúsculas", () => {
      expect(Mask.normalize("ABCabc123")).toBe("ABCabc123");
    });
  });

  describe("cpf_cnpj", () => {
    it("deve formatar CPF quando length <= 11", () => {
      // Só formata quando tem exatamente 11 dígitos (regex precisa corresponder exatamente)
      expect(Mask.cpf_cnpj("12345678901")).toBe("123.456.789-01");
      // Valores parciais não são formatados pela regex
      expect(Mask.cpf_cnpj("1234567890")).toBe("1234567890");
      expect(Mask.cpf_cnpj("123")).toBe("123");
    });

    it("deve formatar CNPJ quando length <= 14", () => {
      // Só formata quando tem exatamente 14 dígitos (regex precisa corresponder exatamente)
      expect(Mask.cpf_cnpj("12345678000190")).toBe("12.345.678/0001-90");
      // Valores parciais não são formatados pela regex
      expect(Mask.cpf_cnpj("1234567800019")).toBe("1234567800019");
    });

    it("deve truncar e formatar como CNPJ quando length > 14", () => {
      expect(Mask.cpf_cnpj("12345678000190123")).toBe("12.345.678/0001-90");
      expect(Mask.cpf_cnpj("123456780001901234567")).toBe("12.345.678/0001-90");
    });

    it("deve remover caracteres não numéricos", () => {
      expect(Mask.cpf_cnpj("123.456.789-01")).toBe("123.456.789-01");
      expect(Mask.cpf_cnpj("12.345.678/0001-90")).toBe("12.345.678/0001-90");
      expect(Mask.cpf_cnpj("abc12345678901def")).toBe("123.456.789-01");
      expect(Mask.cpf_cnpj("abc12345678000190def")).toBe("12.345.678/0001-90");
    });

    it("deve lidar com undefined (gera erro, mas testamos o comportamento)", () => {
      // @ts-expect-error - Testing undefined input
      // O método não trata undefined corretamente e gera erro ao acessar .length
      expect(() => Mask.cpf_cnpj(undefined)).toThrow();
    });
  });

  describe("cardNumber", () => {
    it("deve retornar string vazia quando value é undefined", () => {
      // @ts-expect-error - Testing undefined input
      expect(Mask.cardNumber(undefined)).toBe("");
    });

    it("deve retornar string vazia quando value é null", () => {
      // @ts-expect-error - Testing null input
      expect(Mask.cardNumber(null)).toBe("");
    });

    it("deve retornar string vazia quando value é string vazia", () => {
      expect(Mask.cardNumber("")).toBe("");
    });

    it("deve formatar número de cartão com espaços a cada 4 dígitos", () => {
      expect(Mask.cardNumber("1234567890123456")).toBe("1234 5678 9012 3456");
      expect(Mask.cardNumber("123456789012")).toBe("1234 5678 9012");
      expect(Mask.cardNumber("12345678")).toBe("1234 5678");
    });

    it("deve lidar com números menores que 4 dígitos", () => {
      expect(Mask.cardNumber("123")).toBe("123");
      expect(Mask.cardNumber("12")).toBe("12");
      expect(Mask.cardNumber("1")).toBe("1");
    });
  });
});
