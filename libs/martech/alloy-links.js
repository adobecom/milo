export default function processAlloyLink(a) {
  const alloyData = a.href.split('#_')?.find((s) => s.startsWith('alloy:')) || '';
  a.href = a.href.replace(/#_alloy:.+:\w+/, '');
  a.addEventListener('click', () => {
    const [, profile, businessSegment, value] = alloyData?.split(/:|\./g) || [];
    // eslint-disable-next-line no-underscore-dangle
    if (window._satellite && profile && businessSegment && value) {
      const payload = {
        data: {
          eventType: 'decisioning.propositionDisplay',
          web: {
            webInteraction: {
              linkClicks: { value: 1 },
              type: 'other',
              name: 'AdobeTarget|Profile|Update',
            },
          },
          __adobe: { target: { [`${profile}.${businessSegment}`]: value } },
        },
        xdm: {
          _experience: {
            decisioning: {
              propositions: [
                {
                  scope: 'profile-update-request',
                  scopeDetails: { decisionProvider: 'TGT' },
                },
              ],
              propositionEventType: { display: 1 },
            },
          },
          eventType: 'decisioning.propositionDisplay',
        },
      };
      // eslint-disable-next-line no-underscore-dangle
      window._satellite.track('event', payload);
    }
  });
}
