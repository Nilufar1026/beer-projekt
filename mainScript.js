"use strict";

let getData = async requestedData => {
  let request = await fetch(requestedData)
  let data  = await request.json()
  return data
}

let writeDataInDOM = (requestedElement, str) => {
  let element = document.querySelector(requestedElement);
  element.innerHTML = str
}

let randomBeer = async () => {
  let beerData = await getData("https://api.punkapi.com/v2/beers/random")
  document.querySelector(".beer-name").innerHTML = beerData[0].name
  
  if (beerData[0].image_url == null) {
    let img = document.querySelector(".beer-img")
    img.src = "/img/beerBottleSmall.PNG"
  }
  else {
    let img = document.querySelector(".beer-img")
    img.src = beerData[0].image_url
  }

  document.querySelector(".description").innerHTML = beerData[0].description
  beerInfoPage(beerData[0])
}

let beerInfoPage = beer => {
  let ingredients = []
  for (let i = 0; i < beer.ingredients.malt.length; i++) {
    ingredients.push(beer.ingredients.malt[i].name)
  }

  let hops = []
  for (let j = 0; j < beer.ingredients.hops.length; j++) {
    hops.push(beer.ingredients.hops[j].name)
  }

  writeDataInDOM(".beer-name-info",beer.name)
  writeDataInDOM(".description", `Description:${beer.description}`)
  writeDataInDOM(".alcohol-by-volume", `Beer alcohol by volume: ${beer.abv}`)
  writeDataInDOM(".volume", `Beer volume: ${beer.volume.value} ${beer.volume.unit}`)
  writeDataInDOM(".ingredients", `Ingredients: ${ingredients}`)
  writeDataInDOM(".hops", `Beer hops: ${hops}`)
  writeDataInDOM(".food-pairing", `Beer food pairing: ${beer.food_pairing}`)
  writeDataInDOM(".brewers-tips", `Beer brewers tips: ${beer.brewers_tips}`)

  if (beer.image_url == null) {
    let img = document.querySelector(".beer-img-info")
    img.src = "/img/beerBottleSmall.PNG"
  }
  else {
    let img = document.querySelector(".beer-img-info")
    img.src = beer.image_url
  }

}

let beerSearch = async page => {
  let value = document.querySelector("input.search-beer-input").value.toLowerCase()
  value = value.replace(/\s/g, '_')

  if (value.length > 2) {
    let beers = await getData("https://api.punkapi.com/v2/beers?beer_name=" + value + "&page=" + page + "&per_page=10")

    console.log("Length: " + beers.length + " Page: " + page)

    if (beers.length == 0) {
      page--
      beerSearch(page)
    }

    //let beerHops = await getData("https://api.punkapi.com/v2/beers?hops=" + value)
    //let beerMalt = await getData("https://api.punkapi.com/v2/beers?malt=" + value)
    //let brewedBefore = await getData("https://api.punkapi.com/v2/beers?brewed_before=" + value)
    //let brewedAfter = await getData("https://api.punkapi.com/v2/beers?brewed_after=" + value)
  
    let list = document.querySelector(".beer-list")
    list.innerHTML = '';

    for (let i = 0; i < beers.length; i++) {
      let number = (page == 1) ? i + 1 : page * 10 + i - 9

      let listItem = document.createElement("li")
      listItem.innerHTML = number + ". " + beers[i].name

      listItem.addEventListener("click", function() {
        beerInfoPage(beers[i])
      });

      list.append(listItem)
    }
  }
}

let main = () => {
  document.querySelector(".random-beer").addEventListener("click", function() {
    randomBeer()
  });

  let page = 1
  document.querySelector("input").oninput = function(event) {
    let list = document.querySelector(".beer-list")
    list.innerHTML = '';
    page = 1
    beerSearch(page)
  };

  document.querySelector(".button-minus").addEventListener("click", function() {
    page = (page > 1) ? page -= 1 : 1
    beerSearch(page)
  });

  document.querySelector(".button-plus").addEventListener("click", function() {
    page++
    beerSearch(page)
  });
  
  randomBeer()
}

main();