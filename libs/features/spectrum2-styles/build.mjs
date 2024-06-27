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

// Merge additional properties into base properties
const mergeProperties = (baseProps, additionalProps) => {
  Object.keys(additionalProps).forEach((prop) => {
    if (!baseProps[prop]) {
      baseProps[prop] = additionalProps[prop];
    }
  });
};

const spectrumProperties = extractAndTransform(spectrumCSS, '--spectrum');

// Get Spectrum properties for a given selector
const getSpectrumPropertiesForSelector = (selector) => {
  const properties = {};
  if (selector === ':root') {
    mergeProperties(properties, spectrumProperties['.spectrum'] || {});
    mergeProperties(properties, spectrumProperties['.spectrum--light'] || {});
    mergeProperties(properties, spectrumProperties['.spectrum--medium'] || {});
  } else if (selector === '.light') {
    mergeProperties(properties, spectrumProperties['.spectrum--light'] || {});
  } else if (selector === '.dark') {
    mergeProperties(properties, spectrumProperties['.spectrum--dark'] || {});
  } else {
    mergeProperties(properties, spectrumProperties[selector] || {});
  }
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
          const spectrumSelector = selector === ':root' ? '.spectrum' : selector === '.light' ? '.spectrum--light' : selector === '.dark' ? '.spectrum--dark' : null;
          const spectrumProps = getSpectrumPropertiesForSelector(spectrumSelector);
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
