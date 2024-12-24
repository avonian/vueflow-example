import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useListStore = defineStore('listStore', () => {
  const busy = ref(false)
  const lists = ref([
    {
      "_id": "673cb3ca1e7d6ac47069e561",
      "tenant_id": "000000000000000000000001",
      "name": "List A",
      "autoimport": false,
      "community_id": "672ceb06b4d2505b71723ca3",
      "count": 0,
      "created_at": "2024-11-19T15:50:34.697Z",
      "updated_at": "2024-11-19T15:50:34.697Z",
      "__v": 0
    },
    {
      "_id": "000000000000000005f5e100",
      "tenant_id": "000000000000000000000001",
      "name": "List B",
      "autoimport": false,
      "count": 83,
      "created_at": "2024-11-19T15:52:04.364Z",
      "updated_at": "2024-11-19T15:52:04.413Z",
      "__v": 0
    },
    {
      "_id": "000000000000000005f5e101",
      "tenant_id": "000000000000000000000001",
      "name": "List C",
      "autoimport": false,
      "count": 50,
      "created_at": "2024-11-19T15:52:04.415Z",
      "updated_at": "2024-11-19T15:52:04.425Z",
      "__v": 0
    }
  ])

  const fetchLists = async () => {
    busy.value = true
    busy.value = false
  }

  return {
    fetchLists,
    lists,
  }
})
