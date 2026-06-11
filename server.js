require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Web App: http://localhost:${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api/v1`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});