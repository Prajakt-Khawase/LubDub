let express = require('express')
let app = express()
let url = require('url')
app.set('view engine', 'ejs')
require('@google-cloud/debug-agent').start();
// Declared instance variable for Heart Rates
let minimumHeartRate; // Declared variable for minimum This variable will store the Minimum heart rate sent in entire session
let maximumHeartRate; // This variable will store the Maximum heart rate sent in entire session
let meanHeartRate = 0; // 
let medianHeartRate = 0;
let count = 0;
let total;

// Initialize an empty Array.
let heartRateValues = [];

app.get('/', (req, res) => {

    res.send('Welcome to the homepage \n  We will show you your Heart Status')
})

app.get('/addData', (req, res) => {

    heartRateValues.push(parseFloat(req.query.heartRate));
    res.send("The HeartRate Value " + parseFloat(req.query.heartRate) + " is noted down")

    if (count === 0) {
        count++;
        minimumHeartRate = parseFloat(req.query.heartRate);
        maximumHeartRate = minimumHeartRate;
        meanHeartRate = minimumHeartRate;
        medianHeartRate = minimumHeartRate;
        console.log("The Value of Minimum Heart Rate is " + minimumHeartRate);
        console.log("The Value of Maximum Heart Rate is " + maximumHeartRate);
        console.log("The Value of Mean Heart Rate is " + meanHeartRate);
        console.log("The Value of Median Heart Rate is " + medianHeartRate);
        console.log("\n" + "\n" + "\n");

    }
    else {
        maximumHeartRate = Math.max.apply(Math, heartRateValues);
        minimumHeartRate = Math.min.apply(Math, heartRateValues);
        meanHeartRate = calMean();
        medianHeartRate = calMedian();
        console.log("The Value of Minimum Heart Rate is " + minimumHeartRate);
        console.log("The Value of Maximum Heart Rate is " + maximumHeartRate);
        console.log("The Value of Mean Heart Rate is " + meanHeartRate);
        console.log("The Value of Median Heart Rate is " + medianHeartRate);
        console.log("\n" + "\n" + "\n");
    }

})

app.get('/statistics', (req, res) => {

    meanHeartRate = calMean();
    medianHeartRate = calMedian();
    res.render('myview.ejs', {
        maximumHeartRate: maximumHeartRate, minimumHeartRate: minimumHeartRate
        , meanHeartRate: meanHeartRate, medianHeartRate: medianHeartRate
    })
})

function calMean() {
    total = 0;
    for (let i = 0; i < heartRateValues.length; i++) {
        total += parseFloat(heartRateValues[i]);
    }
    meanHeartRate = (total / heartRateValues.length);
    return meanHeartRate;
}

function calMedian() {
    heartRateValues.sort(function (a, b) { return a - b });
    let midpoint = Math.floor(heartRateValues.length / 2);
    if (heartRateValues.length % 2) {
        return heartRateValues[midpoint];
    } else {
        return (heartRateValues[midpoint - 1] + heartRateValues[midpoint]) / 2.0;
    }
}

let port = process.env.PORT || 4001
app.listen(port)