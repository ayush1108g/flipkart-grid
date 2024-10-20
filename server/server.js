const express = require("express");
const axios = require("axios");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();

app.use((req,res,next)=>{
  console.log(req.url);
  next();
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append unique suffix and keep original file extension
  },
});

const upload = multer({ storage: storage });


const { spawn } = require("child_process");

const pythonProcess = spawn("python", ["models/yo.py"]);

function getInference(inputData, callback) {
  pythonProcess.stdin.write(
    JSON.stringify({ action: "model", data: inputData }) + "\n"
  );

  pythonProcess.stdout.once("data", (data) => {
    console.log("Received data from Python process:", data.toString());
    callback(JSON.parse(data.toString()));
  });
}


app.post("/predict", upload.single("image"), async(req, res) => {
  const imagePath = req.file.path; // The path to the uploaded image

  if (!imagePath) {
    return res.status(400).json({ error: "Image path is required" });
  }

  console.log("Received image file:", imagePath);


  getInference(imagePath, (result) => {
    // Delete the uploaded image after inference
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting imagd: ${err}`);
      }
    });
    console.log('Result received');
    // Send the result back to the client
    console.log(result);
    res.status(200).send({
      result
    });
  });
});


app.post("/predict1", upload.single("image"), async (req, res) => {
  console.log("Received image file:");
  const imagePath = req.file.path; // The path to the uploaded image

  if (!imagePath) {
    return res.status(400).json({ error: "Image path is required" });
  }

  const url = process.env.URL;
  const promptTemplate = process.env.PROMPT_TEXT;

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng", {
      logger: (info) => console.log(info),
    });

    const prompt_data = {
      contents: [
        {
          parts: [
            {
              text: promptTemplate.replace(/{text}/g, text), // Replace {text} with actual OCR text
            },
          ],
        },
      ],
    };

    console.log("Recognized Text:", text);
    const response = await axios.post(url, prompt_data, {
      headers: { "Content-Type": "application/json" },
    });

    const result = response.data;
    const regex = /\{(?:[^{}]|(?:))+\}/g;
    const extractedText = result?.candidates[0]?.content?.parts[0]?.text;
    const matches = extractedText?.match(regex);

    const extractedTextresult = JSON.parse(matches[0]);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${err}`);
      }
    });

    res.status(200).send({
      extractedText: extractedTextresult,
    });
  } catch (err) {
    console.error("Error:", err);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${err}`);
      }
    });
    res.status(500).json({ error: "An error occurred during OCR processing" });
  }
});
 

app.listen(3000, () => {
  console.log("Node.js server running on port 3000");
});