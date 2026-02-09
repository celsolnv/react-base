export function validateCpf(cpfParams: string) {
  const cpf = cpfParams.replace(/\D/g, "");

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

  if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function getPasswordRequirements(
  password: string
): PasswordRequirement[] {
  if (!password) return [];
  return [
    { label: "Minimo 8 caracteres", met: password.length >= 8 },
    { label: "Contem letras", met: /[a-zA-Z]/.test(password) },
    { label: "Contem numeros", met: /[0-9]/.test(password) },
    {
      label: "Contem caracteres especiais",
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ];
}
