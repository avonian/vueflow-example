<template>
  <form @submit.prevent="save" class="flex-1 flex flex-col justify-between">
    <div class="space-y-12" v-if="loaded">
      <div class="flex flex-col gap-y-3">
        <ComboBox
          label="Condition"
          fullWidth
          direction="vertical"
          v-model="node.condition"
          :errors="errors?.condition"
          :options="[
            { label: 'Contact added to segment', value: 'contact_added_to_segment' },
            { label: 'Contact added to list', value: 'contact_added_to_list' }
          ]"
          data-test="aut-form-condition-input"
        />
        <template v-if="node.condition === 'contact_added_to_segment'">
          <MultiComboBox
            label="Segment(s)"
            direction="vertical"
            selectedText="segment(s)"
            placeholder="Select segments"
            fullWidth
            :options="segmentOptions"
            v-model="selectedSegments"
            v-if="segmentStore.segments.length > 0"
            :errors="errors?.segment_ids"
            data-test="aut-form-segment-input"
          />
          <div
            class="bg-red-50 px-2 -mx-2 py-2 rounded-md text-red-600 text-center flex flex-col gap-y-3"
            v-else
          >
            No segments found in the system.
          </div>
        </template>
        <template v-if="node.condition === 'contact_added_to_list'">
          <MultiComboBox
            label="List(s)"
            direction="vertical"
            selectedText="list(s)"
            placeholder="Select lists"
            fullWidth
            :options="listOptions"
            v-model="selectedLists"
            @update:modelValue="node.list_ids = $event"
            v-if="listStore.lists.length > 0"
            :errors="errors?.list_ids"
            data-test="aut-form-list-input"
          />
          <div
            class="bg-red-50 px-2 -mx-2 py-2 rounded-md text-red-600 text-center flex flex-col gap-y-3"
            v-else
          >
            No lists found in the system.
          </div>
        </template>
      </div>
    </div>
    <div class="mt-6 flex items-center justify-between gap-x-6">
      <ButtonSecondary
        class="ring-0 ring-transparent border-0 shadow-none"
        @click="$parent.$emit('hide')"
        data-test="btn-cancel-node"
        >Cancel</ButtonSecondary
      >
      <ButtonPrimary :disabled="busy" @click="save" data-test="btn-save-node">{{
        busy ? 'Saving...' : 'Save'
      }}</ButtonPrimary>
    </div>
  </form>
</template>

<script setup>
import { onBeforeMount, ref, getCurrentInstance, watch } from 'vue'
import ButtonPrimary from '@/controls/ButtonPrimary.vue'
import ButtonSecondary from '@/controls/ButtonSecondary.vue'
import ComboBox from '@/controls/ComboBox.vue'
import MultiComboBox from '@/controls/MultiComboBox.vue'
import { useSegmentStore } from '@/stores/segment.ts'
import { useListStore } from '@/stores/list.ts'
const segmentStore = useSegmentStore()
const listStore = useListStore()

const props = defineProps(['modelValue'])

const node = ref({
  id: props.modelValue.id
})
const isNew = !props.modelValue.id || props.modelValue.data.placeholder

if (isNew) {
  Object.assign(node.value, {
    condition: '',
    list_ids: [],
    segment_ids: []
  })
} else {
  Object.assign(node.value, {
    condition: props.modelValue.data.condition,
    list_ids: props.modelValue.data.list_ids || [],
    segment_ids: props.modelValue.data.segment_ids || []
  })
}
const selectedSegments = ref([])
const selectedLists = ref([])

const loaded = ref(false)
const errors = ref({})
const busy = ref(false)

const currentInstance = getCurrentInstance()
const parentComponent = currentInstance.parent

const segmentOptions = ref([])
const listOptions = ref([])

const save = async () => {
  const payload = { ...node.value }
  payload.list_ids = selectedLists.value.map((l) => l.value)
  payload.segment_ids = selectedSegments.value.map((s) => s.value)
  parentComponent.emit('save', payload)
  parentComponent.emit('hide')
}

watch(
  () => node.value.condition,
  () => {
    if (node.value.condition === 'contact_added_to_segment') {
      node.value.list_ids = []
    } else {
      node.value.segment_ids = []
    }
  },
  { deep: true }
)

onBeforeMount(async () => {
  if (isNew) {
    parentComponent.emit('setTitle', `Create entry point`)
  } else {
    parentComponent.emit('setTitle', `Edit entry point`)
  }
  await segmentStore.fetchSegments()
  await listStore.fetchLists()
  segmentOptions.value = segmentStore.segments.map((s) => {
    return { label: s.name, value: s._id }
  })
  listOptions.value = listStore.lists.map((l) => {
    return { label: l.name, value: l._id }
  })
  if (!isNew) {
    selectedSegments.value = segmentOptions.value.filter((option) =>
      node.value.segment_ids.includes(option.value)
    )
    selectedLists.value = listOptions.value.filter((option) =>
      node.value.list_ids.includes(option.value)
    )
  }
  loaded.value = true
})
</script>
