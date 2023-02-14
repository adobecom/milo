import { html } from '../../../../libs/deps/htm-preact.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';

// FIXME: pass props
const fakeUrl = '/fakeurl';
const items = [
  {
    url: '/drafts/jingleh/marquee',
    sourceEditUrl: fakeUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeUrl,
    storePreviewUrl: fakeUrl,
  },
  {
    url: '/drafts/jingleh/mas',
    sourceEditUrl: fakeUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeUrl,
    storePreviewUrl: fakeUrl,
  },
  {
    url: '/drafts/jingleh/section-container',
    sourceEditUrl: fakeUrl,
    sourcePreviewUrl: fakeUrl,
    sourceLiveUrl: fakeUrl,
    storeSyncUrl: fakeUrl,
    storeEditUrl: fakeUrl,
    storePreviewUrl: fakeUrl,
  },
];

export default function Layout({}) {
  const bigTitleRow = html` <${GridItem} extraCls=${[
    'url',
  ]}>ALL ITEMS</${GridItem}>
    <${GridItem} extraCls=${['source']}>SOURCE</${GridItem}>
    <${GridItem} extraCls=${['store']}>LANGUAGE STORE</${GridItem}>`;

  const smallTitleRow = html`
    <${GridItem} extraCls=${['url']}>URL</${GridItem}>
    <${GridItem} extraCls=${['source-edit']}>EDIT</${GridItem}>
    <${GridItem} extraCls=${['source-preview']}>PREVIEW</${GridItem}>
    <${GridItem} extraCls=${['source-live']}>LIVE</${GridItem}>
    <${GridItem} extraCls=${['store-sync']}>SYNC</${GridItem}>
    <${GridItem} extraCls=${['store-edit']}>EDIT</${GridItem}>
    <${GridItem} extraCls=${['store-preview']}>PREVIEW</${GridItem}>`;

  const itemRows = items.map(
    ({
      url,
      sourceEditUrl,
      sourcePreviewUrl,
      sourceLiveUrl,
      storeSyncUrl,
      storeEditUrl,
      storePreviewUrl,
    }) => html`
      <${GridItem} extraCls=${['url']}>${url}</${GridItem}>
      <${GridItem} extraCls=${['source-edit']}>${sourceEditUrl}</${GridItem}>
      <${GridItem} extraCls=${['source-preview']}>${sourcePreviewUrl}</${GridItem}>
      <${GridItem} extraCls=${['source-live']}>${sourceLiveUrl}</${GridItem}>
      <${GridItem} extraCls=${['store-sync']}>${storeSyncUrl}</${GridItem}>
      <${GridItem} extraCls=${['store-edit']}>${storeEditUrl}</${GridItem}>
      <${GridItem} extraCls=${['store-preview']}>${storePreviewUrl}</${GridItem}>`,
  );

  const container = html`<${GridContainer} extraCls=${['content-items']}>
  ${bigTitleRow}
  ${smallTitleRow}
  ${itemRows}
  </${GridContainer}>`;

  return html`${container}`;
}
