import dagre from 'dagre'
import { Position, useVueFlow } from '@vue-flow/core'
import { watch } from 'vue'

export function useLayout() {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const { getEdges, getNodes, getNodesInitialized, getViewport, setViewport } = useVueFlow()

  const centerGraphHorizontally = () => {
    const nodes = getNodes.value
    if (!nodes.length) return

    // Calculate the leftmost and rightmost positions
    const xPositions = nodes.map(node => node.position.x)
    const minX = Math.min(...xPositions)
    const maxX = Math.max(...xPositions)

    // Calculate center point of the nodes
    const centerX = (minX + maxX) / 2

    // Get current viewport
    const viewport = getViewport()

    // Get the container width (you might need to adjust how you get this)
    const containerWidth = document.querySelector('.vue-flow').clientWidth

    // Calculate new x position to center the graph
    const newX = -(centerX - containerWidth / 2 / viewport.zoom)

    // Set viewport maintaining the current y position and zoom
    setViewport({
      x: newX,
      y: viewport.y,
      zoom: viewport.zoom
    })
  }

  const createDagreGraph = () => {
    const graph = new dagre.graphlib.Graph()
    graph.setDefaultEdgeLabel(() => ({}))
    graph.setGraph({
      rankdir: 'TB',
      ranksep: 100,
      nodesep: 100, // Add consistent horizontal spacing
      edgesep: 320, // Add consistent edge spacing
      marginx: 0,
      marginy: 0,
    })
    return graph
  }

  const onLayout = () => {
    // Create a new graph instance for each layout
    const dagreGraph = createDagreGraph()

    getNodesInitialized.value.forEach((el) => {
      const nodeConfig = {
        width: el.dimensions.width,
        height: el.dimensions.height
      }

      // Automatically set rank based on node type
      if (el.type === 'entry' || el.type === 'add-entry') {
        nodeConfig.rank = 'source' // All entry nodes at top
      } else if (el.type === 'exit') {
        nodeConfig.rank = 'sink' // All exit nodes at bottom
      }

      dagreGraph.setNode(el.id, nodeConfig)
    })

    getEdges.value.forEach((edge) => {
      if (edge.sourceHandle === 'source-exit') {
        dagreGraph.setEdge(edge.source, edge.target, { weight: 0 })
      } else {
        dagreGraph.setEdge(edge.source, edge.target, { weight: 0 })
      }
    })

    dagre.layout(dagreGraph)

    getNodesInitialized.value.forEach((el) => {
      const nodeWithPosition = dagreGraph.node(el.id)
      const hasPredecessors = dagreGraph.predecessors(el.id)?.length
      el.targetPosition = Position.Top
      el.sourcePosition = Position.Bottom
      el.position = { x: nodeWithPosition.x, y: nodeWithPosition.y }
      if(el.type === 'start') {
        el.position.y += 75;
      }
      el.data = { ...el.data, hasPredecessors }
      el.style = {
        opacity: 1
      }
    })
    setTimeout(() => {
      centerGraphHorizontally()
    })
  }

  watch(
    [
      getNodesInitialized,
      getEdges,
      () => getNodesInitialized.value.length,
      () => getEdges.value.length
    ],
    () => {
      onLayout()
    }
  )
}
