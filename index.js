//import the modules that we need
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

const filePath = path.join(__dirname, 'test.csv');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) 
    {
        console.error('Error reading the file:', err);
        return;
    }
    
    const lines = data.split('\n').filter(line => line.trim()); // Split and filter out empty lines
    const processedData = lines.slice(1).map(line => {
        const entries = line.split(',').map(entry => entry.trim()); // Split and trim each entry
        return entries.slice(1); // Ignore the first entry (time slot)
    });
    console.log(processedData);
});
