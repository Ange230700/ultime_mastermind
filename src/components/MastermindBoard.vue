<!-- src/components/MastermindBoard.vue -->
<template>
  <div
    class="mx-auto flex max-w-lg flex-1 flex-col gap-6 rounded-lg p-4 shadow-lg"
    style="background-color: var(--p-surface-700)"
  >
    <!-- Message / Status -->
    <div class="mb-2 text-center font-semibold">
      <p v-if="!isCodeSet && !hasMadeFirstGuess">First, set the secret code.</p>
      <p v-else-if="victoryMessage">{{ victoryMessage }}</p>
      <p v-else-if="lossMessage">{{ lossMessage }}</p>
      <p v-else-if="clueMessage">{{ clueMessage }}</p>
      <p v-else class="italic">Select 4 colors and submit your guess.</p>
    </div>

    <!-- Color palette (for guessing) -->
    <div class="flex flex-wrap justify-center gap-2">
      <ColorButton
        v-for="color in possibleColors"
        :key="color"
        :color="color"
        @select="onPaletteSelect"
        :disabled="
          !isCodeSet || colorsArray.length >= slotsCount || hasWon || hasLost
        "
      />
    </div>

    <!-- Guess slots -->
    <div class="mt-4 flex justify-center gap-4">
      <GameSlot
        v-for="(color, idx) in colorsArray"
        :key="idx"
        :fillColor="color"
        @remove="onRemoveSlot"
      />
      <GameSlot
        v-for="emptyIdx in emptySlotsCount"
        :key="`empty-${emptyIdx}`"
        :fillColor="null"
      />
    </div>

    <!-- Action buttons -->
    <div class="mt-6 flex justify-center gap-4">
      <PrimeButton
        label="Set Secret Code"
        icon="pi pi-key"
        class="p-button-sm"
        :disabled="hasMadeFirstGuess"
        @click="showModal = true"
        style="font-size: 1rem"
      />
      <PrimeButton
        label="Submit Guess"
        icon="pi pi-check"
        class="p-button-sm"
        :disabled="!canSubmit || hasWon || hasLost"
        @click="handleSubmitGuess"
        style="font-size: 1rem"
      />
      <PrimeButton
        label="Reset Game"
        icon="pi pi-refresh"
        class="p-button-sm p-button-warning"
        :disabled="!hasMadeFirstGuess"
        @click="handleResetGame"
        style="font-size: 1rem"
      />
    </div>

    <!-- Clues area -->
    <transition name="fade">
      <div v-if="showClues" class="mt-6 rounded-lg border p-4">
        <h3 class="mb-2 underline">Clues</h3>
        <p><strong>Well placed:</strong> {{ wellPlacedText }}</p>
        <p><strong>Misplaced:</strong> {{ misplacedText }}</p>
        <p><strong>Not in code:</strong> {{ notInCodeText }}</p>
      </div>
    </transition>

    <!-- Secret Code Modal -->
    <SecretCodeModal v-model="showModal" @code-set="onCodeSet" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import ColorButton from "./ColorButton.vue";
import GameSlot from "./GameSlot.vue";
import SecretCodeModal from "./SecretCodeModal.vue";
import { useMastermindState } from "../composables/useMastermindState";
import { computeClues } from "../helpers/computeClues";

export default defineComponent({
  name: "MastermindBoard",
  components: {
    ColorButton,
    GameSlot,
    SecretCodeModal,
  },
  setup() {
    const {
      state,
      resetAppState,
      resetColorsArray,
      addChosenColorToColorsArray,
      removeColorFromColorsArray,
      checkIfColorsArrayIsValid,
      hasPlayerWon,
      hasPlayerLost,
      incrementAttemptsNumber,
    } = useMastermindState();

    const showModal = ref(false);

    const isCodeSet = computed(
      () => state.secretCode.length === state.slotsCount,
    );
    const hasMadeFirstGuess = computed(() => state.attemptsNumber > 0);
    const hasWon = hasPlayerWon;
    const hasLost = hasPlayerLost;

    // Current guess array:
    const colorsArray = computed(() => state.colorsArray);
    const slotsCount = computed(() => state.slotsCount);

    // How many empty slots to render next to filled slots:
    const emptySlotsCount = computed(() => {
      return Math.max(state.slotsCount - state.colorsArray.length, 0);
    });

    // All possible colors (palette):
    const possibleColors = computed(() => state.possibleColorsList);

    // Clue‐related state:
    const showClues = ref(false);
    const wellPlacedColors = ref<string[]>([]);
    const misplacedColors = ref<string[]>([]);
    const notInCodeColors = ref<string[]>([]);

    // Message for user after each guess
    const clueMessage = computed(() => {
      if (state.attemptsNumber > 0 && !hasWon.value && !hasLost.value) {
        return `Incorrect guess: ${
          state.maxAttempts - state.attemptsNumber
        } attempt(s) remaining.`;
      }
      return "";
    });

    const wellPlacedText = computed(() =>
      wellPlacedColors.value.length
        ? wellPlacedColors.value.join(", ")
        : "None",
    );
    const misplacedText = computed(() =>
      misplacedColors.value.length ? misplacedColors.value.join(", ") : "None",
    );
    const notInCodeText = computed(() =>
      notInCodeColors.value.length ? notInCodeColors.value.join(", ") : "None",
    );

    const victoryMessage = computed<string>(() => {
      return hasWon.value ? "You guessed the secret code! You win!" : "";
    });
    const lossMessage = computed<string>(() => {
      return hasLost.value ? "No more attempts left. You lost!" : "";
    });

    const canSubmit = computed(() => {
      return isCodeSet.value && checkIfColorsArrayIsValid.value;
    });

    // User clicks on a color in the palette to build a guess
    const onPaletteSelect = (color: string) => {
      if (
        state.colorsArray.length < state.slotsCount &&
        isCodeSet.value &&
        !hasWon.value &&
        !hasLost.value
      ) {
        addChosenColorToColorsArray(color);
      }
    };

    // User clicks on a filled slot to remove that color
    const onRemoveSlot = (index: number) => {
      removeColorFromColorsArray(index);
    };

    // Submit Guess handler
    const handleSubmitGuess = () => {
      if (!checkIfColorsArrayIsValid.value) {
        // If they haven’t selected exactly slotsCount colors, do nothing
        return;
      }
      incrementAttemptsNumber();

      // First check win
      if (hasPlayerWon.value) {
        showClues.value = false;
        return;
      }
      // Then check loss
      if (hasPlayerLost.value) {
        showClues.value = false;
        return;
      }

      // Compute clues
      const {
        wellPlacedColors: wp,
        misplacedColors: mp,
        notInCodeColors: nic,
      } = computeClues(state.colorsArray, state.secretCode);

      wellPlacedColors.value = wp;
      misplacedColors.value = mp;
      notInCodeColors.value = nic;
      showClues.value = true;

      // Reset for next guess
      resetColorsArray();
    };

    // Reset entire game
    const handleResetGame = () => {
      resetAppState();
      showClues.value = false;
    };

    // When the modal emits “code-set”, we show the “start” message
    const onCodeSet = () => {
      showClues.value = false;
    };

    return {
      showModal,
      isCodeSet,
      hasMadeFirstGuess,
      possibleColors,
      colorsArray,
      slotsCount,
      emptySlotsCount,
      onPaletteSelect,
      onRemoveSlot,
      canSubmit,
      handleSubmitGuess,
      handleResetGame,
      showClues,
      wellPlacedText,
      misplacedText,
      notInCodeText,
      clueMessage,
      victoryMessage,
      lossMessage,
      hasWon,
      hasLost,
      onCodeSet,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
