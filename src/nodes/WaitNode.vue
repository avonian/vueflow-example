<script setup>
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/controls/Icon.vue'

defineProps(['id', 'data'])
defineEmits(['edit', 'delete'])
</script>

<template>
  <div
    class="rounded-lg w-[320px] border border-gray-400 bg-white relative cursor-pointer hover:shadow-md hover:shadow-gray-400/50 group"
    @click="$emit('edit', id)"
  >
    <div class="divide-y divide-gray-400">
      <div class="px-3 py-6 h-[48px] flex items-center">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center space-x-2">
            <div
              class="bg-gray-50 border border-gray-400 w-[24px] h-[24px] p-1 rounded-md flex items-center justify-center"
            >
              <Icon name="wait" class-list="fill-gray-400" />
            </div>
            <h2
              class="text-[13px] font-medium leading-5 line-clamp-1"
            >
              Wait {{ data.timer_value }} {{ data.timer_unit }}
            </h2>
          </div>
          <div class="flex gap-x-1" v-tippy="'Contacts waiting'" data-tippy-placement="bottom">
            <Icon name="person" class-list="fill-gray-500" />
            <div class="text-gray-500 text-[11px] leading-4 font-medium">{{ data.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <Handle type="target" :position="Position.Top" />
    <Handle id="source-true" type="source" :connectable="false" :position="Position.Bottom" />
    <div
      class="absolute top-0 -right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      @click.stop="$emit('delete', id)"
    >
      <div class="flex flex-col gap-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5">
          <path
            fill="white"
            d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2z"
          />
          <path
            class="fill-red-600"
            d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
