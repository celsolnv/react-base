// Função auxiliar para obter um índice aleatório seguro usando crypto.getRandomValues
export function getSecureRandomIndex(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// Função auxiliar para obter um número aleatório seguro usando crypto.getRandomValues
export function getSecureRandomNumber(max: number, min = 0): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % (max - min + 1)) + min;
}

// Função auxiliar para embaralhar array de forma segura
function secureShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generate() {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const specialCharacters = /[!@#$%^&*()_+{}[\]:;<>,.?~\\|]/;

  const getRandomChar = (characters: string): string => {
    const randomIndex = getSecureRandomIndex(characters.length);
    return characters.charAt(randomIndex);
  };

  let password =
    getRandomChar(uppercaseLetters) +
    getRandomChar(lowercaseLetters) +
    getRandomChar(specialCharacters.toString());

  for (let i = 0; i < 3; i++) {
    const randomType = getSecureRandomIndex(4);
    if (randomType === 0) {
      password += getRandomChar("0123456789");
    } else {
      password += getRandomChar(
        `${uppercaseLetters}${lowercaseLetters}${specialCharacters}`
      );
    }
  }

  const shuffledPassword = secureShuffle(password.split("")).join("");

  return shuffledPassword;
}
export function hasUpperCase(arg: string): boolean {
  for (let i = 0; i < arg?.length; i++) {
    if (arg[i] >= "A" && arg[i] <= "Z") {
      return true; // Encontrou um caractere maiúsculo
    }
  }
  return false; // Não encontrou nenhum caractere maiúsculo
}
export function hasLowerCase(arg: string): boolean {
  for (let i = 0; i < arg?.length; i++) {
    if (arg[i] >= "a" && arg[i] <= "z") {
      return true; // Encontrou um caractere maiúsculo
    }
  }
  return false; // Não encontrou nenhum caractere maiúsculo
}
export function hasSpecialCaracter(arg: string): boolean {
  for (let i = 0; i < arg?.length; i++) {
    if (/[!@#$%^&*()_+{}[\]:;<>,.?~\\|]/.test(arg[i])) {
      return true; // Encontrou um caractere especial
    }
  }
  return false; // Não encontrou nenhum caractere especial
}
