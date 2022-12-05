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



// const express = require('express');
// const app = express();
// const port = 3001;
// // const cors = require('cors')
// // app.use(cors());


// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://hr-management-4a24c.web.app");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// // var whitelist = ['http://localhost:3000', 'http://localhost:3001']
// // var corsOptions = {
// //   origin: function (origin, callback) {
// //     if (whitelist.indexOf(origin) !== -1) {
// //       callback(null, true)
// //     } else {
// //       callback(new Error('Not allowed by CORS'))
// //     }
// //   }
// // }

// app.get('/', (req, res) => {
//     res.send({test:1234})
// });
// // app.listen(port, () => {
// //   console.log(`Example app listening at http://localhost:${port}`);
// // });
// const PORT = parseInt(process.env.PORT) || 8080;
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
//   console.log('Press Ctrl+C to quit.');
// });
