/* eslint-disable no-nested-ternary */
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

const spectrumCSSPath = path.resolve('node_modules/@spectrum-css/tokens/dist/index.css');
const miloCSSPath = path.resolve('../../styles/styles.css');

const logFileSize = (filePath, status) => {
  const fileSizeInBytes = fs.statSync(filePath).size;
  const fileSizeInKilobytes = fileSizeInBytes / 1024;
  console.log(`The size of the ${status} CSS file is ${fileSizeInKilobytes.toFixed(2)} kB`);
};

const spectrumCSS = fs.readFileSync(spectrumCSSPath, 'utf8');
const miloCSS = fs.readFileSync(miloCSSPath, 'utf8');

logFileSize(miloCSSPath, 'original');

const transformRgbProperties = (rule) => {
  const properties = {};

  const replaceZeroPx = (value) => value.replace(/\b0px\b/g, '0');

  rule.walkDecls((decl) => {
    const { prop, value } = decl;
    decl.value = replaceZeroPx(value);

    let baseName;
    const isRgb = prop.endsWith('-rgb');
    const isOpacity = prop.endsWith('-opacity');

    if (isRgb || isOpacity) {
      baseName = prop.replace(isRgb ? '-rgb' : '-opacity', '');
      if (isRgb) {
        properties[baseName] = `rgb(${value.replace(/,\s*/g, ' ')})`;
      } else if (isOpacity) {
        if (properties[baseName]) {
          properties[baseName] = properties[baseName].replace(')', ` / ${parseFloat(value) * 100}%)`);
        } else {
          properties[baseName] = `rgb(0 0 0 / ${value})`;
        }
      }
      decl.remove();
    }
  });

  Object.keys(properties).forEach((prop) => rule.append({ prop, value: properties[prop] }));
};

const extractAndTransform = (css, prefix) => {
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

const spectrumProperties = extractAndTransform(spectrumCSS, '--spectrum');

const getSpectrumPropertiesForSelector = (selector) => {
  const map = {
    ':root': ['.spectrum', '.spectrum--light', '.spectrum--medium', '.spectrum--lightest'],
    '.dark': ['.spectrum--dark'],
  };
  const properties = {};
  const propertiesToMerge = map[selector] || [selector];
  propertiesToMerge.forEach((property) => {
    Object.assign(properties, spectrumProperties[property] || {});
  });
  return properties;
};

const miloProperties = extractAndTransform(miloCSS, '--s2');

const updateMiloCSS = (css) => {
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    const { selector } = rule;
    if (miloProperties[selector]) {
      rule.walkDecls((decl) => {
        const { prop } = decl;
        if (prop.startsWith('--s2')) {
          const spectrumProp = `--spectrum${prop.slice(4)}`;
          const spectrumProps = getSpectrumPropertiesForSelector(selector);
          if (spectrumProps[spectrumProp] !== undefined) {
            decl.value = spectrumProps[spectrumProp];
          }
        }
        if (decl.value.includes('--spectrum')) {
          decl.value = decl.value.replace(/--spectrum/g, '--s2');
        }
      });
    }
  });

  return root.toString();
};

const updatedMiloCSS = updateMiloCSS(miloCSS);

fs.writeFileSync(miloCSSPath, updatedMiloCSS, 'utf8');
console.log(`Updated custom properties written to ${miloCSSPath}`);

logFileSize(miloCSSPath, 'updated');
