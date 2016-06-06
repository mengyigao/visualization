var hist = function(data_in, chart_id, value, chart_title, total = false, left = true) {

  var margin = {
      "top": 30,
      "right": 30,
      "bottom": 50,
      "left": 30
    },
    width = 550 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data_in, function(d) {
      return d.value[value];
    })])
    .range([height, 0]);

  d3.select("#" + chart_id).remove();

  var div = d3.select("#crossfilter_baseball_container").append("div").attr("id", chart_id);
  //console.log("this is div:", div);
  document.getElementById(chart_id).style.cssFloat = "left";
  var textLabels = div.append("h3").text(chart_title);

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
    .attr("width", width / data_in.length - 1)
    .attr("height", function(d) {
      return height - y(d.value[value]);
    });

  var formatCount = d3.format(",.0f");

  	 bar.append("text")
    .attr("dy", "-.9em")
    .attr("y", 5)
    .attr("x", (width / data_in.length - 1) / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .text(function(d) {
      return formatCount(d.value[value]);
    });

	if (total == false) {
  	var unique_names = data_in.map(function(d) {
    return d.key;
  });
  } else {
  	var unique_names = data_in.map(function(d) {
    return d.key*10 + "-" + (d.key+1)*10;
  });
  }
  unique_names.push("");

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
    .orient("left");

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10);
}

d3.json("https://tranquil-peak-82564.herokuapp.com/api/v1.0/data/baseball/limit/100/",
  function(error, games_json) {

    var cf = crossfilter(games_json);
    var dim_team = cf.dimension(function(d) {
      return d.team_id;
    });
    var dim_ngames = cf.dimension(function(d) {
      return d.g_all;
    });
    /* add more dimensions here */
    var dim_year = cf.dimension(function(d) {
      return d.year;
    });
    var dim_playerid = cf.dimension(function(d) {
    	return d.player_id.charCodeAt(0);
    });
    var dim_teamid = cf.dimension(function(d) {
      return d.team_id.charCodeAt(0);
    });

    var group_team = dim_team.group();
    var group_year = dim_year.group();
    var group_total_by_10 = dim_ngames.group(function(v) {return Math.floor(v/10); });
    /* add more groups here */


    // sanity check
    /*
    group_team
      .top(Infinity)
      .forEach(function(d, i) {
        console.log(JSON.stringify(d));
      });

    */

    /* ---------------------------------------------------------

    	Add a third and 4th variable to this map reduction
      - the third should be the minimum year
      - the fourth should be the maximum year
      - hint: use inequalities

    */

    var reduce_init = function() {
      return {
        "count": 0,
        "total": 0,
        "min_year": 3000,
        "max_year": 0
      };
    }

    var reduce_add = function(p, v, nf) {
      ++p.count;
      p.total += v.g_all;
      if (parseInt(v.year) < parseInt(p.min_year)) {
        p.min_year = parseInt(v.year);
      }
      if (parseInt(v.year) > parseInt(p.max_year)) {
        p.max_year = parseInt(v.year);
      }
      return p;
    }

    var reduce_remove = function(p, v, nf) {
      --p.count;
      p.total -= v.g_all;
      return p;
    }

    /* --------------------------------------------------------- */

    group_team.reduce(reduce_add, reduce_remove, reduce_init);
    group_year.reduce(reduce_add, reduce_remove, reduce_init);
    group_total_by_10.reduce(reduce_add, reduce_remove, reduce_init);
/*
    group_total_by_10
      .top(Infinity)
      .forEach(function(d, i) {
        console.log(JSON.stringify(d));
      });
      */
    /* reduce the more groups here */

    var team_count_btn = true;
    document.getElementById('team_cnt_btn').addEventListener("click", function() {
      team_count_btn = true;
      render_plots();
    });

    document.getElementById('team_tot_btn').addEventListener("click", function() {
      team_count_btn = false;
      render_plots();
    });

    var year_count_btn = true;
    document.getElementById('year_cnt_btn').addEventListener("click", function() {
      year_count_btn = true;
      render_plots();
    });

    document.getElementById('year_tot_btn').addEventListener("click", function() {
      year_count_btn = false;
      render_plots();
    });

    var render_plots = function() {
      // count refers to a specific key specified in reduce_init
      // and updated in reduce_add and reduce_subtract
      // Modify this for the chart to plot the specified variable on the y-axis
      d3.select("#" + "appearances_by_team").remove();
      d3.select("#" + "total_game_by_team").remove();
      if (team_count_btn) {
        hist(group_team.top(Infinity),
          "appearances_by_team",
          "count",
          "# of Appearances by Team"
        );
      } else {
        hist(group_team.top(Infinity),
          "total_game_by_team",
          "total",
          "# of Total Games by Team"
        );
      }

      /* build more charts here */
	  d3.select("#" + "appearances_by_year").remove();
      d3.select("#" + "total_game_by_year").remove();
      if (year_count_btn) {
        hist(group_year.top(Infinity),
          "appearances_by_year",
          "count",
          "# of Appearances by Year"
        );
      } else {
        hist(group_year.top(Infinity),
          "total_game_by_year",
          "total",
          "# of Total Games by Year"
        );
      }

      hist(group_total_by_10.top(Infinity),
          "appearances_by_total",
          "count",
          "# of Appearances by Total Games",
          true
        );

    }


    /* ---------------------------------------------------------
       this is a slider, see the html section above
    */
    var n_games_slider = new Slider(
      "#n_games_slider", {
        "id": "n_games_slider",
        "min": 0,
        "max": 100,
        "range": true,
        "value": [0, 100]
      });

    /* add at least 3 more sliders here */
    var year_slider = new Slider(
      "#year_slider", {
        "id": "year_slider",
        "min": 1870,
        "max": 1910,
        "range": true,
        "value": [1870, 1910]
      });

      var playerid_slider = new Slider(
      "#playerid_slider", {
        "id": "playerid_slider",
        "min": 97,
        "max": 122,
        "range": true,
        "value": [97, 122]
      });

      var teamid_slider = new Slider(
      "#teamid_slider", {
        "id": "teamid_slider",
        "min": 65,
        "max": 90,
        "range": true,
        "value": [65, 90]
      });

    // this is an event handler for a particular slider
    n_games_slider.on("slide", function(e) {
      d3.select("#n_games_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

      // filter based on the UI element
      dim_ngames.filter(e);

      // re-render
      render_plots();

      /* update the other charts here
       hint: each one of your event handlers needs to update all of the charts
      */
    });


    /* add at least 3 more event handlers here */
    year_slider.on("slide", function(e) {
      d3.select("#year_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

      // filter based on the UI element
      dim_year.filter(e);

      // re-render
      render_plots();

      /* update the other charts here
       hint: each one of your event handlers needs to update all of the charts
      */
    });

		  playerid_slider.on("slide", function(e) {
      d3.select("#playerid_slider_txt").text("min: " + String.fromCharCode(e[0]) + ", max: " + String.fromCharCode(e[1]));

      // filter based on the UI element
      dim_playerid.filter(e);

      // re-render
      render_plots();

      /* update the other charts here
       hint: each one of your event handlers needs to update all of the charts
      */
    });

    teamid_slider.on("slide", function(e) {
      d3.select("#teamid_slider_txt").text("min: " + String.fromCharCode(e[0]) + ", max: " + String.fromCharCode(e[1]));

      // filter based on the UI element
      dim_teamid.filter(e);

      // re-render
      render_plots();

      /* update the other charts here
       hint: each one of your event handlers needs to update all of the charts
      */
    });

    /* --------------------------------------------------------- */



    render_plots(); // this just renders the plots for the first time

  });
