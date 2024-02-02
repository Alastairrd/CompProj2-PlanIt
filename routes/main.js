module.exports = function (app, csvData, filePath, fs) {
    // Handle our routes

    app.get("/", async function (req, res) {

        const testData = await new Promise((resolve, reject) => {

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {


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


		//TODO Archie/Al can now use this testData to populate!
		//need to restructure the html/css to use classes
        console.log(testData);

		res.render("index.ejs")
    });
}

