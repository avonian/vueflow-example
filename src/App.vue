<template>
  <ConfirmDialog
    :show="true"
    :title="deleteDialog.title"
    :body="deleteDialog.body"
    :callback="deleteDialog.callback"
    :hide-cancel-button="deleteDialog.hideCancelButton"
    @hide="deleteDialog = false"
    v-if="deleteDialog"
  >
    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
  </ConfirmDialog>
  <DeleteBranchDialog
    :show="true"
    :callback="deleteBranchDialog.callback"
    @hide="deleteBranchDialog = false"
    v-if="deleteBranchDialog"
  >
    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
  </DeleteBranchDialog>
  <InsertNodeDialog @hide="insertNodeDialog = false" :callback="insertNodeDialog.callback" :show="!!insertNodeDialog"/>
  <div class="absolute w-full h-full">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :class="{ dark }"
      class="basic-flow"
      :min-zoom="0.2"
      :max-zoom="1.5"
    >
      <SlideOver :show="!!editNode" @save="saveNode($event, editNode.type)" @hide="editNode = false">
        <EntryNodeForm :model-value="editNode" v-if="editNode?.type === 'entry'" />
        <ActionNodeForm :model-value="editNode" v-if="editNode?.type === 'action'" />
        <BranchNodeForm :model-value="editNode" v-if="editNode?.type === 'branch'" />
        <WaitNodeForm :model-value="editNode" v-if="editNode?.type === 'wait'" />
      </SlideOver>
      <Background pattern-color="#aaa" :gap="16" />
      <template #node-entry="props">
        <EntryNode
          :id="props.id"
          :data="props.data"
          @edit="toggleForm(props)"
          @delete="confirmDeleteNode($event)"
          class="nodrag"
        />
      </template>
      <template #node-start="props">
        <StartNode
          :id="props.id"
          class="nodrag"
          @insertAfterNode="insertAfterNode($event)"
        />
      </template>
      <template #node-action="props">
        <ActionNode
          :id="props.id"
          :data="props.data"
          @edit="toggleForm(props)"
          @delete="confirmDeleteNode($event)"
        />
      </template>
      <template #node-branch="props">
        <BranchNode
          :id="props.id"
          :data="props.data"
          @edit="toggleForm(props)"
          @delete="confirmDeleteBranchNode($event)"
        />
      </template>
      <template #node-wait="props">
        <WaitNode
          :id="props.id"
          :data="props.data"
          @edit="toggleForm(props)"
          @delete="confirmDeleteNode($event)"
        />
      </template>
      <template #node-exit="props">
        <ExitNode :id="props.id" :data="props.data" />
      </template>
      <template #edge-button="buttonEdgeProps">
        <Edge
          :id="buttonEdgeProps.id"
          :source-x="buttonEdgeProps.sourceX"
          :source-y="buttonEdgeProps.sourceY"
          :target-x="buttonEdgeProps.targetX"
          :target-y="buttonEdgeProps.targetY"
          :source-position="buttonEdgeProps.sourcePosition"
          :target-position="buttonEdgeProps.targetPosition"
          :marker-end="buttonEdgeProps.markerEnd"
          :style="buttonEdgeProps.style"
          :show-inject-button="showInjectButton(buttonEdgeProps.id)"
          @insertNode="showInsertNodeDialog($event)"
        />
      </template>
      <Controls position="top-left">
        <ControlButton title="Log `toObject`" @click="logToObject">
          <Icon name="log" />
        </ControlButton>
      </Controls>
    </VueFlow>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import EntryNode from '@/nodes/EntryNode.vue'
import ActionNode from '@/nodes/ActionNode.vue'
import ExitNode from '@/nodes/ExitNode.vue'
import { useLayout } from '@/useLayout.ts'
import { useGraph } from '@/useGraph.ts'
import Edge from '@/nodes/Edge.vue'
import BranchNode from '@/nodes/BranchNode.vue'
import WaitNode from '@/nodes/WaitNode.vue'
import Icon from '@/controls/Icon.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import InsertNodeDialog from '@/nodes/InsertNodeDialog.vue'
import DeleteBranchDialog from '@/controls/DeleteBranchDialog.vue'
import StartNode from '@/nodes/StartNode.vue'
import ConfirmDialog from '@/controls/ConfirmDialog.vue'
import SlideOver from '@/controls/SlideOver.vue'
import EntryNodeForm from '@/forms/EntryNodeForm.vue'
import ActionNodeForm from '@/forms/ActionNodeForm.vue'
import BranchNodeForm from '@/forms/BranchNodeForm.vue'
import WaitNodeForm from '@/forms/WaitNodeForm.vue'

const flow = useVueFlow()
const { onConnect, addEdges, toObject } = flow
const { nodes, edges, saveNode, deleteNode, deleteBranchNode, showInjectButton } = useGraph(flow)

// our dark mode toggle flag
const dark = ref(false)

const editNode = ref(false)
const deleteDialog = ref(false)
const deleteBranchDialog = ref(false)
const insertNodeDialog = ref(false)

const toggleForm = ($event) => {
  editNode.value = $event
}

const insertAfterNode = (nodeId) => {
  const adjacentEdgeId = edges.value.find((e) => e.source === nodeId)?.id
  showInsertNodeDialog(adjacentEdgeId)
}

const showInsertNodeDialog = (connectionId) => {
  insertNodeDialog.value = {
    callback: (type) => {
      if(type.startsWith('action')) {
        const action = type.split('.')[0]
        editNode.value = {
          insertEdge: connectionId,
          type: 'action',
          data: {
            action,
          }
        }
      } else {
        editNode.value = {
          insertEdge: connectionId,
          type,
        }
      }
      insertNodeDialog.value = false
    }
  }
}

const confirmDeleteNode = (nodeId) => {
  const node = nodes.value.find((n) => n.id === nodeId)
  let message = 'Are you sure you want to delete this node?';
  if(!['entry','action'].includes(node.type)) {
    message += '<div class="text-sm mt-2 bg-gray-100 border border-gray-400 px-2 py-1 text-gray-700 rounded-md ">Any contacts in this node will automatically be moved to the next node.</div>'
  }
  deleteDialog.value = {
    title: 'Delete Node',
    body: message,
    callback: () => {
      deleteNode(nodeId)
      deleteDialog.value = false
    },
  }
}

const confirmDeleteBranchNode = (nodeId) => {
  deleteBranchDialog.value = {
    callback: (selectedPath) => {
      deleteBranchNode(nodeId, selectedPath)
      deleteBranchDialog.value = false
    },
  }
}

/**
 * onConnect is called when a new connection is created.
 *
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether by not calling `addEdges`
 */
onConnect((connection) => {
  addEdges(connection)
})

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  console.log(toObject())
}

onMounted(() => {
  useLayout()
})
</script>

<style>
/* custom styles */
@import 'styles.css';

/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';
</style>
