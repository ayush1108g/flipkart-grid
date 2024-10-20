const express = require("express");
const axios = require("axios");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
require("dotenv").config();

const app = express();
app.use(express.json());

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

// app.post("/predict", upload.single("image"), (req, res) => {
//   console.log("Received image file:");
//   const imagePath = req.file.path; // The path to the uploaded image

//   const command = `python models/object-detection-on-grocery-items.py ${imagePath}`;

//   // Execute the Python script
//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return res.status(500).send(`Error: ${stderr}`);
//     }

//     if (stderr) {
//       console.error(`Stderr: ${stderr}`);
//       return res.status(500).send(`Error: ${stderr}`);
//     }

//     // After prediction, delete the uploaded image file
//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error(`Error deleting file: ${err}`);
//         return res.status(500).send(`Error deleting file: ${err}`);
//       }

//       console.log(stdout);
//       // Send the response after deleting the file
//       const jsonOutputMatch = stdout.match(/\{.*\}/);
//       if (jsonOutputMatch) {
//         const jsonOutput = jsonOutputMatch[0]; // Extract the first match which is your JSON
//         try {
//           const result = JSON.parse(jsonOutput);
//           res.json(result); // Send the result back to the client
//         } catch (parseError) {
//           console.error(`Error parsing JSON: ${parseError}`);
//           res.status(500).send("Error parsing Python output");
//         }
//       } else {
//         console.error(`No JSON found in the Python output: ${stdout}`);
//         res.status(500).send("No valid JSON found");
//       }
//     });
//   });
// });

// app.post("/predict", upload.single("image"), (req, res) => {
//   console.log("Received image file:");
//   const imagePath = req.file.path; // The path to the uploaded image

//   if (!imagePath) {
//     return res.status(400).json({ error: "Image path is required" });
//   }

//   // Command to run the Python prediction script
//   const command = `python models/fruit-freshness-final.py ${imagePath}`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Execution error: ${error}`);
//       // Delete the image file after use
//       fs.unlink(imagePath, (err) => {
//         if (err) {
//           console.error(`Error deleting image: ${err}`);
//         }
//       });
//       return res.status(500).send(stderr);
//     }

//     // Capture the result from the Python script
//     const lines = stdout.trim().split("\n");
//     const predictedLabel = lines[lines.length - 1];

//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error(`Error deleting image: ${err}`);
//       }
//     });

//     res.json({ predictedLabel }); // Send the result back to the client
//   });
// });

// app.post("/predict", upload.single("image"), async (req, res) => {
//   console.log("Received image file:");
//   const imagePath = req.file.path; // The path to the uploaded image

//   if (!imagePath) {
//     return res.status(400).json({ error: "Image path is required" });
//   }

//   const url = process.env.URL;
//   const promptTemplate = process.env.PROMPT_TEXT;

//   try {
//     const {
//       data: { text },
//     } = await Tesseract.recognize(imagePath, "eng", {
//       logger: (info) => console.log(info),
//     });

//     const prompt_data = {
//       contents: [
//         {
//           parts: [
//             {
//               text: promptTemplate.replace(/{text}/g, text), // Replace {text} with actual OCR text
//             },
//           ],
//         },
//       ],
//     };

//     console.log("Recognized Text:", text);
//     const response = await axios.post(url, prompt_data, {
//       headers: { "Content-Type": "application/json" },
//     });

//     const result = response.data;
//     const regex = /\{(?:[^{}]|(?:))+\}/g;
//     const extractedText = result.candidates[0].content.parts[0].text;
//     const matches = extractedText.match(regex);

//     const extractedTextresult = JSON.parse(matches[0]);

//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error(`Error deleting image: ${err}`);
//       }
//     });

//     res.status(200).send({
//       extractedText: extractedTextresult,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error(`Error deleting image: ${err}`);
//       }
//     });
//     res.status(500).json({ error: "An error occurred during OCR processing" });
//   }
// });

/////
/////
/////
// /////
// app.post("/predict", upload.single("image"), async (req, res) => {
//   console.log("Received image file:");
//   const imagePath = req.file.path; // The path to the uploaded image

//   if (!imagePath) {
//     return res.status(400).json({ error: "Image path is required" });
//   }

//   const url = process.env.URL;
//   const promptTemplate = process.env.PROMPT_TEXT;

//   try {
//     // Run OCR and invoke Python scripts in parallel
//     const ocrPromise = Tesseract.recognize(imagePath, "eng", {
//       logger: (info) => console.log(info),
//     });

//     const pythonScriptPromise = new Promise((resolve, reject) => {
//       // Command to run the Python script for object detection
//       const command = `python models/object-detection-on-grocery-items.py ${imagePath}`;

//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Execution error: ${error}`);
//           return reject(stderr);
//         }
//         resolve(stdout);
//       });
//     });

//     const fruitFreshnessScriptPromise = new Promise((resolve, reject) => {
//       // Command to run the Python script for fruit freshness
//       const command = `python models/fruit-freshness-final.py ${imagePath}`;

//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Execution error: ${error}`);
//           return reject(stderr);
//         }
//         resolve(stdout);
//       });
//     });

//     const [ocrResult, objectDetectionResult, fruitFreshnessResult] =
//       await Promise.all([
//         ocrPromise,
//         pythonScriptPromise,
//         fruitFreshnessScriptPromise,
//       ]);

//     // Process OCR result
//     const {
//       data: { text },
//     } = ocrResult;
//     const prompt_data = {
//       contents: [
//         {
//           parts: [
//             {
//               text: promptTemplate.replace(/{text}/g, text),
//             },
//           ],
//         },
//       ],
//     };

//     console.log("Recognized Text:", text);
//     const response = await axios.post(url, prompt_data, {
//       headers: { "Content-Type": "application/json" },
//     });

//     const result = response.data;
//     const regex = /\{(?:[^{}]|(?:))+\}/g;
//     const extractedText = result.candidates[0].content.parts[0].text;
//     const matches = extractedText.match(regex);

//     const extractedTextResult = matches ? JSON.parse(matches[0]) : null;

//     // Clean up uploaded file
//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error(`Error deleting image: ${err}`);
//       }
//     });

//     const lines = fruitFreshnessResult.trim().split("\n");
//     const predictedLabelFruit = lines[lines.length - 1];

//     const objectDetectionResult1 = objectDetectionResult?.match(/\{.*\}/);
//     const objectDetectionResult2 = objectDetectionResult1[0]; // Extract the first match which is your JSON
//     const objectDetectionResult3 = JSON.parse(objectDetectionResult2);

//     console.log(extractedTextResult);
//     console.log(objectDetectionResult3);
//     console.log(predictedLabelFruit);

//     // Combine all results
//     res.status(200).send({
//       extractedText: extractedTextResult,
//       objectDetectionOutput: objectDetectionResult,
//       fruitFreshnessOutput: predictedLabelFruit,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     fs.unlink(imagePath, (err) => {
//       if (err) {
//         console.error(`Error deleting image: ${err}`);
//       }
//     });
//     res.status(500).json({ error: "An error occurred during processing" });
//   }
// });

app.post("/predict", upload.single("image"), async (req, res) => {
  console.log("Received image file:");
  const imagePath = req.file.path; // The path to the uploaded image

  if (!imagePath) {
    return res.status(400).json({ error: "Image path is required" });
  }

  const url = process.env.URL;
  const promptTemplate = process.env.PROMPT_TEXT;

  try {
    // Run the other two models concurrently
    const objectDetectionPromise = new Promise((resolve, reject) => {
      const command = `python models/object-detection-on-grocery-items.py ${imagePath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error}`);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });

    const fruitFreshnessPromise = new Promise((resolve, reject) => {
      const command = `python models/fruit-freshness-final.py ${imagePath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error}`);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });

    // Run OCR first
    const ocrResult = await Tesseract.recognize(imagePath, "eng", {
      logger: (info) => console.log(info),
    });

    // Process OCR result
    const {
      data: { text },
    } = ocrResult;

    const prompt_data = {
      contents: [
        {
          parts: [
            {
              text: promptTemplate.replace(/{text}/g, text),
            },
          ],
        },
      ],
    };

    console.log("Recognized Text:", text);

    const ocrPromise = axios.post(url, prompt_data, {
      headers: { "Content-Type": "application/json" },
    });

    // Wait for all promises to resolve
    const [ocrResponse, objectDetectionResult, fruitFreshnessResult] =
      await Promise.all([
        ocrPromise,
        objectDetectionPromise,
        fruitFreshnessPromise,
      ]);

    const result = ocrResponse.data;
    const regex = /\{(?:[^{}]|(?:))+\}/g;
    const extractedText = result.candidates[0].content.parts[0].text;
    const matches = extractedText.match(regex);
    const extractedTextResult = matches ? JSON.parse(matches[0]) : null;

    // Clean up uploaded file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${err}`);
      }
    });

    const lines = fruitFreshnessResult.trim().split("\n");
    const predictedLabelFruit = lines[lines.length - 1];

    const objectDetectionResultMatch = objectDetectionResult.match(/\{.*\}/);
    const objectDetectionResultJson = objectDetectionResultMatch
      ? JSON.parse(objectDetectionResultMatch[0])
      : null;

    console.log(extractedTextResult);
    console.log(objectDetectionResultJson);
    console.log(predictedLabelFruit);

    // Combine all results
    res.status(200).send({
      extractedText: extractedTextResult,
      objectDetectionOutput: objectDetectionResultJson,
      fruitFreshnessOutput: predictedLabelFruit,
    });
  } catch (err) {
    console.error("Error:", err);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${err}`);
      }
    });
    res.status(500).json({ error: "An error occurred during processing" });
  }
});

app.listen(3000, () => {
  console.log("Node.js server running on port 3000");
});
