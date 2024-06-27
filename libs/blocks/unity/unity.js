export default async function init(el) {
  const { default: init } = await import(`https://blockpoc--unity--adobecom.hlx.live/unitylibs/blocks/unity/unity.js`);
  init(el);
}
