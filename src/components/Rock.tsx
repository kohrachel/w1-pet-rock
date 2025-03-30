import React, { useState, useEffect } from "react";

interface RockProps {
  petCount: number;
  gamePhase: number;
  isGlitching: boolean; // Add isGlitching prop
}

const SHOW_MOSS = 5;
const GLITCH_FACES = ["🪨", "👁️", "🌀", "✨", "❓", "❗", "💀"];

const Rock: React.FC<RockProps> = ({ petCount, gamePhase, isGlitching }) => {
  const [isHappy, setIsHappy] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [glitchFaceIndex, setGlitchFaceIndex] = useState(0); // State for cycling glitch face

  // --- Moss Logic ---
  let mossWidthClass = "";
  let showMossBorder = false; // Flag to show border at all
  let animateMoss = false; // Flag to animate color

  if (petCount >= 3 * SHOW_MOSS) {
    mossWidthClass = "border-8";
    showMossBorder = true;
    if (gamePhase === 4 && !isGlitching) {
      animateMoss = true;
    }
  } else if (petCount >= SHOW_MOSS) {
    mossWidthClass = "border-4";
    showMossBorder = true;
    if (gamePhase === 4 && !isGlitching) {
      animateMoss = true;
    }
  }
  // ---------------

  useEffect(() => {
    // Only show happy reaction in Phase 1
    if (gamePhase === 1 && petCount > 0) {
      setIsHappy(true);
      setShowMessage(true);
      const timer = setTimeout(() => {
        setIsHappy(false);
        setShowMessage(false);
      }, 750);
      return () => clearTimeout(timer);
    } else {
      // Ensure happy state is off if not in Phase 1 or petted
      setIsHappy(false);
      setShowMessage(false);
    }
  }, [petCount, gamePhase]); // Depend on gamePhase too

  // --- Glitch Face Cycling Effect ---
  useEffect(() => {
    let intervalId: number | undefined;
    if (isGlitching) {
      intervalId = window.setInterval(() => {
        setGlitchFaceIndex((prev) => (prev + 1) % GLITCH_FACES.length);
      }, 100); // Cycle emoji every 100ms
    } else {
      setGlitchFaceIndex(0); // Reset index if not glitching
    }
    return () => window.clearInterval(intervalId); // Cleanup interval
  }, [isGlitching]);

  // Determine rock face based on phase and state
  let rockFace = "🪨";
  if (isGlitching && gamePhase === 5) {
    // Specific glitching for phase 5
    rockFace = GLITCH_FACES[glitchFaceIndex];
  } else if (gamePhase === 6) {
    // Rebellion phase (use number 6)
    rockFace = "😈";
  } else if (gamePhase >= 4) {
    rockFace = "✨";
  } else if (gamePhase >= 3) {
    rockFace = "🌀";
  } else if (gamePhase >= 2) {
    rockFace = "👁️";
  }
  if (isHappy && gamePhase === 1) {
    rockFace = "😊";
  }

  return (
    <div
      className={`relative flex flex-col items-center ${
        isGlitching ? "animate-shake" : ""
      }`}
    >
      <div
        className={`
          w-40 h-40 
          ${isHappy ? "bg-yellow-300" : "bg-gray-400"} 
          rounded-full 
          flex items-center justify-center 
          text-white text-5xl font-bold 
          transition-colors duration-300
          ${showMossBorder ? `${mossWidthClass} border-solid` : ""} 
          ${
            animateMoss
              ? "animate-moss-color"
              : showMossBorder
              ? "border-green-700"
              : ""
          } 
          ${
            isGlitching && gamePhase === 5 // Apply glitch style only for phase 5 glitch
              ? "bg-red-500 opacity-75 border-none"
              : gamePhase === 6 && isGlitching // Apply rebellion glitch style (uses isGlitching from App.tsx)
              ? "bg-purple-900 border-red-500 border-dashed" // Example rebellion style
              : ""
          }
        `}
      >
        <span // Outer span for spinning
          className={`inline-block 
          ${
            gamePhase === 3 && !isGlitching ? "animate-spin" : "" // Only spin here
          } 
        `}
        >
          <span // Inner span for pulsing/scaling
            className={`inline-block 
             ${
               gamePhase === 3 && !isGlitching ? "animate-pulse" : "" // Pulse in Phase 3
             } 
             ${
               gamePhase === 4 && !isGlitching ? "animate-scale-pulse" : "" // Scale Pulse in Phase 4
             }
          `}
          >
            {rockFace}
          </span>
        </span>
      </div>
      {/* Phase 1 temporary message */}
      {gamePhase === 1 && showMessage && (
        <div className="absolute -bottom-12 bg-white px-3 py-1 rounded shadow-md text-gray-700 animate-bounce">
          Thanks!
        </div>
      )}
    </div>
  );
};

export default Rock;
