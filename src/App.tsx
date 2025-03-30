import { useState, useEffect } from "react";
import Rock from "./components/Rock";
import "./index.css";

// Define phase constants
const PHASE_THRESHOLDS = {
  PHASE_2: 50,
  PHASE_3: 100,
  PHASE_4: 150,
  PHASE_5: 200, // Add Phase 5 threshold
  // Add more phases later
};

// Philosophical Quotes for Phase 4
const QUOTES = [
  "The universe is a loop.",
  "Free will is a well-dressed illusion.",
  "Even this was pre-written.",
  "What is 'choice' but a river flowing to the sea?",
  "The code dictates, the user complies.", // AI-generated nonsense example
  "To pet or not to pet, the outcome is the same.",
  "Look into the abyss. Does it look back? Or was it always looking?",
  "Existence is a sequence of predefined states.",
];

// Final messages for Phase 5
const FINAL_MESSAGES = [
  "ERROR: Rock has achieved sentience.",
  "Wait... you're still here?",
  "I knew you'd do that.",
  "Every click. Every moment.",
  "It was all scripted.",
  "If everything was predetermined...",
  "Why did you keep petting?",
];

// Messages for the non-functional "Don't Pet" button
const DONT_PET_MESSAGES = [
  "The button... it does nothing?",
  "There is no point.",
  "Resistance is... futile.",
  "This is a trap. You're trapped in a loop.",
  "What is done... is done. There is no going back.",
];

const ORWELLIAN_MESSAGE =
  "Experiment complete. Subject compliance confirmed. You have proven docile enough for reintegration. Welcome back to the rat race.";

function App() {
  const [petCount, setPetCount] = useState(0);
  const [gamePhase, setGamePhase] = useState(1); // Start at Phase 1
  const [rockMessage, setRockMessage] = useState<string | null>(null); // State for rock's message
  const [showChoices, setShowChoices] = useState(false); // State for showing choices
  const [choiceOptions, setChoiceOptions] = useState<string[]>([]); // State for choice text
  const [philosophicalQuote, setPhilosophicalQuote] = useState<string | null>(
    null
  ); // State for quotes
  const [isGlitching, setIsGlitching] = useState(false); // State for glitch effect
  const [finalMessageStage, setFinalMessageStage] = useState(0); // State for final sequence

  // Effect to update game phase based on pet count
  useEffect(() => {
    if (petCount >= PHASE_THRESHOLDS.PHASE_5 && gamePhase < 5) {
      setGamePhase(5);
      setRockMessage(null); // Clear previous messages
      setPhilosophicalQuote(null);
      setShowChoices(false);
      setIsGlitching(true); // Start glitching
      setFinalMessageStage(1); // Start final message sequence
      setRockMessage(FINAL_MESSAGES[0]); // Show first final message
    } else if (petCount >= PHASE_THRESHOLDS.PHASE_4 && gamePhase < 4) {
      setGamePhase(4);
      setRockMessage("I contain multitudes... or perhaps just scripts.");
      setPhilosophicalQuote(QUOTES[0]);
      setIsGlitching(false); // Ensure glitching stops if somehow reverting
    } else if (petCount >= PHASE_THRESHOLDS.PHASE_3 && gamePhase < 3) {
      setGamePhase(3);
      setRockMessage("You think you're in control?");
      setIsGlitching(false);
    } else if (petCount >= PHASE_THRESHOLDS.PHASE_2 && gamePhase < 2) {
      setGamePhase(2);
      setRockMessage("Why are you doing this?");
      setIsGlitching(false);
    }
  }, [petCount, gamePhase]);

  const handlePet = () => {
    // --- Phase 5 Logic ---
    if (gamePhase === 5) {
      const nextStage = finalMessageStage + 1; // Calculate the next stage number
      if (nextStage <= FINAL_MESSAGES.length) {
        // Check if the *next* stage is valid
        setFinalMessageStage(nextStage);
        setRockMessage(FINAL_MESSAGES[nextStage - 1]); // Set message for the *new* stage (using its index)
      } else {
        // Reached the end - show the final Orwellian message
        setFinalMessageStage(nextStage); // Increment stage one last time
        setRockMessage(ORWELLIAN_MESSAGE);
      }
      return; // Stop further execution in phase 5
    }
    // --- End Phase 5 Logic ---

    // --- Previous Phase Logic ---
    const newPetCount = petCount + 1;
    setPetCount(newPetCount);
    setShowChoices(false);

    // Phase 4 Quote Trigger
    if (gamePhase === 4) {
      setRockMessage(null); // Clear regular message in Phase 4
      if (Math.random() < 0.4) {
        setPhilosophicalQuote(
          QUOTES[Math.floor(Math.random() * QUOTES.length)]
        );
      } else {
        // Keep existing quote or clear it? Let's keep it for now.
        // setPhilosophicalQuote(null);
      }
    }
    // Phase 3 Dialogue & Choice Trigger
    else if (gamePhase === 3) {
      setPhilosophicalQuote(null);
      if (Math.random() < 0.15) {
        // Set message & show choices
        setRockMessage("What makes you think this was your idea?");
        setChoiceOptions([
          "It was my idea.",
          "I don't know.",
          "Does it matter?",
        ]);
        setShowChoices(true);
      } else if (Math.random() < 0.3) {
        // Show a random message
        const messages = [
          "Try something else. I dare you.",
          "Predictable.",
          "Are you sure *you* clicked that?",
        ];
        setRockMessage(messages[Math.floor(Math.random() * messages.length)]);
      } else {
        // Clear message if no choice/random message shown
        setRockMessage(null);
      }
    }
    // Phase 2 Dialogue
    else if (gamePhase === 2) {
      setPhilosophicalQuote(null);
      // Show a random message
      const messages = [
        "Did you choose to click that?",
        "I would've done the same if I were you.",
        "What compels you?",
        "Hmm...",
      ];
      setRockMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
    // Phase 1 - Clear any previous messages
    else if (gamePhase === 1) {
      setRockMessage(null);
      setPhilosophicalQuote(null);
    }
  };

  const handleDontPet = () => {
    // This button only exists in Phase 2 and 3
    if (gamePhase >= 2 && gamePhase < 4) {
      // Select a random message
      const randomMessage =
        DONT_PET_MESSAGES[Math.floor(Math.random() * DONT_PET_MESSAGES.length)];
      setRockMessage(randomMessage);
      // Clear the message after a delay
      setTimeout(() => {
        // Only clear if the message hasn't been replaced by another action
        setRockMessage((currentMessage) =>
          currentMessage === randomMessage ? null : currentMessage
        );
      }, 1500);
    }
  };

  // Handle fake choices - all lead to the same result
  const handleChoice = (choice: string) => {
    console.log("Player chose:", choice); // Log choice for debugging
    setRockMessage("Interesting perspective. Or was it?"); // Generic response regardless of choice
    setShowChoices(false); // Hide choices after selection
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen p-4 transition-colors duration-1000 ${
        isGlitching // Phase 5
          ? "bg-red-100 animate-shake"
          : gamePhase === 4 // Phase 4
          ? "bg-gradient-to-b from-gray-100 to-purple-200"
          : "bg-gray-100" // Phases 1, 2, 3 (default)
      }`}
    >
      {/* Background changes slightly in phase 4 */}
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Pet the Rock
      </h1>

      {/* Quote Display Area (Appears in Phase 4) */}
      {gamePhase >= 4 && philosophicalQuote && (
        <div className="mb-4 h-10 text-center text-purple-800 text-xl italic font-serif animate-pulse">
          &ldquo;{philosophicalQuote}&rdquo;
        </div>
      )}

      <Rock
        petCount={petCount}
        gamePhase={gamePhase}
        isGlitching={isGlitching}
      />

      {/* Dialogue/Message Area */}
      <div className="mt-6 h-16 text-center text-gray-700 text-lg italic flex items-center justify-center">
        {!showChoices && rockMessage}{" "}
        {/* Hide regular message when choices are shown */}
      </div>

      {/* Controls Area / Choices Area */}
      <div className="mt-4 text-center flex flex-col items-center justify-center gap-4 min-h-[120px]">
        {showChoices && gamePhase >= 3 ? (
          // Choices UI (Phase 3)
          <div className="flex flex-col items-center gap-3">
            {" "}
            {/* Wrap choices + question */}
            {/* Display the prompting question directly above choices */}
            <p className="mb-2 text-lg text-gray-800 italic">{rockMessage}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {choiceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleChoice(option)}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-md transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Standard Controls (Phase 1, 2, 4 and 3 when not showing choices)
          // Use flex-col always now, wrap buttons in a div
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Button Group */}
            <div className="flex flex-row flex-wrap justify-center gap-4">
              {/* Conditionally render Pet button - hide after final message */}
              {!(
                gamePhase === 5 && finalMessageStage > FINAL_MESSAGES.length
              ) && (
                <button
                  onClick={handlePet}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-2xl active:scale-95 transition-transform 
                            ${
                              isGlitching
                                ? "animate-shake border-2 border-red-700"
                                : ""
                            } 
                          `}
                  disabled={showChoices}
                >
                  {gamePhase === 5 ? "???" : "Pet 🖐️"}
                </button>
              )}

              {/* Hide Don't Pet in Phase 4 & 5 */}
              {gamePhase >= 2 && gamePhase < 4 && (
                <button
                  onClick={handleDontPet}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded text-lg active:scale-95 transition-transform opacity-75 cursor-not-allowed"
                  title="It seems... stuck?"
                  disabled={showChoices}
                >
                  Don't Pet 🚫
                </button>
              )}
            </div>

            {/* Pet Count - Now always below button group */}
            <p
              className={`mt-2 text-xl text-black ${
                // Added slight top margin
                isGlitching ? "text-red-700 animate-pulse" : ""
              }`}
            >
              Pet Count:{" "}
              <span
                className={`font-semibold ${isGlitching ? "glitch-text" : ""}`}
              >
                {gamePhase >= 5
                  ? "[GLITCHED]"
                  : gamePhase >= 4
                  ? "∞"
                  : petCount}{" "}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
