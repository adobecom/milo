export const updateLiterals = (el, values = {}) => {
    el.querySelectorAll('span[data-placeholder]').forEach((el) => {
        const { placeholder } = el.dataset;
        el.innerText = values[placeholder] ?? '';
    });
};
