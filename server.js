const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || '3000';
const indexRouter = require('./routes/index');
const { changeLocation } = require('./change-location');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.post('/vessels', async (req, res) => {
  console.log(req.body);
  const { tokenDev, tokenProd, limit } = req.body;
  const sucessImos = await changeLocation(tokenDev, tokenProd, limit);
  res.send(sucessImos);
});

app.listen(PORT, () => {
  console.log(`Server run on port:${PORT}`);
});
