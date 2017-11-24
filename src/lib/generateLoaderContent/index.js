import dedent from 'dedent';
import formatLocale from '../formatLocale';
/**
 * @typedef GLCOptions
 * @property {String[]} files
 * @property {Boolean} [chunk]
 *
 */
/**
 * @function
 * @description Generate js code for localeLoader according the files listed.
 * @param {GLCOptions} options
 */
export default function generateLoaderContent(/** @type {GLCOptions} */ {
  files,
  chunk = true,
}) {
  const cases = files.map((f) => {
    const basename = f.replace(/\.(js|json)$/i, '');
    const locale = formatLocale(basename);
    const padding = chunk ? '  ' : '';
    let code = `
            ${padding}const data = require('./${basename}');
            ${padding}resolve(data.__esModule === true ? data.default : data);`;
    if (chunk) {
      code = `
            require.ensure(['./${basename}'], (require) => {${code}
            }, '${locale}');`;
    }
    return `
          case '${locale}': {${code}
            break;
          }`;
  });
  return dedent`export default function loadLocale(locale) {
      return new Promise((resolve) => {
        switch (locale) {${cases.join('')}
          default:
            resolve({});
            break;
        }
      });
    }\n`;
}
