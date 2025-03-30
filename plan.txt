# Pet The Rock - Project Plan

## 1. Project Goal
Create a simple web-based game using React, inspired by Neal.fun, exploring themes of determinism vs. free will through the act of petting a rock.

## 2. Core Mechanic
- Player clicks/taps a representation of a rock ("Pet").
- A persistent "Pet Count" tracks the number of pets.
- Each pet triggers changes in the rock's appearance, dialogue, or the surrounding UI, progressing the game through different phases.

## 3. Game Progression (Phases)
The game will evolve through distinct phases based on the pet count or specific triggers:
1.  **The Ordinary:** Simple visual feedback (smiles, moss), basic messages, increasing pet count. Establishes the clicker feel.
2.  **The Strange:** Rock gains eyes, speaks simple questions. Introduce non-functional "Don't Pet" button. Subtle hints of the underlying theme.
3.  **The Self-Aware:** Rock engages in more direct philosophical questioning. Introduce choices that lead to the same outcome.
4.  **The Cosmic:** Rock transforms significantly (black hole, deity). Petting seems to affect the environment/universe. Display philosophical quotes.
5.  **The Breakdown:** UI becomes unstable (flickering, glitches). Rock reveals awareness of the script. Game delivers its final message on determinism.

## 4. Key Themes
- **Determinism:** The core idea that all events, including player actions, are predetermined and inevitable.
- **Illusion of Free Will:** Making the player feel they have agency, then revealing the constraints.
- **Player Agency:** Questioning the nature of interaction within a scripted system.

## 5. Tech Stack
- **Frontend:** React
- **State Management:** Start with React Hooks (`useState`, `useReducer`). Evaluate need for more complex state management later if necessary.
- **Styling:** TBD (Options: CSS Modules, Styled Components, Tailwind CSS)

## 6. High-Level Development Stages
1.  **Setup:** Initialize React project (e.g., using Vite or Create React App). Set up basic file structure.
2.  **Core Implementation:** Create the Rock component, implement the "Pet" button functionality, and the Pet Count display.
3.  **Phase 1:** Implement initial rock states, simple visual changes, and messages.
4.  **Phase 2:** Add dialogue features, eye graphics, and the non-functional "Don't Pet" button.
5.  **Phase 3:** Implement branching dialogue/choices that converge, more complex rock states.
6.  **Phase 4:** Develop cosmic visuals, quote display system.
7.  **Phase 5:** Create UI glitch effects, final dialogue sequences.
8.  **Extras:** Implement refusal mechanics, alternate realities (skins/dialogue variations), hidden "Don't Pet" mode.
9.  **Polish:** Refine UI/UX, add animations/transitions, consider sound effects.
10. **Testing:** Ensure phase transitions work correctly, test across different interactions.

## 7. Notes
- This plan is a living document and will be updated as the project evolves.
- Focus initially on the core loop and phase progression before adding extras. 