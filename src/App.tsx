import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

// generates a deck of card pairs
function generateDeck() {
  const symbols = ["🐡", "🐠", "🐙", "🦐", "🐋", "🐬"]; // lil fishies
  return [...symbols, ...symbols]; // duplicate the symbols to create pairs
}

// this function shuffles the deck randomly
function shuffle(deck: Array<string>) {
  return deck.sort(() => Math.random() - 0.5); // randomly shuffles the deck
}

function App() {
  const [deck, setDeck] = useState(Array<string>); // state to hold the deck of cards
  const [flippedCards, setFlippedCards] = useState(Array<boolean>); // state to track which cards are flipped
  const [selectedCards, setSelectedCards] = useState(Array<number>); // state to track the currently selected cards
  const [foundPairs, setFoundPairs] = useState(0); // state to track the number of pairs found
  const [gameWon, setGameWon] = useState(false); // state to check if the game is won
  const [isCheckingPair, setIsCheckingPair] = useState(false); // state to block clicks during comparison
  const [clickCount, setClickCount] = useState(0); // state to count the number of clicks

  // runs once when the app loads, initializing the deck and resetting the game state
  useEffect(() => {
    const newDeck = shuffle(generateDeck());
    setDeck(newDeck);
    setFlippedCards(Array(newDeck.length).fill(false)); // initialize all cards as unflipped
  }, []);

  // checks if the game is won when all pairs are found
  useEffect(() => {
    if (foundPairs === deck.length / 2 && deck.length > 0) {
      setGameWon(true); // set the gameWon state to true if all pairs are found
    }
  }, [foundPairs, deck.length]); // this runs every time foundPairs changes

  // this function is triggered when a card is clicked
  const handleCardClick = (index: number) => {
    // prevents clicking if the card is already flipped or if two cards are being compared
    if (flippedCards[index] || selectedCards.length === 2 || isCheckingPair)
      return;

    // increments the click count for each valid click
    setClickCount(clickCount + 1);

    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = true; // flip the clicked card
    setFlippedCards(newFlippedCards); // update the flippedCards state

    const newSelectedCards = [...selectedCards, index]; // add this card to selectedCards

    // when two cards are selected, compare them
    if (newSelectedCards.length === 2) {
      setIsCheckingPair(true); // block further clicks during comparison

      const [first, second] = newSelectedCards;
      if (deck[first] === deck[second]) {
        setFoundPairs(foundPairs + 1); // increment the found pairs count if the cards match
        setSelectedCards([]); // reset the selectedCards array
        setIsCheckingPair(false); // allow clicks again
      } else {
        // if the cards don't match, flip them back after a delay
        setTimeout(() => {
          newFlippedCards[first] = false;
          newFlippedCards[second] = false;
          setFlippedCards([...newFlippedCards]); // update the flippedCards state
          setSelectedCards([]); // reset the selectedCards array
          setIsCheckingPair(false); // allow clicks again
        }, 500); // wait .5 second before flipping the cards back
      }
    } else {
      setSelectedCards(newSelectedCards); // update selectedCards if only one card is flipped
    }
  };

  // restarts the game by shuffling a new deck and resetting the state
  const restartGame = () => {
    const newDeck = shuffle(generateDeck());
    setDeck(newDeck); // sets a new deck
    setFlippedCards(Array(newDeck.length).fill(false)); // reset all cards to face-down
    setFoundPairs(0); // reset found pairs count
    setGameWon(false); // reset gameWon state
    setSelectedCards([]); // clear the selectedCards array
    setClickCount(0); // reset the click count
    setIsCheckingPair(false); // allow clicks again
  };

  return (
    <div>
      <h1 className="game-title">Memory Game</h1>
      {gameWon && (
        <>
          <Confetti />
          <p>Congratulations! You won! 💖 </p>
          <button style={{ marginBottom: "20px" }} onClick={restartGame}>
            Play Again
          </button>
        </>
      )}
      <div className="memory-game">
        {deck.map((card, index) => (
          <div
            className={`card ${!flippedCards[index] ? "hidden" : ""}`} // add 'hidden' class if the card is face-down
            key={index}
            onClick={() => handleCardClick(index)}
          >
            {flippedCards[index] ? card : "X"}{" "}
            {/* show the card if flipped, otherwise show 'X' */}
          </div>
        ))}
      </div>
      <p className="click-counter">Clicks: {clickCount}</p>{" "}
      {/* Affiche le compteur de clics */}
    </div>
  );
}

export default App;
