<!-- src/components/SecretCodeModal.vue -->
<template>
  <PrimeDialog
    header="Set Your Secret Code"
    v-model:visible="visibleLocal"
    :modal="true"
    :closable="false"
    class="w-96"
  >
    <div class="space-y-4">
      <p>Pick {{ slotsCount }} colors (click to fill each slot):</p>

      <!-- Color palette inside modal -->
      <div class="flex flex-wrap gap-2">
        <ColorButton
          v-for="color in possibleColorsList"
          :key="color"
          :color="color"
          @select="onColorSelect"
        />
      </div>

      <!-- Slots showing temp selection -->
      <div class="mt-2 flex justify-center gap-2">
        <GameSlot
          v-for="(color, idx) in tempSecretCode"
          :key="idx"
          :fillColor="color"
        />
        <GameSlot
          v-for="idx in slotsRemaining"
          :key="`empty-${idx}`"
          :fillColor="null"
        />
      </div>

      <p class="text-center font-semibold text-red-600">{{ errorMessage }}</p>

      <div class="mt-4 flex justify-center gap-4">
        <PrimeButton label="Confirm Code" @click="confirmSecretCode" />
        <PrimeButton
          label="Cancel"
          class="p-button-secondary"
          @click="onCancel"
        />
      </div>
    </div>
  </PrimeDialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import ColorButton from "./ColorButton.vue";
import GameSlot from "./GameSlot.vue";
import { useMastermindState } from "../composables/useMastermindState";

export default defineComponent({
  name: "SecretCodeModal",
  components: {
    ColorButton,
    GameSlot,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue", "code-set"],
  setup(props, { emit }) {
    const {
      state,
      addColorToTemporarySecretCode,
      resetTemporarySecretCode,
      setSecretCode,
    } = useMastermindState();
    const visibleLocal = ref(props.modelValue);
    const errorMessage = ref("");

    // Keep local visibility in sync
    watch(
      () => props.modelValue,
      (val) => {
        visibleLocal.value = val;
        if (val) {
          errorMessage.value = "";
          resetTemporarySecretCode();
        }
      },
    );
    watch(visibleLocal, (val) => {
      emit("update:modelValue", val);
      if (!val) {
        errorMessage.value = "";
        resetTemporarySecretCode();
      }
    });

    const tempSecretCode = computed(() => state.tempSecretCode);
    const slotsCount = computed(() => state.slotsCount);
    const possibleColorsList = computed(() => state.possibleColorsList);
    const slotsRemaining = computed(() => {
      return state.slotsCount - state.tempSecretCode.length;
    });

    const onColorSelect = (color: string) => {
      if (state.tempSecretCode.length < state.slotsCount) {
        addColorToTemporarySecretCode(color);
        if (errorMessage.value) errorMessage.value = "";
      }
    };

    const confirmSecretCode = () => {
      if (state.tempSecretCode.length !== state.slotsCount) {
        errorMessage.value = `Please pick exactly ${state.slotsCount} colors.`;
        return;
      }
      // Persist it into state.secretCode
      setSecretCode();
      emit("code-set"); // notify parent that secret has been set
      visibleLocal.value = false;
    };

    const onCancel = () => {
      visibleLocal.value = false;
    };

    return {
      visibleLocal,
      tempSecretCode,
      slotsCount,
      possibleColorsList,
      slotsRemaining,
      onColorSelect,
      confirmSecretCode,
      onCancel,
      errorMessage,
    };
  },
});
</script>

<style scoped>
/* Dialog classes come from PrimeVue; additional styling via Tailwind in template. */
</style>
