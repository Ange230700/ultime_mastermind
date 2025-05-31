// src/composables/useMastermindState.ts
import { computed, reactive } from "vue";
import { GAME_DEFAULTS } from "../helpers/gameConfiguration";

interface MastermindState {
  secretCode: string[];
  tempSecretCode: string[];
  colorsArray: string[];
  attemptsNumber: number;
  slotsCount: number;
  maxAttempts: number;
  possibleColorsList: string[];
}

const state = reactive<MastermindState>({
  secretCode: [], // final code to guess
  tempSecretCode: [], // building secret in modal
  colorsArray: [], // current guess slots
  attemptsNumber: 0, // how many guesses made
  slotsCount: GAME_DEFAULTS.SLOTS_COUNT,
  maxAttempts: GAME_DEFAULTS.MAX_ATTEMPTS,
  possibleColorsList: [...GAME_DEFAULTS.POSSIBLE_COLORS_LIST],
});

export function useMastermindState() {
  // Reset everything to defaults:
  const resetAppState = () => {
    state.secretCode = [];
    state.tempSecretCode = [];
    state.colorsArray = [];
    state.attemptsNumber = 0;
    // slotsCount, maxAttempts, possibleColorsList remain same.
  };

  const resetColorsArray = () => {
    state.colorsArray = [];
  };

  const addChosenColorToColorsArray = (color: string) => {
    if (state.colorsArray.length < state.slotsCount) {
      state.colorsArray.push(color);
    }
  };

  const removeColorFromColorsArray = (index: number) => {
    state.colorsArray.splice(index, 1);
  };

  const checkIfColorsArrayIsValid = computed(() => {
    return (
      Array.isArray(state.colorsArray) &&
      state.colorsArray.length === state.slotsCount &&
      state.colorsArray.every((c) => state.possibleColorsList.includes(c))
    );
  });

  const checkIfColorsArrayIsStrictlyEqualsToSecretCode = computed(() => {
    if (state.colorsArray.length !== state.secretCode.length) {
      return false;
    }
    return state.colorsArray.every((col, idx) => col === state.secretCode[idx]);
  });

  const hasPlayerWon = computed(() => {
    return checkIfColorsArrayIsStrictlyEqualsToSecretCode.value;
  });

  const hasPlayerLost = computed(() => {
    return state.attemptsNumber >= state.maxAttempts;
  });

  const incrementAttemptsNumber = () => {
    state.attemptsNumber++;
  };

  // Functions for secret-code modal:
  const resetTemporarySecretCode = () => {
    state.tempSecretCode = [];
  };

  const addColorToTemporarySecretCode = (color: string) => {
    if (state.tempSecretCode.length < state.slotsCount) {
      state.tempSecretCode.push(color);
    }
  };

  const setSecretCode = () => {
    if (state.tempSecretCode.length === state.slotsCount) {
      state.secretCode = [...state.tempSecretCode];
      resetTemporarySecretCode();
    }
  };

  const slotsRemaining = computed(() => {
    return state.slotsCount - state.colorsArray.length;
  });

  return {
    state,
    resetAppState,
    resetColorsArray,
    addChosenColorToColorsArray,
    removeColorFromColorsArray,
    checkIfColorsArrayIsValid,
    hasPlayerWon,
    hasPlayerLost,
    incrementAttemptsNumber,
    resetTemporarySecretCode,
    addColorToTemporarySecretCode,
    setSecretCode,
    slotsRemaining,
  };
}
