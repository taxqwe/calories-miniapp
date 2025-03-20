(function() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('debug') === 'true';
    const lang = urlParams.get('lang') || 'en'; // Default to English
    
    // Get chatId from Telegram WebApp if available
    let chatId = undefined;
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        if (isDebugMode) {
            console.log('WebApp data:', {
                initDataUnsafe: webApp.initDataUnsafe,
                user: webApp.initDataUnsafe?.user,
                initData: webApp.initData
            });
        }
        
        // Try to get chatId from initData
        try {
            const initData = webApp.initData ? JSON.parse(webApp.initData) : null;
            if (initData && initData.user && typeof initData.user.id === 'number' && initData.user.id > 0) {
                chatId = initData.user.id;
                if (isDebugMode) {
                    console.log('Received chatId from initData:', chatId);
                }
            }
        } catch (e) {
            if (isDebugMode) {
                console.warn('Error parsing initData:', e);
            }
        }
        
        // If not successful from initData, try from initDataUnsafe
        if (!chatId && webApp.initDataUnsafe && webApp.initDataUnsafe.user && 
            typeof webApp.initDataUnsafe.user.id === 'number' && webApp.initDataUnsafe.user.id > 0) {
            chatId = webApp.initDataUnsafe.user.id;
            if (isDebugMode) {
                console.log('Received chatId from initDataUnsafe:', chatId);
            }
        }
    }

    if (isDebugMode) {
        console.log('Final chatId:', chatId);
    }
    
    // Objects with translations
    const translations = {
        en: {
            activityLevels: [
                {
                    title: "Sedentary lifestyle (no exercise)",
                    description: "You have a desk job or spend most of your time sitting with minimal physical activity."
                },
                {
                    title: "Light activity (1-2 workouts per week)",
                    description: "You occasionally exercise or take light walks, but most of your time is spent with little physical exertion."
                },
                {
                    title: "Moderate activity (3-5 workouts per week)",
                    description: "You exercise several times a week, maintaining good physical condition."
                },
                {
                    title: "Active lifestyle (6-7 workouts per week)",
                    description: "You exercise almost daily, have an active job, or engage in intense training."
                },
                {
                    title: "Very active (professional athlete level)",
                    description: "You have intensive physical training twice a day, work in physically demanding professions, or are a competitive athlete."
                }
            ],
            resultTitle: "Your BMR and Calorie Requirements",
            bmrResult: "Your Basal Metabolic Rate (BMR):",
            dailyCaloriesResult: "Your daily calorie needs with activity:",
            kcal: "kcal",
            sendingData: "Sending data...",
            dataReceived: "Data received!",
            errorSending: "Error sending data",
            invalidHeight: "Please enter a valid height (100-250 cm)",
            invalidWeight: "Please enter a valid weight (30-300 kg)",
            invalidAge: "Please enter a valid age (18-100 years)",
            inputHeight: "Height",
            inputWeight: "Weight",
            inputAge: "Age",
            inputGender: "Gender",
            male: "Male",
            female: "Female",
            close: "Close",
            inputActivityLevel: "Activity level",
            calculate: "Calculate and Send"
        }
    };
    
    // Get current translation based on language
    const t = translations[lang] || translations.en;
    
    // DOM element references
    const form = document.getElementById('bmr-form');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const ageInput = document.getElementById('age');
    const activityRangeInput = document.getElementById('activityRange');
    const activityDescriptionContainer = document.getElementById('activityDescription');
    const male = document.getElementById('gender-male');
    const female = document.getElementById('gender-female');
    const resultDiv = document.getElementById('result');
    
    // Default values for activity levels
    const activityLevels = t.activityLevels;
    
    // Activity multipliers corresponding to each level
    const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    
    // Update activity description based on current slider value
    const updateActivityDescription = () => {
        const level = parseInt(activityRangeInput.value, 10);
        const selectedActivity = activityLevels[level - 1];
        
        const levelElem = activityDescriptionContainer.querySelector('.activity-level');
        const detailsElem = activityDescriptionContainer.querySelector('.activity-details');
        
        levelElem.textContent = selectedActivity.title;
        detailsElem.textContent = selectedActivity.description;
    };
    
    // Function to validate inputs
    const validateInputs = (height, weight, age) => {
        let isValid = true;
        
        // Reset validation errors
        clearValidationError(heightInput);
        clearValidationError(weightInput);
        clearValidationError(ageInput);
        
        // Validate height (100cm - 250cm)
        if (!height || height < 100 || height > 250) {
            showValidationError(heightInput, t.invalidHeight);
            isValid = false;
        }
        
        // Validate weight (30kg - 300kg)
        if (!weight || weight < 30 || weight > 300) {
            showValidationError(weightInput, t.invalidWeight);
            isValid = false;
        }
        
        // Validate age (18 - 100)
        if (!age || age < 18 || age > 100) {
            showValidationError(ageInput, t.invalidAge);
            isValid = false;
        }
        
        return isValid;
    };
    
    // Create log container for debug messages
    const createLogContainer = () => {
        if (document.getElementById('debug-log')) return;
        
        const logDiv = document.createElement('div');
        logDiv.id = 'debug-log';
        logDiv.className = 'debug-info';
        document.querySelector('.container').appendChild(logDiv);
        
        return logDiv;
    };
    
    // Log message to page (for debug mode)
    const logToPage = (message, type = 'info') => {
        if (!isDebugMode) return;
        
        const logContainer = document.getElementById('debug-log') || createLogContainer();
        const logEntry = document.createElement('p');
        
        let prefix = '';
        switch(type) {
            case 'error':
                prefix = '🔴 ERROR: ';
                logEntry.style.color = '#ff4d4d';
                break;
            case 'warning':
                prefix = '🟠 WARNING: ';
                logEntry.style.color = '#ffcc00';
                break;
            case 'success':
                prefix = '🟢 SUCCESS: ';
                logEntry.style.color = '#66cc66';
                break;
            default:
                prefix = '🔵 INFO: ';
        }
        
        // For objects, format them as JSON
        if (typeof message === 'object') {
            try {
                const formattedJson = JSON.stringify(message, null, 2);
                logEntry.textContent = prefix + formattedJson;
            } catch (e) {
                logEntry.textContent = prefix + 'Object couldn\'t be stringified';
            }
        } else {
            logEntry.textContent = prefix + message;
        }
        
        logContainer.appendChild(logEntry);
        logContainer.style.display = 'block';
        
        // Auto-scroll to bottom of the log
        logContainer.scrollTop = logContainer.scrollHeight;
    };
    
    // Show validation error for input field
    const showValidationError = (field, message) => {
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.style.borderColor = '#ff4d4d';
    };
    
    // Clear validation error
    const clearValidationError = (field) => {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    };
    
    // Set up validation for input fields
    const setupValidation = () => {
        // Validate height
        heightInput.addEventListener('input', () => {
            const height = parseFloat(heightInput.value);
            if (height && (height < 100 || height > 250)) {
                showValidationError(heightInput, t.invalidHeight);
            } else {
                clearValidationError(heightInput);
            }
        });
        
        // Validate weight
        weightInput.addEventListener('input', () => {
            const weight = parseFloat(weightInput.value);
            if (weight && (weight < 30 || weight > 300)) {
                showValidationError(weightInput, t.invalidWeight);
            } else {
                clearValidationError(weightInput);
            }
        });
        
        // Validate age
        ageInput.addEventListener('input', () => {
            const age = parseInt(ageInput.value, 10);
            if (age && (age < 18 || age > 100)) {
                showValidationError(ageInput, t.invalidAge);
            } else {
                clearValidationError(ageInput);
            }
        });
    };
    
    // Calculate BMR using Mifflin-St Jeor formula
    const calculateBMR = (weight, height, age, gender) => {
        // Mifflin-St Jeor Equation
        // For men: BMR = 10W + 6.25H - 5A + 5
        // For women: BMR = 10W + 6.25H - 5A - 161
        
        if (gender === 'm' || gender === 'м') {
            return (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            return (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
    };
    
    // Set up input fields
    function setupInputFields() {
        // Set up activity slider
        activityRangeInput.addEventListener('input', updateActivityDescription);
        
        // Initial activity description update
        updateActivityDescription();
        
        // Set up validation
        setupValidation();
        
        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const height = parseFloat(heightInput.value);
            const weight = parseFloat(weightInput.value);
            const age = parseInt(ageInput.value, 10);
            
            // Get gender selection
            let gender = 'm'; // Default to male
            if (female.checked) {
                gender = 'f';
            }
            
            // Get activity level (1-5)
            const activityLevel = parseInt(activityRangeInput.value, 10);
            
            // Validate inputs
            if (!validateInputs(height, weight, age)) {
                return;
            }
            
            try {
                // Calculate BMR
                const bmr = Math.round(calculateBMR(weight, height, age, gender));
                
                // Calculate daily calorie needs with activity
                const activityMultiplier = activityMultipliers[activityLevel - 1];
                const dailyCalories = Math.round(bmr * activityMultiplier);
                
                // Display results
                displayResults(bmr, dailyCalories);
                
                // Send data to server
                await sendDataToServer(height, weight, age, gender, activityLevel, bmr, dailyCalories);
                
            } catch (error) {
                logToPage(`Error: ${error.message}`, 'error');
                alert(`An error occurred: ${error.message}`);
            }
        });
    }
    
    // Handle keyboard visibility for mobile devices
    function handleKeyboardVisibility() {
        const container = document.querySelector('.container');
        
        const inputs = [heightInput, weightInput, ageInput];
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Add class to container when keyboard is open
                container.classList.add('keyboard-open');
            });
            
            input.addEventListener('blur', () => {
                // Remove class when keyboard is closed
                container.classList.remove('keyboard-open');
            });
        });
    }
    
    // Display results in the result div
    function displayResults(bmr, dailyCalories) {
        resultDiv.innerHTML = `
            <h3>${t.resultTitle}</h3>
            <p><strong>${t.bmrResult}</strong> ${bmr} ${t.kcal}</p>
            <p><strong>${t.dailyCaloriesResult}</strong> ${dailyCalories} ${t.kcal}</p>
            <button type="button" class="close-button">${t.close}</button>
        `;
        
        resultDiv.classList.add('visible');
        
        // Add event listener to close button
        const closeButton = resultDiv.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                resultDiv.classList.remove('visible');
                // Reset form values
                form.reset();
                updateActivityDescription();
            });
        }
    }
    
    // Send data to server
    async function sendDataToServer(height, weight, age, gender, activityLevel, bmr, dailyCalories) {
        if (!chatId) {
            logToPage('No chatId available to send data', 'error');
            return;
        }
        
        // Create status element if it doesn't exist
        let statusElem = document.getElementById('sending-status');
        if (!statusElem) {
            statusElem = document.createElement('div');
            statusElem.id = 'sending-status';
            statusElem.className = 'sending-status';
            form.appendChild(statusElem);
        }
        
        statusElem.textContent = t.sendingData;
        
        try {
            // Get all available data from Telegram WebApp
            const webApp = window.Telegram.WebApp;
            const initData = webApp.initData;
            
            logToPage('Sending data to server...');
            logToPage({
                chatId,
                height,
                weight,
                age,
                gender,
                activityLevel,
                bmr,
                dailyCalories,
                initDataLength: initData?.length || 0
            });
            
            const response = await fetch('https://calories-bot.duckdns.org:8443/api/bmr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    chatId: chatId,
                    height: height,
                    weight: weight,
                    age: age,
                    gender: gender,
                    activityLevel: activityLevel,
                    bmr: bmr,
                    dailyCalories: dailyCalories,
                    initData: initData
                })
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            
            const responseData = await response.json();
            logToPage('Server response:', 'success');
            logToPage(responseData);
            
            statusElem.textContent = t.dataReceived;
            statusElem.className = 'success-status';
            
            setTimeout(() => {
                statusElem.textContent = '';
            }, 3000);
            
        } catch (error) {
            console.error('Error sending data:', error);
            logToPage(`Error sending data: ${error.message}`, 'error');
            
            statusElem.textContent = `${t.errorSending}: ${error.message}`;
            statusElem.className = 'error-status';
        }
    }
    
    // Initialize
    function init() {
        setupInputFields();
        handleKeyboardVisibility();
        
        // Expand Telegram WebApp if available
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.expand();
        }
        
        // Show debug info if in debug mode
        if (isDebugMode) {
            logToPage('Debug mode is active');
            logToPage(`Language: ${lang}`);
            logToPage(`Chat ID: ${chatId}`);
            
            if (window.Telegram && window.Telegram.WebApp) {
                const webApp = window.Telegram.WebApp;
                logToPage('Telegram WebApp is available');
                logToPage(`Platform: ${webApp.platform}`);
                logToPage(`Version: ${webApp.version}`);
                logToPage(`Color scheme: ${webApp.colorScheme}`);
            } else {
                logToPage('Telegram WebApp is not available');
            }
        }
    }
    
    // Start the app
    init();
})(); 