<template>
  <button
    type="button"
    :disabled="busy || disabled || disabled === ''"
    class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    :class="{
      'opacity-25': disabled || disabled === '',
      'hover:bg-red-700': !busy && !(disabled || disabled === '')
    }"
  >
    <img
      src="@/assets/spinner-third-solid-white.svg"
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
