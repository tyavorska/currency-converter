const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const exchangeRateDiv = document.getElementById('exchangeRate');
let exchangeRate = 0;

// Function to populate currency options
const populateCurrencyOptions = (currencies) => {
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        fromCurrencySelect.appendChild(option.cloneNode(true));
        toCurrencySelect.appendChild(option);
    });
}

// Fetch the list of currencies from the API
fetch('https://currencycalculator-d9d0b-default-rtdb.europe-west1.firebasedatabase.app/currencies.json')
    .then(response => response.json())
    .then(data => {
        const currencies = data.split(',');
        populateCurrencyOptions(currencies);
    })
    .catch(error => {
        console.error('Error fetching currencies:', error);
    });

// Function to check and enable the "Convert" button
const checkEnableConvertButton = () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = amountInput.value;

    // Enable the button only if all conditions are met
    convertBtn.disabled = !(amount && fromCurrency && toCurrency);
};

// Function to fetch and display exchange rate for selected currencies
async function fetchExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await fetch(`https://currencycalculator-d9d0b-default-rtdb.europe-west1.firebasedatabase.app/${fromCurrency}.json`);
        const data = await response.json();
        exchangeRate = data[toCurrency];
        exchangeRateDiv.textContent = `Exchange rate: 1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`;
    } catch (error) {
        exchangeRateDiv.textContent = 'Error fetching exchange rate.';
    };
};

// Initial call to fetch exchange rate and enable/disable Convert button
const checkExchangeRate = () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
     fetchExchangeRate(fromCurrency, toCurrency) 
};

const handleCurrencyChange = () => {    
    checkExchangeRate();
    amountInput.value && checkEnableConvertButton();
}

const disableCurrency = (options, selectedCurrency) => {
    // Loop through the options in the oposite select and disable the selected option
    for (const option of options) {
        if (option.value === selectedCurrency) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    }
}

// Event listeners for currency select elements
fromCurrencySelect.addEventListener('change', () => {
    disableCurrency(toCurrencySelect.options, fromCurrencySelect.value)
    toCurrencySelect.value && handleCurrencyChange ()
});
toCurrencySelect.addEventListener('change', () => {
    disableCurrency(fromCurrencySelect.options, toCurrencySelect.value)
    fromCurrencySelect.value && handleCurrencyChange ()
});

// Event listener for amount input (to trigger conversion)
amountInput.addEventListener('input', () => {
   checkEnableConvertButton();
});

// Event listener for "Convert" button click
convertBtn.addEventListener('click', () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    const convertedAmount = amount * exchangeRate;
    resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
});
