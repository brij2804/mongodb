// $match all celestial bodies, not equal to Star
db.solarSystem.aggregate([{
  "$match": { "type": { "$ne": "Star" } }
}]).pretty()

// same query using find command
db.solarSystem.find({ "type": { "$ne": "Star" } }).pretty();

// count the number of matching documents
db.solarSystem.count();

// using $count
db.solarSystem.aggregate([{
  "$match": { "type": { "$ne": "Star"} }
}, {
  "$count": "planets"
}]);

// matching on value, and removing ``_id`` from projected document
db.solarSystem.find({"name": "Earth"}, {"_id": 0});

var pipeline = [ { $match: { $and:[{imdb.rating:{$gte:7}},{genres:{$ne:["Crime","Horror"]}},{$or:[{rated:{$eq:"PG"}},{rated:{$eq:"G"}}]},{languages:{$eq:["English","Japanese"]}}] } } ]

var pipeline = [ {
                   $match: {
                            $and:[
                                  {
                                    "imdb.rating": {
                                                  $gte:7
                                                 }
                                  },
                                  {
                                    genres: {
                                             $nin:["Crime","Horror"]
                                             }
                                   },
                                   {
                                    $or:[
                                         {
                                           rated:{
                                                  $eq:"PG"
                                                 }
                                         },
                                         {
                                           rated:{
                                                  $eq:"G"
                                                  }
                                         }
                                         ]
                                    },
                                   {
                                     languages: {
                                                 $eq:["English","Japanese"]
                                                 }
                                   }
                                 ]
                           }
                  }
               ]


var pipeline1 = [ {
                   $match: {
                            $and:[
                                  {
                                    "imdb.rating": {
                                                  $gte:7
                                                 }
                                  }
                                 ]
                           }
                  }
               ]

var pipeline1 = [ {
                   $match: {
                            $and:[
                                  {
                                    "imdb.rating": {
                                                  $gte:7
                                                 }
                                  },
                                  {
                                    genres: {
                                             $nin:["Crime","Horror"]
                                             }
                                   },
                                   {
                                    rated: {
                                             $in:["PG","G"]
                                             }
                                   },
                                   {
                                     languages: {
                                                 $all:["English","Japanese"]
                                                 }
                                   }
                                 ]
                           }
                  }
               ]


db.movies.aggregate(pipeline1).itcount()

db.movies.aggregate(pipeline).itcount()


var pipeline = [{ $match: {
                            $and:[
                                  {
                                    "imdb.rating": {
                                                  $gte:7
                                                 }
                                  },
                                  {
                                    genres: {
                                             $nin:["Crime","Horror"]
                                             }
                                   },
                                   {
                                    rated: {
                                             $in:["PG","G"]
                                             }
                                   },
                                   {
                                     languages: {
                                                 $all:["English","Japanese"]
                                                 }
                                   }
                                 ]
                           }
                },
                { $project: { title:1,rated:1,_id:0 } 
                }]


db.movies.aggregate(pipeline).itcount()
db.movies.aggregate(pipeline)


{ $split: [ <string expression>, <delimiter> ] }


var splitting = [{ $split: [ "$title", " " ] }]

db.movies.aggregate(splitting)

db.movies.aggregate([
  { $project : { title_prefix : { $split: ["$title", " "] }, qty : 1 } },
  { $unwind : "$city_state" },
  { $match : { city_state : /[A-Z]{2}/ } },
  { $group : { _id: { "state" : "$city_state" }, total_qty : { "$sum" : "$qty" } } },
  { $sort : { total_qty : -1 } }
]);


db.movies.aggregate([
  { $project : { title_prefix : { $split: ["$title", " "] }} }
]);

{ $size: "$title_prefix" }

db.movies.aggregate([
  { $project : { title_prefix : { $split: ["$title", " "]}}},
  { $project : { title_size : { $size: "$title_prefix" } } },
  { $match : { title_size : {$eq:1} } },
  { $project : { title_prefix:1 ,_id:0, title:1} }  
]);


db.movies.aggregate([
  { $project : { title_array : { $split: ["$title", " "]}}},
  { $project : { title_size : { $size: "$title_array" } } },
  { $match : { title_size : {$eq:1} } },
  { $project : { title_prefix:1 ,_id:0, title:1} }  
]);


db.movies.aggregate([
  { $project : { title_array : { $split: ["$title", " "]}}},
  { $project : { title_size : { $size: "$title_array" } } }   
]);


db.movies.aggregate([
  { $project : { title_array : { $split: ["$title", " "]}}},
  { $project : { title_size : { $size: "$title_array" } } },
  { $match : { title_size : {$eq:1} } } 
]).itcount();












