var custom_bubble_chart = (function(d3) {
"use strict";
 
var width = 940,
height = 600,
layout_gravity = -0.01,
damper = 0.1,
nodes = [],
widthXL = 940,
heightXL = 600,
vis, force, circles, radius_scale;
 
var center = {x: width / 2, y: height / 2};

var newsCat_centers = {
    "Science" : {x : 15 * width / 100, y :  height / 2},
    "Sports" : {x : 25 * width / 100, y :  height / 2},
    "Health" : {x : 37 * width / 100, y :  height / 2},
    "Business" : {x : 48 * width / 100, y :  height / 2},
    "Arts" : {x : 53 * width / 100, y :  height / 2},
    "U.S." : {x : 67 * width / 100, y :  height / 2},
    "World" : {x : 80 * width / 100, y :  height / 2},
    };

var frequency_centers = {
    "Less than 1 day" : {x : 20 * width / 100, y :  height / 2},
    "1 to 2 days" : {x : 35 * width / 100, y :  height / 2},
    "2 to 3 days" : {x : 50 * width / 100, y :  height / 2},
    "3 to 4 days" : {x : 60 * width / 100, y :  height / 2},
    "4 to 5 days" : {x : 70 * width / 100, y :  height / 2},
    "More than 5 days" : {x : 80 * width / 100, y :  height / 2}
    };

var kickerCat_centers = {
    "Yes" : {x : 35 * width / 100, y :  height / 2},
    "No" : {x : 65 * width / 100, y :  height / 2},
    };
 
var fill_color = d3.scale.ordinal()
.domain(["Arts", "World", "Science", "Health", "Business", "Sports", "U.S."])
.range(["#aa7139", "#73aa39", "	#a939aa", "#aaa939", "#2c4870", "#9c344c", "#a9a9a9"]);
 
function custom_chart(data) {
	var max_amount = d3.max(data, function(d) { return parseInt(d.Scaling, 25);});

	radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([10, 55]);	 

	data.forEach(function(d){
		var node = {
			id: d.Id,
		    radius: radius_scale(parseInt(d.Scaling, 15)),
		    value: d.Scaling,
		    title: d.Title,
		    url: d.Url,
		    author: d.Author,
		    buildDate: d.BuildDate,
		    buildTime: d.BuildTime,
		    pubDate: d.PubDate,
		    pubTime: d.PubTime,
		    onlineDays: d.OnlineDays,
		    onlineTime: d.OnlineTime,
		    kicker: d.Kicker,
		    kickerTitle: d.KickerTitle,
		    genCat:d.GenCat,
		    deltaDays: d.DeltaDays,
			x: Math.random() * 900,
			y: Math.random() * 800
		};
		nodes.push(node);
	});
	 
	nodes.sort(function(a, b) {return b.value- a.value;});
	 
	vis = d3.select("#vis").append("svg")
			.attr("width", widthXL)
			.attr("height", heightXL)
			.attr("id", "svg_vis");
	 
	circles = vis.selectAll("circle")
			.data(nodes, function(d) { return d.Id;});
	 
		circles.enter().append("circle")
			.attr("r", 0)
			.attr("fill", function(d) { return fill_color(d.genCat);})
			.attr("stroke-width", 2)
			.attr("stroke", function(d) {return d3.rgb(fill_color(d.genCat)).darker();})
			.attr("id", function(d) { return "bubble_" + d.Id;})                      
			.call(d3.helper.tooltip()          
                .text(function(d, i){return (("Title: ").bold()+d.title)
                	+"<br>"+(("Article Link: ").bold()+d.url)
                	// +"<br>"+(("Scaling: ").bold()+"$"+d.value +"M")
                	+"<br>"+(("Author: ").bold()+d.author)
                	+"<br>"+(("Category: ").bold()+d.genCat)
                	+"<br>"+(("Kicker: ").bold()+d.kickerTitle)
                	+"<br>"+(("Build: ").bold()+d.buildDate+" - "+d.buildTime)
                	+"<br>"+(("Published: ").bold()+d.pubDate+" - "+d.pubTime)
                	+"<br>"+(("Article Featured: ").bold()+d.onlineDays+" + "+d.onlineTime)               	
				;
				})
            );
	 
		circles.transition().duration(2000).attr("r", function(d) { return d.radius; }); 
}

 
function charge(d) {
	return -Math.pow(d.radius, 2.0) / 8;
}
 
function start() {
	force = d3.layout.force()
		.nodes(nodes)
		.size([width, height]);
}

/* --------------------------------------------------------------------- Display All ------------------------------------------------------------*/
 
function display_group_all() {
	force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			circles.each(move_towards_center(e.alpha))
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;});
		});

	force.start();
	display_alls();
	display_legend();
	hide_frequency();
	hide_newsCats();
	hide_kickerCats();
	
}
 
function move_towards_center(alpha) {
	return function(d) {
		d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
		d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
	};
}
 
function display_alls() {

	d3.select("#all").classed("HighB", true).style("color", "#fff");
	d3.select("#category").classed("HighB", false).style("color", "#333333");
	d3.select("#frequency").classed("HighB", false).style("color", "#333333");
	d3.select("#kicker").classed("HighB", false).style("color", "#333333");

	var alls_x = {
		"all ":  width / 2	
	};

	var alls_data = d3.keys(alls_x);

	var alls = vis.selectAll(".alls")
				.data(alls_data);

    /*--------------------------------------------------------------------------overlapping legend circles--------------------------------------------------------------------*/

	alls.enter().append("text")
			.attr("class", "alls")
			.attr("x", 26 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("[98 Articles]");
    									/*--------------------------------small----------------------------*/

    alls.enter()
	    .append("circle")
	    .attr("class", "alls")
	    .attr("r", radius_scale(parseInt(400)))
	    .attr("cx", 70)
	    .attr("cy", 478)
	    .attr("fill", "none")
	    .attr("stroke", "#000");

    alls.enter()
	    .append("line")
	    .attr("class", "alls")
	    .attr("x1", 70)
	    .attr("x2", 150)
	    .attr("y1", 475)
	    .attr("y2", 475)
	    .attr("stroke", "#000")
	    .style("stroke-dasharray", ("3, 3"));

    alls.enter()
    	.append("text")
		.attr("class", "alls")
		.attr("x", 160)
		.attr("y", 475)
		.text("Less than 1 day");

    									/*--------------------------------medium----------------------------*/

    alls.enter()
	    .append("circle")
	    .attr("class", "alls")
	    .attr("r", radius_scale(parseInt(2500)))
	    .attr("cx", 70)
	    .attr("cy", 472)
	    .attr("fill", "none")
	    .attr("stroke", "#000");

    alls.enter()
	    .append("line")
	    .attr("class", "alls")
	    .attr("x1", 70)
	    .attr("x2", 150)
	    .attr("y1", 460)
	    .attr("y2", 460)
	    .attr("stroke", "#000")
	    .style("stroke-dasharray", ("3, 3"));

    alls.enter()
    	.append("text")
		.attr("class", "alls")
		.attr("x", 160)
		.attr("y", 460)
		.text("1 to 2 days");

   									/*--------------------------------medlge----------------------------*/

    alls.enter()
	    .append("circle")
	    .attr("class", "alls")
	    .attr("r", radius_scale(parseInt(8000)))
	    .attr("cx", 70)
	    .attr("cy", 463)
	    .attr("fill", "none")
	    .attr("stroke", "#000");

    alls.enter()
	    .append("line")
	    .attr("class", "alls")
	    .attr("x1", 70)
	    .attr("x2", 150)
	    .attr("y1", 443)
	    .attr("y2", 443)
	    .attr("stroke", "#000")
	    .style("stroke-dasharray", ("3, 3"));

    alls.enter()
    	.append("text")
		.attr("class", "alls")
		.attr("x", 160)
		.attr("y", 443)
		.text("2 to 3 days");

    									/*--------------------------------large----------------------------*/

    alls.enter()
	    .append("circle")
	    .attr("class", "alls")
	    .attr("r", radius_scale(parseInt(16000)))
	    .attr("cx", 70)
	    .attr("cy", 455)
	    .attr("fill", "none")
	    .attr("stroke", "#000");

    alls.enter()
	    .append("line")
	    .attr("class", "alls")
	    .attr("x1", 70)
	    .attr("x2", 150)
	    .attr("y1", 430)
	    .attr("y2", 430)
	    .attr("stroke", "#000")
	    .style("stroke-dasharray", ("3, 3"));

    alls.enter()
    	.append("text")
		.attr("class", "alls")
		.attr("x", 160)
		.attr("y", 430)
		.text("3 to 4 days");

    									/*------------------------------x-large----------------------------*/

	  alls.enter()
	    .append("circle")
	    .attr("class", "alls")
	    .attr("r", radius_scale(parseInt(28000)))
	    .attr("cx", 70)
	    .attr("cy", 446)
	    .attr("fill", "none")
	    .attr("stroke", "#000");

	  alls.enter()
	    .append("line")
	    .attr("class", "alls")
	    .attr("x1", 70)
	    .attr("x2", 150)
	    .attr("y1", 410)
	    .attr("y2", 410)
	    .attr("stroke", "#000")
	    .style("stroke-dasharray", ("3, 3"));

	  alls.enter()
	  	.append("text")
		.attr("class", "alls")
		.attr("x", 160)
		.attr("y", 410)
		.text("4 to 5 days");

	alls.enter()
	  	.append("text")
		.attr("class", "alls")
		.attr("x", 160)
		.attr("y", 390)
		.text("Article Frequency");

}

function hide_alls() {
	var alls = vis.selectAll(".alls").remove();
}

/* --------------------------------------------------------------------- Display Legends ------------------------------------------------------------*/
function display_legend() {

	var legend_x = {
		"Arts": 2 * width/50,
		"World": 6 * width/50,
		"Science": 10 * width/50,
		"Health": 14.5 * width/50,
		"Business": 18.5 * width/50,
		"Sports": 23 * width/50,
		"U.S.": 27 * width/50
	};

	var legend_y = {
		"Arts": 48 * height/50,
		"World": 48 * height/50,
		"Science": 48 * height/50,
		"Health": 48 * height/50,
		"Business": 48 * height/50,
		"Sports": 48 * height/50,
		"U.S.": 48 * height/50
	};

	var legend_data = d3.keys(legend_x);

	var legend = vis.selectAll(".legend")
				.data(legend_data);
	 
		legend.enter()
    	.append("text")
		.attr("class", "legend")
		.attr("x", function(d) { return legend_x[d]; } )
		.attr("y", function(d) { return legend_y[d]; } )
		.text(function(d) { return d;});

    	    							/*-----------------------------Categories--------------------------*/	 
	    legend.enter()
		    .append("text")
		    .attr("class", "legend")
		    .attr("x", 20)
		    .attr("y", 550)
		    .text("News Categories");

    									/*--------------------------------Arts----------------------------*/	 
	    legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 25)
		    .attr("cy", 570)
		    .attr("fill", "#aa7139");
										/*--------------------------------World----------------------------*/
	    legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 100)
		    .attr("cy", 570)
		    .attr("fill", "#73aa39");
										/*--------------------------------Science-----------------------------*/
	    legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 175)
		    .attr("cy", 570)
		    .attr("fill", "#a939aa");
		    							/*--------------------------------Health------------------------------*/
		legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 260)
		    .attr("cy", 570)
		    .attr("fill", "#aaa939");
		    							/*--------------------------------Business----------------------------*/
		legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 335)
		    .attr("cy", 570)
		    .attr("fill", "#2c4870");
		    							/*--------------------------------Sports------------------------------*/
		legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 420)
		    .attr("cy", 570)
		    .attr("fill", "#9c344c");	
		    							/*--------------------------------U.S.-------------------------------*/
		legend.enter()
		    .append("circle")
		    .attr("class", "legend")
		    .attr("r", 10)
		    .attr("cx", 495)
		    .attr("cy", 570)
		    .attr("fill", "#a9a9a9");							
}

/* --------------------------------------------------------------------- Display newsCat ------------------------------------------------------------*/

function display_by_newsCat() {
	force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			circles.each(move_towards_newsCat(e.alpha))
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;});
		});

	force.start();
	display_newsCats();
	hide_alls();
	hide_frequency();
	hide_kickerCats();
	
}
 
function move_towards_newsCat(alpha) {
	return function(d) {
		var target = newsCat_centers[d.genCat];
		d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
		d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
	};
}
 
function display_newsCats() {

	d3.select("#all").classed("HighB", false).style("color", "#333333");
	d3.select("#category").classed("HighB", true).style("color", "#fff");
	d3.select("#frequency").classed("HighB", false).style("color", "#333333");
	d3.select("#kicker").classed("HighB", false).style("color", "#333333");
	

	var newsCats_x = {
		"newsCat ":  width / 2	
	};

	var newsCats_data = d3.keys(newsCats_x);

	var newsCats = vis.selectAll(".newsCats")
				.data(newsCats_data);

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 2 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Science");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 2 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[5 articles]");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 8 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Sports");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 8 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[5 articles]");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 14 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Health");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 14 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[6 articles]");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 20 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Business");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 20 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[11 articles]");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 26 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Arts");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 26 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[22 articles]");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 34 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("U.S.");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 34 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[23 articles]");

		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 42 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("World");
		
		newsCats.enter().append("text")
			.attr("class", "newsCats")
			.attr("x", 42 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[26 articles]");

}
 
function hide_newsCats() {
	var newsCats = vis.selectAll(".newsCats").remove();
}


/* --------------------------------------------------------------------- Display Frequency ------------------------------------------------------------*/

function display_by_frequency() {
	force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			circles.each(move_towards_frequency(e.alpha))
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;});
		});

	force.start();
	display_frequency();
	hide_alls();
	hide_newsCats();
	hide_kickerCats();
	
}
 
function move_towards_frequency(alpha) {
	return function(d) {
		var target = frequency_centers[d.deltaDays];
		d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
		d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
	};
}
 
function display_frequency() {

	d3.select("#all").classed("HighB", false).style("color", "#333333");
	d3.select("#category").classed("HighB", false).style("color", "#333333");
	d3.select("#frequency").classed("HighB", true).style("color", "#fff");
	d3.select("#kicker").classed("HighB", false).style("color", "#333333");
	

	var frequency_x = {
		"frequency ":  width / 2	
	};

	var frequency_data = d3.keys(frequency_x);

	var frequency = vis.selectAll(".frequency")
				.data(frequency_data);

/*--------------------------------------------------------------------------Text--------------------------------------------------------------------*/
	
		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 6 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Less than 1 day");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 6 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[55 articles]");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 17 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("1 to 2 days");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 17 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[25 articles]");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 26 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("2 to 3 days");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 26 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[8 articles]");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 33 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("3 to 4 days");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 33 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[5 articles]");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 39 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("4 to 5 days");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 39 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[3 articles]");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 45 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("More than 5 days");

		frequency.enter().append("text")
			.attr("class", "frequency")
			.attr("x", 45 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[2 articles]");


}
 
function hide_frequency() {
	var frequency = vis.selectAll(".frequency").remove();
}


/* --------------------------------------------------------------------- Display KicketCat ------------------------------------------------------------*/

function display_by_kickerCat() {
	force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			circles.each(move_towards_kickerCat(e.alpha))
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;});
		});

	force.start();
	display_kickerCats();
	hide_alls();
	hide_frequency();
	hide_newsCats();
	
}
 
function move_towards_kickerCat(alpha) {
	return function(d) {
		var target = kickerCat_centers[d.kicker];
		d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
		d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
	};
}
 
function display_kickerCats() {

	d3.select("#all").classed("HighB", false).style("color", "#333333");
	d3.select("#category").classed("HighB", false).style("color", "#333333");
	d3.select("#frequency").classed("HighB", false).style("color", "#333333");
	d3.select("#kicker").classed("HighB", true).style("color", "#fff");
	

	var kickerCats_x = {
		"kicker ":  width / 2	
	};

	var kickerCats_data = d3.keys(kickerCats_x);

	var kickerCats = vis.selectAll(".kickerCats")
				.data(kickerCats_data);

/*--------------------------------------------------------------------------Text--------------------------------------------------------------------*/

		kickerCats.enter().append("text")
			.attr("class", "kickerCats")
			.attr("x", 14 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("Yes");

		kickerCats.enter().append("text")
			.attr("class", "kickerCats")
			.attr("x", 14 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[32 articles]");

		kickerCats.enter().append("text")
			.attr("class", "kickerCats")
			.attr("x", 34 * width / 50)
			.attr("y", 2 * height / 15)
			.attr("text-anchor", "middle")
			.text("No");

		kickerCats.enter().append("text")
			.attr("class", "kickerCats")
			.attr("x", 34 * width / 50)
			.attr("y", 5 * height / 30)
			.attr("text-anchor", "middle")
			.text("[67 articles]");
}
 
function hide_kickerCats() {
	var kickerCats = vis.selectAll(".kickerCats").remove();
}

/* --------------------------------------------------------------------- Tooltip ------------------------------------------------------------*/


 
var my_mod = {};

my_mod.init = function (_data) {
	custom_chart(_data);
	start();
};
 
my_mod.display_all = display_group_all;

my_mod.toggle_view = function(view_type) {
	if (view_type == 'category') {
		display_by_newsCat();
	} else if (view_type == 'frequency') {
		display_by_frequency();
	} else if (view_type == 'kicker') {
		display_by_kickerCat();
	} else {
		display_group_all();
	}
};
 
return my_mod;

})(d3); 

d3.helper = {};

d3.helper.tooltip = function(){
        var tooltipDiv;
        var bodyNode = d3.select('#vis').node();
        var attrs = {};
        var text = '';
        var styles = {};

        function tooltip(selection){

            selection.on('mouseover.tooltip', function(pD, pI){
                var name, value;
                // Clean up lost tooltips
                d3.select('#vis').selectAll('div.tooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('#vis').append('div').attr('class', 'tooltip');
                tooltipDiv.attr(attrs);
                //tooltipDiv.style(styles);
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style({
                    left: (absoluteMousePos[0] + 100)+'px',
                    top: (absoluteMousePos[1] + 100)+'px',
                    position: 'absolute',
                    'z-index': 1001
                });
                // Add text using the accessor function, Crop text arbitrarily
                tooltipDiv.style('width', function(d, i){ return (text(pD, pI).length > 80) ? '300px' : null; })
                    .html(function(d, i){return text(pD, pI);});
            })
            .on('mousemove.tooltip', function(pD, pI){
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style({
                    left: (absoluteMousePos[0] + 100)+'px',
                    top: (absoluteMousePos[1] + 100)+'px'
                });
                // Keep updating the text, it could change according to position
                tooltipDiv.html(function(d, i){ return text(pD, pI); });
            })
            .on('mouseout.tooltip', function(pD, pI){
                // Remove tooltip
                tooltipDiv.remove();
            });

        }

        tooltip.attr = function(_x){
            if (!arguments.length) return attrs;
            attrs = _x;
            return this;
        };

        tooltip.style = function(_x){
            if (!arguments.length) return styles;
            styles = _x;
            return this;
        };

        tooltip.text = function(_x){
            if (!arguments.length) return text;
            text = d3.functor(_x);
            return this;
        };

        return tooltip;
    };