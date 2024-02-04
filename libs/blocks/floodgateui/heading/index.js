import { heading, languages, urls, statuses, renderSignal, shouldOpenModalOnMount } from '../utils/state.js';
import { setStatus } from '../utils/status.js';
import { autoSetup } from '../floodgate/index.js';
import getServiceConfig from '../../../utils/service-config.js';

export default async function handleRefresh() {
  if (heading.value.projectId) {
    const { miloc } = await getServiceConfig(origin);
    if (!miloc) {
      setStatus(
        'service',
        'error',
        'No Milo Floodgate config',
        'Check /.milo/config in your project.',
      );
      return;
    }
  } else {
    languages.value = [];
    urls.value = [];
    statuses.value = {};
    shouldOpenModalOnMount.value = false;
    await autoSetup();
    renderSignal.value = renderSignal.value + 1;
  }
}
