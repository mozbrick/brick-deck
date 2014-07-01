/* jshint expr: true */
/* global chai, before, describe, it */

var expect = chai.expect;

var ready;
before(function (done) {
  ready = done;
});

var cardCount = 10;

window.addEventListener('WebComponentsReady', function() {

  // Add the HTMLImport for the custom element.
  document.head.innerHTML += '<link rel="import" id="el" href="/base/src/brick-deck.html">';

  document.querySelector('#el').addEventListener('load', function() {

    ready();

  });
});

describe("the brick-deck with transition-type and selectedIndex 0", function(){

  before(function(){
    // Create the elements.
    var deck = document.createElement('brick-deck');
    deck.id = 'deck';
    var cards = [];
    for (var i = 0; i < cardCount; i++) {
      var card = document.createElement('brick-card');
      card.id = i;
      card.innerHTML = i;
      cards.push(card);
    }

    // Set the attributes.
    deck.setAttribute('selected-index', 0);
    deck.setAttribute('transition-type', 'slide-left');
    cards[0].setAttribute('selected','');

    // Add the custom elements to the page.
    for (i = 0; i < cards.length; i++) {
      deck.appendChild(cards[i]);
    }
    document.body.appendChild(deck);
  });

  it("should be attached to the DOM", function(){
    expect(document.querySelector("brick-deck")).not.to.be.null;
  });

  describe("the first card", function(){

    it("should not have display set to none", function(){
      var card = document.querySelectorAll("brick-card")[0];
      expect(window.getComputedStyle(card).display).not.to.equal("none");
    });

    it("should have attribute selected and show", function(){
      var card = document.querySelectorAll("brick-card")[0];
      expect(card.getAttribute("selected")).not.to.be.null;
      expect(card.getAttribute("show")).not.to.be.null;
    });

  });

});

describe("the brick-deck", function(){


});


