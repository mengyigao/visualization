// C3 init

var data1 = [
  ["OffRtg", 112.5, 108.9, 110.1, 108.1],
  ["DefRtg", 101.0, 96.4, 103.2, 102.2]
];

var data2 = [
  ["FG%", 48.8, 48.7, 47.8, 46.0],
  ["AST%", 68.2, 61.3, 55.7, 59.0],
  ["REB%", 51.3, 52.2, 54.8, 52.1]
];

var data3 = [
  ["x", "2015-11", "2015-12", "2016-01"],
  ["GSW-OffRtg", 113.6, 109.3, 115.3],
  ["SAS-OffRtg", 106.5, 111.8, 114.0],
  ["OKC-OffRtg", 106.9, 112.4, 110.1],
  ["CLE-OffRtg", 106.7, 99.6, 112.9],
  ["GSW-DefRtg", 97.1, 100.1, 100.2],
  ["SAS-DefRtg", 93.4, 91.5, 100.7],
  ["OKC-DefRtg", 100.0, 100.4, 102.8],
  ["CLE-DefRtg", 102.1, 97, 104.7]
]

var my_chart_parameters = {
  "data": {
    "columns": data1,
    "type": "bar",
    "selection": {
      "enabled": true
    },
    "colors": {
      "OffRtg": "3399ff",
      "DefRtg": "ff9933"
    }
  },
  "grid": {
    "x": {
      "show": false
    },
    "y": {
      "show": true
    }
  },
  "tooltip": {
    "show": true,
    "grouped": true
  },
  axis: {
    x: {
      type: 'category',
      categories: ['Warriors', 'Spurs', 'Thunder', 'Cavaliers']
    },
    y: {
      label: 'Off/Def Ratings',
      min: 80
    }
  }
};

var my_chart_parameters2 = {
  "data": {
    "x": "x",
    "xFormat": "%Y-%m",
    "columns": data3,
    "type": "line",
    "selection": {
      "enabled": true
    },
    "colors": {
      "GSW-OffRtg": "000066",
      "SAS-OffRtg": "3333ff",
      "OKC-OffRtg": "6699ff",
      "CLE-OffRtg": "99ccff",
      "GSW-DefRtg": "800000",
      "SAS-DefRtg": "ff5050",
      "OKC-DefRtg": "ff9999",
      "CLE-DefRtg": "ffcccc"
    }
  },
  "point": {
    "r": 5,
    "focus": {
      "expand": {
        "r": 7,
        "enabled": true
      }
    }
  },
  "grid": {
    "x": {
      "show": false
    },
    "y": {
      "show": true
    }
  },
  "tooltip": {
    "show": true,
    "grouped": true
  },
  axis: {
    x: {
      type: "timeseries",
      tick: {
        format: "%Y-%m"
      }
    },
    y: {
      label: 'Off/Def Ratings',
      min: 80
    }
  }
};

var my_chart_object = c3.generate(my_chart_parameters);

// slides

var slide_0 = function() {
  my_chart_object = c3.generate(my_chart_parameters);
  document.getElementById("message").innerHTML = "Offence and defence performance for the season";
};

var slide_1 = function() {
  my_chart_object.focus(["OffRtg"]);
  document.getElementById("message").innerHTML = "The Warriors has the highest offensive rating";
};

var slide_2 = function() {
  my_chart_object.focus(["DefRtg"]);
  document.getElementById("message").innerHTML = "The Spurs has the lowest defensive rating";
};

var slide_3 = function() {
  my_chart_object.load({
    "columns": data2,
    "unload": my_chart_object.columns,
    "colors": {
      "FG%": "66b3ff",
      "AST%": "cc99ff",
      "REB%": "ff99bb"
    }
  });
  my_chart_object.axis.min({
    y: 40
  });
  my_chart_object.axis.labels({
    y: "FG%/AST%/REB%"
  });
  document.getElementById("message").innerHTML = "Field Goals, Assists and rebounds performance";
};

var slide_4 = function() {
  my_chart_object.focus(["AST%"]);
  document.getElementById("message").innerHTML = "The Warriors has the highest assist percentage";
};

var slide_5 = function() {
  my_chart_object.focus(["REB%"]);
  document.getElementById("message").innerHTML = "The Thunder has the highest rebound percentage";
};

var slide_6 = function() {
  my_chart_object = c3.generate(my_chart_parameters2);
  document.getElementById("message").innerHTML = "Let's take a look at the monthly Offensive/Defensive Rating";
  setTimeout(function() {
    document.getElementById("message").innerHTML = "Before all-star break";
  }, 2000);
}

var slide_7 = function() {
  document.getElementById("start_btn").disabled = true;
  my_chart_object.flow({
    "columns": [
      ["x", "2016-02", "2016-03"],
      ["GSW-OffRtg", 110.4, 112.3],
      ["SAS-OffRtg", 110.7, 107.8],
      ["OKC-OffRtg", 111.6, 109.5],
      ["CLE-OffRtg", 108.0, 111.3],
      ["GSW-DefRtg", 105.4, 102.8],
      ["SAS-DefRtg", 99.1, 97.2],
      ["OKC-DefRtg", 109.4, 103.1],
      ["CLE-DefRtg", 103.5, 104.4]
    ],
    "length": 1,
    "duration": 1000,
    "done": function() {
      document.getElementById("start_btn").disabled = false;
    }
  });
  document.getElementById("message").innerHTML = "After all-star break";
}

var slides_8 = function() {
  my_chart_object.transform("bar", ["GSW-OffRtg", "SAS-OffRtg", "OKC-OffRtg", "CLE-OffRtg"]);
  setTimeout(function() {
    my_chart_object.transform("bar", ["GSW-DefRtg", "SAS-DefRtg", "OKC-DefRtg", "CLE-DefRtg"]);
  }, 1000);
  document.getElementById("message").innerHTML = "In bar chart";
}

var slides_9 = function() {
  my_chart_object.axis.min({
    y: 0
  });
  my_chart_object.groups([
    ["GSW-OffRtg", "SAS-OffRtg", "OKC-OffRtg", "CLE-OffRtg"]
  ]);
  setTimeout(function() {
    my_chart_object.groups([
      ["GSW-OffRtg", "SAS-OffRtg", "OKC-OffRtg", "CLE-OffRtg"],
      ["GSW-DefRtg", "SAS-DefRtg", "OKC-DefRtg", "CLE-DefRtg"]
    ]);
  }, 1000);
  document.getElementById("message").innerHTML = "Overall monthly Offensive/Defensive rating";
}

var slides = [slide_0, slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slides_8, slides_9];

// cycle through slides

var current_slide = 0;
var current_slide2 = 0;

var run = function() {
  slides[current_slide]();
  current_slide += 1;

  if (current_slide === 1) {
    document.getElementById("start_btn").innerHTML = "Start";
  } else if (current_slide === slides.length) {
    current_slide = 0;
    document.getElementById("start_btn").innerHTML = "Replay";
  } else {
    document.getElementById("start_btn").innerHTML = "Continue";
  }
};

var timer;
var running = false;
var run2 = function() {
	running = !running;
	if(running){
    document.getElementById("auto_btn").innerHTML = "Pause";
    timer = setInterval(function() {
      if (current_slide2 == slides.length) current_slide2 = 0;
      slides[current_slide2]();
      current_slide2++;
    }, 2000);
    }
    else{
    	document.getElementById("auto_btn").innerHTML = "Autoplay";
    	clearInterval(timer);
    }
  }
  // button event handler

document.getElementById('start_btn').addEventListener("click", run);

document.getElementById('auto_btn').addEventListener("click", run2);

run();
