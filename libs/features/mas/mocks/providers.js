export const mockProviders = ({ force = true, checkoutAction = null } = {}) => {
    /** @type {Commerce.Checkout.buildCheckoutAction} */
    function getCheckoutAction(offers, options) {
        return Promise.resolve(checkoutAction);
    }

    return () => ({
        force,
        getCheckoutAction,
    });
};
