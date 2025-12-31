// index.js
//const weatherApi = "https://api.weather.gov/alerts/active?area="//

// Your code here!

// Step 1: Fetch weather alerts from the National Weather Service API
async function fetchWeatherAlerts(state) {
  const url = `https://api.weather.gov/alerts/active?area=${state}`;
  
  try {
    const response = await fetch(url);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts. Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.log('Error:', error.message);
    throw error;
  }
}

// Step 2: Display the alerts on the page
function displayAlerts(data) {
  // Get the features array (alerts)
  const alerts = data.features || [];
  const alertCount = alerts.length;
  const title = data.title || 'Weather Alerts';
  
  // Create summary message using title from API
  const summaryMessage = `${title}: ${alertCount}`;
  
  // Get the alerts display element
  const alertsDisplay = document.getElementById('alerts-display');
  
  // Clear previous content
  alertsDisplay.innerHTML = '';
  
  // Add summary
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'summary';
  summaryDiv.textContent = summaryMessage;
  alertsDisplay.appendChild(summaryDiv);
  
  // Check if there are any alerts
  if (alertCount === 0) {
    const noAlertsMessage = document.createElement('p');
    noAlertsMessage.textContent = 'No active alerts for this state.';
    noAlertsMessage.className = 'no-alerts';
    alertsDisplay.appendChild(noAlertsMessage);
  } else {
    // Create a list for alert headlines
    const alertList = document.createElement('ul');
    alertList.className = 'alert-list';
    
    // Loop through each alert adding its headline to the list
    alerts.forEach(alert => {
      const headline = alert.properties?.headline || 'No headline available';
      
      const listItem = document.createElement('li');
      listItem.className = 'alert-item';
      listItem.textContent = headline;
      
      alertList.appendChild(listItem);
    });
    
    alertsDisplay.appendChild(alertList);
  }
}

// Step 4: Display error messages
function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  errorMessage.classList.add('show');
}

// Hide error messages
function hideError() {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
  errorMessage.classList.remove('show');
}

// Step 3: Clear and reset the UI
function clearUI() {
  const alertsDisplay = document.getElementById('alerts-display');
  alertsDisplay.innerHTML = '';
  hideError();
}

// Main handler function
async function handleFetchAlerts() {
  const stateInput = document.getElementById('state-input');
  const alertsDisplay = document.getElementById('alerts-display');
  
  try {
    // Get input value
    const state = stateInput.value.trim().toUpperCase();
    
    // Clear previous UI state (including errors)
    clearUI();
    
    // Optional: Show loading indicator
    alertsDisplay.innerHTML = '<p class="loading">Loading alerts...</p>';
    
    // Fetch alerts
    const data = await fetchWeatherAlerts(state);
    
    // Display alerts
    displayAlerts(data);
    
    // Step 3: Clear the input field
    stateInput.value = '';
    
  } catch (error) {
    // Step 4: Handle errors - display error message
    alertsDisplay.innerHTML = '';
    showError(error.message);
  }
}

// Initialize event listeners after DOM is loaded
function init() {
  const stateInput = document.getElementById('state-input');
  const fetchButton = document.getElementById('fetch-alerts');
  
  // Event listener for the fetch button
  fetchButton.addEventListener('click', handleFetchAlerts);
  
  // Optional: Allow Enter key to submit
  stateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleFetchAlerts();
    }
  });
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}