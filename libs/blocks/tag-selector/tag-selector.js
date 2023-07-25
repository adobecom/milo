import { html, render, useState, useEffect } from '../../deps/htm-preact.js';
import Picker from '../../ui/controls/TagSelectPicker.js';
import { loadCaasTags } from '../caas/utils.js';

const TagPreview = ({ selectedTags = [] }) => {
  const [copyText, setCopyText] = useState('Copy');

  /* c8 ignore next 10 */
  const handleClick = () => {
    navigator.clipboard?.writeText(selectedTags.join(',')).then(
      () => setCopyText('Copied!'),
      () => setCopyText('Copy Failed'),
    );

    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
  };

  return html`
    <section class='tag-preview-container'>
      <button disabled=${!selectedTags.length} onClick=${handleClick}>${copyText}</button>
      <div class='tag-preview'>
        ${selectedTags.map((tag) => html`<p>${tag}</p>`)}
      </div>
    </section>
  `;
};

const TagSelector = () => {
  const [options, setOptions] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionMap, setOptionMap] = useState({});
  const tagUrl = 'https://www.adobe.com/chimera-api/tags';

  const getTagTree = (root) => {
    const options = Object.entries(root).reduce((opts, [, tag]) => {
      opts[tag.tagID] = {};

      if (Object.keys(tag.tags).length) {
        opts[tag.tagID].children = getTagTree(tag.tags);
      }

      opts[tag.tagID].label = tag.title;
      opts[tag.tagID].path = tag.path.replace('/content/cq:tags/caas/', '');

      return opts;
    }, {});
    return options;
  };

  const createOptionMap = (root) => {
    const newOptionMap = {};
    const parseNode = (nodes, parent) => {
      Object.entries(nodes).forEach(([key, val]) => {
        newOptionMap[key] = val;
        if (parent) {
          newOptionMap[key].parent = parent;
        }
        if (val.children) {
          parseNode(val.children, val);
        }
      });
    };
    parseNode(root);
    return newOptionMap;
  };

  useEffect(async () => {
    const { tags: caasTags, errorMsg } = await loadCaasTags(tagUrl);
    if (errorMsg) window.lana.log(`Tag Selector. Error fetching caas tags: ${errorMsg}`);

    const opts = getTagTree(caasTags);
    setOptions(opts);

    if (opts && Object.values(opts).some((value) => typeof value !== 'string')) {
      setOptionMap(createOptionMap(opts));
    } else {
      /* c8 ignore next 2 */
      setOptionMap(opts);
    }
  }, []);

  const toggleTag = (value) => {
    setSelectedTags((tags) => {
      if (tags.includes(value)) {
        return tags.filter((tag) => tag !== value);
      }
      return [...tags, value];
    });
  };

  return html`
    <section class="tag-selector-sources">
      <div class="col">
        <div class="tagselect-item expanded">
          <button class="has-children">CaaS Tags</button>
        </div>
      </div>
    </section>
    ${options
      && optionMap
      && html`<${Picker}
        toggleTag=${toggleTag}
        options=${options}
        optionMap=${optionMap}
        selectedTags=${selectedTags}
      />`
}
    <${TagPreview} selectedTags=${selectedTags} />
  `;
};

export default async function init(el) {
  render(html`<${TagSelector} />`, el);
}
