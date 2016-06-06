d3.json("http://mengyi-xiang.herokuapp.com/data/", function(my_data) {
// define dimensions
var cf = crossfilter(my_data);
var dim_team = cf.dimension(function(d) {
  return d.Team;
});
var dim_playoff = cf.dimension(function(d) {
	return d.Playoff;
});
var dim_conference = cf.dimension(function(d) {
	return d.Conference;
});
var dim_conference2 = cf.dimension(function(d) {
	return d.Conference;
});

//define groups and map-reduce functions
var group_team = dim_team.group().reduce(
  /* add */
  function(p, v) {
    if (v.month == "Season") {
      p["2P total"] = p["2P total"] + parseFloat(v["In The Paint FGA"]) + parseFloat(v["Restricted Area FGA"]) + parseFloat(v["Mid-Range FGA"]);
      p["2P made"] = p["2P made"] + parseFloat(v["In The Paint FGM"]) + parseFloat(v["Restricted Area FGM"]) + parseFloat(v["Mid-Range FGM"]);
      p["3P total"] = p["3P total"] + parseFloat(v["Left Corner 3 FGA"]) + parseFloat(v["Right Corner 3 FGA"]) + parseFloat(v["Above the Break 3 FGA"]);
      p["3P made"] = p["3P made"] + parseFloat(v["Left Corner 3 FGM"]) + parseFloat(v["Right Corner 3 FGM"]) + parseFloat(v["Above the Break 3 FGM"]);
      p.wins += parseFloat(v.Wins);
    }
    return p;
  },

  /* remove */
  function(p, v) {
    if (v.month == "Season") {
      p["2P total"] = p["2P total"] - parseFloat(v["In The Paint FGA"]) - parseFloat(v["Restricted Area FGA"]) - parseFloat(v["Mid-Range FGA"]);
      p["2P made"] = p["2P made"] - parseFloat(v["In The Paint FGM"]) - parseFloat(v["Restricted Area FGM"]) - parseFloat(v["Mid-Range FGM"]);
      p["3P total"] = p["3P total"] - parseFloat(v["Left Corner 3 FGA"]) - parseFloat(v["Right Corner 3 FGA"]) - parseFloat(v["Above the Break 3 FGA"]);
      p["3P made"] = p["3P made"] - parseFloat(v["Left Corner 3 FGM"]) - parseFloat(v["Right Corner 3 FGM"]) - parseFloat(v["Above the Break 3 FGM"]);
      p.wins -= parseFloat(v.Wins);
      //console.log(JSON.stringify(p));
    }
    //console.log(v.Team + v.month + JSON.stringify(p));
    return p;
  },

  /* initialize p */
  function() {
    return {
      "2P total": 0,
      "2P made": 0,
      "3P total": 0,
      "3P made": 0,
      "wins": 0
    };
  }
);

group_playoff = dim_playoff.group().reduceSum(function(d) {
  if (d.month == "Season") {
    return d.Wins;
  } else {
    return 0;
  }
});

group_conference_2p = dim_conference.group().reduce(
 /* add */
  function(p, v) {
    if (v.month == "Season") {
      p["restricted total"] += parseFloat(v["Restricted Area FGA"]);
      p["restricted made"] += parseFloat(v["Restricted Area FGM"]);
      p["paint total"] += parseFloat(v["In The Paint FGA"]);
      p["paint made"] += parseFloat(v["In The Paint FGM"]);
      p["mid total"] += parseFloat(v["Mid-Range FGA"]);
      p["mid made"] += parseFloat(v["Mid-Range FGM"]);
    }
    return p;
  },

  /* remove */
  function(p, v) {
    if (v.month == "Season") {
      p["restricted total"] -= parseFloat(v["Restricted Area FGA"]);
      p["restricted made"] -= parseFloat(v["Restricted Area FGM"]);
      p["paint total"] -= parseFloat(v["In The Paint FGA"]);
      p["paint made"] -= parseFloat(v["In The Paint FGM"]);
      p["mid total"] -= parseFloat(v["Mid-Range FGA"]);
      p["mid made"] -= parseFloat(v["Mid-Range FGM"]);
    }
    //console.log(v.Team + v.month + JSON.stringify(p));
    return p;
  },

  /* initialize p */
  function() {
    return {
      "restricted total": 0,
      "restricted made": 0,
			"paint total": 0,
      "paint made": 0,
      "mid total": 0,
      "mid made": 0
    };
  }
);

group_conference_3p = dim_conference2.group().reduce(
 /* add */
  function(p, v) {
    if (v.month == "Season") {
      p["left corner total"] += parseFloat(v["Left Corner 3 FGA"]);
      p["left corner made"] += parseFloat(v["Left Corner 3 FGM"]);
      p["right corner total"] += parseFloat(v["Right Corner 3 FGA"]);
      p["right corner made"] += parseFloat(v["Right Corner 3 FGM"]);
      p["above the break total"] += parseFloat(v["Above the Break 3 FGA"]);
      p["above the break made"] += parseFloat(v["Above the Break 3 FGM"]);
    }
    return p;
  },

  /* remove */
  function(p, v) {
    if (v.month == "Season") {
      p["left corner total"] -= parseFloat(v["Left Corner 3 FGA"]);
      p["left corner made"] -= parseFloat(v["Left Corner 3 FGM"]);
      p["right corner total"] -= parseFloat(v["Right Corner 3 FGA"]);
      p["right corner made"] -= parseFloat(v["Right Corner 3 FGM"]);
      p["above the break total"] -= parseFloat(v["Above the Break 3 FGA"]);
      p["above the break made"] -= parseFloat(v["Above the Break 3 FGM"]);
    }
    //console.log(v.Team + v.month + JSON.stringify(p));
    return p;
  },

  /* initialize p */
  function() {
    return {
      "left corner total": 0,
      "left corner made": 0,
			"right corner total": 0,
      "right corner made": 0,
      "above the break total": 0,
      "above the break made": 0
    };
  }
);

// build bubble chart showing shooting percentages by teams using dc.js
var teamBubbleChart = dc.bubbleChart("#teamBubbleChart")
  .width(750)
  .height(380)
  //.margins({top: 10, right: 50, bottom: 20, left: 40})
  .dimension(dim_team)
  .group(group_team)
  //.colors(function(d) {return colorScale(d.value.wins);} )
  .colors(['#dadaeb', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd'])
  .colorDomain([-10, 73])
  .colorAccessor(function(d) {
    return d.value.wins;
  })
  .keyAccessor(function(p) {
    return p.value["2P made"] / (p.value["2P total"] + 0.001);
  })
  .valueAccessor(function(p) {
    return p.value["3P made"] / (p.value["3P total"] + 0.001);
  })
  .radiusValueAccessor(function(p) {
    return p.value.wins;
  })
  .renderLabel(true)
  .label(function(p) {
   arr = p.key.split(" ");
   return arr.pop();
  })
  .maxBubbleRelativeSize(0.2)
  .x(d3.scale.linear().domain([0.445, 0.538]))
  .y(d3.scale.linear().domain([0.31, 0.43]))
  .r(d3.scale.linear().domain([0, 500]))
  //.elasticY(true)
  //.elasticX(true)
  .xAxisLabel('2P percentage')
  .yAxisLabel('3P percentage')
  //.elasticRadius(true)
  .yAxisPadding(0.01)
  .xAxisPadding(0.01)
  .renderTitle(true)
  .title(function (d) {
      return [d.key, "Wins: " + d.value.wins, "2P%: " + Math.round(d.value["2P made"] / (d.value["2P total"] + 0.001)*1000)/10 + "%", "3P%: " + Math.round(d.value["3P made"] / (d.value["3P total"] + 0.001)*1000)/10 + "%"].join("\n");
   });

teamBubbleChart.yAxis().tickFormat(function(v) {
  return v * 100 + '%';
})
teamBubbleChart.xAxis().tickFormat(function(v) {
  return v * 100 + '%';
});

// build pie chart showing regular season wins by playoff/non-playoff teams
var pie_params = new function(){
  this.width = 380;
  this.height = 380;
  this.r_scale = .75;
  this.r_outer = this.width/2 * this.r_scale;
  this.r_inner = this.width/4 * this.r_scale; // donut
}();

//console.log(JSON.stringify(group_playoff.top(Infinity)));
var playoffPieChart = dc.pieChart("#playoffPieChart")
  .dimension(dim_playoff)
  .group(group_playoff)
  .width(pie_params.width)
  .height(pie_params.height)
  .radius(pie_params.r_outer)
  //.innerRadius(pie_params.r_inner)
  .slicesCap(4)
  .minAngleForLabel( 2*Math.PI * .10 )
  .renderLabel(true)
  .label(function (d) {
  		//console.log(d);
      return (d.data.key != "Yes") ? ("Nonplayoff Teams " + "Wins:" + d.value) : ("Playoff Teams " + "Wins:" + d.value);
   });

//console.log(JSON.stringify(group_conference_2p.top(Infinity)));

// build bar chart showing two pointer shooting percentages by eastern/westerns teams
var conference2pBarChart = dc.barChart("#conference2pBarChart")
  .width(375)
  .height(200)
  .margins({top: 10, right: 50, bottom: 20, left: 40})
  .dimension(dim_conference)
  .group(group_conference_2p, "Restricted Area 2P%")
  .valueAccessor(function(p) {
    //console.log("p.value.average: ", p.value.average) //displays the avg fine
    return p.value["restricted made"] / (p.value["restricted total"] + 0.0001);
})
	.stack(group_conference_2p, "In the Paint 2P%", function(p) {
  return p.value["paint made"] / (p.value["paint total"] + 0.0001);
  })
  .stack(group_conference_2p, "Mid-Range 2P%", function(p) {
  return p.value["mid made"] / (p.value["mid total"] + 0.0001);
  })
  //.elasticY(true)
  .y(d3.scale.linear().domain([0.3, 1.6]))
  .yAxisPadding(0.01)
  .x(d3.scale.ordinal().domain(["Western", "Eastern"]))
  .xUnits(dc.units.ordinal)
  .elasticX(true)
  .centerBar(true)
  .gap(40)
  .renderTitle(true)
  .title(function(d) {
  //console.log(d);
  if (d.layer == 0) {
  	return "Restricted Area: " + Math.round(d.data.value["restricted made"] / (d.data.value["restricted total"] + 0.001)*1000)/10 + "%";
  } else if (d.layer == 1) {
  	return "In the Paint: " + Math.round(d.data.value["paint made"] / (d.data.value["paint total"] + 0.001)*1000)/10 + "%";
  } else {
  	return "Mid-range: " + Math.round(d.data.value["mid made"] / (d.data.value["mid total"] + 0.001)*1000)/10 + "%";
  }
    })
 .legend(dc.legend().x(250).itemHeight(13).gap(5))
 .yAxis().tickFormat(function(v) {
  return Math.round(v * 1000)/10 + '%';
	});


// build bar chart showing three pointer shooting percentages by eastern/westerns teams
var conference3pBarChart = dc.barChart("#conference3pBarChart")
  .width(375)
  .height(200)
  .margins({top: 10, right: 50, bottom: 20, left: 40})
  .dimension(dim_conference2)
  .group(group_conference_3p, "Above the Break 3P%")
  .valueAccessor(function(p) {
    //console.log("p.value.average: ", p.value.average) //displays the avg fine
    return p.value["above the break made"] / (p.value["above the break total"] + 0.0001);
})
	.stack(group_conference_3p, "Reft Corner 3P%", function(p) {
  return p.value["left corner made"] / (p.value["left corner total"] + 0.0001);
  })
  .stack(group_conference_3p, "Right Corner 3P%", function(p) {
  return p.value["right corner made"] / (p.value["right corner total"] + 0.0001);
  })
  //.elasticY(true)
  .y(d3.scale.linear().domain([0.1, 1.3]))
  .yAxisPadding(0.01)
  .x(d3.scale.ordinal().domain(["Western", "Eastern"]))
  .xUnits(dc.units.ordinal)
  .elasticX(true)
  .centerBar(true)
  .gap(40)
  .renderTitle(true)
  .title(function(d) {
  //console.log(d);
  if (d.layer == 0) {
  	return "Above the Break 3P: " + Math.round(d.data.value["above the break made"] / (d.data.value["above the break total"] + 0.001)*1000)/10 + "%";
  } else if (d.layer == 1) {
  	return "Left Corner 3P: " + Math.round(d.data.value["left corner made"] / (d.data.value["left corner total"] + 0.001)*1000)/10 + "%";
  } else {
  	return "Right Corner 3P: " + Math.round(d.data.value["right corner made"] / (d.data.value["right corner total"] + 0.001)*1000)/10 + "%";
  }
    })
 .legend(dc.legend().x(250).itemHeight(13).gap(5))
 .yAxis().tickFormat(function(v) {
  return Math.round(v * 1000)/10 + '%';
	});
/*
playoffPieChart.on("filtered", function(chart){
 console.log("filter applied on playoffPieChart");
 console.log("Active filters = ", chart.filters());
});

teamBubbleChart.on("filtered", function(chart){
 console.log("filter applied on teamBubbleCart");
 console.log("Active filters = ", chart.filters());
});
*/

dc.renderAll();

});

d3.json("http://mengyi-xiang.herokuapp.com/data/", function(my_data) {


var hist = function(data_in, chart_id, value, chart_title) {

  var margin = {
      "top": 40,
      "right": 30,
      "bottom": 70,
      "left": 45
    },
    width = 1000 - margin.left - margin.right,
    height = 245 - margin.top - margin.bottom;

  var colors = [["Western", "#9467bd"], ["Eastern", "#e377c2"]];

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0.35, d3.max(data_in, function(d) {
      return d.value[value];
    })])
    .range([height, 0]);

  d3.select("#" + chart_id).remove();

  var div = d3.select("#project_container").append("div").attr("id", chart_id);

  div.append("h4").text(chart_title);

  var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data_in)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(" + x(i / data_in.length) + "," + y(d.value[value]) + ")";
    });

  bar.append("rect")
    .attr("x", 1)
    .attr("width", width / data_in.length - 3)
    .attr("height", function(d) {
      return height - y(d.value[value]);
    })
    .style("fill", function(d) {
     //console.log(d.value.conference);
    	return d.value.conference == "Western"? colors[0][1] : colors[1][1]
    })
    .style("shape-rendering", "crispEdges");


  var formatCount = d3.format("0%");

  bar.append("text")
    .attr("dy", "-1em")
    .attr("y", 6)
    .attr("x", (width / data_in.length - 1) / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .text(function(d) {
      return formatCount(d.value[value]);
    });

  var unique_names = data_in.map(function(d) {
    arr = d.key.split(" ");
    return arr.pop();
  });
  unique_names.push("");
  //console.log(unique_names);
  var xScale = d3.scale.ordinal().domain(unique_names).rangePoints([0, width]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var xTicks = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10)
    .attr("transform", function(d) {
      return "rotate(-50)"
    });


  var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("0%"));

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10);


  // add legend
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 100)
    .attr('transform', 'translate(-20,50)');

  var legendRect = legend.selectAll('rect').data(colors);

  legendRect.enter()
    .append("rect")
    .attr("x", 25)
    .attr("width", 10)
    .attr("height", 10);

  legendRect
    .attr("y", function(d, i) {
      return i * 15 - 88;
    })
    .style("fill", function(d) {
      //console.log(d[1]);
      return d[1];
    });

  var legendText = legend.selectAll('text').data(colors);

  legendText.enter()
    .append("text")
    .attr("x", 45)
    .style("font-size", "10px");

  legendText
    .attr("y", function(d, i) {
      return i * 15 - 79;
    })
    .text(function(d) {
      //console.log(d[0]);
      return d[0];
    });

}

// draw a histogram showing overall season team shooting performance by distance using d3.js
var hist2 = function(data_in, chart_id, value, chart_title) {

  var margin = {
      "top": 47,
      "right": 30,
      "bottom": 70,
      "left": 45
    },
    width = 1000 - margin.left - margin.right,
    height = 255 - margin.top - margin.bottom;

  var color = d3.scale.ordinal()
    .range(["#1f77b4", "#fd8d3c"]);

  var names = data_in.map(function(d) {
    return d.key;
  });

data_in.forEach(function(d) {
    d.per = ["2P perc", "3P perc"].map(function(name) { return {name: name, value: +d.value[name]}; });
  });


  var x0 = d3.scale.ordinal()
    .rangeRoundBands([-0.5, width], 0.15)
    .domain(data_in.map(function(d) {
    	arr = d.key.split(" ");
    	return arr.pop(); }));

  var x1 = d3.scale.ordinal()
  	.domain(["2P perc", "3P perc"])
    .rangeRoundBands([0, x0.rangeBand()]);

  var y = d3.scale.linear()
    .domain([0.27, d3.max(data_in, function(d) {
      //console.log(d.per);
      return d3.max(d.per, function(d) {return d.value; }); })])
    .range([height, 0]);

  d3.select("#" + chart_id).remove();

  var div = d3.select("#project_container").append("div").attr("id", chart_id);

  div.append("h4").text(chart_title);

  var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data_in)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      arr = d.key.split(" ");
      return "translate(" + x0(arr.pop()) + ",0)";
    });

  bar.selectAll("rect")
     .data(function(d) { return d.per; })
    .enter().append("rect")
    //.attr("x", 1)
    .attr("width", x1.rangeBand())
    .attr("x", function(d) { return x1(d.name); })
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) {
      return height - y(d.value);
    })
 		.style("fill", function(d) { return color(d.name); })
    .style("shape-rendering", "crispEdges");

  var formatCount = d3.format("0%");


  bar.selectAll("text")
  	.data(function(d) { return d.per; })
    .enter().append("text")
    .attr("dy", "-1em")
    //.attr("y", 6)
    .attr("y", function(d) { return y(d.value); })
    .attr("x", function(d) { return x1(d.name) + 8; })
    .attr("text-anchor", "middle")
    .text(function(d) {
      //console.log(d);
      return formatCount(d.value);
    })
    .attr("font-size", "8px");

  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

  var xTicks = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10)
    .attr("transform", function(d) {
      return "rotate(-50)"
    });


  var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("0%"));

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10);

   var legend = svg.selectAll(".legend")
      .data(["2P%", "3P%"])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

  legend.append("rect")
      .attr("x", 20)
      .attr("y", -35)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color);

  legend.append("text")
      .attr("x", 64)
      .attr("y", -30)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .attr("font-size", 10)
      .text(function(d) { return d; });

}

// define dimensions
var cf = crossfilter(my_data);
var dim_team = cf.dimension(function(d) {
  return d.Team;
});
var dim_playoff = cf.dimension(function(d) {
  return d.Playoff;
});
var dim_conference = cf.dimension(function(d) {
  return d.Conference;
});
var dim_conference2 = cf.dimension(function(d) {
  return d.Conference;
});

var month_ordinal = {"November":1, "December":2, "January":3, "Febuary":4, "March":5, "April":6};

var month_rev = {1:"Nov", 2:"Dec", 3:"Jan", 4:"Feb", 5:"Mar", 6:"Apr"};

var dim_month = cf.dimension(function(d) {
	return month_ordinal[d.month];
});


// define groups
var group_team2 = dim_team.group().reduce(
  /* add */
  function(p, v) {
    if (v.month != "Season") {
      p["total"] = p["total"] + parseFloat(v["In The Paint FGA"]) + parseFloat(v["Restricted Area FGA"]) + parseFloat(v["Mid-Range FGA"]) + parseFloat(v["Left Corner 3 FGA"]) + parseFloat(v["Right Corner 3 FGA"]) + parseFloat(v["Above the Break 3 FGA"]);

      p["made"] = p["made"] + parseFloat(v["In The Paint FGM"]) + parseFloat(v["Restricted Area FGM"]) + parseFloat(v["Mid-Range FGM"]) + parseFloat(v["Left Corner 3 FGM"]) + parseFloat(v["Right Corner 3 FGM"]) + parseFloat(v["Above the Break 3 FGM"]);

      p["perc"] = p["made"] / (p["total"] + 0.0001);
      if (v.Conference != "Western") {p.conference = "Eastern"};
    }
    return p;
  },

  /* remove */
  function(p, v) {
    if (v.month != "Season") {
      p["total"] = p["total"] - parseFloat(v["In The Paint FGA"]) - parseFloat(v["Restricted Area FGA"]) - parseFloat(v["Mid-Range FGA"]) - parseFloat(v["Left Corner 3 FGA"]) - parseFloat(v["Right Corner 3 FGA"]) - parseFloat(v["Above the Break 3 FGA"]);

      p["made"] = p["made"] - parseFloat(v["In The Paint FGM"]) - parseFloat(v["Restricted Area FGM"]) - parseFloat(v["Mid-Range FGM"]) - parseFloat(v["Left Corner 3 FGM"]) - parseFloat(v["Right Corner 3 FGM"]) - parseFloat(v["Above the Break 3 FGM"]);

      p["perc"] = p["made"] / (p["total"] + 0.0001);
      if (v.Conference != "Western") {p.conference = "Eastern"};
    }
    //console.log(v.Team + v.month + JSON.stringify(p));
    return p;
  },

  /* initialize p */
  function() {
    return {
      "total": 0,
      "made": 0,
      "perc": 0,
      "conference": "Western"
    };
  }
);

// define groups
var group_team3 = dim_team.group().reduce(
  /* add */
  function(p, v) {
    if (v.month != "Season") {
      p["2P total"] = p["2P total"] + parseFloat(v["In The Paint FGA"]) + parseFloat(v["Restricted Area FGA"]) + parseFloat(v["Mid-Range FGA"]);
      p["2P made"] = p["2P made"] + parseFloat(v["In The Paint FGM"]) + parseFloat(v["Restricted Area FGM"]) + parseFloat(v["Mid-Range FGM"]);
      p["3P total"] = p["3P total"] + parseFloat(v["Left Corner 3 FGA"]) + parseFloat(v["Right Corner 3 FGA"]) + parseFloat(v["Above the Break 3 FGA"]);
      p["3P made"] = p["3P made"] + parseFloat(v["Left Corner 3 FGM"]) + parseFloat(v["Right Corner 3 FGM"]) + parseFloat(v["Above the Break 3 FGM"]);
 			p["2P perc"] = p["2P made"] / (p["2P total"] + 0.0001);
      p["3P perc"] = p["3P made"] / (p["3P total"] + 0.0001);
    }
    return p;
  },

  /* remove */
  function(p, v) {
    if (v.month != "Season") {
      p["2P total"] = p["2P total"] - parseFloat(v["In The Paint FGA"]) - parseFloat(v["Restricted Area FGA"]) - parseFloat(v["Mid-Range FGA"]);
      p["2P made"] = p["2P made"] - parseFloat(v["In The Paint FGM"]) - parseFloat(v["Restricted Area FGM"]) - parseFloat(v["Mid-Range FGM"]);
      p["3P total"] = p["3P total"] - parseFloat(v["Left Corner 3 FGA"]) - parseFloat(v["Right Corner 3 FGA"]) - parseFloat(v["Above the Break 3 FGA"]);
      p["3P made"] = p["3P made"] - parseFloat(v["Left Corner 3 FGM"]) - parseFloat(v["Right Corner 3 FGM"]) - parseFloat(v["Above the Break 3 FGM"]);
      //console.log(JSON.stringify(p));
      p["2P perc"] = p["2P made"] / (p["2P total"] + 0.0001);
      p["3P perc"] = p["3P made"] / (p["3P total"] + 0.0001);
    }
    //console.log(v.Team + v.month + JSON.stringify(p));
    return p;
  },

  /* initialize p */
  function() {
    return {
      "2P total": 0,
      "2P made": 0,
      "2P perc": 0,
      "3P total": 0,
      "3P made": 0,
			"3P perc": 0
      };
  }
);

var render_plots = function() {

  //console.log(JSON.stringify(group_team2.top(Infinity)));
  hist(group_team2.top(Infinity),
    "shooting_by_team",
    "perc",
    "NBA 2015-16 Regular Season Overall Team Shooting Performance"
  );

  hist2(group_team3.top(Infinity),
    "shooting_by_distance",
    "perc",
    "NBA 2015-16 Regular Season Team Shooting Performance by Distance"
  );
}

// define month slider
var month_slider = new Slider(
      "#month_slider", {
        "id": "month_slider",
        "min": 1,
        "max": 6,
        "range": true,
        "value": [1, 6]
      });

month_slider.on("slide", function(e) {
      d3.select("#month_slider_txt").text("from: " + month_rev[e[0]] + " to: " + month_rev[e[1]]);

      // filter based on the UI element
      dim_month.filter(e);

      // re-render
      render_plots();

    });

render_plots();

});