const submitButton = $("#submitButton");
const hotList = $(".hotList");
const myList = $(".myList");
const watchList = $(".watchList");
const watchListButton = $(".watchListButton");
const cryptoFeaturedImage = $(".featuredCryptoItemImage");
const cryptoFeaturedName = $(".featuredCryptoItemHeader");
const cryptoFeaturedPercentChange = $(".featuredCryptoItemPercentChange");
const cryptoFeaturedPrice = $(".featuredCryptoItemPrice");
const exitButton = $("#exitButton");
const addToWatchListButton = $(".pin-button");
const searchCryptoPage = document.querySelector("#searchedCryptoPage");
const cryptoNewsArticles = $("#cryptoNewsArticles");
const noArticles = $("#noArticlesDiv");
const paginationButtonsDiv = $(".marketButtons");
const newsLetterContainerExitButton = $("#newsLetterExitButton");
const newsLetterModal = $(".newsLetterModal");
const newsLetterButton = $("#newsLetterButton");
const recentCryptoNewsArticlesHeader = $("#cryptoNewsArticlesHeader");
const topCryptoNews = $("#news-articles");
const returnToHomePageButton = $("#returnToHomePageButton");
const mediaQuery = window.matchMedia("(max-width: 1020px)");
let featuredCryptoImageLinks = [];
let featuredCryptoNames = [];
let featuredCryptoImageChangePercents = [];
let featuredCryptoImagePrice = [];
let topHundredSortedByPercentChange = [];
let negativePercentChanges = [];
let cryptoClosingDataset = [];
let topFiftyCryptos = [];
let topTenCryptos = [];
let theNewTenCryptos = [];
let cryptoNamesToPersist = [];
let searchValue; 
let coinNews;
let cryptoSymbolForSearchedGraph; //cryptoSymbol will be retrieved by the retrieveFinnhubCryptoSymbol function
let cryptoSymbolForCryptoNews;
let cryptoName;
let theSearchedCrypto;
let CurrentWatchListCryptoNames;
let nameOfCurrentWatchListCryptos;
let suggestedCryptos = [];
let doNotRun = false;
let anyMatches;

/*
homePage.style.display = "none";
    searchCryptoPage.style.display = "block";
*/


function switchToHotList() {
    myList.removeClass("visible");
    myList.addClass("hidden");
    hotList.removeClass("hidden");
    hotList.addClass("visible");
    //make the hotList button a darker shade to indicate it's selected
}

function switchToMyList() {
    hotList.removeClass("visible");
    hotList.addClass("hidden");
    myList.removeClass("hidden");
    myList.addClass("visible");
    //make the myList button a darker shade to indicate it's selected
}



function getSearchedCoinSymbolCoinGecko() {
    return new Promise((resolve, reject) => {
        let requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
        fetch(requestURL)
            .then(response => response.json())
            .then(data => {
                let anyMatches = 0;
                console.log("THIS SEARCH VALUE" + searchValue);

                for (let i = 0; i < data.length; i++) {
                    if (searchValue.toLowerCase() == data[i].name.toLowerCase()) {
                        anyMatches++;
                        cryptoSymbolForCryptoNews = cryptoSymbolForSearchedGraph = data[i].symbol;

                        if (cryptoSymbolForSearchedGraph == "usdt") {
                            cryptoName = "tether";
                        } else {
                            cryptoSymbolForSearchedGraph = (data[i].symbol).toUpperCase() + "USDT";
                        }

                        cryptoName = data[i].name;
                        theSearchedCrypto = data[i];
                    }
                }

                if (anyMatches === 0) {
                    console.log("no MATCHES");
                    doNotRun = true;
                    reject("No matches found");
                } else {
                    console.log("MATCHES Found");
                    doNotRun = false;
                    resolve(data); // Resolve with the data if matches are found
                }

                // Additional logic for suggestedCryptos
                suggestedCryptos = [];
                for (let i = 0; i < 2; i++) {
                    let randomNumber = Math.floor((Math.random() * 100));
                    suggestedCryptos.push(data[randomNumber]);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                reject(error); // Reject the promise if an error occurs
            });
    });
}


function populateSearchedCryptoInfo (theSearchedCryptoObject) {
    let theSearchedCryptoImage = theSearchedCryptoObject.image;
    let theSearchedCryptoName = theSearchedCryptoObject.name;
    let theSearchedCryptoSymbol = theSearchedCryptoObject.symbol;
    let theSearchedCryptoPercentChange = theSearchedCryptoObject.market_cap_change_percentage_24h;
    let theSearchedCryptoRank = theSearchedCryptoObject.market_cap_rank;
    let theSearchedCryptoATH = (theSearchedCryptoObject.ath).toLocaleString(undefined, {minimumFractionDigits: 0});
    let theSearchedCryptoCurrentValue = (theSearchedCryptoObject.current_price).toLocaleString(undefined, {minimumFractionDigits: 0});
    let theSearchedCryptoATL = (theSearchedCryptoObject.atl).toLocaleString(undefined, {minimumFractionDigits: 0});
    $("#searchedCryptoImage").attr("src", theSearchedCryptoImage);
    $("#searchedCryptoNameAndSymbol").text(theSearchedCryptoName + "(" + theSearchedCryptoSymbol + ")");
    $("#searchedCryptoRank").text(theSearchedCryptoRank + "/100");
    $("#allTimeHigh").text("All-time High: $" + theSearchedCryptoATH);
    $("#currentValue").text("Current Value: $" + theSearchedCryptoCurrentValue);
    $("#allTimeLow").text("All-time Low: $" + theSearchedCryptoATL);
    if (theSearchedCryptoPercentChange > 0) {
        let dailyPerformance =theSearchedCryptoPercentChange.toLocaleString(undefined, {minimumFractionDigits: 0}) + "%";
        $("#searchedCryptoPercentChange").text(dailyPerformance).css("color", "green");
    }
    else {
        let dailyPerformance =theSearchedCryptoPercentChange.toLocaleString(undefined, {minimumFractionDigits: 0}) + "%";
        $("#searchedCryptoPercentChange").text(dailyPerformance).css("color", "red");
    }

}
/*
function createSearchedCryptoGraph () {
    let requestURL = "https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:" + cryptoSymbolForSearchedGraph + "&resolution=M&from=1672534801&to=1692513981&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0";
    fetch(requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            chart.data.datasets[0].data = [];
            chart.update();
            let closingData = data.c;
            if (closingData != null) {
                cryptoClosingDataset = [];
                for (let i = 0; i < closingData.length; i ++) {
                    cryptoClosingDataset.push(closingData[i]);
                }
                chart.data.datasets[0].data = cryptoClosingDataset;
                chart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
                chart.update();
            }
            else {
                chart.data.datasets[0].data = [];
                chart.options.plugins.title.text = "No Available Graph";
                chart.update();
                console.log("bye");
                chart.options.plugins.title.text = "No Available Graph";
            }
        })//dataset is based on the closing prices for the month
}*/




function createSearchedCryptoGraph () {
    let requestURL = "https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:" + cryptoSymbolForSearchedGraph + "&resolution=M&from=1672534801&to=1692513981&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0";
    let tetherURL = "https://finnhub.io/api/v1/crypto/candle?symbol=COINBASE:USDT-USD&resolution=M&from=1672534801&to=1692513981&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0"
    if (cryptoName == "Tether" || cryptoName == "tether") { //this function is working and populates the graph whenever tetherURL does not return null, open the link and I'll see that it occassionally returns null for no reason
        fetch(tetherURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            chart.data.datasets[0].data = [];
            chart.update();
            let closingData = data.c;
            cryptoClosingDataset = [];
            for (let i = 0; i < closingData.length; i ++) {
                cryptoClosingDataset.push(closingData[i]);
            }
            chart.data.datasets[0].data = cryptoClosingDataset;
            chart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
            chart.update();
        })
    }
    else {
        fetch(requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            chart.data.datasets[0].data = [];
            chart.update();
            let closingData = data.c;
            if (closingData != null) {
                cryptoClosingDataset = [];
                for (let i = 0; i < closingData.length; i ++) {
                    cryptoClosingDataset.push(closingData[i]);
                }
                chart.data.datasets[0].data = cryptoClosingDataset;
                chart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
                chart.update();
            }
            else {
                chart.data.datasets[0].data = [];
                chart.options.plugins.title.text = "No Available Graph";
                chart.update();
                chart.options.plugins.title.text = "No Available Graph";
            }
        })
    }
}



















//this submitButton listener refreshes the searchPages data, and populates it
submitButton.on("click", async function (event) {
    event.preventDefault();
    submitButton.attr("disabled", "disabled");
    searchValue = ($("#searchValue").val()).trim();
    $("#searchValue").val("")
    console.log(searchValue);
    console.log(doNotRun);
    if (searchValue == "") {
        submitButton.removeAttr("disabled");
        return;
    }
    chart.data.datasets[0].data = [];
    try {
        await getSearchedCoinSymbolCoinGecko();
        console.log(doNotRun);

        if (doNotRun) {
            console.log("no matches");
            return;
        } else {
            console.log("matches");
            populateSearchedCryptoInfo(theSearchedCrypto);
            createSearchedCryptoGraph();
            displaySuggestedCryptos(suggestedCryptos);
            populateRecentNewsSection(cryptoName, cryptoSymbolForCryptoNews);
            setTimeout(populateHotList2, 100);
            switchToSearchPage();
        }
    } catch (error) {
        console.error(error);
    } finally {
        submitButton.removeAttr("disabled");
    }
})


const submitButtonTwo = $("#submitButtonTwo");
submitButtonTwo.on("click", (event) => {
    event.preventDefault();
    searchValue = ($("#searchValueTwo").val()).trim();
    $("#searchValueTwo").val("")
    chart.data.datasets[0].data = [];
    let searchedCryptoNews = $("#cryptoNewsArticles").empty();
    for (let i = 0; i < searchedCryptoNews.children().length; i++) {
        searchedCryptoNews.children().eq(i).empty();
        for (let j = 0; i < searchedCryptoNews.children().eq(i).length; i++) {
            console.log(searchedCryptoNews.children().eq(i).children().eq(j));
            searchedCryptoNews.children().eq(i).children().eq(j).remove(); // this removes the already emptied child elements inside the NewsArticle div
        }
    }
    let suggestedCryptosTable = $("#tableBodyTwo")
    for (let i = 0; i < suggestedCryptosTable.children().length; i++) {
        suggestedCryptosTable.children().eq(i).empty();
    }
    for (let i = suggestedCryptos.length - 1; i >= 0; i--) {
        suggestedCryptos.splice(i, 1);
      }
    getSearchedCoinSymbolCoinGecko();
    setTimeout(() => {populateSearchedCryptoInfo(theSearchedCrypto)}, 1000);
    setTimeout(() => {displaySuggestedCryptos(suggestedCryptos)}, 1000)
    setTimeout(createSearchedCryptoGraph, 1000);
    setTimeout(() => {populateRecentNewsSection(cryptoName, cryptoSymbolForCryptoNews)}, 2000);
})

//this populates the Top Crypto News section as well
function finnHub (response) {
    let headline;
    let newsSum;
    let NewsLinkk;
    let Newssrc;
    let line;
    let theHeadline;
    let theSummary;
    let newsLink;
    let articleSrc;
    let theIndex = 0;


    let requestURL = "https://finnhub.io/api/v1/news?category=crypto&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0";
    fetch (requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (let i = 0; i<5; i++)  {
                headline = $('<h2>');
                headline.addClass("headline");
                newsSum = $('<p>');
                newsSum.addClass("newsSum");
                NewsLinkk = $('<a>');
                NewsLinkk.addClass("NewsLinkk");
                Newssrc = $('<p>');
                Newssrc.addClass("Newssrc");
                line = document.createElement("hr");

                theHeadline = (data[theIndex].headline);

                topCryptoNews.append(headline);
                headline.text(theHeadline)
                

                theSummary = (data[theIndex].summary);
                topCryptoNews.append(newsSum);
                newsSum.text("Summary: " + theSummary);

                newsLink = (data[theIndex].url);
                topCryptoNews.append(NewsLinkk);
                NewsLinkk.attr("href", newsLink);
                NewsLinkk.text("Link: " + newsLink);

                articleSrc = (data[theIndex].source);
                topCryptoNews.append(Newssrc);
                Newssrc.text("Source: " + articleSrc);

                topCryptoNews.append(line);
                theIndex++;
            }
            }
        )
};

//THIS FUNCTION POPULATES THE TOP 50 COINS ARRAY THAT THE MARKET LEADERS ARRAY USES, DO NOT TAMPER WITH IT...
function retrieveTrendingCryptoData (response) {
    let requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch (requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (let i = 0; i < 4; i++)  {
                featuredCryptoImageLinks.push(data[i].image);
                featuredCryptoNames.push(data[i].name);
                featuredCryptoImageChangePercents.push(data[i].market_cap_change_percentage_24h);
                let currentPrice = (data[i].current_price).toLocaleString(undefined, {minimumFractionDigits: 2});
                featuredCryptoImagePrice.push(currentPrice);
            }

            for (let i = 0; i < 50; i++) {
                topFiftyCryptos.push(data[i]);
            }
            for (let i = 0; i < 10; i++) {
                topTenCryptos.push(data[i]);
            }
            theNewTenCryptos = topTenCryptos;
        }
    )
};

function populateTrendingCrypto () {
    for (let i = 0; i < 4; i++) {
        let imageLink = featuredCryptoImageLinks[i];
        $(cryptoFeaturedImage[i]).attr("src", imageLink);
        $(cryptoFeaturedName[i]).text(featuredCryptoNames[i]);
        let percentChange = featuredCryptoImageChangePercents[i].toLocaleString() + "%";
        if (percentChange < 0) {
            percentChange.css("color", "red")
        }
        if (percentChange > 0) {
            percentChange.css("color", "#1CAC78")
        }
        $(cryptoFeaturedPercentChange[i]).text(percentChange);
        $(cryptoFeaturedPrice[i]).text("$" + featuredCryptoImagePrice[i]);
    }
} 

finnHub();


$(window).on("load", function() {
    finnHub();
    retrieveTrendingCryptoData();
    setTimeout(populateTrendingCrypto, 900);
    setTimeout(() => {displayMarketUpdate(topTenCryptos)}, 900);
    retrieveHotListData();
    setTimeout(populateHotList, 900);
    watchListPersist();
});


//when the window loads, this function is ran once...



// function to render search results after search button is clicked




    //getCoinID is taking too long to retrieve the ID, need to set a timeout on getCoinInfoWithID() to make sure
    //getCoinID gets the ID before calling it
    //retrieveTrendingCryptoData();



watchListButton.on("mouseenter", function () { 
    let watchListClasses = watchList.attr("class").split(" ");
    if (watchListClasses.includes("appear") == false) {
        watchList.addClass("appear");
    }
});

watchList.on("mouseleave", function (event) {
    let watchListClasses = watchList.attr("class").split(" ");
    if (watchListClasses.includes("appear") == true) {
        watchList.removeClass("appear");
    }
});

const handleClickOutside = (event) => {
    if (!watchList.is(event.target) && !watchList.has(event.target).length) {
        watchList.removeClass("appear");
    }
}

$(document).on("click", handleClickOutside)



function fetchMarketUpdate() {
    // API URL
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'; //
    fetch (apiUrl) 
        .then ((response) => response.json())
        .then (function (data) {
            return data;
        })
}


paginationButtonsDiv.on("click",(event) => {
    let theNewTenCryptos = [];
    let clicked = event.target;
    let x;
    let y;
    if (clicked.matches("#buttonOne")) {
        y = 10;
        for (x = 0; x<y; x++) {
            theNewTenCryptos.push(topFiftyCryptos[x]);
        }
    }
    if (clicked.matches("#buttonTwo")) {
        y = 20;
        for (x = 10; x<y; x++) {
            theNewTenCryptos.push(topFiftyCryptos[x]);
        }
    }
    if (clicked.matches("#buttonThree")) {
        y = 30;
        for (x = 20; x<y; x++) {
            theNewTenCryptos.push(topFiftyCryptos[x]);
        }
    }
    if (clicked.matches("#buttonFour")) {
        y = 40;
        for (x = 30; x<y; x++) {
            theNewTenCryptos.push(topFiftyCryptos[x]);
        }
    }

    if (clicked.matches("#buttonFive")) {
        y = 50;
        for (x = 40; x<y; x++) {
            theNewTenCryptos.push(topFiftyCryptos[x]);
        }
    }
    toBeDisplayed = theNewTenCryptos;

    displayMarketUpdate(theNewTenCryptos);
})









//in the display market function, have it work to display the top ten when the function is opened,
//have the function use the top 100 coins array\
//create an event listener that listens to which of the five buttons are clicked
//based on the button clicked, you set two letiables: x and y, to the numbers necessary to parse the top 100 array accordingly
//then feed that array into the displayMarketUpdate() function, and it will display the correct coins on the page

fetchMarketUpdate();


// Function to fetch market update data from the API
/*async function fetchMarketUpdate() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data; //this grabs and returns all of the data from the apiUrl, which is top 100 cryptos
    } catch (error) {//catches the error if there is one
        console.error("Error fetching data:", error);
        return null;
    }
}*/

// Renames column headers
const columnMapping = {
    name: 'Name',
    current_price: 'Price',
    market_cap_change_percentage_24h: '24h Change',
    market_cap: 'Market Cap',
};

// Function to display market update data in columns
function displayMarketUpdate(theNewTenCryptos) { //uses the data from the API, which is the top 100 coins
    const marketUpdateContainer = document.getElementById("market-update");
    if (!theNewTenCryptos) return; //if its empty, then the function does not run...
    const columns = ['name', 'current_price', 'market_cap_change_percentage_24h', 'market_cap'];
    const tableRows = $("#tableBody").children();
    let index = 0;
    for (let i = 0; i < 10 ; i++) {
        tableRows.eq(i).empty();
    }
    theNewTenCryptos.forEach(crypto => {
        columns.forEach(column => {
            const cell = document.createElement('td');//creates the cell
            if (column == 'current_price' || column == "market_cap") {
                $(cell).text("$" + crypto[column].toLocaleString()); // Format with "$"
            }
            if (column == "market_cap_change_percentage_24h") {
                let value = crypto[column];
                if (value> 0) {
                    $(cell).text(value).css("color", "green");
                    $(cell).text(value + "%")
                }
                else {
                    $(cell).text(value).css("color", "red");
                    $(cell).text(value + "%")
                }
            }
            if (column == "name") {
                cell.textContent = crypto[column].toLocaleString(); // Format with thousands separators
                let image = $("<img>");
                image.attr("src", crypto.image);
                image.attr("class", "marketLeaderImage");
                let div = $("<div>");
                div.attr("class", "marketLeaderDiv")
                div.append(image)
                $(cell).append(div);
            }
            $(tableRows[index]).append(cell);
        });
        index++; //increments and creates a row for the
    });
    const cells = table.querySelectorAll("td"); //error here and 560
    cells.forEach(cell => {
    cell.style.border = 'none';
});
};

function displaySuggestedCryptos(suggestedCryptos) { 
    console.log(suggestedCryptos);
    $("#suggestedCryptosHeader").text("Coins Like " + cryptoName);
    if (!suggestedCryptos) {
        return;
    } //if its empty, then the function does not run...
    const columns = ['name', 'current_price', 'market_cap'];
    const tableRows = $("#tableBodyTwo").children();
    console.log(tableRows);
    let index = 0;
    for (let i = 0; i < 3; i++) {
        tableRows.eq(i).empty();
    }
    suggestedCryptos.forEach(crypto => {
        columns.forEach(column => {
            const cell = $("<td>");//creates the cell
            if (column == 'current_price') {
                let value = "$" + crypto[column].toLocaleString(undefined, {minimumFractionDigits: 0});
                cell.text(value)
            }
            if (column == "market_cap") {
                let value = "$" + crypto[column].toLocaleString(undefined, {minimumFractionDigits: 0});
                cell.text(value)
            }
            if (column == "name") {
                let value = crypto[column].toLocaleString(undefined, {minimumFractionDigits: 0});
                 // Format with thousands separators
                cell.text(value)
                let image = $("<img>");
                image.attr("src", crypto.image);
                image.addClass("tableBodyTwoImage")
                cell.append(image);
            }
            $(tableRows[index]).append(cell);
        });
        index++; //increments and creates a row for the
    });
    const cells = table.querySelectorAll("td");
    cells.forEach(cell => {
    cell.style.border = 'none';
});
};
/*
emptySuggestedCryptos = () => {
    const tableBodyLength = $("#tableBodyTwo").children().length;
    for (let i = 0; i < tableBodyLength; i++) {
        for (let j = 0; j < 3; j++) {
            const tableBodyElement = $("#tableBodyTwo").children().eq(i).children().eq(j);
            tableBodyElement.empty();
        }
    }
}*/

function retrieveHotListData() {
    let requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch(requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (let i = 0; i < data.length; i++) {
                topHundredSortedByPercentChange.push(data[i]); //creating the array of the topHundredCryptos
            }
            //pushes all the APIs data objects into the array
            for (let i = 0; i < data.length; i++) {
                if (topHundredSortedByPercentChange[i].market_cap_change_percentage_24h < 0) {
                    negativePercentChanges.push(data[i].name); //putting the names of all Negative Percent Changes in this array
                }
            }
            
            for (let i = 0; i < data.length; i++) {
                topHundredSortedByPercentChange[i].market_cap_change_percentage_24h = Math.abs(topHundredSortedByPercentChange[i].market_cap_change_percentage_24h);
            } //making all percent changes absolute values to sort

            topHundredSortedByPercentChange.sort(function (a,b) {
                return b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h;
            }) //sorting the topHundred by the magnitude of their percent change
        })
};


function populateHotList() {
    let topTenImages = $(".topTenImage");
    let topTenNames = $(".topTenNameUnderEightCharacters")
    let topTenPercentChanges = $(".topTenPercentage");
    let topTenArrows = $(".arrow");
    let index = 0;
    for (let i = 0; i < 10; i ++) {
        $(topTenImages[i]).attr("src", topHundredSortedByPercentChange[i].image);
        $(topTenNames[i]).text(topHundredSortedByPercentChange[i].name);
        if ((topHundredSortedByPercentChange[i].name).length > 8) {
            $(topTenNames[i]).attr("class", "topTenNameBetweenEightAndTwelveCharacters");
        }
        if ((topHundredSortedByPercentChange[i].name).length > 11) {
            $(topTenNames[i]).attr("class", "topTenNameOverTwelveCharacters");
        }
        if ((topHundredSortedByPercentChange[i].name).length > 11) {
            $(topTenNames[i]).attr("class", "topTenNameOverTwelveCharacters");
        }
        $(topTenPercentChanges[i]).text((topHundredSortedByPercentChange[i].market_cap_change_percentage_24h).toFixed(1) + "%");
    }//displaying the top ten percent changes regardless of whether its negative or positive

    for (let i = 0; i < topTenNames.length; i++) {
        for (let j = 0; j < negativePercentChanges.length; j++) {
            if ((negativePercentChanges[j]) == ($(topTenNames[i]).text())) {
                $(topTenPercentChanges[index]).css("color", "red");
                $(topTenArrows[index]).attr("src", "./assets/images/DownwardsArrow.png");
                //adjusts the arrow symbol and color of percentChange according to whether the coin is under or over for the day
                index++;
                //this if loop is ran 10 out of the 910 times, which means it does change the color for the percent change
            }
    }}
};

function populateHotList2() {
    let topTenImages = $(".topTenImage2");
    let topTenNames = $(".topTenNameUnderEightCharacters2")
    let topTenPercentChanges = $(".topTenPercentage2");
    let topTenArrows = $(".arrow2");
    let index = 0;
    for (let i = 0; i < 10; i ++) {
        $(topTenImages[i]).attr("src", topHundredSortedByPercentChange[i].image);
        $(topTenNames[i]).text(topHundredSortedByPercentChange[i].name);
        if ((topHundredSortedByPercentChange[i].name).length > 8) {
            $(topTenNames[i]).attr("class", "topTenNameBetweenEightAndTwelveCharacters");
        }
        if ((topHundredSortedByPercentChange[i].name).length > 11) {
            $(topTenNames[i]).attr("class", "topTenNameOverTwelveCharacters");
        }
        if ((topHundredSortedByPercentChange[i].name).length > 11) {
            $(topTenNames[i]).attr("class", "topTenNameOverTwelveCharacters");
        }
        $(topTenPercentChanges[i]).text((topHundredSortedByPercentChange[i].market_cap_change_percentage_24h).toFixed(1) + "%");
    }//displaying the top ten percent changes regardless of whether its negative or positive

    for (let i = 0; i < topTenNames.length; i++) {
        for (let j = 0; j < negativePercentChanges.length; j++) {
            if ((negativePercentChanges[j]) == ($(topTenNames[i]).text())) {
                $(topTenPercentChanges[index]).css("color", "red");
                $(topTenArrows[index]).attr("src", "assets/downwardsArrow.png");
                //adjusts the arrow symbol and color of percentChange according to whether the coin is under or over for the day
                index++;
                //this if loop is ran 10 out of the 910 times, which means it does change the color for the percent change
            }
    }}
};




//here I will create the object that will be passed into the addToMyList function
//I will add an event listener to the watchList button that calls the addToMyList using the parameter of the saved object
//the name of the object in localStorage will be the name of the coin



//THIS SUBMIT BUTTON LISTNERS SERVES AS A DUAL PURPOSE FUNCTION THAT SETS THE SEARCHED ITEM TO LOCALSTORAGE, SO THAT THE ADD TO WATCHLISTBUTTON EVENT LISTENER
//CAN ADD THE SEARCHED CRYPTO TO THE WATCHLSIT
//IT ALSO SWTICHES THE PAGE, THE SWITCH PAGE FUNCTION RELIES ON THE FETCH, AND IF THE FETCH FAILS, THE PAGE DOES NOT SWITCH
submitButton.on("click", function (event) {
    event.preventDefault();
    let requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
    fetch (requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let allCryptos = [];
            searchValue = ($("#searchValue").val()).trim();
            for (let i = 0; i < data.length; i++) {
                allCryptos.push(data[i]);
            }
            if (searchValue != "") {
                for (let i = 0; i <data.length; i++) {
                    if ((allCryptos[i].name).toLowerCase() == (searchValue).toLowerCase()) {

                        let possibleWatchListCrypto = {
                            name: data[i].name,
                            image: data[i].image,
                            dayChange: data[i].market_cap_change_percentage_24h,
                        }

                        localStorage.setItem(possibleWatchListCrypto.name, JSON.stringify(possibleWatchListCrypto));
                        
                        doesItMatch();
                    //switching the pages
                    //CONSIDER THIS ERROR POSSIBILITY:
                    //THE PAGE WONT SWITCH IF THE FETCH REQUEST HERE IS UNSUCCESSFUL....
                    }
                }
            }
        }
    )
});

let watchListPersist = () => {
    let toBeAdded = localStorage.getItem("savedWatchList");
    toBeAdded = JSON.parse(toBeAdded);
    if (toBeAdded != null) {
        for (let i = 0; i < toBeAdded.length; i ++) {
            let addToList = toBeAdded[i].name;
            addToWatchList(addToList);
        }
    }
}


let addToWatchList = (cryptoName) => {
    const myList = $(".unOrderedMyList");
    let newWatchListCrypto = localStorage.getItem(cryptoName); //cryptoName updates to the crypto that is searched
    newWatchListCrypto = JSON.parse(newWatchListCrypto); //new watchListCrypto is now equal to the parsed object 


    // this code works for saving the watchlist items after browser has been reloaded
    cryptoNamesToPersist.push(newWatchListCrypto);
    let theNamesToBeSaved = JSON.stringify(cryptoNamesToPersist);
    localStorage.setItem("savedWatchList", theNamesToBeSaved);
    

    let newWatchListItem = $("<li>");

    let newWatchListItemImage = $("<img>");
    newWatchListItemImage.attr("src", newWatchListCrypto.image);
    newWatchListItemImage.attr("height", 60);
    newWatchListItemImage.attr("width", 60);
    newWatchListItem.append(newWatchListItemImage);
    //append image
    
    let newWatchListItemName = $("<div>");
    newWatchListItemName.addClass("itemName");
    newWatchListItemName.text(newWatchListCrypto.name);
    newWatchListItem.append(newWatchListItemName);
    //append name

    let newWatchListItemDayChange = $("<div>");
    newWatchListItemDayChange.addClass("dayChange");
    newWatchListItemDayChange.text(newWatchListCrypto.dayChange);
    if (newWatchListCrypto.dayChange < 0) {newWatchListItemDayChange.css("color", "red")}
    else {newWatchListItemDayChange.css("color", "green")};
    newWatchListItem.append(newWatchListItemDayChange);
    //append priceChange

    let newWatchListItemRemoveButton= $("<button>");
    newWatchListItemRemoveButton.addClass("removeButton");
    newWatchListItemRemoveButton.text("X");
    newWatchListItem.append(newWatchListItemRemoveButton);
    myList.append(newWatchListItem);
    //adds the new watchList item


    const lineBreakDiv = $("<div>");
    lineBreakDiv.addClass("linebreak");
    //linebreak for the next element

    //But, that is not the case... to access any elements created in javascript, whether through their element type, class/id name, or styles, I MUST access them in accordance with the scope that they are created
//I thought the element created would be added to the html file, and then, I could access them regardless of scope, but that is not the case since the element is created and given a class inside a function

//cryptoNames to persist is an array of objects, including the name, that need to be deleted, so I find the object in the array that matches using the name of the watchList item and name of 

    let removeButtons = $(".removeButton"); //this still runs because the event Listener is being attached to each removeButton element that is created... so it still runs when it is clicked on regardless of the fact it is nested in a function...
    removeButtons.on("click", (event) => {
        let clickedRemoveButton = $(event.target); 
        let itemToBeRemoved = clickedRemoveButton.parent(); //this should grab the parent element of the removeButton, which is the li for the newWatchList Item
        let itemToBeRemovedName = itemToBeRemoved.children().eq(1).text();

        for (let i = itemToBeRemoved.children().length - 1; i >= 0; i--) {
            itemToBeRemoved.children().eq(i).remove();
        }

        let indexOfRemovedItem = null;
        indexOfRemovedItem = cryptoNamesToPersist.findIndex((cryptoObject) => cryptoObject.name === itemToBeRemovedName); //goes through each item of the cryptoNames Array to until it returns a value for the comparison that is not negative one, when its not -1, it logs the index of the array for which the comparison is true
        $(cryptoNamesToPersist).remove(indexOfRemovedItem);
        localStorage.setItem("savedWatchList", cryptoNamesToPersist);

        //also must remove it from localStorage, so that the letWatchListPersist function () doesn't readd it to the watchlist when the browser is refreshed
        //need to remove the name from cryptoNamesToPersist, in order to do so 
    })
}



addToWatchListButton.on("click", () => {
    addToWatchList(cryptoName);
    addToWatchListButton.attr("disabled", "disabled");
});

//adds to watch list then disables the button 
//should add a css style after that shows that the button has been clicked 




let chart = new Chart(document.getElementById("searchedCryptoGraph"), {
    type : 'line',
    data : {
        labels : ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
        datasets : [
            {
                data : [],
                label : "Closing Value at Month's End",
                borderColor : "#1CAC78",
                fill : false, 
                backgroundColor: "white"
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display : true,
                text : 'Chart JS Line Chart Example',
                color : "#ff9c00"
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                ticks: {
                    color: "white"
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

Chart.defaults.font.size = 15;

function responsiveFonts() {
    const mediaQueryLarge = window.matchMedia('(min-width: 1200px) and (max-width: 1400px)');
    const mediaQueryMedium = window.matchMedia('(min-width: 700px) and (max-width: 1200px)');
    const mediaQuerySmall = window.matchMedia('(min-width: 425px) and (max-width: 700px)');
    const mediaQueryTiny = window.matchMedia('(max-width: 425px)');

    if (mediaQueryLarge.matches) {
        Chart.defaults.font.size = 15;
    } else if (mediaQueryMedium.matches) {
        Chart.defaults.font.size = 12;
    } else if (mediaQuerySmall.matches) {
        Chart.defaults.font.size = 9;
    } else if (mediaQueryTiny.matches) {
        Chart.defaults.font.size = 4;
    }
}

// Call the function on page load and window resize
window.addEventListener('load', responsiveFonts);
window.addEventListener('resize', responsiveFonts);









//I have this letiable

//if doesItMatch returns true, then disable the button...
//when you hit the return button is when the list of watchList cryptos should be updated

let doesItMatch = () =>  {
     //grabs all the div tags in the watchList whose text holds the cryptos name
    //this should return an array of the names of the watchList items
    let length = $(".itemName").length;
    if (CurrentWatchListCryptoNames != null) {
        for (let i = 0; i < length; i++) {
            nameOfCurrentWatchListCryptos = $(CurrentWatchListCryptoNames[i]).text();
            if ((nameOfCurrentWatchListCryptos).toLowerCase() == searchValue.toLowerCase()) {
                addToWatchListButton.attr("disabled", "disabled");
                break;
            }
            else {
                addToWatchListButton.removeAttr("disabled");
            }
        }
    }
};

  //this does disable it...
  //need to change the background image after its clicked once 

  //have the watchlist button be disabled before going onto the page,
  //if the searched bitcoin's name does not match any of the name's on the watchlist, then enable the button
  // keep this 


  //RETURN TO HOMEPAGE BUTTON
  returnToHomePageButton.on("click", () => {
    searchValue = "";
    $("#searchValue").val("");
    submitButton.removeAttr("disabled");
    switchToHomePage();
    chart.data.datasets[0].data = []; //resets graph
    //emptySuggestedCryptos();
    chart.update();
    CurrentWatchListCryptoNames = $(".itemName");
    for (let i = 0; i < cryptoNewsArticles.children().length; i++) {
        cryptoNewsArticles.children().eq(i).empty();
        for (let j = 0; i < cryptoNewsArticles.children().eq(i).length; i++) {
            cryptoNewsArticles.children().eq(i).children().eq(j).remove(); // this removes the already emptied child elements inside the NewsArticle div
        }
    }
    noArticles.removeClass("hidden");
    //should empty each News Article div and its child elements, then delete that newsArticle div and its child elements as well
  });


  let switchToHomePage = () => {
    homePage.style.display = "block";
    afterHomePage.style.display = "block";
    footer.style.display = "block";
    searchCryptoPage.style.display = "none";
  }

  let switchToSearchPage = () => {
    homePage.style.display = "none";
    afterHomePage.style.display = "none";
    footer.style.display = "none";
    searchCryptoPage.style.display = "block";
  }

  newsLetterButton.on("click", function (event) {
    newsLetterModal.removeClass("hidden");
  })

  newsLetterContainerExitButton.on("click", function (event) {
    event.preventDefault();
    newsLetterModal.addClass("hidden");
  })


  let populateRecentNewsSection = (cryptoName, cryptoSymbolForCryptoNews) => {
    let requestURL = "https://finnhub.io/api/v1/news?category=crypto&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0";
    fetch (requestURL)
        .then ((response) => response.json())
        .then ((data) => {
            let anyArticles = 0;
            for (let i = 0; i < data.length; i++) {
                recentCryptoNewsArticlesHeader.text("Recent " + cryptoName + " News: ")
                let theHeadline = data[i].headline;
                let theSummary = data[i].summary;
                let cryptoSymbolCaps = cryptoSymbolForCryptoNews.toUpperCase();
                if (theHeadline.includes(cryptoName) || theHeadline.includes(cryptoSymbolForCryptoNews) || theHeadline.includes(cryptoSymbolCaps) || theSummary.includes(cryptoName) || theSummary.includes(cryptoSymbolForCryptoNews)) {
                    let newArticle = $("<div>");

                    let headline = $("<h2>");
                    headline.text(theHeadline);
                    newArticle.append(headline);

                    let newsSum = $("<p>");
                    newsSum.text(theSummary)
                    newArticle.append(newsSum);

                    let NewsLinkk = $("<a>");
                    NewsLinkk.text(data[i].url)
                    newArticle.append(NewsLinkk);

                    let Newssrc = $("<p>");
                    Newssrc.text(data[i].source);
                    newArticle.append(Newssrc);

                    let line = $("<hr>");
                    newArticle.append(line)  
                    //constructed new article

                    cryptoNewsArticles.append(newArticle)
                    //add new article to that particular crypto's news
                    anyArticles++;
                }
            }
            
            if (anyArticles  == 0) { //if it found no matches
                noArticles.addClass("hidden"); //hide the articles
            }
            else if (anyArticles > 0) {
                //create the outline
            }
            else {

            }
        }) 
  }

  //when I click return button I need to empty out the news Article section

  //put this function in one of the submit button listeners


const newsLetterSubmitButton = $("#newsLetterSubmitButton");
let arrayOfEmails = [];
const submittedEmailForNewsLetter = $("#emailInput");
const submittedNameForNewsLetter = $("#nameInput");
newsLetterSubmitButton.on("click", function (event) {
    event.preventDefault();
    let name = submittedNameForNewsLetter.val().trim();;
    let email = submittedEmailForNewsLetter.val().trim();
    if (email != "" && name != "") {
        location.reload(true);
    }
})



//MEDIA QUERIES 
/*
let mediaQueryOne = window.matchMedia("(max-width: 730px)");

if (mediaQueryOne.matches) {
    $("#searchValue").attr("placeholder", "Search").css("font-size", "2px");
}*/
