const slugify = require('slugify');
const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

//
// Those are executed once when we load the application
const tempOverView = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

// use the "utf-8" to stop Error".replace() is not a function" from happening
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const errResponse = fs.readFileSync(`${__dirname}/templates/error.html`);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// Creating a server
http
  .createServer(function (req, res) {
    let { query, pathname } = url.parse(req.url, true);

    // OVERVIEW page
    if (pathname === '/' || pathname === '/overview') {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      const cardsHTML = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join('');

      const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardsHTML);
      res.end(output);
    }

    //
    // PRODUCT page
    else if (pathname === '/product') {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);

      res.end(output);
    }

    // API page
    else if (pathname === '/api') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    }

    // Any other page = Error
    else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(errResponse);
    }
  })
  .listen(8080);
