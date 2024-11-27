var express = require("express");

var app = express();

const { jsPDF } = require("jspdf"); // Correct import

// Usage
const htmlContent = `<h1>Hello World. This is custom HTML content.</h1>`;

app.get("/generate-pdf", async (req, res) => {
  try {
    const doc = new jsPDF();
    doc.text(htmlContent, 10, 10);

    // Set response headers for PDF content
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=custom.pdf");

    // Stream the PDF directly to the response
    const pdfOutput = doc.output();
    res.send(pdfOutput);

    console.log("PDF generated and sent successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to generate PDF");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
