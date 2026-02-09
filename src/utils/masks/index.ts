class Mask {
  maxLength(input: string, maxLength: number): string {
    if (input.length <= maxLength) {
      return input;
    }
    return input.slice(0, maxLength);
  }

  phone = (input?: string) => {
    let value = input?.replace(/\D/g, "") || "";

    let formattedValue = "";

    if (value.startsWith("55")) {
      value = value.slice(2);
      formattedValue = "+55 ";
    }

    if (value.length > 0) {
      formattedValue += `(${value.substring(0, 2)}`;
    }

    if (value.length > 2) {
      formattedValue += `) ${value.substring(2, 3)} `;
    }

    if (value.length > 3) {
      formattedValue += `${value.substring(3, 7)}`;
    }

    if (value.length > 7) {
      formattedValue += `-${value.substring(7, 11)}`;
    }

    return formattedValue.trim();
  };

  cpf = (value: string) => {
    if (!value) {
      return "";
    }
    const onlyNumbers = value.replace(/[^\d]/g, "");

    let formattedCpf = onlyNumbers.substring(0, 3);
    if (onlyNumbers.length > 3) {
      formattedCpf += "." + onlyNumbers.substring(3, 6);
    }
    if (onlyNumbers.length > 6) {
      formattedCpf += "." + onlyNumbers.substring(6, 9);
    }
    if (onlyNumbers.length > 9) {
      formattedCpf += "-" + onlyNumbers.substring(9, 11);
    }

    return formattedCpf;
  };

  cnpj = (value?: string) => {
    if (typeof value !== "string") {
      return value || "";
    }
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+$/, "$1");
  };

  money(param?: number | string): string {
    let value = param;
    if (typeof value === "number") {
      value = parseFloat(String(value)).toFixed(2);
    }
    if (typeof value !== "string") {
      return "";
    }
    if (!value) {
      return "";
    }
    const input = value.toString().replace(/\D/g, "");
    if (value.trim() == "R$" || input.trim() == "") {
      return "R$ 0,00";
    }
    const parsedValue = parseFloat(value.toString().replace(/\D/g, "")) / 100;
    const formattedValue = parsedValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    });
    return formattedValue;
  }

  cep(cep: string): string {
    if (typeof cep !== "string") {
      return "";
    }
    const formattedCEP = cep.replace(/\D/g, ""); // Remove qualquer caractere que não seja um número
    if (cep.length < 8) {
      return formattedCEP.replace("-", " ");
    }
    return `${formattedCEP.slice(0, 5)}-${formattedCEP.slice(5)}`; // Retorna o CEP formatado com o hífen
  }

  number(input: string): string {
    const number = input.replace(/\D/g, "");

    return number;
  }

  // Format a number to Brazilian currency format
  justNumber(value?: string) {
    if (value == undefined) {
      return "0,00";
    }
    // Remove all characters except for digits, comma and minus sign
    const filteredInput = value
      ?.toString()
      .replace(".", ",")
      .replace(/[^0-9,-]/g, "");
    // Only allow one comma in the input
    const commaIndex = filteredInput?.indexOf(",");
    if (commaIndex !== -1) {
      return (
        filteredInput?.slice(0, commaIndex + 1) +
        filteredInput?.slice(commaIndex + 1).replace(/,/g, "")
      );
    }
    return filteredInput;
  }

  // Remove all characters except for digits
  removeNonNumbers(value?: string): string {
    if (!value) {
      return "0";
    }
    // Remove all characters except for digits
    const filteredInput = value?.toString().replace(/\D/g, "");
    return filteredInput;
  }

  percent(value: string) {
    if (value === undefined || value?.trim() === "") {
      return "0,00";
    }
    // Remove all characters except for digits and comma
    let numbered = parseFloat(value.toString().replace(/\D/g, "")) / 100;
    // limit to 100
    if (numbered > 100) {
      numbered = 100;
    }
    // to have decimal
    const decimal = numbered.toFixed(2).replace(".", ",");

    return `${decimal}`;
  }

  decimal(value: string): string {
    if (value === undefined || value.trim() === "") {
      return "0,00";
    }
    // Remove all characters except for digits
    const numbered = parseFloat(value.replace(/\D/g, "")) / 100;
    // Format the number to Brazilian decimal format
    return numbered.toFixed(2).replace(".", ",");
  }

  decimalWithNegative(value: string): string {
    if (value === undefined || value.trim() === "") {
      return "0,00";
    }
    // Remove all characters except for digits and the minus sign
    const isNegative = value.trim().startsWith("-");
    const numbered = parseFloat(value.replace(/\D/g, "")) / 100;
    // Format the number to Brazilian decimal format
    const formattedValue = numbered.toFixed(2).replace(".", ",");
    return isNegative ? `-${formattedValue}` : formattedValue;
  }

  maskIntoNumber(value: string): number {
    if (!value) {
      return 0;
    }
    const filteredInput = value.toString().replace(/[^0-9,]/g, "");
    if (!filteredInput) {
      return 0;
    }
    return Number(filteredInput.trim().replace(",", "."));
  }

  capitalize(input?: string): string {
    if (!input) {
      return "";
    }
    const words = input.toLowerCase().split(" ");

    const formattedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    const result = formattedWords.join(" ");

    return result;
  }

  normalize(input?: string): string {
    if (!input) {
      return "";
    }
    // Remove caracteres que não são números ou letras
    const sanitizedString = input.replace(/[^a-zA-Z0-9]/g, "");

    return sanitizedString;
  }

  cpf_cnpj(value: string) {
    let val = value?.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

    if (val.length <= 11) {
      // Se o valor tem até 11 dígitos, consideramos como CPF
      val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Aplica a máscara de CPF
    } else if (val.length <= 14) {
      val = val.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      ); // Aplica a máscara de CNPJ
    } else if (val.length > 14) {
      const cache = val.slice(0, 14);
      val = cache.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
      return val;
    }

    return val;
  }

  cardNumber(value: string): string {
    if (!value) {
      return "";
    }
    return value.replace(/(\d{4})(?=\d)/g, "$1 ");
  }
}
export default new Mask();
