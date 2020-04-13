(function() {
  var Chart, Telemachus, addTelemetry, charts, customCharts, customLayouts, dateString, defaultLayout, durationString, hourMinSec, layouts, missionTimeString, orderOfMagnitude, reloadLayout, removeTelemetry, resetChart, setChart, setLayout, siUnit, standardCharts, standardLayouts, stripInsignificantZeros, testCharts, testLayouts,
    slice = [].slice;

  standardCharts = {
    "Altitude": {
      series: ["v.altitude", "v.heightFromTerrain"],
      yaxis: {
        label: "Altitude",
        unit: "m",
        min: 0,
        max: null
      }
    },
    "Apoapsis and Periapsis": {
      series: ["o.ApA", "o.PeA"],
      yaxis: {
        label: "Altitude",
        unit: "m",
        min: 0,
        max: null
      }
    },
    "Atmospheric Density": {
      series: ["v.atmosphericDensity"],
      yaxis: {
        label: "Altitude",
        unit: "Pa",
        min: 0,
        max: null
      }
    },
    "Dynamic Pressure": {
      series: ["v.dynamicPressure"],
      yaxis: {
        label: "Dynamic Pressure",
        unit: "Pa",
        min: 0,
        max: null
      }
    },
    "G-Force": {
      series: ["s.sensor.acc"],
      yaxis: {
        label: "Acceleration",
        unit: "Gs",
        min: null,
        max: null
      }
    },
    "Gravity": {
      series: ["s.sensor.grav"],
      yaxis: {
        label: "Gravity",
        unit: "m/s\u00B2",
        min: 0,
        max: null
      }
    },
    "Pressure": {
      series: ["s.sensor.pres"],
      yaxis: {
        label: "Pressure",
        unit: "kPa",
        min: 0,
        max: null
      }
    },
    "Temperature": {
      series: ["s.sensor.temp"],
      yaxis: {
        label: "Temperature",
        unit: "\u00B0K",
        min: null,
        max: null
      }
    },
    "Orbital Velocity": {
      series: ["v.orbitalVelocity"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: 0,
        max: null
      }
    },
    "Surface Velocity": {
      series: ["v.surfaceSpeed", "v.verticalSpeed"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: null,
        max: null
      }
    },
    "Angular Velocity": {
      series: ["v.angularVelocity"],
      yaxis: {
        label: "Angular Velocity",
        unit: "\u00B0/s",
        min: 0,
        max: null
      }
    },
    "Liquid Fuel and Oxidizer": {
      series: ["r.resource[LiquidFuel]", "r.resource[Oxidizer]"],
      yaxis: {
        label: "Volume",
        unit: "L",
        min: 0,
        max: null
      }
    },
    "Electric Charge": {
      series: ["r.resource[ElectricCharge]"],
      yaxis: {
        label: "Electric Charge",
        unit: "Wh",
        min: 0,
        max: null
      }
    },
    "Monopropellant": {
      series: ["r.resource[MonoPropellant]"],
      yaxis: {
        label: "Volume",
        unit: "L",
        min: 0,
        max: null
      }
    },
    "Heading": {
      series: ["n.heading"],
      yaxis: {
        label: "Angle",
        unit: "\u00B0",
        min: 0,
        max: 360
      }
    },
    "Pitch": {
      series: ["n.pitch"],
      yaxis: {
        label: "Angle",
        unit: "\u00B0",
        min: -90,
        max: 90
      }
    },
    "Roll": {
      series: ["n.roll"],
      yaxis: {
        label: "Angle",
        unit: "\u00B0",
        min: -180,
        max: 180
      }
    },
    "Target Distance": {
      series: ["tar.distance"],
      yaxis: {
        label: "Distance",
        unit: "m",
        min: 0,
        max: null
      }
    },
    "Relative Velocity": {
      series: ["tar.o.relativeVelocity"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: 0,
        max: null
      }
    },
    "True Anomaly": {
      series: ["o.trueAnomaly"],
      yaxis: {
        label: "Angle",
        unit: "\u00B0",
        min: null,
        max: null
      }
    },
    "Map": {
      series: ["v.long", "v.lat", "v.name", "v.body"],
      type: "map"
    }
  };

  testCharts = {
    "Sine and Cosine": {
      series: ["test.sin", "test.cos"],
      yaxis: {
        label: "Angle",
        unit: "\u00B0",
        min: -360,
        max: 360
      }
    },
    "Quadratic": {
      series: ["test.square"],
      yaxis: {
        label: "Altitude",
        unit: "m",
        min: 0,
        max: null
      }
    },
    "Random": {
      series: ["test.rand"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: null,
        max: null
      }
    },
    "Square Root": {
      series: ["test.sqrt"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: 0,
        max: null
      }
    },
    "Exponential": {
      series: ["test.exp"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: 1,
        max: null
      }
    },
    "Logarithmic": {
      series: ["test.log"],
      yaxis: {
        label: "Velocity",
        unit: "m/s",
        min: null,
        max: null
      }
    }
  };

  customCharts = {};

  charts = {};

  standardLayouts = {
    "Flight Dynamics": {
      charts: ["Altitude", "Orbital Velocity", "True Anomaly"],
      telemetry: ["o.sma", "o.eccentricity", "o.inclination", "o.lan", "o.argumentOfPeriapsis", "o.timeOfPeriapsisPassage", "o.trueAnomaly", "v.altitude", "v.orbitalVelocity"]
    },
    "Retrofire": {
      charts: ["Map", "Altitude", "Surface Velocity"],
      telemetry: ["v.altitude", "v.heightFromTerrain", "v.surfaceSpeed", "v.verticalSpeed", "v.lat", "v.long"]
    },
    "Booster Systems": {
      charts: ["Liquid Fuel and Oxidizer", "Dynamic Pressure", "Atmospheric Density"],
      telemetry: ["r.resource[LiquidFuel]", "r.resourceMax[LiquidFuel]", "r.resource[Oxidizer]", "r.resourceMax[Oxidizer]", "v.dynamicPressure", "v.atmosphericDensity"]
    },
    "Instrumentation": {
      charts: ["G-Force", "Pressure", "Temperature"],
      telemetry: ["s.sensor.acc", "s.sensor.pres", "s.sensor.temp", "s.sensor.grav"]
    },
    "Electrical, Environmental and Comm.": {
      charts: ["Electric Charge", "Pressure", "Temperature"],
      telemetry: ["r.resource[ElectricCharge]", "r.resourceMax[ElectricCharge]", "s.sensor.pres", "s.sensor.temp"]
    },
    "Guidance, Navigation and Control": {
      charts: ["Heading", "Pitch", "Roll"],
      telemetry: ["r.resource[MonoPropellant]", "r.resourceMax[MonoPropellant]", "n.heading", "n.pitch", "n.roll"]
    },
    "Rendezvous and Docking": {
      charts: ["Target Distance", "Relative Velocity"],
      telemetry: ["tar.name", "tar.o.sma", "tar.o.eccentricity", "tar.o.inclination", "tar.o.lan", "tar.o.argumentOfPeriapsis", "tar.o.timeOfPeriapsisPassage", "tar.o.trueAnomaly", "tar.distance", "tar.o.relativeVelocity"]
    }
  };

  testLayouts = {
    "Test": {
      charts: ["Sine and Cosine", "Exponential", "Random"],
      telemetry: ['test.rand', 'test.sin', 'test.cos', 'test.square', 'test.exp', 'test.sqrt', 'test.log']
    }
  };

  customLayouts = {};

  layouts = {};

  defaultLayout = "Flight Dynamics";

  Telemachus = {
    CELESTIAL_BODIES: ["Kerbol", "Kerbin", "Mun", "Minmus", "Moho", "Eve", "Duna", "Ike", "Jool", "Laythe", "Vall", "Bop", "Tylo", "Gilly", "Pol", "Dres", "Eeloo"],
    RESOURCES: ["ElectricCharge", "SolidFuel", "LiquidFuel", "Oxidizer", "MonoPropellant", "IntakeAir", "XenonGas"],
    api: {},
    telemetry: {
      "p.paused": 0,
      "v.missionTime": 0,
      "t.universalTime": 0
    },
    lastUpdate: null,
    apiSubscriptionCounts: {
      "t.universalTime": 1,
      "v.missionTime": 1
    },
    $telemetrySubscribers: $(),
    $alertSubscribers: $(),
    format: function(value, api) {
      var units;
      if (value == null) {
        return "No Data";
      } else if ($.isArray(value)) {
        return this.format(value[1][0], api);
      } else {
        units = this.api[api].units.toLowerCase();
        if (units in this.formatters) {
          return this.formatters[units](value);
        } else {
          return value.toString();
        }
      }
    },
    subscribe: function() {
      var $collection, api, apis, k, len, ref;
      $collection = arguments[0], apis = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.$telemetrySubscribers = this.$telemetrySubscribers.add($collection);
      $collection.data("telemachus-api-subscriptions", apis);
      for (k = 0, len = apis.length; k < len; k++) {
        api = apis[k];
        this.apiSubscriptionCounts[api] = ((ref = this.apiSubscriptionCounts[api]) != null ? ref : 0) + $collection.length;
      }
      return $collection;
    },
    unsubscribe: function() {
      var $collection, api, apis, elem, k, l, len, len1;
      $collection = arguments[0], apis = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.$telemetrySubscribers = this.$telemetrySubscribers.not($collection);
      for (k = 0, len = $collection.length; k < len; k++) {
        elem = $collection[k];
        apis = $(elem).data("telemachus-api-subscriptions");
        if (apis != null) {
          for (l = 0, len1 = apis.length; l < len1; l++) {
            api = apis[l];
            if (!(api in this.apiSubscriptionCounts)) {
              continue;
            }
            this.apiSubscriptionCounts[api] = this.apiSubscriptionCounts[api] - 1;
            if (this.apiSubscriptionCounts[api] <= 0) {
              delete this.apiSubscriptionCounts[api];
            }
          }
        }
      }
      return $collection;
    },
    subscribeAlerts: function($collection) {
      return this.$alertSubscribers = this.$alertSubscribers.add($collection);
    },
    unsubscribeAlerts: function($collection) {
      return this.$alertSubscribers = this.$alertSubscribers.not($collection);
    },
    loadAPI: function(testMode) {
      if (testMode) {
        this.api = {
          "p.paused": {
            apistring: 'p.paused',
            name: "Paused",
            units: 'UNITLESS'
          },
          "v.missionTime": {
            apistring: 'v.missionTime',
            name: "Mission Time",
            units: 'TIME'
          },
          "t.universalTime": {
            apistring: 't.universalTime',
            name: "Universal Time",
            units: 'DATE'
          },
          "test.rand": {
            apistring: 'test.rand',
            name: "Random",
            units: 'UNITLESS'
          },
          "test.sin": {
            apistring: 'test.sin',
            name: "Sine",
            units: 'UNITLESS'
          },
          "test.cos": {
            apistring: 'test.cos',
            name: "Cosine",
            units: 'UNITLESS'
          },
          "test.square": {
            apistring: 'test.square',
            name: "Quadratic",
            units: 'UNITLESS'
          },
          "test.exp": {
            apistring: 'test.exp',
            name: "Exponential",
            units: 'UNITLESS'
          },
          "test.sqrt": {
            apistring: 'test.sqrt',
            name: "Square Root",
            units: 'UNITLESS'
          },
          "test.log": {
            apistring: 'test.log',
            name: "Logarithmic",
            units: 'UNITLESS'
          }
        };
        this.testStart = Date.now();
        this.testDownlink();
        return $.Deferred().resolve(this.api).promise();
      } else {
        return $.get("datalink", {
          api: "a.api"
        }, "json").then((function(_this) {
          return function(data, textStatus, jqXHR) {
            var api, i, k, l, len, len1, n, r, ref, ref1, ref2, resourceApi;
            console.log(data.api);
            //ref = JSON.parse(data).api;
            ref = data.api;
            for (k = 0, len = ref.length; k < len; k++) {
              api = ref[k];
              if (api.apistring.match(/^b\./)) {
                for (i = l = 0, ref1 = _this.CELESTIAL_BODIES.length; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
                  _this.api[api.apistring + ("[" + i + "]")] = api;
                }
              } else if (api.apistring.match(/^r\./)) {
                if (api.apistring !== "r.resourceCurrent") {
                  ref2 = _this.RESOURCES;
                  for (n = 0, len1 = ref2.length; n < len1; n++) {
                    r = ref2[n];
                    resourceApi = $.extend({}, api);
                    resourceApi.name = r.replace(/([a-z])([A-Z])/g, "$1 $2");
                    if (api.apistring.match(/Max$/)) {
                      resourceApi.name += " Max";
                    }
                    _this.api[api.apistring + ("[" + r + "]")] = resourceApi;
                  }
                }
              } else if (api.plotable && api.apistring !== "s.sensor") {
                _this.api[api.apistring] = api;
              }
            }
            _this.downlink();
            return _this.api;
          };
        })(this), (function(_this) {
          return function() {
            var timeout;
            _this.$alertSubscribers.trigger("telemetryAlert", ["No Signal Found"]);
            timeout = $.Deferred();
            setTimeout((function() {
              return timeout.resolve();
            }), 5000);
            return timeout.then(function() {
              return _this.loadAPI();
            });
          };
        })(this));
      }
    },
    downlink: function() {
      var api, i, key, query, url;
      query = {};
      i = 0;
      query["p"] = "p.paused";
      for (api in this.apiSubscriptionCounts) {
        if (api !== "p.paused") {
          query["a" + (i++)] = api;
        }
      }
      url = "datalink?" + (((function() {
        var results;
        results = [];
        for (key in query) {
          api = query[key];
          results.push(key + "=" + api);
        }
        return results;
      })()).join("&"));
      return $.get(url).done((function(_this) {
        return function(data, textStatus, jqXHR) {
          var error, value;
          try {
	    // console.log(data);
          } catch (error1) {
            error = error1;
            _this.$alertSubscribers.trigger("telemetryAlert", ["Bad Data"]);
            setTimeout((function() {
              return _this.downlink();
            }), 5000);
            return;
          }
          _this.telemetry["p.paused"] = data.p;
          switch (data.p) {
            case 4:
              _this.$alertSubscribers.trigger("telemetryAlert", ["Signal Lost"]);
              break;
            case 3:
              _this.$alertSubscribers.trigger("telemetryAlert", ["Signal Terminated"]);
              break;
            case 2:
              _this.$alertSubscribers.trigger("telemetryAlert", ["Signal Power Loss"]);
              break;
            case 1:
              _this.$alertSubscribers.trigger("telemetryAlert", ["Game Paused"]);
              break;
            case 0:
              _this.$alertSubscribers.trigger("telemetryAlert", [null]);
          }
          if (data.p !== 1) {
            _this.lastUpdate = Date.now();
            _this.telemetry = {};
            for (key in data) {
              value = data[key];
              if (data.p === 0 || ["p.paused", "v.missionTime", "t.universalTime"].indexOf(query[key]) !== -1) {
                _this.telemetry[query[key]] = value;
              } else {
                _this.telemetry[query[key]] = null;
              }
            }
            _this.$telemetrySubscribers.trigger("telemetry", [_this.telemetry]);
          }
          return setTimeout((function() {
            return _this.downlink();
          }), 500);
        };
      })(this)).fail((function(_this) {
        return function() {
          _this.$alertSubscribers.trigger("telemetryAlert", ["No Signal Found"]);
          return setTimeout((function() {
            return _this.downlink();
          }), 5000);
        };
      })(this));
    },
    testDownlink: function() {
      var api, lastRand, paused, rand, ref, t, x;
      rand = Math.random() * 1000;
      paused = rand >= 10 ? 0 : Math.floor(rand / 2);
      switch (paused) {
        case 4:
          this.$alertSubscribers.trigger("telemetryAlert", ["Signal Lost"]);
          break;
        case 3:
          this.$alertSubscribers.trigger("telemetryAlert", ["Signal Terminated"]);
          break;
        case 2:
          this.$alertSubscribers.trigger("telemetryAlert", ["Signal Power Loss"]);
          break;
        case 1:
          this.$alertSubscribers.trigger("telemetryAlert", ["Game Paused"]);
          break;
        case 0:
          this.$alertSubscribers.trigger("telemetryAlert", [null]);
      }
      if (paused !== 1) {
        this.lastUpdate = Date.now();
        t = (this.lastUpdate - this.testStart) / 1000;
        lastRand = (ref = this.telemetry["test.rand"]) != null ? ref : rand;
        this.telemetry = {
          "p.paused": paused,
          "v.missionTime": t,
          "t.universalTime": this.lastUpdate / 1000
        };
        x = t / 120;
        for (api in this.apiSubscriptionCounts) {
          if (!(api in this.telemetry)) {
            this.telemetry[api] = (function() {
              if (paused !== 0) {
                return null;
              } else {
                switch (api) {
                  case 'test.rand':
                    return lastRand + (rand - 500) / 10;
                  case 'test.sin':
                    return 360 * Math.sin(x * 2 * Math.PI);
                  case 'test.cos':
                    return 360 * Math.cos(x * 2 * Math.PI);
                  case 'test.square':
                    return x * x;
                  case 'test.exp':
                    return Math.exp(x);
                  case 'test.sqrt':
                    return Math.sqrt(x);
                  case 'test.log':
                    return Math.log(x);
                }
              }
            })();
          }
        }
        this.$telemetrySubscribers.trigger("telemetry", [this.telemetry]);
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.testDownlink();
        };
      })(this)), paused === 0 ? 500 : 5000);
    },
    formatters: {
      unitless: function(v) {
        if (typeof v === "number") {
          return v.toPrecision(6);
        } else {
          return v;
        }
      },
      velocity: function(v) {
        return siUnit(v, "m/s");
      },
      deg: function(v) {
        return v.toPrecision(6) + "\u00B0";
      },
      distance: function(v) {
        return siUnit(v, "m");
      },
      time: function(v) {
        return durationString(v);
      },
      string: function(v) {
        return v;
      },
      temp: function(v) {
          return v.toFixed(2) + " K"; 
      },
      pres: function(v) {
          return v.toFixed(4) + " kPa";
      },
      grav: function(v) {
          return v.toFixed(2) + " m/s\u00B2";
      },
      acc: function(v) {
          return v.toFixed(3) + " G";
      },
      date: function(v) {
        return dateString(v);
      }
    }
  };

  Chart = (function() {
    var activeCharts, angleTicks, refreshXAxis, refreshYAxis, resizeHandler, uniqueId, updateDataPaths;

    uniqueId = (function() {
      var counter;
      counter = 0;
      return function() {
        return "chart-id-" + (counter++);
      };
    })();

    activeCharts = [];

    resizeHandler = function(event) {
      var c, k, len, results;
      activeCharts = (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = activeCharts.length; k < len; k++) {
          c = activeCharts[k];
          if ($.contains(document, c.svg.node())) {
            results.push(c);
          }
        }
        return results;
      })();
      if (activeCharts.length === 0) {
        return $(window).off('resize', resizeHandler);
      } else {
        results = [];
        for (k = 0, len = activeCharts.length; k < len; k++) {
          c = activeCharts[k];
          results.push(c.resize());
        }
        return results;
      }
    };

    function Chart(parent, series, yaxis) {
      var $parent, clipPathId, dataHeight, dataWidth, g, magnitude, prefix, rootGroup, tspan;
      $parent = $(parent);
      this.data = [];
      this.series = series.slice();
      this.padding = {
        left: 70.5,
        top: 13.5,
        right: 13.5,
        bottom: 30.5
      };
      if (this.series.length <= 1) {
        this.padding.bottom = 13.5;
      }
      this.legendSpacing = 30;
      this.width = $parent.width();
      this.height = $parent.height();
      dataWidth = Math.max(this.width - (this.padding.left + this.padding.right), 0);
      dataHeight = Math.max(this.height - (this.padding.top + this.padding.bottom), 0);
      this.x = d3.scale.linear().range([0, dataWidth]).domain([0, 300]);
      magnitude = Math.max(orderOfMagnitude(yaxis.min), orderOfMagnitude(yaxis.max));
      prefix = d3.formatPrefix(Math.pow(10, magnitude - 2));
      this.y = d3.scale.linear().range([dataHeight, 0]).domain([prefix.scale(yaxis.min), prefix.scale(yaxis.max)]);
      this.y.prefix = prefix;
      this.y.fixedDomain = [yaxis.min, yaxis.max];
      this.xaxis = d3.svg.axis().scale(this.x).orient("bottom").tickSize(dataHeight, 0).tickFormat((function(_this) {
        return function(d) {
          var h, m, result, t;
          if (_this.missionTimeOffset) {
            t = (d - _this.missionTimeOffset) / 60;
            if (t < 0) {
              result = "T-";
              t = -t;
            } else {
              result = "T+";
            }
            h = t / 60 | 0;
            m = t % 60 | 0;
            if (m < 10) {
              m = "0" + m;
            }
            return result + h + ":" + m;
          }
        };
      })(this)).tickValues([]);
      this.yaxis = d3.svg.axis().scale(this.y).orient("left").ticks((dataHeight / 39) | 0);
      this.yaxis.label = yaxis.label;
      this.yaxis.unit = yaxis.unit;
      if ((this.y.fixedDomain[0] != null) && (this.y.fixedDomain[1] != null) && (this.y.fixedDomain[1] - this.y.fixedDomain[0]) % 90 === 0) {
        this.yaxis.tickValues(angleTicks.apply(null, [this.y.fixedDomain].concat(slice.call(this.yaxis.ticks()))));
      }
      this.svg = d3.select($parent[0]).append("svg:svg").attr("width", this.width).attr("height", this.height);
      rootGroup = this.svg.append("svg:g").attr("transform", "translate(" + this.padding.left + ", " + this.padding.top + ")");
      clipPathId = uniqueId();
      rootGroup.append("svg:defs").append("svg:clipPath").attr("id", clipPathId).append("svg:rect").attr("x", 0).attr("y", -this.padding.top).attr("width", dataWidth).attr("height", dataHeight + this.padding.top);
      rootGroup.append("svg:g").attr("class", "y grid").attr("clip-path", "url(#" + clipPathId + ")");
      g = rootGroup.append("svg:g").attr("class", "x axis");
      g.append("svg:g").attr("class", "ticks").attr("clip-path", "url(#" + clipPathId + ")");
      g.append("svg:path").attr("class", "domain").attr("d", "M0," + dataHeight + "H" + dataWidth);
      refreshXAxis.call(this);
      g = rootGroup.append("svg:g").attr("class", "y axis");
      g.append("svg:text").attr("class", "label").attr("text-anchor", "middle").attr("x", -dataHeight / 2).attr("y", -(this.padding.left - 18)).attr("transform", "rotate(-90)").text(this.yaxis.label + ((this.yaxis.unit != null) || this.y.prefix.symbol !== '' ? " (" + this.y.prefix.symbol + this.yaxis.unit + ")" : ''));
      refreshYAxis.call(this);
      rootGroup.append("svg:g").attr("class", "data").attr("clip-path", "url(#" + clipPathId + ")").selectAll("path").data(this.series).enter().append("svg:path");
      if (this.series.length > 1) {
        tspan = rootGroup.append("svg:text").attr("class", "legend").attr("transform", "translate(" + (dataWidth / 2) + ", " + (dataHeight + 20) + ")").attr("text-anchor", "middle").selectAll("tspan").data(this.series).enter().append("svg:tspan").attr("dx", (function(_this) {
          return function(d, i) {
            if (i > 0) {
              return _this.legendSpacing;
            }
          };
        })(this)).on("mouseover", (function(_this) {
          return function(d, i) {
            if (_this.svg.select(".active").empty()) {
              _this.svg.selectAll(".data path").classed("inactive", function(d, j) {
                return j !== i;
              });
              return _this.svg.selectAll(".legend > tspan").classed("inactive", function(d, j) {
                return j !== i;
              });
            }
          };
        })(this)).on("mouseout", (function(_this) {
          return function() {
            if (_this.svg.select(".active").empty()) {
              return _this.svg.selectAll(".data path, .legend > tspan").classed("inactive", false);
            }
          };
        })(this)).on("click", function(d, i) {
          if (d3.select(this).classed("active")) {
            return rootGroup.selectAll(".data path, .legend > tspan").classed("inactive", false).classed("active", false);
          } else {
            rootGroup.selectAll(".data path").classed("inactive", function(d, j) {
              return j !== i;
            });
            return rootGroup.selectAll(".legend > tspan").classed("inactive", function(d, j) {
              return j !== i;
            }).classed("active", function(d, j) {
              return j === i;
            });
          }
        });
        tspan.append("svg:tspan").attr("class", "bullet").text("\u25fc ");
        tspan.append("svg:tspan").attr("class", "title").text(function(d) {
          return d;
        });
      }
      activeCharts.push(this);
      if (activeCharts.length === 1) {
        $(window).on('resize', resizeHandler);
      }
    }

    Chart.prototype.destroy = function() {
      var i;
      i = activeCharts.indexOf(this);
      activeCharts.splice(i, 1);
      if (activeCharts.length === 0) {
        return $(window).off('resize', resizeHandler);
      }
    };

    Chart.prototype.addSample = function(x, sample) {
      var $parent, dt, e, extent, i, k, l, magnitude, prefix, ref, ref1, ref2, ref3, ref4, ref5, windowEnd, windowStart, x1, x2;
      this.data.push([x].concat(sample));
      this.data.sort(function(a, b) {
        return a[0] - b[0];
      });
      if (this.lastUpdate != null) {
        dt = Date.now() - ((ref = this.lastUpdate) != null ? ref : 0);
        this.lastUpdate += dt;
      } else {
        dt = 0;
        this.lastUpdate = Date.now();
      }
      for (i = k = ref1 = this.data.length - 1; ref1 <= 0 ? k <= 0 : k >= 0; i = ref1 <= 0 ? ++k : --k) {
        if (this.data[i][0] <= this.x.domain()[1]) {
          windowEnd = i + 1;
          break;
        }
      }
      if (dt > 100 && dt < 1000 && this.data.length >= 2) {
        x1 = this.data[this.data.length - 2][0];
        x2 = this.data[this.data.length - 1][0];
      } else {
        x1 = x2 = 0;
      }
      windowStart = 0;
      for (i = l = 1, ref2 = this.data.length; 1 <= ref2 ? l < ref2 : l > ref2; i = 1 <= ref2 ? ++l : --l) {
        if (this.data[i][0] >= this.x.domain()[0] - (x2 - x1)) {
          windowStart = i - 1;
          break;
        }
      }
      this.data = this.data.slice(windowStart, windowEnd);
      if (!((this.y.fixedDomain[0] != null) && (this.y.fixedDomain[1] != null))) {
        extent = d3.extent(d3.merge((function() {
          var len, n, ref3, results;
          ref3 = this.data;
          results = [];
          for (n = 0, len = ref3.length; n < len; n++) {
            e = ref3[n];
            results.push(e.slice(1));
          }
          return results;
        }).call(this)));
        extent = [(ref3 = this.y.fixedDomain[0]) != null ? ref3 : extent[0], (ref4 = this.y.fixedDomain[1]) != null ? ref4 : extent[1]];
        if (extent[1] < extent[0]) {
          if (this.y.fixedDomain[0] != null) {
            extent[1] = extent[0];
          } else {
            extent[0] = extent[1];
          }
        }
        if (this.y.prefix.scale(extent[0]) !== this.y.domain()[0] || this.y.prefix.scale(extent[1]) !== this.y.domain()[1]) {
          magnitude = Math.max(orderOfMagnitude(extent[0]), orderOfMagnitude(extent[1]));
          prefix = d3.formatPrefix(Math.pow(10, magnitude - 2));
          if (prefix.symbol !== this.y.prefix.symbol) {
            this.y.prefix = prefix;
            this.svg.select('.y.axis text.label').text(this.yaxis.label + ((this.yaxis.unit != null) || this.y.prefix.symbol !== '' ? " (" + this.y.prefix.symbol + this.yaxis.unit + ")" : ''));
          }
          (ref5 = this.y.domain([this.y.prefix.scale(extent[0]), this.y.prefix.scale(extent[1])])).nice.apply(ref5, this.yaxis.ticks()).domain([this.y.fixedDomain[0] != null ? this.y.prefix.scale(this.y.fixedDomain[0]) : this.y.domain()[0], this.y.fixedDomain[1] != null ? this.y.prefix.scale(this.y.fixedDomain[1]) : this.y.domain()[1]]);
          refreshYAxis.call(this, dt);
        }
      }
      $parent = $(this.svg.node().parentElement);
      if ($parent.length === 0) {

      } else if (this.width !== $parent.width() || this.height !== $parent.height()) {
        return this.resize();
      } else {
        refreshXAxis.call(this);
        updateDataPaths.call(this);
        if (dt > 100 && dt < 1000) {
          return this.svg.selectAll(".data path,.x.axis .tick").attr("transform", "translate(" + (this.x(x2) - this.x(x1)) + ",0)").interrupt().transition().duration(dt).ease("linear").attr("transform", "translate(0,0)");
        }
      }
    };

    Chart.prototype.resize = function() {
      var $parent, dataHeight, dataWidth;
      $parent = $(this.svg.node().parentElement);
      if ($parent.length === 0) {
        return;
      }
      this.width = $parent.width();
      this.height = $parent.height();
      dataWidth = Math.max(this.width - (this.padding.left + this.padding.right), 0);
      dataHeight = Math.max(this.height - (this.padding.top + this.padding.bottom), 0);
      this.x.range([0, dataWidth]);
      this.y.range([dataHeight, 0]);
      this.xaxis.tickSize(dataHeight, 0);
      this.yaxis.ticks((dataHeight / 39) | 0);
      if ((this.y.fixedDomain[0] != null) && (this.y.fixedDomain[1] != null) && (this.y.fixedDomain[1] - this.y.fixedDomain[0]) % 90 === 0) {
        this.yaxis.tickValues(angleTicks.apply(null, [this.y.fixedDomain].concat(slice.call(this.yaxis.ticks()))));
      }
      this.svg.attr("width", this.width).attr("height", this.height);
      this.svg.select("defs rect").attr("width", dataWidth).attr("height", dataHeight + this.padding.top);
      this.svg.select("g.y.grid").selectAll("line").attr("x2", dataWidth);
      this.svg.select("g.x.axis path.domain").attr("d", "M0," + dataHeight + "H" + dataWidth);
      this.svg.select("g.y.axis text").attr("x", -dataHeight / 2);
      this.svg.select("text.legend").attr("transform", "translate(" + (dataWidth / 2) + "," + (dataHeight + 20) + ")");
      refreshXAxis.call(this);
      refreshYAxis.call(this);
      return updateDataPaths.call(this);
    };

    refreshXAxis = function() {
      var tick, ticks;
      ticks = this.svg.select("g.x.axis .ticks").selectAll("g.tick").data(this.xaxis.tickValues());
      ticks.select("line").attr("x1", this.x).attr("y1", 0).attr("x2", this.x).attr("y2", this.xaxis.tickSize());
      ticks.select("text").attr("x", this.x).attr("y", this.xaxis.tickSize()).text(this.xaxis.tickFormat());
      tick = ticks.enter().append("svg:g").attr("class", "tick");
      tick.append("svg:line").attr("x1", this.x).attr("y1", 0).attr("x2", this.x).attr("y2", this.xaxis.tickSize());
      tick.append("svg:text").attr("x", this.x).attr("y", this.xaxis.tickSize()).attr("dx", "0.5em").attr("dy", "-1ex").attr("text-anchor", "start").text(this.xaxis.tickFormat());
      return ticks.exit().remove();
    };

    refreshYAxis = function(duration) {
      var grid, ref, ref1;
      grid = this.svg.select("g.y.grid").selectAll("line").data((ref = this.yaxis.tickValues()) != null ? ref : (ref1 = this.y).ticks.apply(ref1, this.yaxis.ticks()));
      grid.classed("zero", function(d) {
        return d === 0;
      });
      (duration != null ? grid.transition().duration(duration) : grid).attr("y1", (function(_this) {
        return function(d) {
          return _this.y(d);
        };
      })(this)).attr("y2", (function(_this) {
        return function(d) {
          return _this.y(d);
        };
      })(this));
      grid.enter().append("svg:line").attr("x1", 0).attr("y1", (function(_this) {
        return function(d) {
          return _this.y(d);
        };
      })(this)).attr("x2", this.width).attr("y2", (function(_this) {
        return function(d) {
          return _this.y(d);
        };
      })(this)).classed("zero", function(d) {
        return d === 0;
      });
      grid.exit().remove();
      if (duration != null) {
        return this.svg.select("g.y.axis").transition().duration(duration).call(this.yaxis);
      } else {
        return this.svg.select("g.y.axis").call(this.yaxis);
      }
    };

    updateDataPaths = function() {
      return this.svg.selectAll("g.data path").data(this.series).attr("d", (function(_this) {
        return function(d, i) {
          var j, k, len, path, ref, ref1;
          path = "";
          ref = _this.data;
          for (j = k = 0, len = ref.length; k < len; j = ++k) {
            d = ref[j];
            if (!d[i + 1]) {
              continue;
            }
            path += path.length > 0 && (((ref1 = _this.data[j - 1]) != null ? ref1[i + 1] : void 0) != null) ? "L" : "M";
            path += (_this.x(d[0])) + "," + (_this.y(_this.y.prefix.scale(d[i + 1])));
          }
          return path;
        };
      })(this));
    };

    angleTicks = function(domain, maxTicks) {
      var i, k, len, ref, span, tick;
      span = Math.abs(domain[1] - domain[0]);
      ref = [15, 30, 45, 90, 180, 360];
      for (k = 0, len = ref.length; k < len; k++) {
        i = ref[k];
        if (span / i <= maxTicks) {
          return (function() {
            var l, ref1, ref2, ref3, results;
            results = [];
            for (tick = l = ref1 = domain[0], ref2 = domain[1], ref3 = i; ref3 > 0 ? l <= ref2 : l >= ref2; tick = l += ref3) {
              results.push(tick);
            }
            return results;
          })();
        }
      }
      return domain;
    };

    return Chart;

  })();

  $(document).ready(function() {
    var $chartMenus, $layoutMenu, chart, populateLayoutMenu, ref, ref1, savedDefault, testMode;
    if (window.localStorage != null) {
      customCharts = (ref = JSON.parse(window.localStorage.getItem("telemachus.console.charts"))) != null ? ref : {};
      $.extend(charts, standardCharts, customCharts);
      customLayouts = (ref1 = JSON.parse(window.localStorage.getItem("telemachus.console.layouts"))) != null ? ref1 : {};
      $.extend(layouts, standardLayouts, customLayouts);
      savedDefault = window.localStorage.getItem("defaultLayout");
      if ((savedDefault != null) && savedDefault in layouts) {
        defaultLayout = savedDefault;
      }
    }
    testMode = window.location.protocol === "file:" || window.location.hash === "#test";
    if (testMode) {
      $.extend(layouts, testLayouts);
      $.extend(charts, testCharts);
      defaultLayout = "Test";
    }
    $layoutMenu = $("body > header nav ul");
    populateLayoutMenu = function() {
      var layout, results;
      $layoutMenu.empty();
      results = [];
      for (layout in layouts) {
        results.push($layoutMenu.append($("<li>").append($("<a>").attr({
          href: "#"
        }).text(layout))));
      }
      return results;
    };
    populateLayoutMenu();
    $layoutMenu.on("click", "li a", function(event) {
      var layoutName;
      event.preventDefault();
      layoutName = $(this).text().trim();
      setLayout(layoutName);
      $("#deleteLayout").prop("disabled", !(layoutName in customLayouts));
      return $(this).closest("ul").hide();
    });
    $chartMenus = $(".chart nav ul");
    for (chart in charts) {
      $chartMenus.append($("<li>").append($("<a>").attr({
        href: "#"
      }).text(chart)));
    }
    $chartMenus.on("click", "li a", function(event) {
      event.preventDefault();
      setChart($(this).closest(".chart"), $(this).text());
      return $(this).closest("ul").hide();
    });
    $(document).on("click.dropdown", ".dropdown button", function() {
      var $menu, $this;
      $this = $(this);
      console.log($this.width(), $this.height(), $this.outerWidth(true), $this.outerHeight(true));
      $menu = $this.next();
      return $menu.toggle().css({
        left: Math.max($this.position().left + $this.outerWidth(true) - $menu.outerWidth() + 5, 0),
        top: $this.position().top + Math.min($(window).height() - $menu.outerHeight() - $this.offset().top, $this.outerHeight(true))
      });
    });
    $(document).on("click.dropdown", function(event) {
      return $(".dropdown").not($(event.target).parents()).children("ul").hide();
    });
    $("#apiCategory").change(function(event) {
      var api, apistring, category, ref2, results;
      category = $("#apiCategory").val();
      $("#apiSelect").empty();
      ref2 = Telemachus.api;
      results = [];
      for (apistring in ref2) {
        api = ref2[apistring];
        if (apistring.match(category)) {
          results.push($("#apiSelect").append($("<option>").attr("value", apistring).text(api.name)));
        }
      }
      return results;
    });
    $("#telemetry form").submit(function(event) {
      event.preventDefault();
      return addTelemetry($("#apiSelect").val());
    });
    $("#telemetry ul").on("click", "button.remove", function(event) {
      event.preventDefault();
      return removeTelemetry($(this).parent());
    });
    $("#telemetry ul").sortable({
      handle: ".handle",
      containment: "#telemetry"
    });
    $(".alert").on("telemetryAlert", function(event, message) {
      var $display, $this;
      $(".alert").text(message != null ? message : "");
      if (message != null) {
        $this = $(this);
        $display = $this.siblings(".display");
        return $this.css("marginTop", -($display.outerHeight() + $this.height()) / 2);
      }
    });
    if (window.localStorage != null) {
      $("#saveLayout").click(function(event) {
        var elem, name;
        event.preventDefault();
        name = window.prompt("What name would you like to save this layout under?", $("h1").text().trim()).trim();
        if ((name == null) || name === "" || (name in layouts && !window.confirm("That name is already in use. Are you sure you want to overwrite the existing layout?"))) {
          return;
        }
        layouts[name] = customLayouts[name] = {
          charts: (function() {
            var k, len, ref2, results;
            ref2 = $(".chart h2");
            results = [];
            for (k = 0, len = ref2.length; k < len; k++) {
              elem = ref2[k];
              results.push($(elem).text().trim());
            }
            return results;
          })(),
          telemetry: (function() {
            var k, len, ref2, results;
            ref2 = $("#telemetry li");
            results = [];
            for (k = 0, len = ref2.length; k < len; k++) {
              elem = ref2[k];
              results.push($(elem).data("api"));
            }
            return results;
          })()
        };
        window.localStorage.setItem("telemachus.console.layouts", JSON.stringify(customLayouts));
        populateLayoutMenu();
        $("h1").text(name);
        return $("#deleteLayout").prop("disabled", false);
      });
      $("#deleteLayout").click(function(event) {
        var layoutName;
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete the current custom layout?")) {
          layoutName = $("h1").text().trim();
          if (!(layoutName in customLayouts)) {
            return;
          }
          delete customLayouts[layoutName];
          window.localStorage.setItem("telemachus.console.layouts", JSON.stringify(customLayouts));
          if (layoutName in standardLayouts) {
            layouts[layoutName] = standardLayouts[layoutName];
            reloadLayout();
            return $("#deleteLayout").prop("disabled", true);
          } else {
            delete layouts[layoutName];
            populateLayoutMenu();
            return $("body > header nav ul li:first-child a").click();
          }
        }
      });
    } else {
      $("#saveLayout").prop("disabled", true);
      $("#deleteLayout").prop("disabled", true);
    }
    $(window).resize(function() {
      var $alert, $chart, $display, $telemetry, $telemetryAdd, $telemetryForm, $telemetryList, $telemetrySelect, buttonWidth, display, k, len, margins, ref2, ref3, winHeight;
      winHeight = Math.min($(window).height(), (ref2 = window.innerHeight) != null ? ref2 : 1e6);
      $("#container").height(winHeight - ($("#container").position().top + $("body > footer").outerHeight(true)));
      ref3 = $(".display", "#charts");
      for (k = 0, len = ref3.length; k < len; k++) {
        display = ref3[k];
        $display = $(display);
        $chart = $display.closest(".chart");
        $display.height($chart.height() - $display.position().top - ($display.outerHeight() - $display.height()));
        $alert = $display.siblings(".alert");
        $alert.css("fontSize", $display.height() / 5).css("marginTop", -($display.outerHeight() + $alert.height()) / 2);
      }
      $telemetry = $("#telemetry");
      $telemetryList = $("ul", $telemetry);
      $telemetryForm = $("form", $telemetry);
      margins = $telemetryList.outerHeight(true) - $telemetryList.height();
      $telemetryList.height($telemetryForm.position().top - $telemetryList.position().top - margins);
      $("form", $telemetry).width($telemetry.width());
      $telemetrySelect = $("#apiSelect");
      $telemetryAdd = $("form input", $telemetry);
      buttonWidth = $telemetryAdd.outerWidth(true) + 5;
      return $telemetrySelect.width($telemetry.width() - buttonWidth - ($telemetrySelect.outerWidth() - $telemetrySelect.width()));
    }).resize();
    Telemachus.subscribeAlerts($(".alert"));
    Telemachus.loadAPI(testMode).done(function() {
      $("#apiCategory").change();
      return reloadLayout();
    });
    setInterval(function() {
      var missionTime, universalTime;
      if (Telemachus.telemetry["p.paused"] !== 1) {
        missionTime = Telemachus.telemetry["v.missionTime"];
        if (missionTime > 0) {
          missionTime += (Date.now() - Telemachus.lastUpdate) / 1000;
        }
        universalTime = Telemachus.telemetry["t.universalTime"] + (Date.now() - Telemachus.lastUpdate) / 1000;
        $("#met").text(missionTimeString(missionTime));
        return $("#ut").text(dateString(universalTime));
      }
    }, 1000);
    setLayout(defaultLayout);
    return $("#deleteLayout").prop("disabled", !(defaultLayout in customLayouts));
  });

  addTelemetry = function(api) {
    var $data, $li;
    if ((api != null) && api in Telemachus.api && $("#telemetry li[data-api='" + api + "']").length === 0) {
      $li = $("<li>").data("api", api).append($("<h3>").text(Telemachus.api[api].name)).append($("<button>").attr({
        "class": "remove"
      })).append($("<img>").attr({
        "class": "handle",
        src: "img/draghandle.png",
        alt: "Drag to reorder"
      })).appendTo("#telemetry ul");
      $data = $("<div>").attr({
        "class": "telemetry-data"
      }).text("No Data").appendTo($li);
      $li.on("telemetry", function(event, data) {
        var value;
        value = data[api];
        return $data.text(Telemachus.format(value, api));
      });
      Telemachus.subscribe($li, api);
      return $("#telemetry ul").sortable("refresh").disableSelection();
    }
  };

  removeTelemetry = function(elem) {
    var $elem;
    $elem = $(elem);
    Telemachus.unsubscribe($elem);
    $elem.remove();
    return $("#telemetry ul").sortable("refresh");
  };

  resetChart = function(elem) {
    var $display, ref;
    $display = $(".display", elem).empty();
    Telemachus.unsubscribe($display);
    if ((ref = $display.data('chart')) != null) {
      ref.destroy();
    }
    return $display.data('chart', null);
  };

  setChart = function(elem, chartName) {
    var $display, $map, apis, body, chart, e, map, marker;
    resetChart(elem);
    chart = charts[chartName];
    if (chart == null) {
      return;
    }
    $("h2", elem).text(chartName);
    $display = $(".display", elem);
    Telemachus.subscribe.apply(Telemachus, [$display].concat(slice.call(chart.series)));
    if (chart.type === "map") {
      $map = $("<div>").appendTo($display);
      map = new L.KSP.Map($map[0], {
        layers: [L.KSP.CelestialBody.KERBIN],
        zoom: L.KSP.CelestialBody.KERBIN.defaultLayer.options.maxZoom,
        center: [0, 0],
        bodyControl: false,
        layerControl: true,
        scaleControl: true
      });
      map.fitWorld();
      body = L.KSP.CelestialBody.KERBIN;
      marker = null;
      return $display.on("telemetry", function(event, data) {
        var bodyName, long, ref;
        bodyName = (ref = data["v.body"]) != null ? ref.toUpperCase() : void 0;
        if (data["p.paused"] !== 0) {
          if (marker != null) {
            map.removeLayer(marker);
            return marker = null;
          }
        } else if (bodyName != null) {
          if (!(bodyName in L.KSP.CelestialBody)) {
            if ((bodyName != null) && (body != null)) {
              map.removeLayer(body);
              return body = null;
            }
          } else {
            if (body !== L.KSP.CelestialBody[data["v.body"].toUpperCase()]) {
              map.removeLayer(body);
              body = L.KSP.CelestialBody[data["v.body"].toUpperCase()];
              map.addLayer(body);
            }
            long = data["v.long"] > 180 ? data["v.long"] - 360 : data["v.long"];
            if (marker == null) {
              marker = L.marker([data["v.lat"], data["v.long"]]);
              return map.addLayer(marker);
            } else {
              marker.setLatLng([data["v.lat"], long]);
              marker.bindPopup(data["v.name"] + " </br>Latitude: " + data["v.lat"] + "</br>Longitude: " + data["v.long"]);
              return marker.update();
            }
          }
        }
      });
    } else {
      apis = chart.series;
      chart = new Chart($display[0], (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = apis.length; k < len; k++) {
          e = apis[k];
          if (e in Telemachus.api) {
            results.push(Telemachus.api[e].name);
          }
        }
        return results;
      })(), chart.yaxis);
      return $display.data('chart', chart).on("telemetry", function(event, data) {
        var i, k, lastT, len, missionTime, ref, ref1, sample, t, x;
        t = data["t.universalTime"];
        missionTime = data["v.missionTime"];
        chart.missionTimeOffset = (missionTime > 0 ? t - missionTime : void 0);
        chart.x.domain([t - 300, t]);
        lastT = Math.min((ref = (ref1 = chart.data[chart.data.length - 1]) != null ? ref1[0] : void 0) != null ? ref : t, t);
        chart.xaxis.tickValues((function() {
          var k, ref2, ref3, results;
          results = [];
          for (x = k = ref2 = t - missionTime % 60, ref3 = t - 360 - (t - lastT); k > ref3; x = k += -60) {
            if (missionTime > 0 && x >= (t - missionTime)) {
              results.push(x);
            }
          }
          return results;
        })());
        sample = (function() {
          var k, len, results;
          results = [];
          for (k = 0, len = apis.length; k < len; k++) {
            e = apis[k];
            results.push(data[e]);
          }
          return results;
        })();
        for (i = k = 0, len = sample.length; k < len; i = ++k) {
          e = sample[i];
          if ($.isArray(e)) {
            sample[i] = e[1][0];
          }
        }
        return chart.addSample(t, sample);
      });
    }
  };

  reloadLayout = function() {
    return setLayout($("h1").text().trim());
  };

  setLayout = function(name) {
    var elem, i, k, l, layout, len, len1, len2, n, ref, ref1, ref2, results, telemetry;
    if (name in layouts) {
      window.localStorage.setItem("defaultLayout", name);
      $("h1").text(name);
      layout = layouts[name];
      ref = $("#telemetry ul li");
      for (k = 0, len = ref.length; k < len; k++) {
        elem = ref[k];
        removeTelemetry(elem);
      }
      ref1 = layout.telemetry;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        telemetry = ref1[l];
        addTelemetry(telemetry);
      }
      ref2 = $(".chart");
      results = [];
      for (i = n = 0, len2 = ref2.length; n < len2; i = ++n) {
        elem = ref2[i];
        results.push(setChart(elem, layout.charts[i]));
      }
      return results;
    }
  };

  orderOfMagnitude = function(v) {
    if (+v === 0) {
      return 0;
    }
    return 1 + Math.floor(1e-12 + Math.log(Math.abs(+v)) / Math.LN10);
  };

  siUnit = function(v, unit) {
    var prefixes, scale;
    if (unit == null) {
      unit = "";
    }
    if (v === 0) {
      return "0 " + unit;
    }
    prefixes = ['\u03bc', 'm', '', 'k', 'M', 'G', 'T'];
    scale = Math.ceil(orderOfMagnitude(v) / 3);
    if (scale <= 0 && ++scale < 0) {
      scale = 0;
    } else if (scale === 1) {
      scale = 2;
    } else if (scale >= prefixes.length) {
      scale = prefixes.length - 1;
    }
    return (v / Math.pow(1000, scale - 2)).toPrecision(6) + " " + prefixes[scale] + unit;
  };

  stripInsignificantZeros = function(v) {
    return v.toString().replace(/((\.\d*?[1-9])|\.)0+($|e)/, '$2$3');
  };

  hourMinSec = function(t) {
    var hour, min, sec;
    if (t == null) {
      t = 0;
    }
    hour = (t / 3600) | 0;
    if (hour < 10) {
      hour = "0" + hour;
    }
    t %= 3600;
    min = (t / 60) | 0;
    if (min < 10) {
      min = "0" + min;
    }
    sec = (t % 60 | 0).toFixed();
    if (sec < 10) {
      sec = "0" + sec;
    }
    return hour + ":" + min + ":" + sec;
  };

  dateString = function(t) {
    var day, year;
    if (t == null) {
      t = 0;
    }
    year = ((t / (365 * 24 * 3600)) | 0) + 1;
    t %= 365 * 24 * 3600;
    day = ((t / (24 * 3600)) | 0) + 1;
    t %= 24 * 3600;
    return "Year " + year + ", Day " + day + ", " + (hourMinSec(t)) + " UT";
  };

  missionTimeString = function(t) {
    var result;
    if (t == null) {
      t = 0;
    }
    result = "T+";
    if (t >= 365 * 24 * 3600) {
      result += (t / (365 * 24 * 3600) | 0) + ":";
      t %= 365 * 24 * 3600;
      if (t < 24 * 3600) {
        result += "0:";
      }
    }
    if (t >= 24 * 3600) {
      result += (t / (24 * 3600) | 0) + ":";
    }
    t %= 24 * 3600;
    return result + hourMinSec(t) + " MET";
  };

  durationString = function(t) {
    var result;
    if (t == null) {
      t = 0;
    }
    result = t < 0 ? "-" : "";
    t = Math.abs(t);
    if (t >= 365 * 24 * 3600) {
      result += (t / (365 * 24 * 3600) | 0) + " years ";
      t %= 365 * 24 * 3600;
      if (t < 24 * 3600) {
        result += "0 days ";
      }
    }
    if (t >= 24 * 3600) {
      result += (t / (24 * 3600) | 0) + " days ";
    }
    t %= 24 * 3600;
    return result + hourMinSec(t);
  };

}).call(this);
