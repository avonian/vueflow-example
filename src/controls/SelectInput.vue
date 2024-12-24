<template>
  <div class="flex flex-col gap-x-2">
    <label class="flex items-center gap-2 block text-sm font-medium leading-6 text-gray-900" v-if="label">
      {{ label }}
      <span v-if="optional || optional === ''" class="font-normal">(optional)</span>
      <div v-if="!!toolTipTexts && toolTipTexts.length" class="relative group">
        <div
            v-tippy="toolTipTexts"
            data-tippy-placement="bottom"
        >
          <InformationCircleIcon class="h-5 w-5 cursor-pointer" />
        </div>
      </div>
    </label>
    <span class="text-xs font-medium text-gray-600 mb-1" v-if="hint">{{ hint }}</span>
    <select
      ref="input"
      class="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      :disabled="disabled || disabled === ''"
      :class="{
        'border-1 border-red-400': errors,
        'border-0': !errors
      }"
      @change="emitValue($event.target.value)"
      :data-testid="dataTestid"
    >
      <option v-if="!disallowEmpty"></option>
      <option
        v-for="option of options"
        :value="option.value"
        :selected="modelValue === option.value"
        :key="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span class="text-sm text-red-500 mt-1" :data-testid="'error-' + dataTestid" v-if="errors">{{
      errors[0]
    }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { InformationCircleIcon } from "@heroicons/vue/24/outline";

const { label, modelValue, autofocus, errors, optional, disabled, disallowEmpty, hint, dataTestid, toolTipTexts } =
  defineProps([
    'label',
    'modelValue',
    'options',
    'autofocus',
    'errors',
    'optional',
    'disabled',
    'disallowEmpty',
    'hint',
    'dataTestid',
    'toolTipTexts',
  ])
const emit = defineEmits(['update:modelValue'])
const input = ref(null)

const emitValue = (value) => {
  if (value === 'true' || value === 'false') {
    emit('update:modelValue', value === 'true')
  } else {
    emit('update:modelValue', value)
  }
}

onMounted(() => {
  if (autofocus || autofocus === '') {
    setTimeout(() => {
      input.value.focus()
    }, 100)
  }
})
</script>
