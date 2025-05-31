<!-- src/components/ColorButton.vue -->
<template>
  <PrimeButton
    :style="{ backgroundColor: color }"
    class="h-12 w-12 rounded-full border-2 border-gray-900 transition-transform hover:scale-110"
    :title="color"
    @click="onClick"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "ColorButton",
  props: {
    color: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ["select"],
  setup(props, { emit }) {
    const onClick = () => {
      emit("select", props.color);
    };
    return { onClick };
  },
});
</script>

<style scoped>
/* (No additional CSS; Tailwind handles sizing, border, transitions) */
</style>
