class ImageGenerator {
    
    async generateImageUrl(inputText, numOfImages) {
        // Replace this with actual image generation logic
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

        let srcImageListFinal = [];
        const apiUrl = "https://backdrop-stg.senseiasml.io/backdrop/textToArtJob";
        const questionName = inputText; // Replace with your actual question name
        const question = initializeList(numOfImages, inputText);
        const seedList = initializeSeed(numOfImages);
        // console.log(seed)
        console.log(question);
        const requestBody = JSON.stringify({
        prompt: question,
        algorithm: "clio",
        seed: seedList,
        text_guidance_scale: 5
        }); // Request body in JSON format
        let jobId = "sample";

        try {
        // Create the URL object
        const url = new URL(apiUrl);

        // Open the connection
        const connection = await fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
            },
            body: requestBody
        });

        // Get the response code
        const responseCode = connection.status;

        // Read the response body
        const responseBody = await connection.text();

        // Create a JSON object from the response body
        const jsonResponse = JSON.parse(responseBody);
        jobId = jsonResponse.jobId;

        console.log("Response Code: " + jobId);
        console.log("Response Body: " + jobId);

        // Handle the response as needed
        } catch (error) {
        console.error(error);
        }

        const apiUrlStatus = `https://backdrop-stg.senseiasml.io/backdrop/status/${jobId}`;
        let srcImageList = initializeListWithEmptyStrings(numOfImages);

        try {
        // Create the URL object
        const urlObj = new URL(apiUrlStatus);

        // Open the connection
        const connection = await fetch(urlObj, {
            method: "GET",
            headers: {
            accept: "application/json"
            }
        });

        // Get the response code
        const responseCode = connection.status;

        // Read the response body
        const responseBody = await connection.text();

        // Create a JSON object from the response body
        const jsonResponse = JSON.parse(responseBody);
        const array = jsonResponse.images;
        console.log(array);
        const intialUrl = 'https://backdrop-stg.senseiasml.io/backdrop/image/';
        srcImageListFinal = assignValuesToList(srcImageList, array)
        console.log(srcImageListFinal)
        } catch (error) {
        console.error(error);
        }
                return srcImageListFinal;
            }
}

document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generateButton");
    const textInput = document.getElementById("textInput");
    const numInput = document.getElementById("numInput");
    const dynamicTextElement = document.getElementById("dynamicText");
    const dynamicLink = document.getElementById("dynamicLink");

    generateButton.addEventListener("click", function () {
        const inputText = textInput.value;
        const imageGenerator = new ImageGenerator();
        const imageUrl = imageGenerator.generateImageUrl(inputText, numInput.value);
        console.log(imageUrl)
        imageUrl.then(result => {
            console.log("Promise result:", result);
            dynamicTextElement.textContent = result;
            dynamicLink.href= result;
        }).catch(error => {
            console.error("Promise error:", error);
        });
    });
});