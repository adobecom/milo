let pendingModalTrigger;

export function trackAupModalTrigger(element) {
  element.addEventListener('click', () => {
    const previousLaunch = element.aupCheckoutPromise;
    queueMicrotask(() => {
      const launch = element.aupCheckoutPromise;
      const { modalId } = element.dataset;
      if (!modalId || !launch || launch === previousLaunch) return;

      const trigger = { launch, modalId };
      pendingModalTrigger = trigger;
      const clear = () => {
        if (pendingModalTrigger === trigger) pendingModalTrigger = undefined;
      };
      Promise.resolve(launch).then(clear, clear);
    });
  });
}

export function consumeAupModalTrigger() {
  const modalId = pendingModalTrigger?.modalId;
  pendingModalTrigger = undefined;
  return modalId;
}
