import express from "express";
import axios from "axios";

const app = express();
const port = 8008;
const TIMEOUT_MS = 500; // Timeout for each remote URL in milliseconds

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;

  console.log("Hello", urls);
  if (!urls) {
    return res.status(400).json({ error: "No URLs provided" });
  }

  try {
    const results = await Promise.all(
      [].concat(urls).map(async (url) => {
        try {
          const response = await Promise.race([
            axios.get(url),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request Timeout")), TIMEOUT_MS)
            ),
          ]);

          return response.data;
        } catch (error) {
          return { url, error: "Invalid URL or error fetching data" };
        }
      })
    );

    const mergedNumbers = results
      .flatMap((result) => (result.numbers ? result.numbers : []))
      .filter((number, index, self) => self.indexOf(number) === index)
      .sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});