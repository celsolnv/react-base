import { removeFalsyValuesFromObject } from "../func";

export const setMultiFormData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): FormData => {
  const formData = new FormData();

  // Processar o campo "file"
  const file = body.file || [];
  delete body.file;

  if (file instanceof File) {
    formData.append("file", file);
  } else if (Array.isArray(file)) {
    if (file.length > 0) {
      file.forEach((f: File) => {
        if (f instanceof File) {
          formData.append("file", f);
        }
      });
    } else {
      // Array vazio vira string vazia conforme esperado pelos testes
      formData.append("file", "");
    }
  } else {
    // Quando file não existe, é undefined, null, false, etc., também adiciona string vazia
    formData.append("file", "");
  }

  // Remover valores falsy do body
  const formatBody = removeFalsyValuesFromObject(body);

  // Adicionar os campos restantes ao FormData
  for (const key in formatBody) {
    const value = formatBody[key];
    // Não adicionar valores falsy (0, false, string vazia já foram removidos por removeFalsyValuesFromObject)
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== 0 &&
      value !== false
    ) {
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof File)
      ) {
        // Se for objeto, adicionar como JSON
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  }

  return formData;
};

export const setFormData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): FormData => {
  const formData = new FormData();

  // Processar o campo "files"
  const files = body.files || [];
  delete body.files;

  if (Array.isArray(files) && files.length > 0) {
    files.forEach((file: File) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });
  }

  // Remover valores falsy do body
  const formatBody = removeFalsyValuesFromObject(body);

  // Adicionar o body restante como JSON no campo "data"
  formData.append("data", JSON.stringify(formatBody));

  return formData;
};

export const setFormDataMulti = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  filesKeys: string[]
): FormData => {
  const formData = new FormData();
  // Vamos adicionar os arquivos no formData
  filesKeys.forEach((key) => {
    const files = body[key] || [];
    delete body[key];
    if (files !== null) {
      const hasFiles = Array.isArray(files) && files.length > 0;
      const isFile = files instanceof File;
      if (hasFiles) {
        files.forEach((file: File) => {
          formData.append(key, file);
        });
      } else if (isFile) {
        formData.append(key, files);
      }
    }
  });

  const formatBody = removeFalsyValuesFromObject(body);

  // Se não há arquivos, adicionar os dados como JSON no campo "data"
  if (filesKeys.length === 0) {
    formData.append("data", JSON.stringify(formatBody));
  } else {
    // Vamos adicionar os itens no formData
    for (const key in formatBody) {
      const item = formatBody[key];
      // Se o item for um array, vamos adicionar cada item no formData
      if (Array.isArray(item)) {
        // Vamos adicionar cada item no formData
        item.forEach((arrayItem, index) => {
          // Se o item for um objeto, vamos adicionar cada propriedade do objeto no formData junto com o índice
          if (typeof arrayItem === "object") {
            for (const keyChildren in arrayItem) {
              // Vamos adicionar cada propriedade do objeto no formData junto com o índice
              formData.append(
                `${key}[${index}][${keyChildren}]`,
                arrayItem[keyChildren]
              );
            }
          } else {
            // Vamos adicionar o item no formData junto com o índice
            formData.append(`${key}[${index}]`, arrayItem);
          }
        });
      } else if (item === null) {
        formData.append(key, "");
      } else if (typeof item === "object") {
        // Vamos adicionar cada propriedade do objeto no formData
        for (const keyChildren in item) {
          formData.append(`${key}[${keyChildren}]`, item[keyChildren]);
        }
      } else {
        // Caso não seja um array nem um objeto, vamos adicionar o item no formData
        formData.append(key, item);
      }
    }
  }

  return formData;
};
