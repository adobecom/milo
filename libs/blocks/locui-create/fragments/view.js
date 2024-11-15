import { findFragments, showFragments } from './index.js';
import { useEffect, useCallback, html, useState } from '../../../deps/htm-preact.js';
import { getUrls } from '../../locui/loc/index.js';

function Loader() {
  return html`<div class='locui-create-loader-container'>
  <div class='locui-create-loader'></div>
  <p>Loading</p>
  </div>`;
}

export default function FragmentsSection({ fragments, setFragments, urls, setNoOfValidfragments }) {
  const [validFragments, setValidFragments] = useState([]);
  const [errorFragments, setErrorFragments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchFragments = useCallback(async () => {
    const inputUrls = urls.split(/[,\r\n]/g).map((url) => new URL(url));
    setLoading(true);
    const found = await findFragments(getUrls(inputUrls));
    const validFrag = found.filter((frag) => !frag?.valid);
    setValidFragments(validFrag);
    setNoOfValidfragments(validFrag.length);
    const selectedFragments = validFrag.map(({ pathname }) => pathname);
    setFragments(selectedFragments);
    const invalid = found.filter((frag) => typeof frag?.valid === 'string');
    setErrorFragments(invalid);
    setLoading(false);
  }, [setFragments, urls]);

  useEffect(() => {
    fetchFragments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchFragments();
  };

  const handleClick = (event) => {
    const pathname = event.target?.value;
    if (!fragments.find((path) => path === pathname)) {
      setFragments([...fragments, pathname]);
    } else {
      const filterFrag = fragments.filter((path) => path !== pathname);
      setFragments(filterFrag);
    }
  };

  const locFragment = (fragment) => {
    const checked = fragments.find((pathname) => pathname === fragment.pathname);
    return html`
    <li class="locui-create-fragment">
    <div class="locui-create-fragment-input-container">
     <input name=${fragment.pathname} value=${fragment.pathname} id=${fragment.pathname} type="checkbox" checked=${checked} onClick=${handleClick}/>
     <label class='locui-create-fragment-label' for=${fragment.pathname}>${fragment.pathname}</label>
     </div>
     <ul class='locui-create-fragment-parent'>
      ${fragment.parentPages && fragment.parentPages.length > 0 && fragment.parentPages.map((parentPage) => html`<li>${parentPage}</li>`)}
     </ul>
    </div>`;
  };

  return html`
  <div class='locui-create-fragments-container'>
  ${isLoading ? html`<${Loader} />`
    : html`
    <button class="locui-create-refresh-button" onClick=${handleRefresh}/>
    <ul class=${`locui-create-fragments-list ${validFragments.length > 0 && fragments.length < 1 && 'error'}`}>
   ${validFragments && validFragments.length > 0 ? validFragments.map((fragment) => locFragment(fragment)) : html`<p>No Valid fragments</p>`}
   </ul>`
}
   <div>
    ${errorFragments && errorFragments.length > 0 && html`<div class='form-field-error'>Invalid fragments <a href="#" onClick=${() => showFragments(errorFragments)}>view details</a></div>`}
    ${validFragments.length > 0 && fragments.length < 1 && html`<div class='form-field-error'>Select atleast one fragment to proceed further</div>`}
   </div>
  </div>`;
}
