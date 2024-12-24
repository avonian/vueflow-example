<template>
  <div
    :class="{
      'flex gap-x-1': label,
      'flex-col': direction === 'vertical',
      'items-center': direction === 'horizontal'
    }"
  >
    <Combobox
      as="div"
      :modelValue="selections"
      @update:modelValue="update($event)"
      nullable
      multiple
      class="flex"
      :class="{
        'w-full': fullWidth || fullWidth === '',
        'flex-col items-start gap-y-1': direction === 'vertical',
        'flex-row items-center': direction !== 'vertical'
      }"
    >
      <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{
        label
      }}</ComboboxLabel>
      <div
        class="relative"
        :class="{ 'w-full': fullWidth || fullWidth === '' }"
        @click="handleClick"
      >
        <ComboboxInput
          class="w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          :class="errors ? 'border border-1 border-red-400' : 'border-0'"
          autocomplete="off"
          @change="query = $event.target.value"
          :placeholder="
            modelValue.length > 0
              ? modelValue.length + ` ${selectedText ? selectedText : 'selected'}`
              : placeholder
          "
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
      <XCircleIcon
        @click="update([])"
        v-if="(allowClearing || allowClearing === '') && modelValue.length > 0"
        class="h-8 fill-blue-600 cursor-pointer ml-1"
      />
    </Combobox>
    <span class="text-sm text-red-500 mt-1" v-if="errors">{{ errors[0] }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

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
  selectedText,
  fullWidth,
  errors,
  disabled
} = defineProps([
  'label',
  'direction',
  'modelValue',
  'options',
  'allowClearing',
  'placeholder',
  'selectedText',
  'fullWidth',
  'errors',
  'disabled'
])
const emit = defineEmits(['update:modelValue'])

const query = ref('')
const open = ref(false)
const selections = ref([])

const close = function () {
  open.value = false
}

const handleClick = () => {
  if (disabled) return
  open.value = open.value !== true
}

const update = function (value) {
  selections.value = value
  emit('update:modelValue', value)
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

onMounted(() => {
  selections.value = options.filter((o) => {
    return modelValue.find((option) => option.value === o.value)
  })
})
</script>
