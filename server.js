let express = require('express')
let app = express()
let url = require('url')
app.set('view engine', 'ejs')
require('@google-cloud/debug-agent').start();
// Declared instance variable for Heart Rates
let minimumHeartRate = 0; // Declared variable for minimum This variable will store the Minimum heart rate sent in entire session
let maximumHeartRate = 0; // This variable will store the Maximum heart rate sent in entire session
let meanHeartRate = 0; // This variable will store the Mean of heart rate sent in entire session
let medianHeartRate = 0; // This variable will store the Median heart rate sent in entire session
let count = 0; // count variable
let total = 0; // variable to store total of all the heart rate values

let heartRateValues = []; // Initialize an empty Array.

// get method for root call
app.get('/', (req, res) => {
    res.send('Welcome to the homepage \n  We will show you your Heart Status')  // Sending the response to browser.

})
// get method if the request comes with path /addData
app.get('/addData', (req, res) => {
    heartRateValues.push(parseFloat(req.query.heartRate)); // Adding the received query string data into an array.
    res.send("The HeartRate Value " + parseFloat(req.query.heartRate) + " is noted down")  // Sending the response back to the browser.
    if (count === 0) {
        count++;
        minimumHeartRate = parseFloat(req.query.heartRate); // Fetching the value from query string and giving it to minimumHeartRate varaible 
        maximumHeartRate = minimumHeartRate; // Assigning the same first value to all the variables for first request hit
        meanHeartRate = minimumHeartRate; // Assigning the same first value to all the variables for first request hit
        medianHeartRate = minimumHeartRate; // Assigning the same first value to all the variables for first request hit
        // Printing the console statment for debugging purpose.
        console.log("The Value of Minimum Heart Rate is " + minimumHeartRate);
        console.log("The Value of Maximum Heart Rate is " + maximumHeartRate);
        console.log("The Value of Mean Heart Rate is " + meanHeartRate);
        console.log("The Value of Median Heart Rate is " + medianHeartRate);
        console.log("\n" + "\n" + "\n");

    }
    else {
        maximumHeartRate = Math.max.apply(Math, heartRateValues);  // Calculating the maximum value in an array and assigning it to maximumHeartRate variable.
        minimumHeartRate = Math.min.apply(Math, heartRateValues);  // Calculating the maximum value in an array and assigning it to minimumHeartRate variable.
        meanHeartRate = calMean();  // Calculating the Mean of values in an array and assigning it to meanHeartRate variable.
        medianHeartRate = calMedian();  // Calculating the Median of values in an array and assigning it to medianHeartRate variable.
        // Printing the console statment for debugging purpose.
        console.log("The Value of Minimum Heart Rate is " + minimumHeartRate);
        console.log("The Value of Maximum Heart Rate is " + maximumHeartRate);
        console.log("The Value of Mean Heart Rate is " + meanHeartRate);
        console.log("The Value of Median Heart Rate is " + medianHeartRate);
        console.log("\n" + "\n" + "\n");
    }

})

// get method if the request comes with path /statistics. It shows the statistic of heart rate to user
app.get('/statistics', (req, res) => {
    meanHeartRate = calMean();    // Calculating the Mean of values in an array and assigning it to meanHeartRate variable.
    medianHeartRate = calMedian();    // Calculating the Median of values in an array and assigning it to medianHeartRate variable.
    // Rendering the ejs page so as to show the html on browser having the calculated heart values
    res.render('myview.ejs', {
        maximumHeartRate: maximumHeartRate, minimumHeartRate: minimumHeartRate
        , meanHeartRate: meanHeartRate, medianHeartRate: medianHeartRate
    })
})

// Method for calculating the Mean of values in an Array
function calMean() {
    total = 0;
    for (let i = 0; i < heartRateValues.length; i++) {
        total += parseFloat(heartRateValues[i]);
    }
    meanHeartRate = (total / heartRateValues.length);
    return meanHeartRate;
}

// Method for calculating the median of values in an array.
function calMedian() {
    heartRateValues.sort(function (a, b) { return a - b });  // Sorting the values in heartRateValues array.
    let midpoint = Math.floor(heartRateValues.length / 2);  // Taking the midpoint of array.
    // Checking the conditions according to  the number of values inside an array is even or odd.
    if (heartRateValues.length % 2) {
        return heartRateValues[midpoint];
    } else {
        return (heartRateValues[midpoint - 1] + heartRateValues[midpoint]) / 2.0;
    }
}

// Configuring the port value to 4001

let port = process.env.PORT || 4001
app.listen(port)