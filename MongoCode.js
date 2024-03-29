// 1) Store in appropriate database ************************************************************************************
// CHANGING DATE FORMAT
// In excel, split the given date format into date, month, year and time (in different columns)
// Merge them back together in the format year-month-day"T"hour"Z"
// Copy the new column and paste it by "Values & Number Formatting" option in the Paste Special option.
// Delete the columns with the split data 

// IMPORTING DATA TO MONGO
// mongoimport --db FinalProject --port 27041 --collection hourly_dublin_17_18 --type csv --headerline --file /Users/racheldhc/Documents/year3/BigDataSystems/CA2/BDSDA2FPData/hourly_dublin_17_18.csv
// mongoimport --db FinalProject --port 27041 --collection JLHome1718Power --type csv --fields "dateandtime, watts" --file /Users/racheldhc/Documents/year3/BigDataSystems/CA2/BDSDA2FPData/JLHome1718Power.csv 
// mongoimport --db FinalProject --port 27041 --collection JLHome1718Temperature --type csv --fields "dateandtime, temperature" --file /Users/racheldhc/Documents/year3/BigDataSystems/CA2/BDSDA2FPData/JLHome1718Temperature.csv 

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

mkdir ShardingRachel
cd ShardingRachel
mkdir configSvrReplicaSetRachel
mkdir shard1ReplicaSet
mkdir shard2ReplicaSet
cd configSvrReplicaSetRachel
mkdir ./mongo1 ./mongo2 ./mongo3

//in different tabs
mongod --configsvr --replSet csReplicaSetRachel --dbpath ./mongo1 --bind_ip localhost --port 27011
mongod --configsvr --replSet csReplicaSetRachel --dbpath ./mongo2 --bind_ip localhost --port 27012
mongod --configsvr --replSet csReplicaSetRachel --dbpath ./mongo3 --bind_ip localhost --port 27013

//new terminal
mongo localhost:27011
rs.initiate({ _id : 'csReplicaSetRachel', configsvr : true, members : [ {_id:0, host: 'localhost:27011'}, {_id:1, host: 'localhost:27012'}, {_id:2, host: 'localhost:27013'} ]})
rs.status()

mongo localhost:27012
rs.slaveOk()
mongo localhost:27013
rs.slaveOk()

//in new terminal
cd shard1ReplicaSet/
mkdir ./mongo1 ./mongo2 ./mongo3
mongod --shardsvr --replSet shard1ReplicaSet --dbpath ./mongo1 --bind_ip localhost --port 27021
mongod --shardsvr --replSet shard1ReplicaSet --dbpath ./mongo2 --bind_ip localhost --port 27022
mongod --shardsvr --replSet shard1ReplicaSet --dbpath ./mongo3 --bind_ip localhost --port 27023

rs.initiate({ _id : ‘shard1ReplicaSet’, members : [ {_id:0, host: 'localhost:27021'}, {_id:1, host: 'localhost:27022'}, {_id:2, host: 'localhost:27023'} ]})

mongo localhost:27022
rs.slaveOk()
mongo localhost:27023
rs.slaveOk()

//new terminal 
cd shard2ReplicaSet/
mkdir ./mongo1 ./mongo2 ./mongo3
mongod --shardsvr --replSet shard2ReplicaSet --dbpath ./mongo1 --bind_ip localhost --port 27031
mongod --shardsvr --replSet shard2ReplicaSet --dbpath ./mongo2 --bind_ip localhost --port 27032
mongod --shardsvr --replSet shard2ReplicaSet --dbpath ./mongo3 --bind_ip localhost --port 27033

mongo localhost:27031
rs.initiate({ _id : ‘shard2ReplicaSet’, members : [ {_id:0, host: 'localhost:27031'}, {_id:1, host: 'localhost:27032'}, {_id:2, host: 'localhost:27033'} ]})


mongo localhost:27032
rs.slaveOk()
mongo localhost:27033
rs.slaveOk()

// 4) Back up the data and high availability to servers ****************************************************************
// Replica sets, that are made above, provide both backups and high availability. The replica sets provide high 
// availability to each shard

// INDEXING
db.JLHome1718Power.createIndex({dateandtime : -1})
db.JLHome1718Temperature.createIndex({dateandtime : -1})
db.hourly_dublin_17_18.createIndex({date : -1})

// Created indexes on the date field in each collection in descending order to have the dates sorted, so it will be easier to mapreduce 
// to get the average of values over a certain time (ie. normalise data to have all the values averaged over every hour)






