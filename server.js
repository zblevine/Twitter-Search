const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const port = process.env.PORT || 5002;
const yelp = require('yelp-fusion');
const apiKey = 'S370M4sMp1u2FgBBYcBxGaHj2gqmzFWFyNQ8W5u-sIhoXDAcXvuap41_kQhUUNqNen97DopaNwfFbyJmsvmv1UJA4h4Vbcjb4AfMqBdHhdzHM7KEVgamTcqXgInGXXYx';
const client = yelp.client(apiKey);

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/', (req, res, next) => {
  const searchRequest = {
    term: 'food',
    location: 'tribeca nyc',
    limit: 6,
    sort_by: 'rating'
  }
  client.search(searchRequest)
    .then(response => res.send(response))
    .catch(next);
})

app.get('/api/:nbhd/:city', (req, res, next) => {
  const searchRequest = {
    term: 'food',
    location: `${req.params.nbhd} ${req.params.city}`,
    limit: 6,
    sort_by: 'rating',
    open_now: true,
    radius: 1000
  }
  client.search(searchRequest)
    .then(response => res.send(response))
    .catch(next);
})

app.get('/api/:nbhd/:city/:time', (req, res, next) => {
  const searchRequest = {
    term: 'food',
    location: `${req.params.nbhd} ${req.params.city}`,
    limit: 6,
    sort_by: 'rating',
    open_at: req.params.time,
    radius: 1000
  }
  console.log(req.params.time);
  client.search(searchRequest)
    .then(response => res.send(response))
    .catch(next);
})

app.listen(port, ()=> console.log(`listening on port ${port}`));