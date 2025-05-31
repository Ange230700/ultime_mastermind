<!-- src/components/HeaderComponent.vue -->
<template>
  <header class="mb-6 text-center">
    <h1 class="text-4xl font-extrabold">MASTERMIND</h1>
    <p class="mt-2">
      Mastermind is a classic logic game where you try to guess a secret
      combination of {{ slotsCount }} colors among
      {{ possibleColorsCount }} colors. You have {{ maxAttempts }} attempts.
      After each guess, you’ll see clues to help you!
    </p>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useMastermindState } from "../composables/useMastermindState";

export default defineComponent({
  name: "HeaderComponent",
  setup() {
    const { state } = useMastermindState();
    const slotsCount = computed(() => state.slotsCount);
    const possibleColorsCount = computed(() => state.possibleColorsList.length);
    const maxAttempts = computed(() => state.maxAttempts);

    return {
      slotsCount,
      possibleColorsCount,
      maxAttempts,
    };
  },
});
</script>

<style scoped>
/* Tailwind global styles apply; no additional rules needed here. */
</style>
