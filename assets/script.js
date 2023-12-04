const submitButton = $("#submitButton");
const submitButtonTwo = $("#submitButtonTwo");
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
const newsLetterSubmitButton = $("#newsLetterSubmitButton");
const submittedEmailForNewsLetter = $("#emailInput");
const submittedNameForNewsLetter = $("#nameInput");
const linkOne = $("#linkOne");
const linkTwo = $("#linkTwo");
const linkThree = $("#linkThree");
const linkFout = $("#linkFour");
let newChart;
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
let arrayOfEmails = [];
let searchValue; 
let coinNews;
let cryptoSymbolForSearchedGraph;
let cryptoSymbolForCryptoNews;
let cryptoName;
let theSearchedCrypto;
let CurrentWatchListCryptoNames;
let nameOfCurrentWatchListCryptos;
let suggestedCryptos = [];
let doNotRun = false;
let anyMatches;

function switchToHotList() {
    myList.removeClass("visible");
    myList.addClass("hidden");
    hotList.removeClass("hidden");
    hotList.addClass("visible");
}

function switchToMyList() {
    hotList.removeClass("visible");
    hotList.addClass("hidden");
    myList.removeClass("hidden");
    myList.addClass("visible");
}



function getSearchedCoinSymbolCoinGecko() {
    return new Promise((resolve, reject) => {
        let requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
        fetch(requestURL)
            .then(response => response.json())
            .then(data => {
                let anyMatches = 0;
                console.log("THIS SEARCH VALUE" + searchValue);
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    console.log(searchValue);
                    console.log(data[i].name);
                    if (searchValue.toLowerCase() == data[i].name.toLowerCase()) {
                        anyMatches++;
                        cryptoSymbolForCryptoNews = cryptoSymbolForSearchedGraph = data[i].symbol;

                        if (cryptoSymbolForSearchedGraph == "usdt") {
                            cryptoName = "tether";
                        } else {
                            cryptoSymbolForSearchedGraph = (data[i].symbol).toUpperCase();
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
                    resolve(data);
                }

                suggestedCryptos = [];
                for (let i = 0; i < 2; i++) {
                    let randomNumber = Math.floor((Math.random() * 100));
                    suggestedCryptos.push(data[randomNumber]);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                reject(error);
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


submitButton.on("click", async function (event) {
    event.preventDefault();
    submitButton.attr("disabled", "disabled");
    searchValue = ($("#searchValue").val()).trim();
    //$("#searchValue").val("")
    console.log(searchValue);
    console.log(doNotRun);
    if (searchValue == "") {
        submitButton.removeAttr("disabled");
        return;
    }
    try {
        await getSearchedCoinSymbolCoinGecko();
        console.log(doNotRun);

        if (doNotRun) {
            console.log("no matches");
            return;
        } else {
            console.log("matches");
            responsiveFontsAndCharts();
            populateSearchedCryptoInfo(theSearchedCrypto);
            displaySuggestedCryptos(suggestedCryptos);
            populateRecentNewsSection(cryptoName, cryptoSymbolForCryptoNews);
            setTimeout(populateHotList2, 100);
            setTimeout(createSearchedCryptoGraph, 200);
            setTimeout(switchToSearchPage, 1000);
        }
    } catch (error) {
        console.error(error);
    } finally {
        submitButton.removeAttr("disabled");
    }
})


submitButtonTwo.on("click", (event) => {
    event.preventDefault();
    searchValue = ($("#searchValueTwo").val()).trim();
    $("#searchValueTwo").val("")
    newChart.data.datasets[0].data = [];
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


fetchMarketUpdate();


const columnMapping = {
    name: 'Name',
    current_price: 'Price',
    market_cap_change_percentage_24h: '24h Change',
    market_cap: 'Market Cap',
};


function displayMarketUpdate(theNewTenCryptos) {
    const marketUpdateContainer = document.getElementById("market-update");
    if (!theNewTenCryptos) return;
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
        index++;
    });
    const cells = table.querySelectorAll("td");
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
            const cell = $("<td>");
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
                cell.text(value)
                let image = $("<img>");
                image.attr("src", crypto.image);
                image.addClass("tableBodyTwoImage")
                cell.append(image);
            }
            $(tableRows[index]).append(cell);
        });
        index++; 
    });
    const cells = table.querySelectorAll("td");
    cells.forEach(cell => {
    cell.style.border = 'none';
});
};

function retrieveHotListData() {
    let requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch(requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (let i = 0; i < data.length; i++) {
                topHundredSortedByPercentChange.push(data[i]);
            }
            for (let i = 0; i < data.length; i++) {
                if (topHundredSortedByPercentChange[i].market_cap_change_percentage_24h < 0) {
                    negativePercentChanges.push(data[i].name);
                }
            }
            
            for (let i = 0; i < data.length; i++) {
                topHundredSortedByPercentChange[i].market_cap_change_percentage_24h = Math.abs(topHundredSortedByPercentChange[i].market_cap_change_percentage_24h);
            }

            topHundredSortedByPercentChange.sort(function (a,b) {
                return b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h;
            })
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
    }
    for (let i = 0; i < topTenNames.length; i++) {
        for (let j = 0; j < negativePercentChanges.length; j++) {
            if ((negativePercentChanges[j]) == ($(topTenNames[i]).text())) {
                $(topTenPercentChanges[index]).css("color", "red");
                $(topTenArrows[index]).attr("src", "assets/downwardsArrow.png");
                index++;
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
    }

    for (let i = 0; i < topTenNames.length; i++) {
        for (let j = 0; j < negativePercentChanges.length; j++) {
            if ((negativePercentChanges[j]) == ($(topTenNames[i]).text())) {
                $(topTenPercentChanges[index]).css("color", "red");
                $(topTenArrows[index]).attr("src", "assets/downwardsArrow.png");
                index++;
            }
        }
    }
};

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
    let newWatchListCrypto = localStorage.getItem(cryptoName);
    newWatchListCrypto = JSON.parse(newWatchListCrypto);

    cryptoNamesToPersist.push(newWatchListCrypto);
    let theNamesToBeSaved = JSON.stringify(cryptoNamesToPersist);
    localStorage.setItem("savedWatchList", theNamesToBeSaved);
    

    let newWatchListItem = $("<li>");

    let newWatchListItemImage = $("<img>");
    newWatchListItemImage.attr("src", newWatchListCrypto.image);
    newWatchListItemImage.attr("height", 60);
    newWatchListItemImage.attr("width", 60);
    newWatchListItem.append(newWatchListItemImage);
    
    let newWatchListItemName = $("<div>");
    newWatchListItemName.addClass("itemName");
    newWatchListItemName.text(newWatchListCrypto.name);
    newWatchListItem.append(newWatchListItemName);

    let newWatchListItemDayChange = $("<div>");
    newWatchListItemDayChange.addClass("dayChange");
    newWatchListItemDayChange.text(newWatchListCrypto.dayChange);
    if (newWatchListCrypto.dayChange < 0) {newWatchListItemDayChange.css("color", "red")}
    else {newWatchListItemDayChange.css("color", "green")};
    newWatchListItem.append(newWatchListItemDayChange);

    let newWatchListItemRemoveButton= $("<button>");
    newWatchListItemRemoveButton.addClass("removeButton");
    newWatchListItemRemoveButton.text("X");
    newWatchListItem.append(newWatchListItemRemoveButton);
    myList.append(newWatchListItem);


    const lineBreakDiv = $("<div>");
    lineBreakDiv.addClass("linebreak");

    let removeButtons = $(".removeButton");
    removeButtons.on("click", (event) => {
        let clickedRemoveButton = $(event.target); 
        let itemToBeRemoved = clickedRemoveButton.parent();
        let itemToBeRemovedName = itemToBeRemoved.children().eq(1).text();

        for (let i = itemToBeRemoved.children().length - 1; i >= 0; i--) {
            itemToBeRemoved.children().eq(i).remove();
        }

        let indexOfRemovedItem = null;
        indexOfRemovedItem = cryptoNamesToPersist.findIndex((cryptoObject) => cryptoObject.name === itemToBeRemovedName); //goes through each item of the cryptoNames Array to until it returns a value for the comparison that is not negative one, when its not -1, it logs the index of the array for which the comparison is true
        $(cryptoNamesToPersist).remove(indexOfRemovedItem);
        localStorage.setItem("savedWatchList", cryptoNamesToPersist);
    })
}

addToWatchListButton.on("click", () => {
    addToWatchList(cryptoName);
    addToWatchListButton.attr("disabled", "disabled");
});

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
        maintainAspectRatio: true
    }
});

Chart.defaults.font.size = 15;

function responsiveFontsAndCharts() {
    console.log(cryptoClosingDataset);
    const mediaQueryLarge = window.matchMedia('(min-width: 1300px) and (max-width: 1600px)');
    const mediaQueryLargeToMedium = window.matchMedia('(min-width: 1100px) and (max-width: 1300px)');
    const mediaQueryMedium = window.matchMedia('(min-width: 860px) and (max-width: 1100px)');
    const mediaQuerySmall = window.matchMedia('(min-width: 570px) and (max-width: 860px)');
    const mediaQuerySmallToSmaller = window.matchMedia("(min-width: 440px) and (max-width: 570px)")
    const mediaQuerySmallerToTiny = window.matchMedia('(min-width: 380px) and (max-width: 440px)');
    const mediaQueryTiny = window.matchMedia("(min-width: 341px) and (max-width: 380px)")
    const mediaQuerySmallest = window.matchMedia("(max-width: 341px)")
    const chartCanvas = document.getElementById('searchedCryptoGraph');

    if (mediaQueryLarge.matches) {
        Chart.defaults.font.size = 15;
        createChart(chartCanvas, 2, true);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    } 
    else if (mediaQueryLargeToMedium.matches) {
        Chart.defaults.font.size = 12;
        createChart(chartCanvas, 1.8, true);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    }
    else if (mediaQueryMedium.matches) {
        Chart.defaults.font.size = 10;
        createChart(chartCanvas, 1.6, true);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    } 
    else if (mediaQuerySmall.matches) {
        Chart.defaults.font.size = 7;
        createChart(chartCanvas, 1.4, true);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    } 
    else if (mediaQuerySmallerToTiny.matches) {
        Chart.defaults.font.size = 7;
        createChart(chartCanvas, 1.15, false);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    }
    else if (mediaQuerySmallToSmaller.matches) {
        Chart.defaults.font.size = 6;
        createChart(chartCanvas, 1.2, false);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        chanewChartrt.update();
    }
    else if (mediaQueryTiny.matches) {
        Chart.defaults.font.size = 6;
        createChart(chartCanvas, 1.15, false);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    }
    else if (mediaQuerySmallest.matches) {
        Chart.defaults.font.size = 6;
        createChart(chartCanvas, 1.1, false);
        newChart.data.datasets[0].data = cryptoClosingDataset;
        newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
        newChart.update();
    }
}


window.addEventListener('resize', responsiveFontsAndCharts);
document.addEventListener('fullscreenchange', responsiveFontsAndCharts);

function createChart(canvas, aspectRatio, willMaintain) {
    myChart = Chart.getChart(canvas);
    if (myChart) {
        myChart.destroy();
    }

    newChart = new Chart(canvas.getContext('2d'), {
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
            aspectRatio: aspectRatio,
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
            maintainAspectRatio: willMaintain
        }
    });

    newChart.data.datasets[0].data = cryptoClosingDataset;
    newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
    newChart.update();
}


let doesItMatch = () =>  {
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

returnToHomePageButton.on("click", () => {
    searchValue = "";
    $("#searchValue").val("");
    submitButton.removeAttr("disabled");
    switchToHomePage();
    newChart.data.datasets[0].data = [];
    newChart.update();
    CurrentWatchListCryptoNames = $(".itemName");
    for (let i = 0; i < cryptoNewsArticles.children().length; i++) {
        cryptoNewsArticles.children().eq(i).empty();
        for (let j = 0; i < cryptoNewsArticles.children().eq(i).length; i++) {
            cryptoNewsArticles.children().eq(i).children().eq(j).remove(); // this removes the already emptied child elements inside the NewsArticle div
        }
    }
    noArticles.removeClass("hidden");
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
    responsiveFontsAndCharts();
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

                    cryptoNewsArticles.append(newArticle)
                    anyArticles++;
                }
            }
        
            if (anyArticles  == 0) { 
                noArticles.addClass("visible");
            }
            else if (anyArticles > 0) {
            }
            else {

            }
        }
    ) 
}

function createSearchedCryptoGraph () {
    let requestURL = "https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:" + cryptoSymbolForSearchedGraph + "USDT&resolution=D&from=1572651390&to=1575243390&token=clm4ptpr01qske4so43gclm4ptpr01qske4so440"
    let tetherURL = "https://finnhub.io/api/v1/crypto/candle?symbol=COINBASE:USDT-USD&resolution=D&from=1572651390&to=1575243390&token=clm4ptpr01qske4so43gclm4ptpr01qske4so440"
    if (cryptoName == "Tether" || cryptoName == "tether") { //this function is working and populates the graph whenever tetherURL does not return null, open the link and I'll see that it occassionally returns null for no reason
        fetch(tetherURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            newChart.data.datasets[0].data = [];
            newChart.update();
            let closingData = data.c;
            cryptoClosingDataset = [];
            for (let i = 0; i < closingData.length; i ++) {
                cryptoClosingDataset.push(closingData[i]);
            }
            console.log(cryptoClosingDataset);
            newChart.data.datasets[0].data = cryptoClosingDataset;
            newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
            newChart.update();
        })
    }
    else {
        console.log(requestURL);
        fetch(requestURL)
        .then (function (response) {
            console.log(response);
            return response.json();
        })
        .then (function (data) {
            console.log("Hello running here");
            console.log(data);
            //chart.data.datasets[0].data = [];
            newChart.data.datasets[0].data = [];
            //chart.update();
            newChart.update();
            let closingData = data.c;
            console.log(closingData);
            if (closingData != null) {
                cryptoClosingDataset = [];
                for (let i = 0; i < closingData.length; i ++) {
                    cryptoClosingDataset.push(closingData[i]);
                }
                console.log(cryptoClosingDataset);
                chart.data.datasets[0].data = cryptoClosingDataset;
                chart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
                newChart.options.plugins.title.text = cryptoName + "'s 2023 Performance";
                //chart.update();
                newChart.update();
            }
            else {
                newChart.data.datasets[0].data = [];
                newChart.options.plugins.title.text = "No Available Graph";
                //chart.update();
                newChart.options.plugins.title.text = "No Available Graph";
            }
        })
    }
}

newsLetterSubmitButton.on("click", function (event) {
    event.preventDefault();
    let name = submittedNameForNewsLetter.val().trim();;
    let email = submittedEmailForNewsLetter.val().trim();
    if (email != "" && name != "") {
        location.reload(true);
    }
})
