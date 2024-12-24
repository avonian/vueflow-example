<script setup>
defineProps(['id'])
import Icon from '@/controls/Icon.vue'
defineEmits(['insertAfterNode'])
</script>

<template>
  <div
    class="w-[320px] flex justify-center"
  >
    <div
      class="h-6 w-6 flex items-center justify-center bg-white border border-gray-500 cursor-pointer hover:border-2" @click="$emit('insertAfterNode', id)"
    >
      <Icon name="plus" />
    </div>
  </div>
</template>
