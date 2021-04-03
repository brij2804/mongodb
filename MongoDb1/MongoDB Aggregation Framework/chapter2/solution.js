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

{$match: {
	      countries:{ $in:["USA"]},
		  "tomatoes.viewer.rating":{$gte:3},
		  "cast" : { $exists : true }
}}

{ $setIntersection: [ "$cast", favorites ] }

{$size: { $setIntersection: [ "$cast", favorites ] } }

{$addFields:{"num_favs":{$size: { $setIntersection: [ "$cast", favorites ] } }}}

{$sort: {
	    "num_favs":-1,
		"tomatoes.viewer.rating" : -1,
		"title" : -1
}}

{ $skip : 24 }

var pipeline= [
        {
			$match: {
				  countries:{ $in:["USA"]},
				  "tomatoes.viewer.rating":{$gte:3},
				  "cast" : { $exists : true }
                   }
	    },
		{
			$addFields:{
				"num_favs":{
					$size: { 
						$setIntersection: [ "$cast", favorites ] 
						   } 
						   }
					   }
		},
		{
			$sort: {
				"num_favs":-1,
				"tomatoes.viewer.rating" : -1,
				"title" : -1
                }
		},
		{ $skip : 24 }
];

var result = db.movies.aggregate(pipeline, { allowDiskUse : true }).next().title;
print("Result: " + result);

var pipeline=[
{
	$match:{
		"languages" : "English",
		"imdb.rating":{
			$gte:1			
		},
		"imdb.votes":{
			$gte:1
		},
		"year":{
			$gte:1990
		}
	}
},
{
	$addFields:{
		"scaled_votes":{
			$add: [
			  1,
			  {
				$multiply: [
				  9,
				  {
					$divide: [
					  { $subtract: ["$imdb.votes", 5] },
					  { $subtract: [1521105, 5] }
					]
				  }
				]
			  }
			]
		  }
	}
},
{
	$addFields:{
		"normalized_rating":{$avg:["$scaled_votes","$imdb.rating"]}
	}
},
{
	$sort:{
		"normalized_rating":1
	}
}
];

















