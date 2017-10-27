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

			this.slotsX = settings.slots.x;
			this.slotsY = settings.slots.y;
			this.totalSlots = this.slotsX * this.slotsY;
			this.slotSize = settings.slotSize;
			this.allTechs = [];
			this.offGridTechs = [];
			this.initData(data);
			this.virtualGrid = this.createVirtualGrid();
		}

		_createClass(Grid, [{
			key: "initData",
			value: function initData(data) {
				for (var key in data) {
					var tile = new Tile(key, data[key], this.slotSize, null);
					this.allTechs.push(tile);
				}
			}
		}, {
			key: "storeRemaingingTechs",
			value: function storeRemaingingTechs(idx) {
				for (var i = idx; i < this.allTechs.length; i++) {
					this.offGridTechs.push(this.allTechs[i]);
				}
			}
		}, {
			key: "createVirtualGrid",
			value: function createVirtualGrid() {
				var vGrid = [];
				var row = [];
				var idx = 0;

				for (var i = 0; i <= this.slotsY + 1; i++) {
					for (var j = 0; j <= this.slotsX + 1; j++) {
						var newTile = {};

						if (i > 0 && i < this.slotsY + 1 && j > 0 && j < this.slotsX + 1) {
							newTile = this.allTechs[idx];
							idx++;
						} else newTile = new Tile(null, null, null, null);

						newTile.virtualCoords = { x: j, y: i };
						newTile.initRealCoords();

						row.push(newTile);
					}

					vGrid.push(row);
					row = [];
				}

				this.storeRemaingingTechs(idx);

				return vGrid;
			}
		}, {
			key: "returnRandomTech",
			value: function returnRandomTech() {
				return this.offGridTechs[Math.floor(Math.random() * this.offGridTechs.length)];
			}
		}]);

		return Grid;
	}();

	var Tile = function () {
		function Tile(name, tech, size, vCoords) {
			_classCallCheck(this, Tile);

			this.name = name;
			this.tech = tech;
			this.size = size;
			this.virtualCoords = vCoords;
		}

		_createClass(Tile, [{
			key: "initRealCoords",
			value: function initRealCoords() {
				this.realCoords = { x: (this.virtualCoords.x - 1) * this.size, y: (this.virtualCoords.y - 1) * this.size };
			}
		}, {
			key: "calcNewCoords",
			value: function calcNewCoords() {}
		}]);

		return Tile;
	}();

	var GridManager = function () {
		function GridManager(grid, selector) {
			_classCallCheck(this, GridManager);

			this.grid = grid;
			this.frame = document.getElementById(selector);

			this.initGrid();
			this.populateGrid();
		}

		_createClass(GridManager, [{
			key: "initGrid",
			value: function initGrid() {
				this.frame.style.width = this.grid.slotsX * this.grid.slotSize + "px";
				this.frame.style.height = this.grid.slotsY * this.grid.slotSize + "px";
			}
		}, {
			key: "populateGrid",
			value: function populateGrid() {
				for (var i = 0; i < this.grid.virtualGrid.length; i++) {
					for (var j = 0; j < this.grid.virtualGrid[i].length; j++) {
						if (this.grid.virtualGrid[i][j].name !== null) {
							var slotElement = this.grid.virtualGrid[i][j];
							this.drawTile(slotElement.realCoords.x, slotElement.realCoords.y, slotElement.size, slotElement.tech);
						}
					}
				}
			}
		}, {
			key: "drawTile",
			value: function drawTile(x, y, size, color) {
				var tile = document.createElement("div");

				tile.className = "tile";
				tile.style.top = y + "px";
				tile.style.left = x + "px";
				tile.style.width = size + "px";
				tile.style.height = size + "px";
				tile.style.background = color;

				this.frame.appendChild(tile);
			}
		}, {
			key: "prepRow",
			value: function prepRow(rowIdx, dir) {
				var row = this.grid.virtualGrid[rowIdx];
				var slotToPopulate = dir == -1 ? 0 : row.length - 1;
				var newTile = this.grid.returnRandomTech();
				newTile.virtualCoords = { x: slotToPopulate, y: rowIdx };
				newTech.calcNewCoords();
				row[slotToPopulate] = newTile;
			}
		}, {
			key: "updateRow",
			value: function updateRow() {}
		}]);

		return GridManager;
	}();

	document.addEventListener('DOMContentLoaded', function () {

		var settings = { slots: { x: 5, y: 5 },
			slotSize: 100
		};

		var mainGrid = new Grid(settings, tiles);
		var gridManager = new GridManager(mainGrid, 'main-grid');
	});

/***/ })
/******/ ]);