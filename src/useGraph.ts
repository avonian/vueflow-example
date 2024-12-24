import { ref } from 'vue'
import { initialEdges, initialNodes } from './initial-elements.js'

export function useGraph(flow) {
  const nodes = ref(initialNodes)
  const edges = ref(initialEdges)

  const generateNodeId = () => {
    // Find the highest numeric ID and increment by 1
    const maxId = Math.max(...nodes.value.map(node => parseInt(node.id)))
    return (maxId + 1).toString()
  }

  const generateEdgeId = (sourceId, targetId, sourceHandle) => {
    if(sourceHandle) {
      return `e${sourceId}-${targetId}-${sourceHandle}`
    }
    return `e${sourceId}-${targetId}`
  }

  const addNewEntryNode = () => {
    const newNode = {
      id: generateNodeId(),
      type: 'entry',
      position: { x: 0, y: 0 },
      data: {
        placeholder: true
      }
    }
    flow.addNodes([newNode])
  }

  const getNodeConnections = (nodeId) => {
    return {
      incoming: edges.value.filter(edge => edge.target === nodeId),
      outgoing: edges.value.filter(edge => edge.source === nodeId)
    }
  }

  const reconnectEdges = (nodeConnections) => {
    // For each incoming edge, connect it to the outgoing node
    nodeConnections.incoming.forEach(incomingEdge => {
      nodeConnections.outgoing.forEach(outgoingEdge => {
        const newEdge = {
          id: generateEdgeId(incomingEdge.source, outgoingEdge.target, incomingEdge.sourceHandle),
          source: incomingEdge.source,
          target: outgoingEdge.target,
          animated: incomingEdge.animated,
          type: 'button',
          selectable: false
        }
        // If this is a branch node, preserve the sourceHandle
        if (incomingEdge.sourceHandle) {
          newEdge.sourceHandle = incomingEdge.sourceHandle
        }
        flow.addEdges([newEdge])
      })
    })
  }

  const deleteNode = async (nodeId) => {
    // Get all connections before removing the node
    const connections = getNodeConnections(nodeId)

    // Special cases handling
    const node = flow.findNode(nodeId)
    if (node) {
      if (node.type === 'entry') {
        await flow.removeNodes(nodeId)
      } else {
        const defaultTarget = connections.outgoing.find(edge => !edge.sourceHandle)?.target
        if (defaultTarget && connections.incoming.length > 0) {
          const newEdge = {
            id: generateEdgeId(connections.incoming[0].source, defaultTarget, connections.incoming[0].sourceHandle),
            source: connections.incoming[0].source,
            target: defaultTarget,
            animated: false,
            type: 'button',
            sourceHandle: connections.incoming[0].sourceHandle,
            selectable: false
          }
          await flow.removeNodes(nodeId)
          flow.addEdges([newEdge])
        }
        reconnectEdges(connections)
      }
    }

    // Update the reactive references
    edges.value = flow.getEdges.value
    nodes.value = flow.getNodes.value
  }

  const deletePath = async (startingEdge) => {
    // Keep track of nodes to delete
    const nodesToDelete = new Set()
    const edgesToDelete = new Set([startingEdge.id])

    // Start from the target of the initial edge
    let currentNodeId = startingEdge.target

    while (currentNodeId) {
      const currentNode = flow.findNode(currentNodeId)

      // Stop if we reach a branch node or exit node
      if (!currentNode || currentNode.type === 'branch' || currentNode.type === 'exit') {
        break
      }

      // Add current node to deletion set
      nodesToDelete.add(currentNodeId)

      // Get connections for current node
      const connections = getNodeConnections(currentNodeId)

      // Add outgoing edges to deletion set
      connections.outgoing.forEach(edge => {
        edgesToDelete.add(edge.id)
      })

      // If there are no outgoing connections, we're done
      if (connections.outgoing.length === 0) {
        break
      }

      // Move to the next node
      // We can safely take the first outgoing edge since non-branch nodes
      // should only have one outgoing connection
      currentNodeId = connections.outgoing[0].target
    }

    // Remove edges first to avoid orphaned edges
    for (const edgeId of edgesToDelete) {
      await flow.removeEdges(edgeId)
    }

    // Remove nodes
    for (const nodeId of nodesToDelete) {
      await flow.removeNodes(nodeId)
    }

    // Update reactive references
    edges.value = flow.getEdges.value
    nodes.value = flow.getNodes.value
  }

  const deleteBranchNode = async (nodeId, selectedPath) => {
    const connections = getNodeConnections(nodeId)
    const pathToKeep = connections.outgoing.find(edge => edge.sourceHandle === `source-${selectedPath}`)
    const pathToDelete = connections.outgoing.find(edge => edge.sourceHandle === `source-${!selectedPath}`)

    // Delete the unwanted path first
    await deletePath(pathToDelete)

    // For each incoming connection, create a new edge to the kept path
    const newEdges = connections.incoming.map(incomingEdge => ({
      id: generateEdgeId(incomingEdge.source, pathToKeep.target, incomingEdge.sourceHandle),
      source: incomingEdge.source,
      target: pathToKeep.target,
      animated: incomingEdge.animated,
      type: 'button',
      sourceHandle: incomingEdge.sourceHandle,
      selectable: false
    }))

    // Remove the branch node
    await flow.removeNodes(nodeId)

    // Add all the new edges
    flow.addEdges(newEdges)

    // Update reactive references
    edges.value = flow.getEdges.value
    nodes.value = flow.getNodes.value
  }

  const saveNode = async (data, type) => {
    if (!data.id) {
      const id = generateNodeId()
      const node = {
        id,
        type,
        data,
        position: { x: 0, y: 0 }
      }
      const insertEdge = edges.value.find(edge => edge.id === data.insertEdge)
      flow.addNodes([node])

      const newEdges = [];
      const sourceToNewEdge = {
        id: generateEdgeId(insertEdge.source, id, insertEdge.sourceHandle),
        source: insertEdge.source,
        target: id,
        animated: insertEdge.animated,
        type: 'button',
        sourceHandle: insertEdge.sourceHandle, // Preserve sourceHandle for branch nodes
        selectable: false
      }
      newEdges.push(sourceToNewEdge)

      if(type === 'branch') {
        newEdges.push({
          id: generateEdgeId(id, insertEdge.target, 'source-true'),
          source: id,
          target: insertEdge.target,
          animated: false,
          type: 'button',
          sourceHandle: 'source-true',
          selectable: false
        })
        const exitNode = nodes.value.find(node => node.type === 'exit')
        newEdges.push({
          id: generateEdgeId(id, exitNode.id, 'source-false'),
          source: id,
          target: exitNode.id,
          animated: false,
          type: 'button',
          sourceHandle: 'source-false',
          selectable: false
        })
      } else {
        newEdges.push({
          id: generateEdgeId(id, insertEdge.target),
          source: id,
          target: insertEdge.target,
          animated: false,
          type: 'button',
          selectable: false
        })
      }

      // Remove the original edge
      await flow.removeEdges(insertEdge.id)
      flow.addEdges(newEdges)
    } else {
      const node = flow.findNode(data.id)
      const savingNewEntryNode = node.type === 'entry' && node.data.placeholder
      const oldId = data.id
      delete data.id
      node.data = data

      if (savingNewEntryNode) {
        addNewEntryNode()
        const actionNodes = nodes.value.filter((node) => node.type === 'action')
        let firstActionNode = actionNodes[0]
        if (!firstActionNode) {
          firstActionNode = createActionNodePlaceholders()
        }
        const edge = {
          id: generateEdgeId(oldId, firstActionNode.id),
          source: oldId,
          target: firstActionNode.id,
          animated: true,
          type: 'button',
          selectable: false
        }
        flow.addEdges([edge])
      }
    }

    edges.value = flow.getEdges.value
    nodes.value = flow.getNodes.value
  }

  const resetGraph = async () => {
    // Clear existing nodes and edges
    const nodeIds = nodes.value.map(node => node.id)
    await flow.removeNodes(nodeIds)

    // Reset to initial state
    nodes.value = initialNodes
    edges.value = initialEdges
    flow.addNodes(initialNodes)
    flow.addEdges(initialEdges)
  }

  const showInjectButton = (connectionId) => {
    const edge = edges.value.find(edge => edge.id === connectionId)
    const sourceNode = nodes.value.find(node => node.id === edge.source)
    return sourceNode.type !== 'start' && sourceNode.type !== 'entry'
  }

  return {
    nodes,
    edges,
    saveNode,
    deleteNode,
    deleteBranchNode,
    resetGraph,
    // Expose these for testing/debugging
    getNodeConnections,
    generateNodeId,
    generateEdgeId,
    showInjectButton
  }
}