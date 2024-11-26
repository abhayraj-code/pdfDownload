var express = require("express"),
  app = express();

const chromium = require("@sparticuz/chrome-aws-lambda");
const puppeteer = require("puppeteer");

app.get("/generate-pdf", async (req, res) => {
  try {
    console.log("Chromium Path:", await chromium.executablePath);
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent("<h1>Test PDF</h1>");

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=test.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to generate PDF");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(` runn at http://localhost:${port}`);
});
