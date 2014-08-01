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
  document.head.innerHTML += '<link rel="import" id="el" href="/base/dist/brick-deck.local.html">';
  document.querySelector('#el').addEventListener('load', function() {
    ready();
  });
});

describe("brick-deck", function(){

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
      setTimeout(function () {
        done();
      }, 10);
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

  it("provides functions", function(){
    var deck = document.querySelector("brick-deck");
    expect(typeof deck.showCard).to.equal("function");
    expect(typeof deck.hideCard).to.equal("function");
    expect(typeof deck.nextCard).to.equal("function");
    expect(typeof deck.previousCard).to.equal("function");
  });

  describe("deck.cards", function(){

    it("should return an array all cards", function(){
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

      console.log(document.head.innerHTML);

      var deck = document.querySelector("brick-deck");
      var card = deck.cards[1];
      expect(window.getComputedStyle(card).display).to.equal("none");
      expect(card.getAttribute("selected")).to.be.null;
    });
  });

  describe("changing of cards", function(){
    var deck, oldIndex, newIndex, newCard,oldCard;

    beforeEach(function() {
      deck = document.querySelector("brick-deck");
      oldIndex = parseInt(deck.getAttribute("selected-index"));
      newIndex = oldIndex + 1;
      newCard = deck.cards[newIndex];
      oldCard = deck.cards[oldIndex];
    });

    it("should work using the showCard() function", function(){
      deck.showCard(newIndex);
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by changing the selected-index attribute", function(){
      deck.setAttribute("selected-index", newIndex);
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by changing the selectedIndex property", function(){
      deck.selectedIndex = newIndex;
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by triggering reveal on a card", function(){
      newCard.dispatchEvent(new CustomEvent("reveal",{bubbles: true}));
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by setting selected attribute on a card", function(){
      newCard.setAttribute("selected","");
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by setting selected property on a card", function(){
      newCard.selected = true;
      expect(window.getComputedStyle(oldCard).display).to.equal("none");
      expect(oldCard.getAttribute("selected")).to.be.null;
      expect(window.getComputedStyle(newCard).display).not.to.equal("none");
      expect(newCard.getAttribute("selected")).not.to.be.null;
    });

    it("should work by using nextCard and previousCard", function(){
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

    it("should emit a transitionend event on the old card", function(done){
      var listener = function(){
        oldCard.removeEventListener("transitionend",listener);
        done();
      };
      oldCard.addEventListener("transitionend",listener);
      deck.showCard(newCard);
    });

    it("should emit a transitionend event on the new card", function(done){
      var listener = function(){
        newCard.removeEventListener("transitionend",listener);
        done();
      };
      newCard.addEventListener("transitionend",listener);
      deck.showCard(newCard);
    });

    it("should emit a hide event", function(done){
      var listener = function(){
        oldCard.removeEventListener("hide",listener);
        done();
      };
      oldCard.addEventListener("hide",listener);
      deck.hideCard(oldCard);
    });

    it("should emit a show event", function(done){
      var listener = function(){
        newCard.removeEventListener("show",listener);
        done();
      };
      newCard.addEventListener("show",listener);
      deck.showCard(newCard);
    });

  });

  describe("should allow any element as a child", function(){
    it("automatically wraps non brick-card elements inside light dom", function(done){
      var tmp = document.createElement('div');
      tmp.innerHTML = '<brick-deck><section>1</section><div>2</div></brick-deck>';
      document.body.appendChild(tmp);

      var poll = function(){
        if (tmp.firstChild.children[1].tagName === 'BRICK-CARD'){ // this will be DIV until after ready is finished.
          expect(tmp.firstChild.children[1].tagName).to.be.equal('BRICK-CARD');
          document.body.removeChild(tmp)
          done();
        } else {
          setTimeout(poll, 100);
        }
      }
      poll();
    })

    it("automatically wraps new non brick-card elements", function(done){
      var deck = document.getElementById('deck');
      var div = document.createElement('div');
      deck.appendChild(div);

      var poll = function(){
        if(div.parentNode.tagName === 'BRICK-CARD'){
          expect(div.parentNode.tagName).to.be.equal('BRICK-CARD');
          done();
        }else{
          setTimeout(poll, 100);
        }
      }
      poll();

    })
  })
});
