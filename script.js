
function finnHub (response) {
    var requestURL = "https://finnhub.io/api/v1/news?category=crypto&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0";
    fetch (requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            }
        )
};
finnHub()









/*  // Sample for finHUb

const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0"
const finnhubClient = new finnhub.DefaultApi()

finnhubClient.marketNews("crypto", {}, (error, data, response) => {
  console.log(error, data, response);
});

// GET Method atempt 

console.log(fetch("https://finnhub.io/api/v1/news?category=crypto&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0"));
/*  .then((response) => response.json())
  .then((json) => console.log(json));*/
