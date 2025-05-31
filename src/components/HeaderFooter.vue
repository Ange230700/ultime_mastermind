<!-- src/components/HeaderFooter.vue -->
<template>
  <header class="mb-6 text-center">
    <h1 class="text-4xl font-extrabold">MASTERMIND</h1>
    <p class="mt-2 text-gray-700">
      Mastermind is a classic logic game where you try to guess a secret
      combination of {{ slotsCount }} colors among
      {{ possibleColorsCount }} colors. You have {{ maxAttempts }} attempts.
      After each guess, you’ll see clues to help you!
    </p>
  </header>
  <footer class="mt-8 text-center text-gray-600">
    <p>
      Check out the project on
      <a
        href="https://github.com/Ange230700/08_mastermind.git"
        target="_blank"
        class="text-blue-600 underline"
        >GitHub</a
      >
    </p>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useMastermindState } from "../composables/useMastermindState";

export default defineComponent({
  name: "HeaderFooter",
  setup() {
    const { state } = useMastermindState();
    const slotsCount = computed(() => state.slotsCount);
    const possibleColorsCount = computed(() => state.possibleColorsList.length);
    const maxAttempts = computed(() => state.maxAttempts);

    return { slotsCount, possibleColorsCount, maxAttempts };
  },
});
</script>

<style scoped>
/* Basic text styling is handled via Tailwind */
</style>
