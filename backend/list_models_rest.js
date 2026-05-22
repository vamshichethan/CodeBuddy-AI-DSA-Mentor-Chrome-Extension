const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Let's use standard node fetch or dynamic imports, wait, we can just fetch listModels using the REST endpoint directly to see the exact error.
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error(err);
  });
