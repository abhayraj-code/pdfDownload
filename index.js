// var express = require("express"),
//   app = express();

// const chromium = require("@sparticuz/chrome-aws-lambda");
// const puppeteer = require("puppeteer");

// app.get("/generate-pdf", async (req, res) => {
//   try {
//     console.log("Chromium Path:", await chromium.executablePath);
//     const browser = await puppeteer.launch({
//       args: chromium.args,
//       executablePath: await chromium.executablePath,
//       headless: chromium.headless,
//     });

//     const page = await browser.newPage();
//     await page.setContent("<h1>Test PDF</h1>");

//     const pdf = await page.pdf({ format: "A4" });

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=test.pdf");
//     res.send(pdf);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Failed to generate PDF");
//   }
// });

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(` runn at http://localhost:${port}`);
// });

const express = require("express");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");

const app = express();
const PORT = 3000;
const PDF_DIR = path.join(__dirname, "pdfs");

// Ensure the PDF directory exists
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR);
}

// Static HTML template with a placeholder for the tracking number
const generateHTML = (trackingNumber) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Tracking Number: ${trackingNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        p { color: #555; }
      </style>
    </head>
    <body>
      <h1>Package Tracking Details</h1>
      <p>Your tracking number is: <strong>${trackingNumber}</strong></p>
    </body>
  </html>
`;

// API to create or fetch PDF
app.get("/generate-pdf", (req, res) => {
  const { trackingNumber } = req.query;

  if (!trackingNumber) {
    return res.status(400).json({ message: "Tracking number is required." });
  }

  const pdfPath = path.join(PDF_DIR, `${trackingNumber}.pdf`);

  // Check if the PDF already exists
  if (fs.existsSync(pdfPath)) {
    return res.download(pdfPath, `${trackingNumber}.pdf`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file.");
      }
    });
  }

  try {
    // Generate HTML content
    const htmlContent = generateHTML(trackingNumber);

    // Generate PDF from HTML content using html-pdf
    pdf.create(htmlContent).toFile(pdfPath, (err, response) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res.status(500).json({ message: "Error generating PDF." });
      }

      // Send the generated PDF for download
      return res.download(pdfPath, `${trackingNumber}.pdf`, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file.");
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
