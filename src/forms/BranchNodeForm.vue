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
            { label: 'Opened any email', value: 'opened_any_email' },
            { label: 'Opened specific email', value: 'opened_specific_email' },
            { label: 'Clicked on any link', value: 'clicked_any_link' },
            { label: 'Clicked on a specific link', value: 'clicked_specific_link' }
          ]"
          data-test="aut-form-condition-input"
        />
        <label class="block text-sm font-medium leading-6 text-gray-900">Within</label>
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
            v-model.number="node.timer_unit"
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
import TextInput from '@/controls/TextInput.vue'
import ComboBox from '@/controls/ComboBox.vue'

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

const loaded = ref(false)
const errors = ref({})
const busy = ref(false)

const currentInstance = getCurrentInstance()
const parentComponent = currentInstance.parent

const save = async () => {
  const payload = { ...node.value }
  parentComponent.emit('save', payload)
  parentComponent.emit('hide')
}

onBeforeMount(async () => {
  if (isNew) {
    parentComponent.emit('setTitle', `Create branch node`)
  } else {
    parentComponent.emit('setTitle', `Edit branch node`)
  }
  loaded.value = true
})
</script>
