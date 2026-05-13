/* eslint-disable no-undef, no-underscore-dangle */
const bcAnalytics = (event) => {
  if (window?._satellite?.track) {
    switch (event.eventType) {
      case 'query:submitted':
        window.performance.mark('query:submitted');
        break;
      case 'response:started':
        window.performance.mark('response:started');
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-TimetoResponseStart|${(window.performance.measure('responsestarted', 'query:submitted', 'response:started').duration / 1000).toFixed(2)} seconds` } },
            bc: { TimetoResponseStart: (window.performance.measure('responsestarted', 'query:submitted', 'response:started').duration / 1000).toFixed(2) },
          },
        });
        break;
      case 'response:completed':
        window.performance.mark('response:completed');
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-TimetoResponseFinished|${(window.performance.measure('responsefinished', 'response:started', 'response:completed').duration / 1000).toFixed(2)} seconds` } },
            bc: { TimetoResponseFinished: (window.performance.measure('responsefinished', 'response:started', 'response:completed').duration / 1000).toFixed(2) },
          },
        });
        break;
      case 'promptSuggestion:clicked':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-suggested_prompt_clicked|${event.data?.type}` } },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { click: `BC-suggested_prompt_clicked|${event.data?.type}|${event.data?.suggestion}` } } } } },
          },
        });
        break;
      case 'cards:rendered':
        // eslint-disable-next-line no-case-declarations
        let cardimpression = '';
        // eslint-disable-next-line no-return-assign
        event.data?.element.forEach((element) => cardimpression += `BC-card|${element.cardType}|${element.productName}|${element.productPageURL},`);
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-card_rendered|${event.data?.displayMode}` } },
            // eslint-disable-next-line max-len
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { additionalImpressions: cardimpression.slice(0, -1) } } } } },
          },
        });
        break;
      case 'card:clicked':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-card_clicked|${event.data?.element?.cardType}|${event.data?.element?.productName}` } },
            _adobe_corpnew: {
              digitalData: {
                primaryEvent: {
                  eventInfo: {
                    interaction: {
                      click: `BC-card|${event.data?.element?.cardType}|${event.data?.element?.productName}|${event.data?.element?.productPageURL}`,
                      iclick: true,
                    },
                  },
                },
              },
            },
          },
        });
        break;
      case 'error:occurred':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: 'BC-Response:Sorry-Error_Occurred' } },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { click: `BC-Response:Sorry-Error_Occurred|${event.data?.errorMessage}` } } } } },
          },
        });
        break;
      default:
        break;
    }
  }
};

export default bcAnalytics;
