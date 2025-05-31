<!-- src/App.vue -->
<template>
  <div class="flex flex-1 flex-col items-center justify-center pt-10">
    <HeaderComponent />
    <MastermindBoard />
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderComponent from "./components/HeaderComponent.vue";
import MastermindBoard from "./components/MastermindBoard.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderComponent,
    MastermindBoard,
    FooterComponent,
  },
});
</script>

<style>
/* Global styles come from Tailwind via style.css */
</style>
