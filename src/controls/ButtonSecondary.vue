<template>
  <button
    type="button"
    :disabled="busy || disabled || disabled === ''"
    class="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
    :class="{
      'opacity-25': disabled || disabled === '',
      'hover:bg-blue-50 hover:ring-blue-300': !busy && !(disabled || disabled === '')
    }"
  >
    <img
      src="@/assets/spinner-third-solid.svg"
      class="animate-spin h-5 w-5"
      viewBox="0 0 24 24"
      v-if="busy"
    />
    <slot v-else />
  </button>
</template>

<script setup>
const { disabled } = defineProps(['disabled', 'busy'])
</script>
