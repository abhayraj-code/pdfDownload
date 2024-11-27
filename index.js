var express = require("express");

var app = express();

const { jsPDF } = require("jspdf"); // Correct import

function generatePDFfromHTML(htmlContent, outputPath) {
  const doc = new jsPDF();
  doc.text(htmlContent, 10, 10);
  doc.save(outputPath);
  console.log("PDF generated successfully");
}

// Usage
const htmlContent = `<h1>Hello World. This is custom HTML content.</h1>`;

app.get("/generate-pdf", async (req, res) => {
  try {
    generatePDFfromHTML(htmlContent, "custom.pdf");

    res.send("DONE");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to generate PDF");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
