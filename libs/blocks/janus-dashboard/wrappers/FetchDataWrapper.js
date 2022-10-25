import { html, createContext, useState } from '../../../deps/htm-preact.js';
import Loader from '../components/Loader.js';
import useGetData from '../hooks/useGetData.js';
import Clickable from '../components/Clickable.js';

export const DataContext = createContext();

export default function FetchDataWrapper({ children }) {
  const [small, setSmall] = useState(false);
  const toggleSmall = () => {
    setSmall((s) => !s);
  };
  const { isLoading, data, isError } = useGetData(
    `http://localhost:3002/testresult/${small ? 'small' : ''}`,
  );
  if (isError) {
    return 'Error loading data!';
  }
  if (isLoading) {
    return html`<${Loader} />`;
  }
  return html`
  <${DataContext.Provider} value=${data}>
    ${children}
    <${Clickable} onClick=${toggleSmall}>
      switch to ${small ? 'big' : 'small'}
    </${Clickable}>
  <//>`;
}
