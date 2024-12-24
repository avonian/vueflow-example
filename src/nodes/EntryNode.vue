<script setup>
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/controls/Icon.vue'

defineProps(['id', 'data'])
defineEmits(['edit', 'delete'])
</script>

<template>
  <div
    class="rounded-lg w-[320px] border border-green-600 relative cursor-pointer hover:shadow-md hover:shadow-green-400/50 group"
    :class="data.placeholder ? 'bg-green-50' : 'bg-white'"
    @click="$emit('edit', id)"
  >
    <template v-if="data.placeholder">
      <div
        @click="$emit('edit', id)"
        class="flex items-center justify-center gap-x-2 text-[13px] font-medium"
        style="height: 116px"
      >
        <div
          class="bg-green-50 border border-green-600 w-[24px] h-[24px] p-1 rounded-md flex items-center justify-center"
        >
          <Icon name="plus" class-list="fill-green-600" />
        </div>
        Add an entry point
      </div>
    </template>
    <template v-else>
      <div class="divide-y divide-green-600">
        <div class="px-3 py-6 h-[48px] flex items-center">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-2">
              <div
                class="bg-green-50 border border-green-600 w-[24px] h-[24px] p-1 rounded-md flex items-center justify-center"
              >
                <Icon name="play" class-list="fill-green-600" />
              </div>
              <h2
                class="text-[13px] font-medium leading-5 line-clamp-1"
                v-if="data.condition === 'contact_added_to_list'"
              >
                Contact added to list
              </h2>
              <h2
                class="text-[13px] font-medium leading-5 line-clamp-1"
                v-if="data.condition === 'contact_added_to_segment'"
              >
                Contact added to segment
              </h2>
            </div>
            <div class="flex gap-x-1" v-tippy="'Contacts entered'" data-tippy-placement="bottom">
              <Icon name="person" class-list="fill-green-600" />
              <div class="text-green-600 text-[11px] leading-4 font-medium">{{ data.count }}</div>
            </div>
          </div>
        </div>
        <div class="px-3 py-6">
          <div class="flex gap-4">
            <p
              class="line-clamp-2 leading-[18px] font-normal text-[12px]"
              v-if="data.condition === 'contact_added_to_list'"
            >
              {{ data.list_ids?.length || 1 }} lists selected
            </p>
            <p
              class="line-clamp-2 leading-[18px] font-normal text-[12px]"
              v-if="data.condition === 'contact_added_to_segment'"
            >
              {{ data.segment_ids?.length || 1 }} segment(s) selected
            </p>
          </div>
        </div>
      </div>
      <Handle type="source" :connectable="false" :position="Position.Bottom" />
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
    </template>
  </div>
</template>
