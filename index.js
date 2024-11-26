var express = require("express"),
  app = express();

const html_to_pdf = require("html-pdf-node");

app.get("/generate-pdf", async (req, res) => {
  try {
    // Define static HTML content
    const htmlContent = `
      <html>
        <body>
          <h1>Welcome to html-pdf-node</h1>
          <p>This is a static PDF generated using predefined content.</p>
        </body>
      </html>
    `;

    // Define PDF options
    const options = { format: "A4" };

    // Create a file object with the static HTML content
    const file = { content: htmlContent };

    // Generate the PDF buffer
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // Set response headers for downloading the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=static-content.pdf"
    );

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(` runn at http://localhost:${port}`);
});
