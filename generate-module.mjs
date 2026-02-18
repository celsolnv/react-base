import fs from 'fs';
import path from 'path';

// --- Utilitários de String ---
const toPascalCase = (str) => str.replace(/(^\w|-\w)/g, (m) => m.replace(/-/, '').toUpperCase());
const toCamelCase = (str) => str.replace(/-(\w)/g, (m, c) => c.toUpperCase());
const toKebabCase = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toSnakeCase = (str) => str.replace(/-/g, '_');

const pluralize = (word) => {
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  if (word.endsWith('r') || word.endsWith('l')) return word + 'es';
  return word + 's';
};

async function generateModule() {
  const args = process.argv.slice(2);
  const nameArg = args.find(a => a.startsWith('--name='))?.split('=')[1];
  const labelPt = args.find(a => a.startsWith('--pt='))?.split('=')[1] || nameArg;
  if (!nameArg) {
    console.error("❌ Erro: Use --name=nome-do-modulo");
    process.exit(1);
  }
  if (!labelPt) {
    console.error("❌ Erro: Use --pt=nome-do-modulo");
    process.exit(1);
  }
  const nameKebab = toKebabCase(nameArg);
  const config = {
    single: { 
      kebab: nameKebab, 
      pascal: toPascalCase(nameKebab), 
      camel: toCamelCase(nameKebab),
      snake: toSnakeCase(nameKebab) 
    },
    plural: { 
      kebab: pluralize(nameKebab), 
      pascal: pluralize(toPascalCase(nameKebab)), 
      camel: pluralize(toCamelCase(nameKebab)),
      snake: toSnakeCase(pluralize(nameKebab))
    },
    labelPt
  };

  const template = { 
    kebab: '__nameKebab__', 
    pascal: '__namePascal__', 
    camel: '{{nameCamel}}',
    snake: '{{nameSnake}}',
    label: '{{labelPt}}'
  };

  const paths = {
    source: path.join(process.cwd(), 'src/modules/template-base'),
    targetModule: path.join(process.cwd(), 'src/modules', config.single.kebab),
    targetApp: path.join(process.cwd(), 'src/app/_private', labelPt)
  };

  const processFiles = (source, target, isRouteFolder = false) => {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

    fs.readdirSync(source).forEach(item => {
      const sourcePath = path.join(source, item);
      if (!isRouteFolder && item === '_app-routes') return;

      // Renomeia o arquivo usando as chaves como busca
      let targetItemName = item
        .replaceAll(template.kebab, config.single.kebab)
        .replaceAll(template.pascal, config.single.pascal)
        .replaceAll(template.camel, config.single.camel)
        .replaceAll(template.snake, config.single.snake);
      
      const targetPath = path.join(target, targetItemName);

      if (fs.lstatSync(sourcePath).isDirectory()) {
        processFiles(sourcePath, targetPath, isRouteFolder);
      } else {
        let content = fs.readFileSync(sourcePath, 'utf8');
        content = content
          // Plurais (Se você usar {{nameKebabPlural}} no futuro)
          .replaceAll('{{nameKebabPlural}}', config.plural.kebab)
          .replaceAll('{{namePascalPlural}}', config.plural.pascal)
          // Singulares
          .replaceAll(template.kebab, config.single.kebab)
          .replaceAll(template.pascal, config.single.pascal)
          .replaceAll(template.camel, config.single.camel)
          .replaceAll(template.snake, config.single.snake)
          .replaceAll(template.label, config.labelPt);

        fs.writeFileSync(targetPath, content);
      }
    });
  };

  try {
    processFiles(paths.source, paths.targetModule);
    const routeSource = path.join(paths.source, '_app-routes');
    if (fs.existsSync(routeSource)) {
      processFiles(routeSource, paths.targetApp, true);
    }
    console.info(`✅ Sucesso! Arquivos renomeados e conteúdo gerado para "${config.single.pascal}".`);
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

generateModule();

// Comando para rodar abaixo
// npm run gen:module -- --name=product --pt='produto'