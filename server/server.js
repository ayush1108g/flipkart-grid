const express = require("express");
const axios = require("axios");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

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

const { spawn } = require("child_process");
const pythonProcess = spawn("python", ["models/model-predict.py"]);

pythonProcess.stdin.write(JSON.stringify({ action: "load_model" }) + "\n");

function getInference(inputData, callback) {
  pythonProcess.stdin.write(
    JSON.stringify({ action: "infer", data: inputData }) + "\n"
  );
  pythonProcess.stdout.once("data", (data) => {
    callback(JSON.parse(data));
  });
}

app.post("/predict", upload.single("image"), (req, res) => {
  console.log("Received image file:");
  const imagePath = req.file.path;

  if (!imagePath) {
    return res.status(400).json({ error: "Image path is required" });
  }

  getInference(imagePath, (result) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${err}`);
      }
    });
    res.send(result);
  });
});

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

app.listen(3000, () => {
  console.log("Node.js server running on port 3000");
});
