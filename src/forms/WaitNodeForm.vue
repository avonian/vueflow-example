<template>
  <form @submit.prevent="save" class="flex-1 flex flex-col justify-between">
    <div class="space-y-12" v-if="loaded">
      <div class="flex flex-col gap-y-3">
        <label class="block text-sm font-medium leading-6 text-gray-900">Wait</label>
        <div class="flex gap-x-4">
          <TextInput
            fullWidth
            direction="vertical"
            v-model.number="node.timer_value"
            :errors="errors?.timer_value"
            data-test="aut-form-action-window-number-input"
          />
          <ComboBox
            fullWidth
            direction="vertical"
            v-model="node.timer_unit"
            :errors="errors?.timer_unit"
            :options="[{ label: 'days', value: 'days' }, { label: 'hours', value: 'hours' }]"
            data-test="aut-form-template-input"
          />
        </div>
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
import { onBeforeMount, ref, getCurrentInstance } from 'vue'
import ButtonPrimary from '@/controls/ButtonPrimary.vue'
import ButtonSecondary from '@/controls/ButtonSecondary.vue'
import ComboBox from '@/controls/ComboBox.vue'
import TextInput from '@/controls/TextInput.vue'

const props = defineProps(['modelValue'])

const node = ref({
  id: props.modelValue.id,
  insertEdge: props.modelValue.insertEdge,
})
const isNew = !props.modelValue.id || props.modelValue.data.placeholder

if (isNew) {
  Object.assign(node.value, {})
} else {
  Object.assign(node.value, props.modelValue.data)
}
const selectedSegments = ref([])
const selectedLists = ref([])

const loaded = ref(false)
const errors = ref({})
const busy = ref(false)

const currentInstance = getCurrentInstance()
const parentComponent = currentInstance.parent

const save = async () => {
  const payload = { ...node.value }
  payload.list_ids = selectedLists.value.map((l) => l.value)
  payload.segment_ids = selectedSegments.value.map((s) => s.value)
  parentComponent.emit('save', payload)
  parentComponent.emit('hide')
}

onBeforeMount(async () => {
  if (isNew) {
    parentComponent.emit('setTitle', `Create wait node`)
  } else {
    parentComponent.emit('setTitle', `Edit wait node`)
  }
  loaded.value = true
})
</script>
