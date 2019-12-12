// CHANGING DATE FORMAT
// In excel, split the given date format into date, month, year and time (in different columns)
// Merge them back together in the format year-month-day"T"hour"Z"
// Copy the new column and paste it by "Values & Number Formatting" option in the Paste Special option.
// Delete the columns with the split data 

// IMPORTING DATA TO MONGO
// mongoimport --db FinalProject --collection hourly_dublin_17_18 --type csv --headerline --file /Users/racheldhc/Documents/year3/BigDataSystems/CA2/BDSDA2FPData/hourly_dublin_17_18.csv
// mongoimport --db FinalProject --collection JLHome1718Power --type csv --fields "dateandtime, watts" --file /Users/racheldhc/Documents/year3/BigDataSystems/CA2/BDSDA2FPData/JLHome1718Power.csv 
// mongoimport --db FinalProject --collection JLHome1718Temperature --type csv --fields "dateandtime, temperature" --file /Users/racheldhc/Documents/year3/BigDataSystems/CA2/BDSDA2FPData/JLHome1718Temperature.csv 

// RUN THE FOLLOWING COMMANDS TO CHANGE THE DATE / DATEANDTIME COLUMN TO ISODATE
 db.JLHome1718Power.find().forEach(function(element) {
    element.dateandtime = new Date(element.dateandtime);
    db.JLHome1718Power.save(element);
    })
    db.JLHome1718Power.find({"dateandtime" : ISODate("1970-01-01T00:00:00Z")}).count()

    db.JLHome1718Temperature.find().forEach(function(element) {
        element.dateandtime = new Date(element.dateandtime);
        db.JLHome1718Temperature.save(element);
        })
    db.JLHome1718Temperature.find({"dateandtime" : ISODate("1970-01-01T00:00:00Z")}).count()

    db.hourly_dublin_17_18.find().forEach(function(element) {
        element.date = new Date(element.date);
        db.hourly_dublin_17_18.save(element);
        })
    db.hourly_dublin_17_18.find({"date" : ISODate("1970-01-01T00:00:00Z")}).count()