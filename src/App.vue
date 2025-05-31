<!-- src/App.vue -->
<template>
  <div class="flex min-h-screen flex-col items-center py-10">
    <HeaderFooter />
    <MastermindBoard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderFooter from "./components/HeaderFooter.vue";
import MastermindBoard from "./components/MastermindBoard.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderFooter,
    MastermindBoard,
  },
});
</script>

<style>
/* Global styles come from Tailwind via style.css */
</style>
