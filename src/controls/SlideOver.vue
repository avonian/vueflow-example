<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel
                class="pointer-events-auto w-screen max-w-md"
                @setTitle="title = $event"
                @hide="$emit('hide')"
                @created="$emit('created', $event)"
                @save="$emit('save', $event)"
              >
                <div class="flex h-full flex-col overflow-y-scroll bg-white pb-6 shadow-xl">
                  <div class="p-4 bg-gray-100 border-b">
                    <div class="flex items-center justify-between">
                      <DialogTitle class="text-base font-semibold leading-6 text-gray-900">{{
                        title
                      }}</DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button type="button" class="relative rounded-md" @click="$emit('hide')">
                          <span class="absolute -inset-2.5" data-testid="btn-closing-cross" />
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 flex px-4 sm:px-6">
                    <slot @setTitle="$emit('setTitle', $event)" />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
const { show } = defineProps(['show'])
const title = ref('')
</script>
