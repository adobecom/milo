export const mockConfig =
    (
        commerce = {},
        locale = {},
        env = {
            // replace prod with 'local' to enable debugging
            name: 'prod',
        },
    ) =>
    () => ({
        commerce: {
            ...commerce,
        },
        env,
        locale,
    });
