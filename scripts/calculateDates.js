function calculateDates(startDate, endDate) 
{
    // DIFFERENCE BETWEEN START AND END DATES
    const diffTime = endDate - startDate;

    // CONVERT DATES FROM MILLISECONDS TO DAYS E.G. 3 DAYS, 4 DAYS ETC.
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // EMPTY DATES ARRAY
    let dates = [];
  
    // FOR EVERY DAY
    for (let i = 0; i <= diffDays; i++) 
    {
        // CURRENT DATE IN DATES
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        // GET DATE FROM INPUT OBJECT
        let day = currentDate.getDate();
        let month = currentDate.toLocaleString('default', {month: 'short'});

        // CONVERT DATE OBJECT FROM LONG NOTATION E.G. 'WEDNESDAY' TO SHORT NOTATION E.G. 'WED'
        let weekday = currentDate.toLocaleString("en-EN", { weekday: "short" }).toUpperCase();

        // ADD DAY TO ARRAY
        dates.push({
            date: `${day}`,
            dayOfWeek: weekday,
            month: month
        });
    }

    // RETURN DATES ARRAY TO MAIN.JS
    return dates;
  }
  
  module.exports = { calculateDates };