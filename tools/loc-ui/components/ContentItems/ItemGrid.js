import { html } from '../../../../libs/deps/htm-preact.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import FlexContainer from '../FlexContainer.js';
import FlexItem from '../FlexItem.js';
import GlobeIconButton from '../GlobeIconButton.js';
import PreviewIconButton from '../PreviewIconButton.js';
import WordIconButton from '../WordIconButton.js';
import SyncIconButton from '../SyncIconButton.js';
import useFilterStr from '../../hooks/useFilterStr.js';
import { loadStyle } from '../../../../libs/utils/utils.js';

loadStyle('components/ContentItems/AllItemsGrid.css');

// TODO: these extraCls are not very DRY
const ALIGN_CENTER = 'align-self-center';

export default function ItemGrid({ allItems }) {
  const { regex, renderFilterInput } = useFilterStr();
  const filterRow = html`<${FlexContainer} flexStart>
      <${FlexItem}>
        ${renderFilterInput()}
      </${FlexItem}>
    </${FlexContainer}>`;

  const bigTitleRow = html`<${GridItem} extraCls=${['url', ALIGN_CENTER]}><h3>ALL ITEMS</h3></${GridItem}>
    <${GridItem} extraCls=${['source']}><h3>SOURCE</h3></${GridItem}>
    <${GridItem} extraCls=${['store']}><h3>EN LANGUAGE STORE</h3></${GridItem}>`;

  const smallTitleRow = html`
    <${GridItem} extraCls=${['url', ALIGN_CENTER]}><h5>URL</h5></${GridItem}>
    <${GridItem} extraCls=${['source-edit', ALIGN_CENTER]}><h5>EDIT</h5></${GridItem}>
    <${GridItem} extraCls=${['source-preview', ALIGN_CENTER]}><h5>PREVIEW</h5></${GridItem}>
    <${GridItem} extraCls=${['source-live', ALIGN_CENTER]}><h5>LIVE</h5></${GridItem}>
    <${GridItem} extraCls=${['store-sync', ALIGN_CENTER]}><h5>SYNC</h5></${GridItem}>
    <${GridItem} extraCls=${['store-edit', ALIGN_CENTER]}><h5>EDIT</h5></${GridItem}>
    <${GridItem} extraCls=${['store-preview', ALIGN_CENTER]}><h5>PREVIEW</h5></${GridItem}>`;

  const itemRows = allItems
    .filter((item) => regex.test(item.url))
    .map(({ url, sourceEditUrl, sourcePreviewUrl, sourceLiveUrl, storeSyncUrl, storeEditUrl, storePreviewUrl, inENLangstore }) => {
      const sourceEditUrlOnClickHandler = () => {
        alert(sourceEditUrl);
      };
      const sourcePreviewOnClickHandler = () => {
        alert(sourcePreviewUrl);
      };
      const sourceLiveOnClickHandler = () => {
        alert(sourceLiveUrl);
      };
      const storePreviewOnClickHandler = () => {
        alert(storePreviewUrl);
      };
      const storeSyncOnClickHandler = () => {
        alert(storeSyncUrl);
      };
      const storeEditOnClickHandler = () => {
        alert(storeEditUrl);
      };
      return html`
        <${GridItem} extraCls=${['url', ALIGN_CENTER]}>
          ${url}
        </${GridItem}>
        <${GridItem} extraCls=${['source-edit', ALIGN_CENTER]}>
          <${GlobeIconButton} onClick=${sourceEditUrlOnClickHandler} />
        </${GridItem}>
        <${GridItem} extraCls=${['source-preview', ALIGN_CENTER]}>
          <${PreviewIconButton} onClick=${sourcePreviewOnClickHandler} />
        </${GridItem}>
        <${GridItem} extraCls=${['source-live', ALIGN_CENTER]}>
          <${GlobeIconButton} onClick=${sourceLiveOnClickHandler} />
        </${GridItem}>

        <${GridItem} extraCls=${['store-sync', ALIGN_CENTER]} >
          <${SyncIconButton} onClick=${storeSyncOnClickHandler} disabled=${!inENLangstore} />
        </${GridItem}>
        <${GridItem} extraCls=${['store-edit', ALIGN_CENTER]}>
          <${WordIconButton} onClick=${storeEditOnClickHandler} disabled=${!inENLangstore} />
        </${GridItem}>
        <${GridItem} extraCls=${['store-preview', ALIGN_CENTER]}>
          <${PreviewIconButton} onClick=${storePreviewOnClickHandler} disabled=${!inENLangstore} />
        </${GridItem}>`;
    });

  const container = html`
    <div class='mt-2'>
      <div class='mb-1'>
        ${filterRow}
      </div>
      <${GridContainer} extraCls=${['all-items-grid']}>
        ${bigTitleRow}
        ${smallTitleRow}
        ${itemRows}
      </${GridContainer}>
    </div>`;

  return html`${container}`;
}
