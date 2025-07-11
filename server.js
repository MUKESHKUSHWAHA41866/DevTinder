const express      = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/', (req, res) => {
  const ct = req.cookies;
  console.log('ct:', ct);
  // Use backticks for template literals
  res.send(`Your ct token is ${JSON.stringify(ct)}`);
});

app.listen(3000, () => console.log('Listening on port 3000'));
