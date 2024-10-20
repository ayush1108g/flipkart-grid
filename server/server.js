const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// app.post("/predict", async (req, res) => {
//   try {
//     const inputData = req.body.input;

//     // Call multiple Flask APIs in parallel using Promise.all
//     const [response1, response2, response3, response4, response5] =
//       await Promise.all([
//         axios.post("https://model1-api.onrender.com/predict", {
//           input: inputData,
//         }),
//         axios.post("https://model2-api.onrender.com/predict", {
//           input: inputData,
//         }),
//         axios.post("https://model3-api.onrender.com/predict", {
//           input: inputData,
//         }),
//         axios.post("https://model4-api.onrender.com/predict", {
//           input: inputData,
//         }),
//         axios.post("https://model5-api.onrender.com/predict", {
//           input: inputData,
//         }),
//       ]);

//     // Send the combined predictions back to the frontend
//     res.json({
//       model1: response1.data,
//       model2: response2.data,
//       model3: response3.data,
//       model4: response4.data,
//       model5: response5.data,
//     });
//   } catch (error) {
//     res.status(500).send(error.toString());
//   }
// });

app.listen(3000, () => {
  console.log("Node.js server running on port 3000");
});
