/* jshint expr: true */
/* global chai, before, describe, it, beforeEach, afterEach*/

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

describe("in the brick-deck", function(){

  beforeEach(function(done){
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

    // wait for the cards to be shown
    cards[0].addEventListener("show",function(){
      done();
    });

    // Add the custom elements to the page.
    for (i = 0; i < cards.length; i++) {
      deck.appendChild(cards[i]);
    }
    document.body.appendChild(deck);
  });

  afterEach(function(){
    // clean up
    var deck = document.querySelector("brick-deck");
    document.body.removeChild(deck);
  });

  describe("deck.cards", function(){

    it("should return all cards", function(){
      var deck = document.querySelector("brick-deck");
      var cards = Array.prototype.slice.call(document.querySelectorAll("brick-card"));
      expect(deck.cards).to.deep.equal(cards);
    });

  });

  describe("the first card", function(){

    it("should have attribute selected and css style display not none", function(){
      var deck = document.querySelector("brick-deck");
      var card = deck.cards[0];
      expect(window.getComputedStyle(card).display).not.to.equal("none");
      expect(card.getAttribute("selected")).not.to.be.null;
    });

    it("should equal deck.selectedCard", function(){
      var deck = document.querySelector("brick-deck");
      var card = deck.cards[0];
      expect(deck.selectedCard).to.deep.equal(card);
    });

  });

  describe("the second card", function(){

    it("should not have attribute selected and show and css style display none", function(){
      var deck = document.querySelector("brick-deck");
      var card = deck.cards[1];
      expect(window.getComputedStyle(card).display).to.equal("none");
      expect(card.getAttribute("selected")).to.be.null;
    });

  });

  describe("changing of cards", function(){

    it("should work using the showCard() function", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var newCard = deck.cards[newIndex];
      var oldCard = deck.cards[oldIndex];

      deck.showCard(newIndex);

      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by changing the selected-index attribute", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var oldCard = deck.cards[oldIndex];
      var newCard = deck.cards[newIndex];

      deck.setAttribute("selected-index", newIndex);

      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by changing the selectedIndex property", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var oldCard = deck.cards[oldIndex];
      var newCard = deck.cards[newIndex];

      deck.selectedIndex = newIndex;

      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by triggering reveal on a card", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var oldCard = deck.cards[oldIndex];
      var newCard = deck.cards[newIndex];

      newCard.dispatchEvent(new CustomEvent("reveal",{bubbles: true}));

      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by setting selected attribute on a card", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var oldCard = deck.cards[oldIndex];
      var newCard = deck.cards[newIndex];

      newCard.setAttribute("selected","");

      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by setting selected property on a card", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var oldCard = deck.cards[oldIndex];
      var newCard = deck.cards[newIndex];

      newCard.selected = true;

      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by using nextCard and previousCard", function(){
      var deck = document.querySelector("brick-deck");
      var oldIndex = parseInt(deck.getAttribute("selected-index"));
      var newIndex = oldIndex + 1;
      var oldCard = deck.cards[oldIndex];
      var newCard = deck.cards[newIndex];

      deck.nextCard();
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;

      deck.previousCard();
      expect(window.getComputedStyle(newCard).display).to.equal("none");
      expect(newCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(oldCard).display).not.to.equal("none");
      expect(oldCard.getAttribute("selected")).not.to.be.null;
    });
  });

});


