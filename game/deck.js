var uniqid = require("uniqid");

module.exports = deck;


function deck(){
	this.id = uniqid();
	this.deck = null;
}



deck.prototype.getDeck = function() {
    var Deck = ['AS', 'KS', 'QS', 'JS', 'TS', '9S', '8S', '7S', '6S', '5S', '4S', '3S', '2S', 'AH', 'KH', 'QH', 'JH',
        'TH', '9H', '8H', '7H', '6H', '5H', '4H', '3H', '2H', 'AD', 'KD', 'QD', 'JD', 'TD', '9D', '8D', '7D', '6D',
        '5D', '4D', '3D', '2D', 'AC', 'KC', 'QC', 'JC', 'TC', '9C', '8C', '7C', '6C', '5C', '4C', '3C', '2C'];

    this.deck = this.shuffle(Deck);
    return this;

};

deck.prototype.shuffle = function(deck) {
    //Shuffle the deck array with Fisher-Yates
    var i,
        j,
        tempi,
        tempj;

    for (i = 0; i < deck.length; i++) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = deck[i];
        tempj = deck[j];
        deck[i] = tempj;
        deck[j] = tempi;
    }
    return deck;
};




deck.prototype.draw = function( count ) {
  count || ( count = 1 );
  var drawnCards = this.deck.splice( 0, count );
  if ( ! drawnCards.length ) { return; }
  return count === 1 ? drawnCards[ 0 ] : drawnCards;
};
