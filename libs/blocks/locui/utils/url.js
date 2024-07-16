export default function isUrl(str) {
  try {
    const url = new URL(str);
    return url;
  } catch (error) {
    return false;
  }
}
