<script setup>
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'
import Icon from '@/controls/Icon.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  sourceX: {
    type: Number,
    required: true
  },
  sourceY: {
    type: Number,
    required: true
  },
  targetX: {
    type: Number,
    required: true
  },
  targetY: {
    type: Number,
    required: true
  },
  sourcePosition: {
    type: String,
    required: true
  },
  targetPosition: {
    type: String,
    required: true
  },
  markerEnd: {
    type: String,
    required: false
  },
  style: {
    type: Object,
    required: false
  },
  showInjectButton: {
    type: Boolean,
    required: false
  }
})

const path = computed(() => getSmoothStepPath(props))
defineEmits(['insertNode'])
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<template>
  <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />

  <!-- Use the `EdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`
      }"
      class="nodrag nopan"
    >
      <div
        class="h-6 w-6 flex items-center justify-center bg-white border border-gray-500 cursor-pointer hover:border-2" @click="$emit('insertNode', id)"
        v-if="showInjectButton"
      >
        <Icon name="plus" />
      </div>
    </div>
  </EdgeLabelRenderer>
</template>
