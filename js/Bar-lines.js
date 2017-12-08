var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    padding = [10, 10, 30, 130];

// Parse the date / time
var parseDate = d3.time.format("%a-%m-%d-%Y-%I%p").parse;

/*------------------------------------------------------------------BarChart-----------------------------------------------------*/

var xScale1 = d3.scale.ordinal().rangeRoundBands([0, width-50], .05);

var yScale1 = d3.scale.linear().range([height, 0]);

var xAxis1 = d3.svg.axis()
    .scale(xScale1)
    .orient("bottom")
    .tickFormat(d3.time.format("%I%p"));

var yAxis1 = d3.svg.axis()
    .scale(yScale1)
    .orient("left")
    .ticks(10);

var svg1 = d3.select("#Barchart").append("svg")
    .attr("width", width)
    .attr("height", height + 100)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + 10 + ")");

d3.csv("./data/BarDb.csv", function(error, data) {

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
  
  xScale1.domain(data.map(function(d) { return d.date; }));
  yScale1.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis1)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" );

  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis1)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Items");

  svg1.selectAll(".initBar")
      .data(data)
    .enter().append("rect")
      .attr("class", "initBar")
      .style("fill", "#b5cdd6")
      .attr("x", function(d) { return xScale1(d.date); })
      .attr("width", xScale1.rangeBand())
      .attr("y", function(d) { return yScale1(d.value); })
      .attr("height", function(d) { return height - yScale1(d.value); })
      .call(d3.helper.tooltip()          
                .text(function(d, i){
                  return  (("Number of Items: ").bold()+d.value);}));

});

/*-------------------------------------------------------------------------------------LinePlot-------------------------------------*/

var svg2 = d3.select("#Lineplot")
  .append("svg")
  .attr("width", width)
  .attr("height", height +1250)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + 20 + ")");


var minDate = new Date("Sun Sep 17 2017 18:00:00");
var maxDate = new Date("Mon Sep 18 2017 18:00:00");

d3.csv("./data/CompleteDb.csv", function(error, data) {

  data.forEach(function(d) {
        d.start = d.Start;
        d.end = d.End;
        d.title = d.Title;
        d.id = d.Id;
        d.link = d.Link;
    });

var xScale2 = d3.time.scale()
  .domain([minDate, maxDate])
  .range([25, width - 75]);

var yScale2 = d3.scale.ordinal()
  .rangePoints([height, padding[0]], 0.5)
  .domain(data.map(function(d) {
    return d.Id;
  })); 

// define the y axis
var yAxis2 = d3.svg.axis()
  .orient("left")
  .scale(yScale2);

// define the y axis
var xAxis2 = d3.svg.axis()
  .orient("bottom")
  .scale(xScale2)
  .tickFormat(d3.time.format("%I%p")); // <-- format


svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height +330) + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" );

var lines = svg2.selectAll(".itemLine")
  .data(data)
  .enter()
  .append("line")
  .attr("class", "itemLine")
  .attr("transform", function(d,i) {
    
    return "translate(0," + i*6 + ")";
  })
  .style("stroke", function(d){
    if (d.PubType ==="Added") {
      return "#4d9221";
    }else if (d.PubType ==="Removed") {
      return "#c51b7d"
    }else if (d.PubType ==="AddRem") {
      return "#a1d76a"
    }else if (d.PubType ==="Interrupted") {
      return "#000"    
    }else{
      return "#c5c5c5"
    }
  });

var line = lines.attr({
  'x1': function(d) {
    return xScale2(parseDate(d.start));
  },
  'x2': function(d) {
    return xScale2(parseDate(d.end));
  }
}).attr("stroke-width", 1.5);

var circleStart = svg2.selectAll(".itemCircleStart")
    .data(data)
    .enter()
  .append("circle")
    .attr("class", "itemCircleStart")
    .attr("cx", function(d) {
    return xScale2(parseDate(d.start));
  })
    .attr("cy", 0 )
    .attr("r", 3)
    .attr("transform", function(d,i) {
    
    return "translate(0," + i*6 + ")";
  })
    .call(d3.helper.tooltip()          
                .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

var circleEnd = svg2.selectAll(".itemCircleEnd")
    .data(data)
    .enter()
  .append("circle")
    .attr("class", "itemCircleEnd")
    .attr("cx", function(d) {
    return xScale2(parseDate(d.end));
  })
    .attr("cy", 0 )
    .attr("r", 3)
    .attr("transform", function(d,i) {
    
    return "translate(0," + i*6 + ")";
  })
    .call(d3.helper.tooltip()          
                .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 5)
        .attr("y", 735)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Legend:")    

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 750)
        .attr("x2", 50)
        .attr("y2", 750)
        .attr("stroke", "#4d9221")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 755)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Added articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 770)
        .attr("x2", 50)
        .attr("y2", 770)
        .attr("stroke", "#c51b7d")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 775)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Removed articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 790)
        .attr("x2", 50)
        .attr("y2", 790)
        .attr("stroke", "#a1d76a")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 795)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Added and removed articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 810)
        .attr("x2", 50)
        .attr("y2", 810)
        .attr("stroke", "#000")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 815)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Interrupted articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 830)
        .attr("x2", 50)
        .attr("y2", 830)
        .attr("stroke", "#c5c5c5")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 835)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Remaining articles")


  d3.select("#All").on("click", AllItems);
  d3.select("#Added").on("click", AddedItems);
  d3.select("#Removed").on("click", RemovedItems);
  d3.select("#AddRem").on("click", AddRemItems);
  d3.select("#Interrupted").on("click", InterruptedItems);

  // ** Update data section (Called from the onclick)

/*-----------------------------------------------------------------------------AllItems func() ------------------------------------------------*/

function AllItems() {

    // Get the data again
  d3.csv("./data/CompleteDb.csv", function(error, data) {
      
    data.forEach(function(d) {
      d.start = d.Start;
      d.end = d.End;
      d.title = d.Title;
      d.id = d.Id;
      d.link = d.Link;
    });

    svg2.selectAll(".itemLine").remove()
    svg2.selectAll(".LegText").remove()
    svg2.selectAll(".x.axis").remove()
    svg2.selectAll(".itemCircleEnd").remove()
    svg2.selectAll(".itemCircleStart").remove()
        
  var lines = svg2.selectAll(".itemLine")
      .data(data)
    .enter()          
      .append("line")
      .attr("class", "itemLine")
      .attr("transform", function(d,i) {            
        return "translate(0," + i*6 + ")";
      })
      .style("stroke", function(d){
        if (d.PubType ==="Added") {
          return "#4d9221";
        }else if (d.PubType ==="Removed") {
          return "#c51b7d"
        }else if (d.PubType ==="AddRem") {
          return "#a1d76a"
        }else if (d.PubType ==="Interrupted") {
          return "#000"    
        }else{
          return "#c5c5c5"
        }
      });

  var line = lines.attr({
              'x1': function(d) {
                return xScale2(parseDate(d.start));
              },
              'x2': function(d) {
                return xScale2(parseDate(d.end));
              }
            }).attr("stroke-width", 1.5);

  var circleStart = svg2.selectAll(".itemCircleStart")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleStart")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.start));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*6 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

  var circleEnd = svg2.selectAll(".itemCircleEnd")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleEnd")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.end));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*6 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});  

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height +330) + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" );

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 5)
        .attr("y", 735)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Legend:")    

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 750)
        .attr("x2", 50)
        .attr("y2", 750)
        .attr("stroke", "#4d9221")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 755)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Added articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 770)
        .attr("x2", 50)
        .attr("y2", 770)
        .attr("stroke", "#c51b7d")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 775)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Removed articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 790)
        .attr("x2", 50)
        .attr("y2", 790)
        .attr("stroke", "#a1d76a")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 795)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Added and removed articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 810)
        .attr("x2", 50)
        .attr("y2", 810)
        .attr("stroke", "#000")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 815)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Interrupted articles")

    svg2.append("line")
        .attr("class", "itemLine")
        .attr("x1", 5)
        .attr("y1", 830)
        .attr("x2", 50)
        .attr("y2", 830)
        .attr("stroke", "#c5c5c5")
        .attr("stroke-width", "1.5px");

    svg2.append("text")
        .attr("class", "LegText")
        .attr("x", 55)
        .attr("y", 835)
        .attr("text-anchor", "start")
        .attr("font-size", "80%")
        .text("Remaining articles")

    });/*-----------end data call-------------------------*/


} /*-----------end func-------------------------*/

/*-----------------------------------------------------------------------------AddedItems func() ------------------------------------------------*/

function AddedItems() {
    // Get the data again
  d3.csv("./data/AddedItems.csv", function(error, data) {
      
        data.forEach(function(d) {
          d.start = d.Start;
          d.end = d.End;
          d.title = d.Title;
          d.id = d.Id;
          d.link = d.Link;
        });

    svg2.selectAll(".itemLine").remove()
    svg2.selectAll(".LegText").remove()
    svg2.selectAll(".x.axis").remove()
    svg2.selectAll(".itemCircleEnd").remove()
    svg2.selectAll(".itemCircleStart").remove()
        
  var lines = svg2.selectAll(".itemLine")
      .data(data)
    .enter()          
      .append("line")
      .attr("class", "itemLine")
      .attr("transform", function(d,i) {            
        return "translate(0," + i*10 + ")";
      })
      .style("stroke", "#4d9221");

  var line = lines.attr({
                'x1': function(d) {
                  return xScale2(parseDate(d.start));
                },
                'x2': function(d) {
                  return xScale2(parseDate(d.end));
                }
              }).attr("stroke-width", 1.5);

  var circleStart = svg2.selectAll(".itemCircleStart")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleStart")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.start));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*10 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

  var circleEnd = svg2.selectAll(".itemCircleEnd")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleEnd")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.end));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*10 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});  

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height +40) + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" ); 


    });/*-----------end data call-------------------------*/


} /*-----------end func-------------------------*/

/*-----------------------------------------------------------------------------RemovedItems func() ------------------------------------------------*/

function RemovedItems() {
    // Get the data again
  d3.csv("./data/RemovedItems.csv", function(error, data) {
      
        data.forEach(function(d) {
          d.start = d.Start;
          d.end = d.End;
          d.title = d.Title;
          d.id = d.Id;
          d.link = d.Link;
        });

    svg2.selectAll(".itemLine").remove()
    svg2.selectAll(".LegText").remove()
    svg2.selectAll(".x.axis").remove()
    svg2.selectAll(".itemCircleEnd").remove()
    svg2.selectAll(".itemCircleStart").remove()
        
  var lines = svg2.selectAll(".itemLine")
      .data(data)
    .enter()          
      .append("line")
      .attr("class", "itemLine")
      .attr("transform", function(d,i) {            
        return "translate(0," + i*10 + ")";
      })
      .style("stroke", "#c51b7d");

  var line = lines.attr({
                'x1': function(d) {
                  return xScale2(parseDate(d.start));
                },
                'x2': function(d) {
                  return xScale2(parseDate(d.end));
                }
              }).attr("stroke-width", 1.5);

  var circleStart = svg2.selectAll(".itemCircleStart")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleStart")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.start));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*10 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

  var circleEnd = svg2.selectAll(".itemCircleEnd")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleEnd")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.end));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*10 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});  

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height +20) + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" ); 


    });/*-----------end data call-------------------------*/


} /*-----------end func-------------------------*/

/*-----------------------------------------------------------------------------AddRemItems func() ------------------------------------------------*/

function AddRemItems() {
    // Get the data again
  d3.csv("./data/AddRemItems.csv", function(error, data) {
      
        data.forEach(function(d) {
          d.start = d.Start;
          d.end = d.End;
          d.title = d.Title;
          d.id = d.Id;
          d.link = d.Link;
        });

    svg2.selectAll(".itemLine").remove()
    svg2.selectAll(".LegText").remove()
    svg2.selectAll(".x.axis").remove()
    svg2.selectAll(".itemCircleEnd").remove()
    svg2.selectAll(".itemCircleStart").remove()
        
  var lines = svg2.selectAll(".itemLine")
      .data(data)
    .enter()          
      .append("line")
      .attr("class", "itemLine")
      .attr("transform", function(d,i) {            
        return "translate(0," + i*10 + ")";
      })
      .style("stroke", "#a1d76a");

  var line = lines.attr({
                'x1': function(d) {
                  return xScale2(parseDate(d.start));
                },
                'x2': function(d) {
                  return xScale2(parseDate(d.end));
                }
              }).attr("stroke-width", 1.5);

  var circleStart = svg2.selectAll(".itemCircleStart")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleStart")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.start));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*10 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

  var circleEnd = svg2.selectAll(".itemCircleEnd")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleEnd")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.end));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {    
        return "translate(0," + i*10 + ")";
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});  

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height ) + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" ); 


    });/*-----------end data call-------------------------*/


} /*-----------end func-------------------------*/

/*-----------------------------------------------------------------------------InterruptedItems func() ------------------------------------------------*/

function InterruptedItems() {
    // Get the data again
  d3.csv("./data/InterruptedItems.csv", function(error, data) {
      
        data.forEach(function(d) {
          d.start = d.Start;
          d.end = d.End;
          d.title = d.Title;
          d.id = d.Id;
          d.link = d.Link;
        });

    svg2.selectAll(".itemLine").remove()
    svg2.selectAll(".LegText").remove()
    svg2.selectAll(".x.axis").remove()
    svg2.selectAll(".itemCircleEnd").remove()
    svg2.selectAll(".itemCircleStart").remove()

  var lines = svg2.selectAll(".itemLine")
      .data(data)
    .enter()          
      .append("line")
      .attr("class", "itemLine")
      .attr("transform", function(d,i) { 
      if (d.Resil ==="a") {           
        return "translate(0, 10)";
      }else{
        return "translate(0, 25)";
      }
      })
      .style("stroke", "#000");

  var line = lines.attr({
                'x1': function(d) {
                  return xScale2(parseDate(d.start));
                },
                'x2': function(d) {
                  return xScale2(parseDate(d.end));
                }
              }).attr("stroke-width", 1.5);

  var circleStart = svg2.selectAll(".itemCircleStart")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleStart")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.start));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) {
         if (d.Resil ==="a") {           
        return "translate(0, 10)";
      }else{
        return "translate(0, 25)";
      }
      })
      .call(d3.helper.tooltip()          
                    .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});

  var circleEnd = svg2.selectAll(".itemCircleEnd")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "itemCircleEnd")
      .attr("cx", function(d) {
        return xScale2(parseDate(d.end));
      })
      .attr("cy", 0 )
      .attr("r", 3)
      .attr("transform", function(d,i) { 
         if (d.Resil ==="a") {           
        return "translate(0, 10)";
      }else{
        return "translate(0, 25)";
      }
      })
      .call(d3.helper.tooltip()          
                   .text(function(d, i){
                  return  (("Title: ").bold()+d.title)
                  +"<br>"+(("Publication date: ").bold()+d.start)
                  +"<br>"+(("Withdrawal date: ").bold()+d.end)
                  +"<br>"+(("Item Id: ").bold()+d.id)                 
                  +"<br>"+(("Kicker: ").bold()+d.kicker)
                  +"<br>"+(("Category: ").bold()+d.Category)
                  +"<br>"+(("Type: ").bold()+d.Type) 
                  +"<br>"+(("Authors: ").bold()+d.Authors)   
                ;}))
      .on("click", function(d) { window.open(d.Link);});  

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height -200) + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" ); 


    });/*-----------end data call-------------------------*/


} /*-----------end func-------------------------*/

});

d3.helper = {};

d3.helper.tooltip = function(){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        var attrs = {};
        var text = '';
        var styles = {};

        function tooltip(selection){

            selection.on('mouseover.tooltip', function(pD, pI){
                var name, value;
                // Clean up lost tooltips
                d3.select('body').selectAll('div.tooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
                tooltipDiv.attr(attrs);
                //tooltipDiv.style(styles);
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style({
                    left: (absoluteMousePos[0] + 30)+'px',
                    top: (absoluteMousePos[1] - 15)+'px',
                    position: 'absolute',
                    'z-index': 1001
                });
                // Add text using the accessor function, Crop text arbitrarily
                tooltipDiv.style('width', function(d, i){ return (text(pD, pI).length > 80) ? '250px' : null; })
                    .html(function(d, i){return text(pD, pI);});
            })
            .on('mousemove.tooltip', function(pD, pI){
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style({
                    left: (absoluteMousePos[0] + 30)+'px',
                    top: (absoluteMousePos[1] - 15)+'px'
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