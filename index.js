const http = require("http");
require('dotenv').config();
const app = require("./app");
const server = http.createServer(app);

const port = 3001;

// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});