import express from 'express';

const app = express();
app.use(express.json()); // lets the API read JSON request bodies

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is alive' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});