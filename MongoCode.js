// 1) Store in appropriate database ************************************************************************************
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

// 2) How database allows for differently structured data **************************************************************
// Mongo is a schemaless database, this means that there is no structure on the data that can be inserted.
// Because of this, mongo will allow for differently structured data to be added to the database.

db.JLHome1718Power.insert({dateandtime : new Date("2020-01-01T00:00:00"), watts : 40, humidity : 35});
db.JLHome1718Power.insert({dateandtime : new Date("2020-01-01T00:01:00"), watts : 39, humidity : 33});
db.JLHome1718Power.insert({dateandtime : new Date("2020-01-01T00:02:00"), watts : 35, humidity : 34});
db.JLHome1718Power.insert({dateandtime : new Date("2020-01-01T00:03:00"), watts : 27, humidity : 33});
db.JLHome1718Power.insert({dateandtime : new Date("2020-01-01T00:04:00"), watts : 33, humidity : 33});
db.JLHome1718Power.insert({dateandtime : new Date("2020-01-01T00:00:00"), watts : 44, humidity : 34});


// 3) How your solution will scale ************************************************************************************* 
// Mongo supports sharding. Sharding is splitting the data up between different servers, controlled by one config server.
// This allows my solution to scale out as data can be put on more servers connected to the config server.
// Sharding is accomplished by 
// 1) setting up config server and it's replica sets
// 2) setting up Shard 1 and it's replica sets
// 3) setting up Shard 2 and it's replica sets
// 4) Connecting each shard to the config server
// 5) Importing the data

// 4) Back up the data and high availability to servers ****************************************************************
// Replica sets, that are made above, provide both backups and high availability. The replica sets provide high 
// availability to each shard

// 5) prepare, clean, aggregate and analyse the data *******************************************************************









