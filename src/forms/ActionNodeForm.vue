<template>
  <form @submit.prevent="save" class="flex-1 flex flex-col justify-between">
    <div class="space-y-12" v-if="loaded">
      <div class="flex flex-col gap-y-3">
        <ComboBox
          label="Action"
          fullWidth
          direction="vertical"
          v-model="node.action"
          :errors="errors?.action"
          :options="[
            { label: 'Send an e-mail', value: 'send_email' },
          ]"
          data-test="aut-form-condition-input"
        />
        <div v-show="node.action === 'send_email'" class="flex flex-col gap-y-3">
          <ComboBox
            label="Template"
            fullWidth
            direction="vertical"
            v-model="node.template_id"
            :errors="
              templateStore.templates.length === 0
                ? ['No templates found in system.']
                : errors?.template_id
            "
            :options="templateOptions"
            data-test="aut-form-template-input"
          />
          <TextInput
            direction="vertical"
            label="Subject"
            v-model="node.subject"
            :errors="errors?.subject"
            data-test="aut-form-subject-input"
          />
          <TextInput
            label="Sender name"
            direction="vertical"
            v-model="node.sender_name"
            :errors="errors?.sender_name"
            data-test="aut-form-sender-name-input"
          />
          <div class="flex flex-col gap-y-1">
            <label class="block text-sm font-medium leading-6 text-gray-900">Sender email</label>
            <div class="flex gap-x-1 items-center">
              <TextInput
                v-model="node.sender_alias"
                :errors="!!errors?.sender_alias"
                data-test="aut-form-sender-email-input"
              />
              <div class="font-medium">@</div>
              <ComboBox
                fullWidth
                v-model="node.sender_domain_id"
                :errors="!!errors?.sender_domain_id"
                :options="domainOptions"
                data-test="aut-form-domain-input"
              />
            </div>
            <span
              class="text-sm text-red-500 mt-1"
              v-if="errors.sender_alias || errors.sender_domain_id"
            >Please specify a sender email.</span
            >
          </div>
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
import { onBeforeMount, ref, getCurrentInstance, watch } from 'vue'
import ButtonPrimary from '@/controls/ButtonPrimary.vue'
import ButtonSecondary from '@/controls/ButtonSecondary.vue'
import TextInput from '@/controls/TextInput.vue'
import ComboBox from '@/controls/ComboBox.vue'
import { useTemplateStore } from '@/stores/template'
import { useCustomDomainStore } from '@/stores/custom-domain'
const customDomainStore = useCustomDomainStore()
const templateStore = useTemplateStore()

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
const domainOptions = ref([])
const templateOptions = ref([])
const errors = ref({})
const busy = ref(false)

const currentInstance = getCurrentInstance()
const parentComponent = currentInstance.parent

const save = async () => {
  const payload = { ...node.value }
  parentComponent.emit('save', payload)
  parentComponent.emit('hide')
}

watch(() => node.value.template_id, () => {
  const template = templateStore.templates.find((t) => t._id === node.value.template_id)
  node.value.subject = template.default_subject
})

watch(() => node.value.action, () => {
  if (node.value.action === 'send_email') {
    if(!node.value.sender_domain_id) {
      node.value.sender_domain_id = '000000000000000000000001';
    }
    if(!node.value.sender_alias) {
      node.value.sender_alias = 'GamerNet';
    }
    if(!node.value.sender_name) {
      node.value.sender_name = 'Announcements';
    }
  }
})

onBeforeMount(async () => {
  if (isNew) {
    parentComponent.emit('setTitle', `Create action node`)
  } else {
    parentComponent.emit('setTitle', `Edit action node`)
  }
  await customDomainStore.fetchCustomDomains()
  domainOptions.value = customDomainStore.customDomains
    .filter((d) => {
      return d.verification_status === 'verified'
    })
    .map((d) => {
      return {
        label: d.url.replace('https://', '').replace('http://', '').replace('www.', ''),
        value: d._id
      }
    })
  await templateStore.fetchTemplates()
  templateOptions.value = templateStore.templates
    .map((t) => {
      return {
        label: t.name,
        value: t._id
      }
    })
    .filter((t) => !t.shared)
  loaded.value = true
})
</script>
