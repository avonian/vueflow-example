<template>
  <button
    type="button"
    :disabled="busy || disabled || disabled === ''"
    class="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    :class="{
      'opacity-25': disabled || disabled === '',
      'hover:bg-blue-700': !busy && !(disabled || disabled === '')
    }"
  >
    <img
      src="@/assets/spinner-third-solid.svg"
      class="animate-spin invert h-5 w-5"
      viewBox="0 0 24 24"
      v-if="busy"
      alt="Loader Image"
    />
    <slot v-else />
  </button>
</template>

<script setup>
const { disabled, busy } = defineProps(['disabled', 'busy'])
</script>
