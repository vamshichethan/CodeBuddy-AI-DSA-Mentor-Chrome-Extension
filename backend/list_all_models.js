require('dotenv').config();
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

async function printModels() {
  try {
    let nextToken = '';
    do {
      const res = await fetch(nextToken ? `${url}&pageToken=${nextToken}` : url);
      const data = await res.json();
      if (data.error) {
        console.error("API Error:", data.error);
        break;
      }
      if (data.models) {
        for (const m of data.models) {
          console.log(m.name);
        }
      }
      nextToken = data.nextPageToken;
    } while (nextToken);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

printModels();
