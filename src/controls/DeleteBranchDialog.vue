<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6"
            >
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <slot />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900"
                    >Delete Branch Node
                  </DialogTitle>
                  <div class="mt-2">Choose which path you to keep:</div>
                  <SelectInput
                    v-model="selectedPath"
                    :options="[{
                      label: 'True Path',
                      value: true,
                    },
                    {
                      label: 'False Path',
                      value: false,
                    }]"
                    class="mt-2"
                    data-test="select-path"
                    :errors="error ? ['You must select a path'] : []"
                  />
                  <div class="text-sm mt-2 bg-gray-100 border border-gray-400 px-2 py-1 text-gray-700 rounded-md ">Any contacts in this node will automatically be moved to the next node.</div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <ButtonDanger @click="confirm" class="sm:ml-3" data-test="btn-confirm"
                  >Confirm</ButtonDanger
                >
                <ButtonSecondary
                  @click="$emit('hide')"
                  data-test="btn-cancel"
                >
                  Cancel
                </ButtonSecondary>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import ButtonDanger from '@/controls/ButtonDanger.vue'
import ButtonSecondary from '@/controls/ButtonSecondary.vue'
const { show, callback } = defineProps(['show', 'callback'])
import { ref } from 'vue'
import SelectInput from '@/controls/SelectInput.vue'
const emit = defineEmits(['hide'])

const error = ref(false)

const selectedPath = ref('')

const confirm = async () => {
  error.value = false;
  if(selectedPath.value === '') {
    error.value = true;
  } else {
    await callback(selectedPath.value)
    emit('hide')
  }
}
</script>
