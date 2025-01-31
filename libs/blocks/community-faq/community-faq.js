export default async function init(el) {
  const res = await fetch("https://community.adobe.com/api/2.0/search?q=select%20id,%20subject,%20body,%20view_href%20FROM%20messages%20WHERE%20subject%20MATCHES%20'%22remove%20background%22'%20AND%20category.id%3D%22ct-photoshop%22%20AND%20depth%3D0%20ORDER%20BY%20replies.count(*)%20DESC%20limit%2010%20offset%200");
  const js = await res.json();
  console.log(js);
}
