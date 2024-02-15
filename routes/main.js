module.exports = function (app, csvData, filePath, fs) {
    // Handle our routes

    var testDates;

    app.get("/", async function (req, res) {

        const testData = await new Promise((resolve, reject) => {

            fs.readFile(filePath, 'utf8', (err, data) => {

				// IF FILE READ ERROR IS THROWN -> REJECT
                if (err)
                    reject(err);

				// ELSE READ FILE AS NORMAL
            	else 
				{
					//splits the data based on each new line, then iterate through the array of lines, and trim each one
					const lines = data.split('\n').filter(l => l.trim());

					//slice off the first line
					linesSliced = lines.slice(1);

					//uses map to take each line, split into entries using comma delimiter
					handledData = linesSliced.map(l => {
						const entries = l.split(',');

						//then we trim every entry incase
						const trimmedEntries = entries.map(e => e.trim());

						//then we slice off the initial column of time rows
						finalEntries = trimmedEntries.slice(1);

						//return the trimmed entries without initial column
						return finalEntries;
					})

					//send the now processed data to the promise
                    resolve(handledData);
					
                }
            });

        });

		res.render("index.ejs", { data: testData, dates: testDates })


    });

	//OZZES ROUTES WHEY
	app.get('/landing', function(req, res) {
        res.render('landing.ejs');
      });
    app.get('/link', function(req, res) {
        res.render('link.ejs');
      });
      app.get('/share', function(req, res) {
        res.render('share.ejs');
      });
      app.get('/date', function(req, res) {
        res.render('date.ejs');
      });
      app.get('/summary', function(req, res) {
        res.render('summary.ejs');
      });

	// LOGIN PAGE
	app.get('/login', function (req,res) {
        res.render('login.ejs');                                                                 
    }); 


    // USER INPUTS DATES FOR RETURNED ARRAY OF DATES INFO
    app.post('/calculate-dates', (req, res) => {
        // TAKE THE VALUES FROM /date FORMS
        const startDate = new Date(req.body['start-date']);
        const endDate = new Date(req.body['end-date']);

        // EXTRACT START TO FINISH DATE
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // FIND NUMBER OF DAYS (DIFFTIME IS FOUND IN MILLISECONDS)
    
        // ARRAY OF DATES TO BE RETURNED
        let dates = [];

        // FOR EVERY DAY 
        for (let i = 0; i <= diffDays; i++) 
        {
            // CREATE NEW DATE OBJECT
            let currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i); // SET NEW DATE OBJECT FOR EVERY ITERATION e.g. 18TH - 20TH = 1, 2, 3 DAYS

            // RETURN DATE AS A NUMBER e.g. 18th April -> 18
            let day = currentDate.getDate(); 
            
            // FOR UI PURPOSES, TAKE STRING, CUT OFF FIRST THREE LETTERS -> SET TO UPPER CASE
            let weekday = currentDate.toLocaleString('en-EN', { weekday: 'short' }).toUpperCase(); 

            // PUSH DATE OBJECT TO ARRAY
            dates.push({
                date: `${day}`, // DAY NUMBER
                dayOfWeek: weekday // DAY OF WEEK
            });
        }
        
        // STORE DATES FOR LATER RENDERING
        testDates = dates;

        // NOW REDIRECT TO CALENDER PAGE
        res.redirect('/');
    });

}

