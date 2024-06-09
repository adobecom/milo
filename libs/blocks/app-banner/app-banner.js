function getQuickLink(ecidVal) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "branch_key": "key_test_eaNdoH8nTxeZXfOsgkELrjgpFrhm4q2m",
    "channel": "web",
    "feature": "banner",
    "campaign": "product",
    "stage": "new user",
    "tags": ["one", "two", "three"],
    "type": 2,
    "data": {
      "$marketing_title": "dm-generated-link",
      "$canonical_identifier": "content/123",
      "$og_title": "Title from Deep Link",
      "$og_description": "Description from Deep Link",
      "$og_image_url": "http://www.lorempixel.com/400/400/",
      "$desktop_url": "https://lightroom.adobe.com",
      "custom_boolean": true,
      "ECID": ecidVal,
      "custom_string": "everything",
      "custom_array": [1, 2, 3, 4, 5, 6],
      "custom_object": {
        "random": "dictionary"
      }
    }
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("https://api2.branch.io/v1/url", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
}

export default function init(el) {
  const banner = document.querySelector('.aside.promobar').closest('.section');
  banner.classList.add('app-banner-sec');
  const button = banner.querySelector('a');
  
  if (button) {
    button.classList.remove('con-button', 'outline', 'button-l');
    button.classList.add('app-banner-button');
    if (typeof alloy !== 'undefined') {
      alloy("getIdentity").then(function(result) {
          const ecidVal = result.identity.ECID;
          getQuickLink(ecidVal).then(response => {
            const url = JSON.parse(response).url;
            console.log('quick link generated: ', url);
            button.href = url;
          });
      });
    }
  }
  const container = document.querySelector('.app-banner-con');
  if (container) {
    container.append(banner);
  } else {
    banner.style.display = 'none';
  }
}
