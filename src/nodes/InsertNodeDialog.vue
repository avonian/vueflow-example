<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @click="$emit('hide')">
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6"
            >
              <div class="mt-3 mb-2 text-center sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-base leading-6 text-gray-900 pl-2">
                  <div class="text-center font-semibold text-lg px-10">
                    Insert a node
                    <XMarkIcon
                      class="h-6 w-6 cursor-pointer absolute right-5 top-5"
                      @click="$emit('hide')"
                    />
                  </div>
                </DialogTitle>
                <div class="mt-2 flex flex-col gap-y-4">
                  <ButtonSecondary class="w-full" v-for="action of actions" @click="callback(action.type)" :key="action">
                    <div class="flex items-center gap-x-2 w-full">
                      <Icon class-list="w-6 h-6" :name="action.icon" />
                      <div class="grow flex items-start">{{ action.label }}</div>
                    </div>
                  </ButtonSecondary>
                </div>
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
import { XMarkIcon } from '@heroicons/vue/20/solid'
import ButtonSecondary from '@/controls/ButtonSecondary.vue'
import Icon from '@/controls/Icon.vue'
import { watch } from 'vue'

const { show, actions } = defineProps(['show', 'actions', 'callback'])

defineEmits(['hide', 'newNode'])

watch(() => show, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      document.activeElement?.blur()
    }, 0)
  }
})
</script>
