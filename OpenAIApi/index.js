// index.js
const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const systemMessage = `Please provide a JSON object that contains a list of all countries with the following data fields for each entry:

id: give a uniquie id to each item , and that id start with 1
country: The name of the country
capital: The capital city of the country
country_code: The country code (ISO 3166-1 alpha-2)
flag: The flag of the country (represented as an emoji)
The JSON format should be structured as an array of objects, with each object containing the above fields for a specific country.`
// Middleware to parse JSON request body
app.use(express.json());

app.post("/chat-completion", async (req, res) => {
  try {
    // Define messages, model, and request body
    const messages = req.body.messages || [
      { role: "system", content: systemMessage},
      { role: "user", content: "Give me a list of all county there capitals and flag" }
    ];

    // Hit the OpenAI chat completion API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      "response_format":{
        "type":"json_object"
      }
    });

    // Send the API response back to the client
    let message = completion.choices[0].message.content
    message = JSON.parse(message)
    res.json(message);
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
