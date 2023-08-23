function initializeList(n, x) {
  const myList = [];
  for (let i = 0; i < n; i++) {
    myList.push(x);
  }
  return myList;
}

function initializeSeed(n) {
  if (n <= 0) {
    return [];
  }

  const result = [];
  const maxRange = n * 10; // Adjust the range as needed

  while (result.length < n) {
    const randomInt = Math.floor(Math.random() * maxRange) + 1;
    if (!result.includes(randomInt)) {
      result.push(randomInt);
    }
  }

  return result;
}

function initializeListWithEmptyStrings(n) {
  const myList = Array.from({ length: n }, () => '');
  return myList;
}

function assignValuesToList(list, array) {
  const intialUrl = 'https://backdrop-stg.senseiasml.io/backdrop/image/';
  for (let i = 0; i < list.length; i++) {
    list[i] = intialUrl + array[i].src_image;
  }
  return list;
}
export default class ImageGenerator {
  constructor() {
    this.currentJob = null;
    this.status = 'pending';
    this.apiUrl = 'https://backdrop-stg.senseiasml.io/backdrop/textToArtJob';
    this.numOfImages = 4;
  }

  async startJob(inputText, numOfImages) {
    this.numOfImages = numOfImages;
    const question = initializeList(numOfImages, inputText);
    const seedList = initializeSeed(numOfImages);
    const requestBody = JSON.stringify({
      prompt: question,
      algorithm: 'clio',
      seed: seedList,
      text_guidance_scale: 5,
    });
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: requestBody,
    }).then((response) => response.json());

    return {
      status: 'IN_PROGRESS',
      jobId: res.jobId,
    };
  }

  async monitorGeneration(jobId) {
    // if (useMock) return mockData;
    const url = `https://backdrop-stg.senseiasml.io/backdrop/status/${jobId}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      throw new Error(`Error monitoring progress: ${res.status} ${res.statusText}`);
    }
    const { status, images } = await res.json();

    if (status !== 'DONE') return { status, results: [] };

    const srcImageList = initializeListWithEmptyStrings(this.numOfImages);
    const srcImageListFinal = assignValuesToList(srcImageList, images);
    return { status, results: srcImageListFinal };
  }
}
