<template>
  <div
    :class="{
      'flex-col': direction === 'vertical',
      'flex gap-x-1': label,
      'items-center': direction === 'horizontal',
      'flex items-center': allowClearing || allowClearing === ''
    }"
  >
    <Combobox
      as="div"
      @update:modelValue="open = false; $emit('update:modelValue', $event ? $event.value : null)"
      :model-value="filteredOptions.find((option) => option.value === modelValue) ?? null"
      nullable
      class="flex"
      :class="{
        'gap-x-2': allowClearing || allowClearing === '',
        'w-full': fullWidth || fullWidth === '',
        'flex-col items-start gap-y-1': direction === 'vertical',
        'flex-row items-center': direction !== 'vertical'
      }"
    >
      <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900" v-if="label">{{
        label
      }}</ComboboxLabel>
      <span class="text-xs font-medium text-gray-600 mb-1" v-if="hint">{{ hint }}</span>
      <div
        class="relative"
        :class="{ 'w-full': fullWidth || fullWidth === '' }"
        @click="handleClick"
        :data-testid="dataTestid"
      >
        <ComboboxInput
          class="w-full rounded-md bg-white py-1.5 pl-3 pr-10 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          :class="{
            'border border-1 border-red-400': errors,
            'border-0': !errors,
            'text-gray-500': disabled,
            'text-gray-900': !disabled
          }"
          autocomplete="off"
          @change="query = $event.target.value"
          :placeholder="placeholder"
          :display-value="(option) => option?.label"
          :disabled="disabled"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="filteredOptions.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          v-show="open"
          static
        >
          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option"
            :value="option"
            as="template"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                'relative cursor-default select-none py-2 pl-3 pr-9 flex gap-x-1',
                active ? 'bg-blue-600 text-white' : 'text-gray-900'
              ]"
            >
              <component class="h-4 w-4" v-if="option.icon" :is="option.icon"> </component>
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ option.label }}
              </span>
              <span
                v-if="selected"
                :class="[
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                  active ? 'text-white' : 'text-blue-600'
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <XCircleIcon
      @click="$emit('update:modelValue', null)"
      v-if="(allowClearing || allowClearing === '') && modelValue"
      class="h-8 fill-blue-600 cursor-pointer ml-1"
    />
    <span class="text-sm text-red-500 mt-1" :data-testid="'error-' + dataTestid" v-if="errors">{{
      errors[0]
    }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { CheckIcon, ChevronUpDownIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'

const {
  label,
  direction,
  options,
  modelValue,
  allowClearing,
  placeholder,
  fullWidth,
  errors,
  disabled,
  hint,
  dataTestid
} = defineProps([
  'label',
  'direction',
  'modelValue',
  'options',
  'allowClearing',
  'placeholder',
  'fullWidth',
  'errors',
  'disabled',
  'hint',
  'dataTestid'
])
defineEmits(['update:modelValue'])

const query = ref('')
const open = ref(false)

const close = function () {
  open.value = false
}

const handleClick = () => {
  if (disabled) return
  open.value = open.value !== true
}

const filteredOptions = computed(() => {
  if (query.value === '') {
    return options
  }
  let filteredOptions = options.filter((option) => {
    return option.label.toLowerCase().includes(query.value.toLowerCase())
  })
  return filteredOptions.length > 0 ? filteredOptions : options
})
</script>
