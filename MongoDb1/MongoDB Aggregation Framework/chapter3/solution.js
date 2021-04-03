var favorites = [
    "Sandra Bullock",
    "Tom Hanks",
    "Julia Roberts",
    "Kevin Spacey",
    "George Clooney"
];

{countries:{ $in:["USA"]} }

{"tomatoes.viewer.rating":{$gte:3}}

{"cast" : { $exists : true }}

{
	$match : { 
		"awards" : { 
			$regex : /Won \d+ Oscar/ 
			} 
		} 
}

{
    "$group": {
      "_id": null,
      "highest_rating": {
                            $max: "$imdb.rating"
                        },
      "lowest_rating": {
                            $min:"$imdb.rating"
                        },
      "average_rating":{
                            $avg: "$imdb.rating"
                       },
       "deviation": {
                        $stdDevSamp:"$imdb.rating"
                    }
    }
}

var pipeline = [
{
	$match : {
		"awards" : {
			$regex : /Won \d+ Oscar/
			}
		}
},
{
    "$group": {
      "_id": null,
      "highest_rating": {
                            $max: "$imdb.rating"
                        },
      "lowest_rating": {
                            $min:"$imdb.rating"
                        },
      "average_rating":{
                            $avg: "$imdb.rating"
                       },
       "deviation": {
                        $stdDevSamp:"$imdb.rating"
                    }
    }
}
];



db.movies.aggregate(pipeline, { allowDiskUse : true })

----------------------------------------
var pipeline = [
{
    $unwind: "$cast"
},
{
    $group: {
      "_id": {
        "cast": "$cast"
      },
      "average_rating": { $avg: "$imdb.rating" },
      "count": { "$sum": 1 }
    }
  },
  {
    $sort: { "count": -1 }
  }
];


db.movies.aggregate(pipeline, { allowDiskUse : true })

{ "_id" : { "cast" : "John Wayne" }, "average_rating" : 6.424299065420561, "count" : 107 }
{ "_id" : "John Wayne", "numFilms" : 107, "average" : 6.4 }

db.movies.aggregate([
  {
    $match: {
      languages: "English"
    }
  },
  {
    $project: { _id: 0, cast: 1, "imdb.rating": 1 }
  },
  {
    $unwind: "$cast"
  },
  {
    $group: {
      _id: "$cast",
      numFilms: { $sum: 1 },
      average: { $avg: "$imdb.rating" }
    }
  },
  {
    $project: {
      numFilms: 1,
      average: {
        $divide: [{ $trunc: { $multiply: ["$average", 10] } }, 10]
      }
    }
  },
  {
    $sort: { numFilms: -1 }
  },
  {
    $limit: 1
  }
])








