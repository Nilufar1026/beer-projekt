"use strict";

let getData = async requestedData => {
  let request = await fetch(requestedData)
  let data  = await request.json()
  return data
}

let writeDataInDOM = (position, item) => {
  let data = document.createElement("div");
  data.innerHTML = item
  position.append(data)
}

let writePlanet = async (planet) => {
  let planetDOM = document.querySelector("div.planet > div.planet-content")
  planetDOM.innerHTML = ""

  document.querySelector("div.planet > div.loading").classList.toggle("hide")
  let planetData = await getData(planet)
  document.querySelector("div.planet > div.loading").classList.toggle("hide")

  writeDataInDOM(planetDOM, "Planet name: " + planetData.name)
  writeDataInDOM(planetDOM, "Rotation period: " + planetData.rotation_period)
  writeDataInDOM(planetDOM, "Orbital period: " + planetData.orbital_period)
  writeDataInDOM(planetDOM, "Diameter: " + planetData.diameter)
  writeDataInDOM(planetDOM, "Climate: " + planetData.climate)
  writeDataInDOM(planetDOM, "Gravity: " + planetData.gravity)
  writeDataInDOM(planetDOM, "Terrain: " + planetData.terrain)
}

let writeCharacter = character => {
  let detailsDOM = document.querySelector("div.character > div.character-content")
  detailsDOM.innerHTML = ""

  document.querySelector("div.character > div.loading").classList.toggle("hide");
  document.querySelector("div.character > div.loading").classList.toggle("hide");

  writeDataInDOM(detailsDOM, character.name)
  writeDataInDOM(detailsDOM, "Height: " + character.height + " cm")
  writeDataInDOM(detailsDOM, "Mass: " + character.mass + " kg")
  writeDataInDOM(detailsDOM, "Hair colour: " + character.hair_color)
  writeDataInDOM(detailsDOM, "Skin colour: " + character.skin_color)
  writeDataInDOM(detailsDOM, "Eye colour: " + character.eye_color)
  writeDataInDOM(detailsDOM, "Birth year: " + character.birth_year)
  writeDataInDOM(detailsDOM, "Gender " + character.gender)
}

let renderCharacterList = async currentPage => {
  let charactersDOM = document.querySelector("div.characters-names > div.characters-names-content")
  charactersDOM.innerHTML = ""

  document.querySelector(".page-number").innerHTML = currentPage + "/9"

  document.querySelector("div.characters-names > div.loading").classList.toggle("hide");
  let data = await getData("https://swapi.dev/api/people/?page=" + currentPage)
  document.querySelector("div.characters-names > div.loading").classList.toggle("hide");

  for (let i = 0; i < data.results.length; i++) {
    let btn = document.createElement("button");
    btn.innerHTML = data.results[i].name
    btn.classList.add("char-box");
    charactersDOM.append(btn)
  
    btn.addEventListener("click", function() {
      writeCharacter(data.results[i])
      writePlanet(data.results[i].homeworld)
    });
  }
}

let main = () => {
  let currentPage = 1

  document.querySelector("button.arrowLeft").addEventListener("click", function() {
    currentPage = (currentPage == 1) ? 9 : currentPage -= 1
    renderCharacterList(currentPage)
  });
  
  document.querySelector("button.arrowRight").addEventListener("click", function() {
    currentPage = (currentPage == 9) ? 1 : currentPage += 1
    renderCharacterList(currentPage)
  });

  renderCharacterList(currentPage)

}

main();