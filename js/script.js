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

// Getting the user current location
if (navigator.geolocation) {
  // If the user allow the location prompt
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Getting the latitude and longitude
      const { latitude, longitude } = position.coords;

      // Initialize the map object from Leaflet and set its view to choosen geo coordinates
      const currentCoords = [latitude, longitude];
      const map = L.map("map").setView(currentCoords, 17);

      // Adding tile layer (OpenStreetMap tile layer)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Displaying a map marker when user click the map
      // Using the map variable then attach the event listener from the leaflet library
      map.on("click", function (mapEvent) {
        const { lat, lng } = mapEvent.latlng;

        // Use the clicked position to get the current latitude & longitude
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: "running-popup",
            })
          )
          .setPopupContent("I'm here!")
          .openPopup();
      });
    },
    // if user block the location prompt
    function (error) {
      console.error(error.message);
    }
  );
}
