// Simple server for development - use this if SSR is causing issues
import express from 'express';
import { join } from 'path';

const app = express();
const port = process.env['PORT'] || 4000;

// Serve static files
app.use(express.static(join(process.cwd(), 'dist/frontend/browser')));

// Handle all routes - serve index.html
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist/frontend/browser/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});