export default async function init(el) {
  const { default: init } = await import(`http://localhost:3000/unitylibs/blocks/unity/unity.js`);
  init(el);
}
