"use strict";

// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// Refactoring the code with Class
class App {
  // Private instance properties
  #map;
  #mapEvent;

  constructor() {
    // By calling this getPosition, the constructor is also executed imediately as the page loads
    this._getPosition();

    // Attach the form submit so it will immediately run as the page loads
    // When user press enter to submit data to the form
    form.addEventListener("submit", this._newWorkout.bind(this));

    // Handle toggle between cycling and running
    // We don't need to bind with "this", because it still point to the select option
    inputType.addEventListener("change", this._toggleElevationField);
  }

  // Getting Position
  _getPosition() {
    // Getting the user current location
    if (navigator.geolocation) {
      // If the user allow the location prompt
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        // if user block the location prompt
        function (error) {
          console.error(error.message);
        }
      );
    }
  }

  // Load the map and take position as parameter
  _loadMap(position) {
    // Getting the latitude and longitude
    const { latitude, longitude } = position.coords;

    // Initialize the map object from Leaflet and set its view to choosen geo coordinates
    const currentCoords = [latitude, longitude];

    // Display map
    this.#map = L.map("map").setView(currentCoords, 15);

    // Adding tile layer (OpenStreetMap tile layer)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);

    // Displaying a map marker when user click the map
    // Using the map variable then attach the event listener from the leaflet library
    this.#map.on("click", this._showForm.bind(this));
  }

  // Display the workout form
  _showForm(eventMap) {
    // Remove the hidden class in workout form
    this.#mapEvent = eventMap;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  // Toggle the elevation field
  _toggleElevationField() {
    // Remember! Here select the closest parent from the elevation input
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  // New workout
  _newWorkout(e) {
    e.preventDefault();

    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = "";

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          classname: "running-popup",
        })
      )
      .setPopupContent("I'm here")
      .openPopup();
  }
}

const app = new App();
