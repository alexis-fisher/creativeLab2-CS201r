'use strict';

function Tile(title) {
  this.title = title;
  this.flipped = false;
}

Tile.prototype.flip = function() {
  this.flipped = !this.flipped;
}


function Game(picNames) {
  var deck = makeDeck(picNames);

  this.grid = makeGrid(deck);

  this.flipTile = function(tile) {
    if (tile.flipped) {
      return;
    }

    tile.flip();

    if (!this.firstPick || this.secondPick) {

      if (this.secondPick) {
        this.firstPick.flip();
        this.secondPick.flip();
        this.firstPick = this.secondPick = undefined;
      }

      this.firstPick = tile;

    } else {

      if (this.firstPick.title === tile.title) {
        this.firstPick = this.secondPick = undefined;

      } else {
        this.secondPick = tile;
      }
    }
  }
}

/* Create an array with two of each tileName in it */
function makeDeck(tileNames) {
  var tileDeck = [];
  tileNames.forEach(function(name) {
    tileDeck.push(new Tile(name));
    tileDeck.push(new Tile(name));
  });

  return tileDeck;
}


function makeGrid(tileDeck) {
  var gridDimension = Math.sqrt(tileDeck.length),
      grid = [];

  for (var row = 0; row < gridDimension; row++) {
    grid[row] = [];
    for (var col = 0; col < gridDimension; col++) {
        grid[row][col] = removeRandomTile(tileDeck);
    }
  }

  return grid;
}


function removeRandomTile(tileDeck) {
  var i = Math.floor(Math.random()*tileDeck.length);
  return tileDeck.splice(i, 1)[0];
}

var memoryGameApp = angular.module('memoryGameApp', []);

memoryGameApp.factory('game', function() {
  var picNames = ['Band', 'Pic1965', 'uncle', 'redShirt', 'pro', '4th', 'brucensara', 'horse'];

  return new Game(picNames);
});


memoryGameApp.controller('GameCtrl', function GameCtrl($scope, game) {
  $scope.game = game;
});

memoryGameApp.directive('mgCard', function() {
  return {
    restrict: 'E',
    template: '<div class="container">' +
                '<div class="card" ng-class="{flipped: tile().flipped}">' +
                  '<img class="front" ng-src="pics/blackSQ.jpg">' +
                  '<img class="back" ng-src="pics/{{tile().title}}.jpg">' +
                '</div>' +
              '</div>',
    scope: {
      tile: 'accessor'
    }
  }
});
