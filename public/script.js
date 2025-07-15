
// --- Passenger Dropdown Logic ---
const counts = {
  adult: 1,
  youth: 0,
  child: 0,
  infant: 0
};

function toggleDropdown() {
  const menu = document.getElementById("passenger-content");
  menu.classList.toggle('show');
}



function increase(type) {
  counts[type]++;
  updateDisplay(type);
}

function decrease(type) {
  if (type === 'adult' && counts.adult > 1) counts.adult--;
  else if (type !== 'adult' && counts[type] > 0) counts[type]--;
  updateDisplay(type);
}

function updateDisplay(type) {
  document.getElementById(`${type}-count`).textContent = counts[type];
  updateButtonText();
}

function updateButtonText() {
  const total = counts.adult + counts.youth + counts.child + counts.infant;
  const span = document.getElementById('passenger-count');
  if (span) {
    span.textContent = `${total}`;
  }
}
//closing the passenger's dropdown by clicking on close or outside of the menu
function closeDropdown() {
  document.getElementById("passenger-content").classList.remove('show');
}

document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('passenger-content');
  const button = document.querySelector('.passengers-dropdown .top-btn');

  if (!dropdown.contains(e.target) && !button.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});


updateButtonText();

// --- Transportation Type Dropdown Logic ---
function toggleTransportDropdown() {
  const dropdown = document.getElementById('transport-options');
  dropdown.classList.toggle('active');
}

function selectTransportation(type) {
  console.log("Selected transport:", type);

  document.querySelectorAll('.circle').forEach(c => c.classList.remove('selected'));

  const id = `circle-${type.toLowerCase()}`;
  const selected = document.getElementById(id);
  if (selected) selected.classList.add('selected');
}

// --- Close Transport Dropdown ---
document.addEventListener('DOMContentLoaded', () => {
  const transportDropdown = document.getElementById('transport-options');
  const transportWrapper = document.querySelector('.transportation-type');
  const closeBtn = document.getElementById('close-transport-btn');
  //default value
  selectTransportation('Cars');
  document.addEventListener('click', (event) => {
    const clickedInside = transportWrapper.contains(event.target);
    if (transportDropdown.classList.contains('active') && !clickedInside) {
      transportDropdown.classList.remove('active');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      transportDropdown.classList.remove('active');
    });
  }
});

// --- Sidebar Toggle ---
const sidebar = document.querySelector('.sidebar');
const sidebarBtn = document.querySelector('.sidebarbtn');

sidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  document.body.classList.toggle('sidebar-open');
});

document.querySelector('.offersbtn').addEventListener('click', () => {
  window.open("offers-page.html");
});

document.querySelector('.helpbtn').addEventListener('click', () => {
  window.location.href = "help-page.html";
});

// --- Trip Type Dropdown ---
function toggleTripDropdown() {
  const tripDropdown = document.getElementById("triptype");
  tripDropdown.classList.toggle("show");
}

function closeTripDropdown() {
  const tripDropdown = document.getElementById("triptype");
  tripDropdown.classList.remove("show");
}



document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('triptype');
  const toggleBtn = document.querySelector('[onclick="toggleTripDropdown()"]');

  const clickedOutsideDropdown = !dropdown.contains(event.target);
  const clickedOutsideButton = !toggleBtn.contains(event.target);

  if (dropdown.classList.contains('show') && clickedOutsideDropdown && clickedOutsideButton) {
    closeTripDropdown();
  }
});
function toggleTripDropdown() {
  const dropdown = document.getElementById('triptype');
  dropdown.classList.toggle('show');
}

function closeTripDropdown() {
  const dropdown = document.getElementById('triptype');
  dropdown.classList.remove('show');
}

// Close trip dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('triptype');
  const toggleButton = document.querySelector('[onclick="toggleTripDropdown()"]');

  if (
    dropdown.classList.contains('show') &&
    !dropdown.contains(event.target) &&
    (!toggleButton || !toggleButton.contains(event.target))
  ) {
    closeTripDropdown();
  }
});


// --- Litepicker Setup ---
let picker;

function initLitepicker(isOneWay) {
  if (picker) picker.destroy();

  picker = new Litepicker({
    element: document.getElementById('Departure-date'),
    format: 'YYYY-MM-DD',
    numberOfMonths: 2,
    numberOfColumns: 2,
    dropdownPosition: 'bottom',
    selectForward: true,
    autoApply: true,
    minDate: new Date(),
    singleMode: isOneWay,
    ...(isOneWay ? {} : { elementEnd: document.getElementById('Return-date') })
  });
}

function selectTrip(type) {
  document.getElementById('trip-button').innerText = type;

  document.getElementById('circle-oneway').classList.remove('selected');
  document.getElementById('circle-roundtrip').classList.remove('selected');

  const departureInput = document.getElementById('Departure-date');
  const returnInput = document.getElementById('Return-date');

  if (type === 'One-way') {
    document.getElementById('circle-oneway').classList.add('selected');
    returnInput.style.display = 'none';
    departureInput.classList.add('full-width');
    initLitepicker(true);
  } else {
    document.getElementById('circle-roundtrip').classList.add('selected');
    returnInput.style.display = 'inline-block';
    departureInput.classList.remove('full-width');
    initLitepicker(false);
  }
}

  window.addEventListener('DOMContentLoaded', () => {
    initLitepicker(false); // Default: round-trip
    document.getElementById('circle-roundtrip').classList.add('selected');
    document.getElementById('trip-button').innerText = 'Round-trip'; 
  });
  
// --- Google Places Autocomplete ---
function initAutocomplete() {
  const departureInput = document.getElementById('departure');
  const destinationInput = document.getElementById('destination');

  new google.maps.places.Autocomplete(departureInput, {
    types: ['(cities)']
  });

  new google.maps.places.Autocomplete(destinationInput, {
    types: ['(cities)']
  });
}

// --- MAP INPUT LOGIC  ---
let markers = {};
let mapInstances = {};
let geocoder = null;

function enableMapInput(type) {
  const mapDiv = document.getElementById(`map-${type}`);
  const input = document.getElementById(type);
  const isVisible = mapDiv.style.display === 'block';

  mapDiv.style.display = isVisible ? 'none' : 'block';
  if (isVisible) return;

  if (!window.google || !google.maps) return;
  if (!geocoder) geocoder = new google.maps.Geocoder();

  if (!mapInstances[type]) {
    const map = new google.maps.Map(mapDiv, {
      center: { lat: 43.6532, lng: -79.3832 }, // Default to Toronto
      zoom: 10,
    });

    const marker = new google.maps.Marker({ map, draggable: false });

    mapInstances[type] = map;
    markers[type] = marker;

    // --- Click on map: reverse geocode to input ---
    map.addListener('click', (event) => {
      const latLng = event.latLng;
      marker.setPosition(latLng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const components = results[0].address_components;
          let city = '';
          let region = '';
          for (const component of components) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              region = component.short_name;
            }
          }

          // Fallbacks
          if (!city) {
            for (const component of components) {
              if (
                component.types.includes('sublocality') ||
                component.types.includes('postal_town') ||
                component.types.includes('administrative_area_level_2') ||
                component.types.includes('neighborhood')
              ) {
                city = component.long_name;
                break;
              }
            }
          }

          const valueToSet = city
            ? `${city}${region ? ', ' + region : ''}`
            : results[0].formatted_address;

          input.value = valueToSet;
          console.log(`Set input ${type}: ${valueToSet}`);
        } else {
          input.value = '';
        }
      });
    });

    // --- Autocomplete logic ---
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['(cities)'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        map.setCenter(location);
        map.setZoom(12);
        marker.setPosition(location);
      }
    });
  }

  setTimeout(() => {
    google.maps.event.trigger(mapInstances[type], 'resize');
  }, 100);
}
// --- Distance Estimator ---
function getEstimatedDistance(from, to, callback) {
  if (!from || !to) {
    callback(0);
    return;
  }

  const service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
    {
      origins: [from],
      destinations: [to],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    },
    (response, status) => {
      if (status === 'OK') {
        const element = response.rows[0].elements[0];
        if (element.status === 'OK') {
          const distanceInKm = element.distance.value / 1000; // in meters → km
          callback(Math.round(distanceInKm));
        } else {
          console.error('Element error:', element.status);
          callback(0);
        }
      } else {
        console.error('Distance Matrix error:', status);
        callback(0);
      }
    }
  );
}


document.getElementById('search-btn').addEventListener('click', function (e) {
  e.preventDefault();

  let hasError = false;

  // Clear previous errors
  ['departure', 'destination'].forEach(id => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(`${id}-error`).style.display = 'none';
  });

  // Get values
  const departure = document.getElementById('departure').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const departureDate = document.getElementById('Departure-date').value.trim();
  const returnDate = document.getElementById('Return-date').value.trim();
  const tripType = document.getElementById('trip-button').innerText;

  // Validate departure
  if (!departure) {
    const input = document.getElementById('departure');
    input.classList.add('error');
    document.getElementById('departure-error').style.display = 'block';
    hasError = true;
  }

  // Validate destination
  if (!destination) {
    const input = document.getElementById('destination');
    input.classList.add('error');
    document.getElementById('destination-error').style.display = 'block';
    hasError = true;
  }

  const dateError = document.getElementById('dates-error');
  dateError.style.display = 'none';
  dateError.textContent = '';
  
  if ((tripType === 'One-way' && !departureDate) ||
      (tripType === 'Round-trip' && (!departureDate || !returnDate))) {
    
    if (tripType === 'Round-trip' && !departureDate && !returnDate) {
      dateError.textContent = "Please enter both departure and return dates.";
    } else if (!departureDate) {
      dateError.textContent = "Please enter a departure date.";
    } else if (tripType === 'Round-trip' && !returnDate) {
      dateError.textContent = "Please enter a return date.";
    }
  
    dateError.style.display = 'block';
    hasError = true;
  }
  
  if (hasError) return;
  

  const transportTypes = ['Motorbikes', 'Vans', 'Cars', 'Trains', 'Buses'];
  let selectedTransport = '';
  transportTypes.forEach(type => {
    const el = document.getElementById(`circle-${type.toLowerCase()}`);
    if (el && el.classList.contains('selected')) selectedTransport = type;
  });

  getEstimatedDistance(departure, destination, function (distance) {
    if (distance === 0) return alert("Could not calculate distance.");

    const basePrices = {
      Motorbikes: 0.6,
      Vans: 0.8,
      Cars: 0.7,
      Trains: 0.4,
      Buses: 0.2
    };

    const passengerMultipliers = {
      adult: 2,
      youth: 1,
      child: 0.5,
      infant: 0.3
    };

    let totalPrice = 0;
    let breakdown = '';

    Object.keys(counts).forEach(type => {
      const multiplier = passengerMultipliers[type];
      const count = counts[type];
      const price = distance * basePrices[selectedTransport] * multiplier * count;
      totalPrice += price;
      if (count > 0) {
        breakdown += `<p>${type.charAt(0).toUpperCase() + type.slice(1)} x${count}: $${price.toFixed(2)}</p>`;
      }
    });

    if (tripType === 'Round-trip') {
      totalPrice *= 2;
      totalPrice *= 0.9; // 10% discount
    }

    breakdown += `<hr><strong>Total Price: $${totalPrice.toFixed(2)}</strong>`;

    document.getElementById('summary-details').innerHTML = `
      <h2>Trip Summary</h2>
      <p><strong>From:</strong> ${departure}</p>
      <p><strong>To:</strong> ${destination}</p>
      <p><strong>Distance:</strong> ${distance} km</p>
      <p><strong>Transport:</strong> ${selectedTransport}</p>
      <p><strong>Trip Type:</strong> ${tripType}</p>
      ${breakdown}
      <div class="summary-button-wrapper">
        <button class="summary-back-btn" id="summary-back-btn">← Back</button>
        <button id="summary-continue-btn">Continue</button>
      </div>
    `;

    document.querySelector('.main-content').style.display = 'none';
    document.getElementById('summary-card').style.display = 'block';

    document.getElementById('summary-back-btn').addEventListener('click', () => {
      document.getElementById('summary-card').style.display = 'none';
      document.querySelector('.main-content').style.display = 'block';
    });

    document.getElementById('summary-continue-btn').addEventListener('click', () => {
      document.getElementById('summary-card').style.display = 'none';
      document.getElementById('confirmation-card').style.display = 'block';
    });
  });
});

document.getElementById('confirm-back-btn').addEventListener('click', () => {
  document.getElementById('confirmation-card').style.display = 'none';
  document.getElementById('summary-card').style.display = 'block';
});

document.getElementById('confirm-final-btn').addEventListener('click', () => {
  // Show confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Show the success message
  const message = document.getElementById('success-message');
  message.classList.add('show');

  // Hide it after 3 seconds (optional)
  setTimeout(() => {
    message.classList.remove('show');
  }, 3000);
});

