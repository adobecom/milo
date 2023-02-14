import { html } from '../../libs/deps/htm-preact.js';
import ErrorBoundary from './wrappers/ErrorBoundary.js';
import LayoutWrapper from './wrappers/LayoutWrapper.js';
import ProgressStateWrapper from './wrappers/ProgressStateWrapper.js';
import useShowingSubproject from './hooks/useShowingSubproject.js';

import ProjectHeader from './components/ProjectHeader/index.js';
import Subprojects from './components/Subprojects/index.js';
import ContentItems from './components/ContentItems/index.js';
import SubprojectDetails from './components/SubprojectDetails/index.js';

function LocUIApp() {
  const { showingSubproject, setShowingSubproject } = useShowingSubproject();

  return html`
    <${ErrorBoundary}>
      <${LayoutWrapper}>
        <${ProgressStateWrapper}>
          <${ProjectHeader} />
          <${Subprojects} showingSubproject=${showingSubproject} setShowingSubproject=${setShowingSubproject} />
          ${showingSubproject ? html`<${SubprojectDetails} locale=${showingSubproject} />` : null}
          <${ContentItems} />
        </${ProgressStateWrapper}>
      </${LayoutWrapper}>
    </${ErrorBoundary}>
  `;
}

export default LocUIApp;
