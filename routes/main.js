module.exports = function (app, csvData, filePath, fs) {
    // Handle our routes

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

		console.log(testData)

		res.render("index.ejs", { data: testData })


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

	// CALENDAR PAGE
	app.get('/EventCalendar', function (req,res) {
        res.render('EventCalendar.ejs');                                                                 
    }); 

	// CREATE EVENT TO SHARE PAGE
	app.get('/EventCreate', function (req,res) {
        res.render('EventCreate.ejs');                                                                 
    }); 

	// EVENT CODE FOR OTHERS TO JOIN PAGE
	app.get('/EventURL', function (req,res) {
        res.render('EventURL.ejs');                                                                 
    }); 

	// RESULTS OF EVERYONE'S INPUT PAGE
	app.get('/Results', function (req,res) {
        res.render('Results.ejs');                                                                 
    }); 
}

