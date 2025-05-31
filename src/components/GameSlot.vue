<!-- src/components/GameSlot.vue -->
<template>
  <div
    class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-gray-900 bg-gray-200"
    :style="{ backgroundColor: fillColor ? fillColor : 'transparent' }"
    @click="onRemove"
  >
    <!-- Optionally show X or number of slot -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "GameSlot",
  props: {
    fillColor: {
      type: String as PropType<string | null>,
      default: null,
    },
    index: {
      type: Number as PropType<number>,
      required: false,
    },
  },
  emits: ["remove"],
  setup(props, { emit }) {
    const onRemove = () => {
      if (props.fillColor) {
        // Only remove if there's actually a color
        emit("remove", props.index);
      }
    };
    return { onRemove };
  },
});
</script>

<style scoped>
/* By default, gray border and light background. When fillColor is provided, it overrides. */
</style>
