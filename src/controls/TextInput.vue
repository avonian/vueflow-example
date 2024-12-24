<template>
  <div :class="{ 'flex gap-x-2': label, 'flex-col gap-y-1': direction === 'vertical' }">
    <label class="block text-sm font-medium leading-6 text-gray-900" v-if="label"
      >{{ label }}
      <span v-if="optional || optional === ''" class="font-normal">(optional)</span></label
    >
    <span class="text-xs font-medium text-gray-600 mb-1" v-if="hint">{{ hint }}</span>
    <div
      class="flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 relative"
    >
      <span
        class="flex select-none items-center pl-3 text-gray-500 absolute right-3 sm:text-sm"
        v-if="counter || counter === ''"
        >{{ maxlength - modelValue.length }}/{{ maxlength }}</span
      >
      <input
        ref="input"
        :type="type || 'text'"
        @input="$emit('update:modelValue', $event.target.value)"
        :value="modelValue"
        class="block w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        :class="{
          'pl-1.5 pr-15': counter,
          'p-1.5': !counter,
          'border-1 border-red-400': errors,
          'border-0': !errors,
          'text-gray-400': disabled || disabled === '',
          'text-gray-900': !disabled && disabled !== ''
        }"
        :disabled="disabled || disabled === ''"
        :placeholder="placeholder"
        :maxlength="maxlength ? maxlength : 100"
        :min="min"
        :data-testid="dataTestid"
      />
      <DocumentDuplicateIcon
        class="cursor-pointer bg-gray-300 h-full rounded-r-md w-7 p-1 flex items-center justify-center text-gray-400 absolute right-0"
        @click="copyText"
        v-tippy="'Click to copy'"
        v-if="enableCopy || enableCopy === ''"
      />
    </div>
    <span class="text-sm text-red-500 mt-1" :data-testid="'error-' + dataTestid" v-if="errors">{{
      errors[0]
    }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DocumentDuplicateIcon } from '@heroicons/vue/20/solid'
import { toast } from 'vue3-toastify'

const {
  label,
  direction,
  modelValue,
  placeholder,
  maxlength,
  counter,
  autofocus,
  type,
  min,
  errors,
  optional,
  disabled,
  enableCopy,
  hint,
  dataTestid
} = defineProps([
  'label',
  'direction',
  'placeholder',
  'modelValue',
  'maxlength',
  'counter',
  'type',
  'autofocus',
  'type',
  'min',
  'errors',
  'optional',
  'disabled',
  'enableCopy',
  'hint',
  'dataTestid'
])
defineEmits(['update:modelValue'])
const input = ref(null)

const copyText = () => {
  const inputElement = input.value
  if (inputElement instanceof HTMLElement) {
    inputElement.select()
    inputElement.setSelectionRange(0, 99999)
    navigator.clipboard
      .writeText(inputElement.value)
      .then(() => {
        console.log('Text copied to clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
      })
  } else {
    console.error('The provided input is not a valid HTMLElement')
  }
  toast.info('Text copied!')
}

onMounted(() => {
  if (autofocus || autofocus === '') {
    setTimeout(() => {
      input.value.focus()
    }, 100)
  }
  if (type === 'number' && input.value > 0) {
    // remove leading zeros
    input.value.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/^0+/, '')
    })
  }
})
</script>
