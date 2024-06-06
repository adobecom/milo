import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

const spectrumCSSPath = path.resolve('node_modules/@spectrum-css/tokens/dist/index.css');
const miloCSSPath = path.resolve('../../deps/spectrum2-styles.css');

const logFileSize = (filePath, status) => {
  const fileSizeInBytes = fs.statSync(filePath).size;
  const fileSizeInKilobytes = fileSizeInBytes / 1024;
  console.log(`The size of the ${status} CSS file is ${fileSizeInKilobytes.toFixed(2)} kB`);
};

const spectrumCSS = fs.readFileSync(spectrumCSSPath, 'utf8');
const miloCSS = fs.readFileSync(miloCSSPath, 'utf8');

logFileSize(miloCSSPath, 'original');

// Formats and transforms Spectrum CSS Rgb and opacity properties for performance
const transformRgbProperties = (rule) => {
  const properties = {};

  const replaceZeroPx = (value) => value.replace(/\b0px\b/g, '0');

  rule.walkDecls((decl) => {
    const { prop, value } = decl;

    decl.value = replaceZeroPx(value);

    if (prop.endsWith('-rgb')) {
      const baseName = prop.replace('-rgb', '');
      properties[baseName] = `rgb(${value.replace(/,\s*/g, ' ')})`;
      decl.remove();
    }

    if (prop.endsWith('-opacity')) {
      const baseName = prop.replace('-opacity', '');
      properties[baseName] = properties[baseName] ? properties[baseName].replace(')', ` / ${parseFloat(value) * 100}%)`) : `rgb(0 0 0 / ${value})`;
      decl.remove();
    }
  });

  Object.keys(properties).forEach((prop) => rule.append({ prop, value: properties[prop] }));
};

const extractAndTransformCustomProperties = (css, prefix) => {
  const customProperties = {};
  postcss.parse(css).walkRules((rule) => {
    const { selector } = rule;
    if (!customProperties[selector]) {
      customProperties[selector] = {};
    }

    transformRgbProperties(rule);

    rule.walkDecls((decl) => {
      let propName = decl.prop;
      if (propName.startsWith(prefix)) propName = `--spectrum${propName.slice(prefix.length)}`;
      customProperties[selector][propName] = decl.value;
    });
  });
  return customProperties;
};

const spectrumCustomProperties = extractAndTransformCustomProperties(spectrumCSS, '--spectrum');
const miloCustomProperties = extractAndTransformCustomProperties(miloCSS, '--s2');

const updateCustomPropertiesInMiloCSS = (css) => {
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    const { selector } = rule;
    if (miloCustomProperties[selector]) {
      rule.walkDecls((decl) => {
        const { prop } = decl;
        if (prop.startsWith('--s2')) {
          const spectrumProp = `--spectrum${prop.slice(4)}`;
          if (spectrumCustomProperties[selector][spectrumProp] !== undefined) {
            decl.value = spectrumCustomProperties[selector][spectrumProp];
          }
        }
      });
    }
  });

  return root.toString();
};

const updatedCustomCSS = updateCustomPropertiesInMiloCSS(miloCSS);

fs.writeFileSync(miloCSSPath, updatedCustomCSS, 'utf8');
console.log(`Updated custom properties written to ${miloCSSPath}`);

logFileSize(miloCSSPath, 'updated');
