export function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

export function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

export function getUrlConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get('config');
    return encodedConfig !== null
        ? JSON.parse(b64_to_utf8(decodeURIComponent(encodedConfig)))
        : null;
}

export const defaultState = {
    cardStyle: 'half-height',
    collectionBtnStyle: 'primary',
    container: '1200MaxWidth',
    disableBanners: false,
    draftDb: false,
    gutter: '4x',
    layoutType: '4up',
    loadMoreBtnStyle: 'primary',
    paginationAnimationStyle: 'paged',
    paginationEnabled: false,
    paginationQuantityShown: false,
    paginationUseTheme3: false,
    paginationType: 'none',
    resultsPerPage: 5,
    setCardBorders: false,
    showFilters: false,
    showSearch: false,
    source: 'hawks',
    theme: 'lightest',
    totalCardsToShow: 10,
    useLightText: false,
};

