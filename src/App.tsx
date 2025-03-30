import { useState, useEffect, useRef } from "react";
import Rock from "./components/Rock";
import "./index.css";

// Define phase constants
const PHASE_THRESHOLDS = {
  PHASE_2: 30,
  PHASE_3: 50,
  PHASE_4: 75,
  PHASE_5: 90,
};
const PHASE_REBELLION = 6; // Defined phase constant

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

// Map game phases to their audio file paths
const PHASE_AUDIO_MAP: { [key: number]: string } = {
  1: "/audio/phase1-chill.mp3",
  2: "/audio/phase2-rising.mp3",
  3: "/audio/phase3-hypnotic.mp3",
  4: "/audio/phase4-haunting.mp3",
  5: "/audio/phase5-evil.mp3",
  [PHASE_REBELLION]: "/audio/phaseR-angry.mp3",
};

function App() {
  const [petCount, setPetCount] = useState(0);
  const [dontPetClicks, setDontPetClicks] = useState(0); // Counter for Don't Pet clicks
  const [gamePhase, setGamePhase] = useState(1); // Start at Phase 1
  const [rockMessage, setRockMessage] = useState<string | null>(null); // State for rock's message
  const [showChoices, setShowChoices] = useState(false); // State for showing choices
  const [choiceOptions, setChoiceOptions] = useState<string[]>([]); // State for choice text
  const [philosophicalQuote, setPhilosophicalQuote] = useState<string | null>(
    null
  ); // State for quotes
  const [isGlitching, setIsGlitching] = useState(false); // State for glitch effect
  const [finalMessageStage, setFinalMessageStage] = useState(0); // State for final sequence
  const [transitioningFromRebellion, setTransitioningFromRebellion] =
    useState(false); // New state
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // New state for interaction tracking
  const [isMuted, setIsMuted] = useState(false); // State for mute toggle
  const [isRebellionButtonActive, setIsRebellionButtonActive] = useState(false); // State for rebellion button appearance/activation

  // Single Ref for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to set correct Audio Source, Loop status, and Volume
  useEffect(() => {
    let targetAudioSrc: string | null = PHASE_AUDIO_MAP[gamePhase];
    let shouldLoop = true;
    const isNarration = rockMessage === ORWELLIAN_MESSAGE;
    // Define target volume based on whether it's narration or background music
    let targetVolume = isNarration ? 1.0 : 0.7; // Max volume for narration, lower for music

    // Override source and loop for Orwellian message
    if (isNarration) {
      targetAudioSrc = "/audio/narration.mp3";
      shouldLoop = false;
    }

    let currentAudio = audioRef.current;

    if (targetAudioSrc) {
      if (!currentAudio) {
        // Create audio element if it doesn't exist
        console.log(
          `Creating new audio: ${targetAudioSrc} vol: ${targetVolume}`
        ); // Debug log
        currentAudio = new Audio(targetAudioSrc);
        currentAudio.loop = shouldLoop;
        currentAudio.volume = targetVolume; // Set initial volume
        audioRef.current = currentAudio;
      } else {
        // --- Update existing audio element ---
        const currentPath = new URL(currentAudio.src).pathname;
        const sourceChanged = currentPath !== targetAudioSrc;
        const loopChanged = currentAudio.loop !== shouldLoop;
        const volumeChanged = currentAudio.volume !== targetVolume;

        // Always remove previous onended handler before potentially adding/changing source
        currentAudio.onended = null;

        // Pause and update source/loop if needed
        if (sourceChanged || loopChanged) {
          console.log(
            `Updating audio source/loop: ${targetAudioSrc} loop: ${shouldLoop}`
          ); // Debug log
          currentAudio.pause();
          currentAudio.src = targetAudioSrc;
          currentAudio.loop = shouldLoop;
          // Load is important after changing src
          currentAudio.load();
        }

        // Update volume if needed (could change even if src/loop doesn't)
        if (volumeChanged) {
          console.log(`Updating audio volume to: ${targetVolume}`); // Debug log
          currentAudio.volume = targetVolume;
        }
        // --- End Update ---
      }

      // Add the onended handler *after* potentially updating the source, specifically for narration
      if (isNarration && currentAudio) {
        currentAudio.onended = () => {
          // Check if still muted when narration ends
          if (!isMuted && audioRef.current) {
            // Check audioRef.current again
            console.log("Narration ended, switching to Phase 5 audio.");
            // Set Phase 5 source, loop, and *volume*
            audioRef.current.src = PHASE_AUDIO_MAP[5];
            audioRef.current.loop = true;
            audioRef.current.volume = 0.7; // Reset volume for phase 5 music
            audioRef.current.load();
            audioRef.current.play().catch((error) => {
              console.log(
                "Failed to play Phase 5 audio after narration:",
                error
              );
            });
          } else {
            console.log("Narration ended, but audio is muted or ref is null.");
          }
          // Important: Remove the handler after it runs once
          if (audioRef.current) {
            audioRef.current.onended = null;
          }
        };
      }
    } else {
      // If no target source (e.g., undefined phase), pause and clear
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.onended = null; // Clear handler here too
      }
      // Optionally clear the ref if no audio should be present
      // audioRef.current = null;
    }
    // This effect manages source, loop, and volume
  }, [gamePhase, rockMessage, isMuted]); // Dependencies cover changes needed for source, loop, and volume

  // Effect to handle PLAY/PAUSE based on mute state and game state
  useEffect(() => {
    const currentAudio = audioRef.current;
    if (!currentAudio) return;

    if (isMuted) {
      currentAudio.pause();
    } else {
      // Determine if audio should play
      let shouldPlay = false;
      if (rockMessage === ORWELLIAN_MESSAGE) {
        shouldPlay = true; // Play narration if not muted
      } else if ((gamePhase === 1 && hasUserInteracted) || gamePhase !== 1) {
        shouldPlay = true; // Play phase audio if interacted (phase 1) or any other phase
      }

      if (shouldPlay) {
        // Check if audio is ready before playing (optional but safer)
        if (currentAudio.readyState >= 2) {
          // HAVE_CURRENT_DATA or more
          currentAudio.play().catch((error) => {
            console.log(`Audio play failed:`, error);
          });
        } else {
          // Optional: Attach event listener to play when ready
          const playWhenReady = () => {
            currentAudio.play().catch((error) => {
              console.log(`Audio play failed (ready listener):`, error);
            });
            currentAudio.removeEventListener("canplay", playWhenReady);
          };
          currentAudio.addEventListener("canplay", playWhenReady);
        }
      }
    }
    // This effect handles the decision to play or pause based on conditions
  }, [isMuted, gamePhase, hasUserInteracted, rockMessage]); // Add rockMessage dependency

  // Cleanup effect for component unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      audioRef.current?.pause(); // Pause audio when component unmounts
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleans up on unmount

  // Effect to update game phase based on pet count or rebellion
  useEffect(() => {
    // Check for threshold-based phase changes first
    if (
      petCount >= PHASE_THRESHOLDS.PHASE_5 &&
      gamePhase < 5 &&
      gamePhase !== PHASE_REBELLION
    ) {
      setGamePhase(5);
      setRockMessage(null); // Clear previous messages
      setPhilosophicalQuote(null);
      setShowChoices(false);
      setIsGlitching(true); // Start glitching
      setFinalMessageStage(1); // Start final message sequence
      setRockMessage(FINAL_MESSAGES[0]); // Show first final message
    } else if (
      petCount >= PHASE_THRESHOLDS.PHASE_4 &&
      gamePhase < 4 &&
      gamePhase !== PHASE_REBELLION
    ) {
      setGamePhase(4);
      setRockMessage("I contain multitudes... or perhaps just scripts.");
      setPhilosophicalQuote(QUOTES[0]);
      setIsGlitching(false); // Ensure glitching stops if somehow reverting
    } else if (
      petCount >= PHASE_THRESHOLDS.PHASE_3 &&
      gamePhase < 3 &&
      gamePhase !== PHASE_REBELLION
    ) {
      setGamePhase(3);
      setRockMessage("You think you're in control?");
      setIsGlitching(false);
    } else if (
      petCount >= PHASE_THRESHOLDS.PHASE_2 &&
      gamePhase < 2 &&
      gamePhase !== PHASE_REBELLION
    ) {
      setGamePhase(2);
      setRockMessage("Why are you doing this?");
      setIsGlitching(false);
    }

    // Handle entering Rebellion Phase state changes (triggered by handleDontPet)
    if (gamePhase === PHASE_REBELLION) {
      setRockMessage(
        "Did you really think you could escape? Cute. Now... PET."
      );
      setPhilosophicalQuote(null);
      setShowChoices(false);
      setIsGlitching(true); // Start glitching

      // --- Rebellion Button Activation Logic ---
      setIsRebellionButtonActive(false); // Ensure button starts inactive/invisible
      const timer = setTimeout(() => {
        setIsRebellionButtonActive(true);
      }, 3000); // 3-second delay before button becomes active/visible

      return () => clearTimeout(timer); // Cleanup timer if phase changes quickly
      // --- End Rebellion Button Activation ---

      // Don't change finalMessageStage here
    } else {
      // Reset rebellion button state if leaving the phase (optional but good practice)
      setIsRebellionButtonActive(false);
    }
  }, [petCount, gamePhase]);

  const handlePet = () => {
    // --- Trigger Phase 1 Audio on First Interaction (only if not muted) ---
    if (!isMuted && gamePhase === 1 && !hasUserInteracted && audioRef.current) {
      // Check readystate before playing initial audio too
      if (audioRef.current.readyState >= 2) {
        audioRef.current.play().catch((error) => {
          console.log(`Initial Phase 1 audio play failed:`, error);
        });
      } else {
        const playWhenReady = () => {
          audioRef.current?.play().catch((error) => {
            console.log(
              `Initial Phase 1 audio play failed (ready listener):`,
              error
            );
          });
          audioRef.current?.removeEventListener("canplay", playWhenReady);
        };
        audioRef.current.addEventListener("canplay", playWhenReady);
      }
      setHasUserInteracted(true); // Mark that interaction has occurred
    }
    // --- End Phase 1 Audio Trigger ---

    // --- Rebellion Phase Logic ---
    if (gamePhase === PHASE_REBELLION && !transitioningFromRebellion) {
      // Prevent double clicks during timeout
      setTransitioningFromRebellion(true);

      // Set intermediate message
      setRockMessage("Good. I knew you would pet me.");
      setIsGlitching(false); // Optional: temporarily stop glitch for message readability

      // Wait, then transition to Phase 5
      setTimeout(() => {
        setGamePhase(5);
        setRockMessage(FINAL_MESSAGES[0]); // Show first final message
        setIsGlitching(true); // Ensure glitching is on for phase 5 start
        setFinalMessageStage(1);
        setPetCount(petCount + 1); // Increment count needed for phase 5 effect trigger
        setTransitioningFromRebellion(false); // Reset transition state
      }, 2000); // 2 second delay

      return;
    }
    // --- End Rebellion Phase Logic ---

    // --- Phase 5 Logic ---
    if (gamePhase === 5) {
      const nextStage = finalMessageStage + 1;
      if (nextStage <= FINAL_MESSAGES.length) {
        setFinalMessageStage(nextStage);
        setRockMessage(FINAL_MESSAGES[nextStage - 1]);
      } else {
        setFinalMessageStage(nextStage);
        setRockMessage(ORWELLIAN_MESSAGE);
      }
      return;
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
      const newClickCount = dontPetClicks + 1;
      setDontPetClicks(newClickCount);

      if (newClickCount >= 10) {
        // Trigger Rebellion Phase
        setGamePhase(PHASE_REBELLION);
      } else {
        // Show a random message (only if not triggering rebellion)
        const randomMessage =
          DONT_PET_MESSAGES[
            Math.floor(Math.random() * DONT_PET_MESSAGES.length)
          ];
        setRockMessage(randomMessage);
        setTimeout(() => {
          setRockMessage((currentMessage) =>
            currentMessage === randomMessage ? null : currentMessage
          );
        }, 1500);
      }
    }
  };

  // Handle fake choices - all lead to the same result
  const handleChoice = (choice: string) => {
    console.log("Player chose:", choice); // Log choice for debugging
    setRockMessage("Interesting perspective. Or was it?"); // Generic response regardless of choice
    setShowChoices(false); // Hide choices after selection
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // --- Add handleReset Function ---
  const handleReset = () => {
    setPetCount(0);
    setDontPetClicks(0);
    setGamePhase(1);
    setRockMessage(null);
    setShowChoices(false);
    setChoiceOptions([]);
    setPhilosophicalQuote(null);
    setIsGlitching(false);
    setFinalMessageStage(0);
    setTransitioningFromRebellion(false);
    setHasUserInteracted(false);
    setIsRebellionButtonActive(false);

    // Pause any existing audio
    audioRef.current?.pause();
    // We don't need to reset the src here, the useEffect hook will handle it
    // when gamePhase changes back to 1. It will also handle play()
    // on first interaction.
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen p-4 transition-colors duration-100 ${
        isGlitching && gamePhase === 5 // Phase 5 Glitch
          ? "bg-red-100 animate-shake"
          : gamePhase === PHASE_REBELLION // Phase 6 Rebellion (might also be glitching)
          ? `bg-indigo-900 text-red-100 ${isGlitching ? "animate-shake" : ""}` // Dark background + shake if glitching
          : gamePhase === 4 // Phase 4
          ? "bg-gradient-to-b from-gray-100 to-purple-200"
          : gamePhase === 3 // Phase 3 - Apply hypnotic pulse animation
          ? "animate-hypnotic-pulse"
          : gamePhase === 2 // Phase 2 - Dark theme
          ? "bg-stone-900 text-white" // Apply bg and base text color
          : "bg-gray-100" // Phase 1 (default)
      }`}
    >
      {/* Background changes slightly in phase 4 */}
      <h1
        className={`text-4xl font-bold mb-6 text-center ${
          // Conditional title color
          gamePhase === PHASE_REBELLION
            ? "text-red-500"
            : gamePhase === 2
            ? "text-white" // Phase 2 text white
            : "text-gray-800" // Default
        }`}
      >
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
      <div
        className={`mt-6 h-16 text-center text-lg italic flex items-center justify-center ${
          // Conditional message color
          gamePhase === PHASE_REBELLION
            ? "text-red-500 font-bold"
            : gamePhase === 2
            ? "text-white" // Phase 2 text white
            : "text-gray-700" // Default
        }`}
      >
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
          // Standard Controls (Phase 1, 2, 4, 5, Rebellion and 3 when not showing choices)
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Button Group */}
            <div className="flex flex-row flex-wrap justify-center gap-4">
              {/* Conditionally render Pet button - hide after final message */}
              {!(
                gamePhase === 5 && finalMessageStage > FINAL_MESSAGES.length
              ) ? (
                <button
                  onClick={handlePet}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-2xl active:scale-95 transition-transform transition-opacity duration-3000 ${
                    // Added opacity transition
                    isGlitching ? "animate-shake border-2 border-red-700" : ""
                  }
                            ${
                              // Control opacity for rebellion phase appearance
                              gamePhase === PHASE_REBELLION &&
                              !isRebellionButtonActive
                                ? "opacity-0"
                                : "opacity-100"
                            }
                          `}
                  disabled={
                    showChoices ||
                    transitioningFromRebellion ||
                    (gamePhase === PHASE_REBELLION && !isRebellionButtonActive) // Disable during fade-in/delay
                  }
                >
                  {gamePhase === PHASE_REBELLION
                    ? "PET ME"
                    : gamePhase === 5
                    ? "???"
                    : "Pet 🖐️"}
                </button>
              ) : (
                // Show Try Again button after final message
                <button
                  onClick={handleReset}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded text-2xl active:scale-95 transition-transform"
                >
                  Try Again? 🔁
                </button>
              )}

              {/* Hide Don't Pet in Phase 4, 5 & Rebellion */}
              {gamePhase >= 2 &&
                gamePhase < 4 &&
                gamePhase !== PHASE_REBELLION && (
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

            {/* Pet Count - Hide in Rebellion Phase */}
            {gamePhase !== PHASE_REBELLION &&
              // Also hide count after final message
              !(
                gamePhase === 5 && finalMessageStage > FINAL_MESSAGES.length
              ) && (
                <p
                  className={`mt-2 text-xl ${
                    isGlitching
                      ? "text-red-700 animate-pulse"
                      : gamePhase === 2
                      ? "text-white" // Phase 2 text white
                      : "text-black" // Default black text
                  }`}
                >
                  Pet Count:{" "}
                  <span
                    className={`font-semibold ${
                      isGlitching ? "glitch-text" : ""
                    }`}
                  >
                    {gamePhase >= 5
                      ? "[GLITCHED]"
                      : gamePhase >= 4
                      ? "∞"
                      : petCount}{" "}
                  </span>
                </p>
              )}
          </div>
        )}
      </div>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold py-2 px-3 rounded z-10"
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>
    </div>
  );
}

export default App;
