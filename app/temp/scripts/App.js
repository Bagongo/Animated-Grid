/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var tiles = {
	  aqua: "#00ffff",
	  azure: "#f0ffff",
	  beige: "#f5f5dc",
	  black: "#000000",
	  blue: "#0000ff",
	  brown: "#a52a2a",
	  cyan: "#00ffff",
	  darkblue: "#00008b",
	  darkcyan: "#008b8b",
	  darkgrey: "#a9a9a9",
	  darkgreen: "#006400",
	  darkkhaki: "#bdb76b",
	  darkmagenta: "#8b008b",
	  darkolivegreen: "#556b2f",
	  darkorange: "#ff8c00",
	  darkorchid: "#9932cc",
	  darkred: "#8b0000",
	  darksalmon: "#e9967a",
	  darkviolet: "#9400d3",
	  fuchsia: "#ff00ff",
	  gold: "#ffd700",
	  green: "#008000",
	  indigo: "#4b0082",
	  khaki: "#f0e68c",
	  lightblue: "#add8e6",
	  lightcyan: "#e0ffff",
	  lightgreen: "#90ee90",
	  lightgrey: "#d3d3d3",
	  lightpink: "#ffb6c1",
	  lightyellow: "#ffffe0",
	  lime: "#00ff00",
	  magenta: "#ff00ff",
	  maroon: "#800000",
	  navy: "#000080",
	  olive: "#808000",
	  orange: "#ffa500",
	  pink: "#ffc0cb",
	  purple: "#800080",
	  violet: "#800080",
	  red: "#ff0000",
	  silver: "#c0c0c0",
	  white: "#ffffff",
	  yellow: "#ffff00"
	};

	// alert(Object.keys(tiles).length);

	var Grid = function () {
	  function Grid(settings, data) {
	    _classCallCheck(this, Grid);

	    this.canvas = document.getElementById(settings.selector);
	    this.ctx = this.canvas.getContext('2d');

	    this.slotsX = settings.slots.x;
	    this.slotsY = settings.slots.y;
	    this.totalSlots = this.slotsX * this.slotsY;

	    this.slotSize = this.canvas.width / this.slotsX;

	    this.allTechs = [];
	    this.inGridTechs = [];
	    this.offGridTechs = [];
	    this.initData(data);

	    this.virtualGrid = this.createVirtualGrid();
	  }

	  _createClass(Grid, [{
	    key: "initData",
	    value: function initData(data) {
	      for (var key in data) {
	        this.allTechs.push({ name: key, tech: data[key] });
	      }

	      for (var i = 0; i < this.allTechs.length; i++) {

	        var tech = this.allTechs[i];

	        if (i < this.totalSlots) this.inGridTechs.push(tech);else this.offGridTechs.push(tech);
	      }

	      console.log(this.allTechs, this.inGridTechs, this.offGridTechs);
	    }
	  }, {
	    key: "createVirtualGrid",
	    value: function createVirtualGrid() {
	      var vGrid = [];

	      // for()
	    }
	  }]);

	  return Grid;
	}();

	document.addEventListener('DOMContentLoaded', function () {

	  var mainGrid = new Grid({ selector: 'tech-grid', slots: { x: 5, y: 5 } }, tiles);
	});

/***/ })
/******/ ]);