function o(e,n=300){if(typeof e!="function")return;let t=null;return(...u)=>{clearTimeout(t),t=setTimeout(()=>e(...u),n)}}export{o as a};
