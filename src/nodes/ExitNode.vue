<script setup>
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/controls/Icon.vue'

defineProps(['id', 'data'])
</script>

<template>
  <div class="rounded-lg w-[320px] border border-red-700 bg-white relative c">
    <div class="divide-y divide-red-700">
      <div class="px-3 py-6 h-[48px] flex items-center">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center space-x-2">
            <div
              class="bg-red-50 border border-red-700 w-[24px] h-[24px] p-1 rounded-md flex items-center justify-center"
            >
              <Icon name="play" class-list="fill-red-700" />
            </div>
            <h2 class="text-[13px] font-medium leading-5 line-clamp-1">Exit Workflow</h2>
          </div>
          <div class="flex gap-x-1" v-tippy="'Contacts exited'" data-tippy-placement="bottom">
            <Icon name="person" class-list="fill-red-700" />
            <div class="text-red-700 text-[11px] leading-4 font-medium">{{ data.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <Handle type="target" :connectable="false" :position="Position.Top" />
  </div>
</template>
