"use strict";

// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Define a Workout Class as a Parent
class Workout {
  date = new Date();
  // Create ID for each instance object
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    // [latitude, longitude]
    this.coords = coords;
    // In Kilometers
    this.distance = distance;
    // In Minutes
    this.duration = duration;
  }
}

// Define the Running Class
class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    // It's fine to call a method inside this constructor
    this.calculatePace();
  }

  // Calculate Pace to define its Pace in hour/kilometer
  calculatePace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

// Define the Cycling Class
class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;

    // Call calculate Speed
    this.calculateSpeed();
  }

  // Calculate Speed to define its Speed in kilometer/hour
  calculateSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
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
  #workouts = [];

  constructor() {
    // By calling this getPosition, the constructor is also executed imediately as the page loads
    this._getPosition();
    // Remember to call this to reset the Form!
    this._resetFrom();

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

  // Reset form
  _resetFrom() {
    form.reset();
  }

  // Toggle the elevation field
  _toggleElevationField() {
    // Remember! Here select the closest parent from the elevation input
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  // New workout
  _newWorkout(e) {
    // Helper function
    // Check if all of them are positive
    const validInputs = (...inputNumber) => {
      return inputNumber.every((input) => Number.isFinite(input));
    };

    // Check if the number is positive value
    const positiveNumber = (...inputNumber) => {
      return inputNumber.every((input) => input > 0);
    };

    e.preventDefault();

    // Get user data from input form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create a running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      // Check input data is valid
      // Using the guard clause, check for the opposite.
      // If opposite is true, then return that value
      if (!validInputs(distance, duration, cadence) || !positiveNumber(distance, duration, cadence)) {
        return alert("Running - Input have to be positive number!");
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create a cycling object
    if (type === "cycling") {
      const elevationGain = +inputElevation.value;
      if (!validInputs(distance, duration, elevationGain) || !positiveNumber(distance, duration)) return alert("Cycling - Input have to be positive number!");

      workout = new Cycling([lat, lng], distance, duration, elevationGain);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Render workout as a marker
    this.renderWorkoutMarker(workout);

    // Render workout on list

    // Hide form + clear input list
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = "";
  }

  renderWorkoutMarker(workout) {
    // Render workout on map as marker
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type}`)
      .openPopup();
  }
}

const app = new App();
