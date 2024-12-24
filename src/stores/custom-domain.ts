import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCustomDomainStore = defineStore('customDomainStore', () => {
  const busy = ref(false)
  const customDomains = ref([
    {
      "_id": "000000000000000005f5e100",
      "tenant_id": "000000000000000000000001",
      "url": "kindhearted-assignment.net",
      "verification_status": "verified",
      "created_at": "2024-11-19T15:50:35.121Z",
      "updated_at": "2024-11-19T15:50:35.121Z",
      "__v": 0
    },
    {
      "_id": "000000000000000005f5e101",
      "tenant_id": "000000000000000000000001",
      "url": "rowdy-calculus.com",
      "verification_status": "pending",
      "created_at": "2024-11-19T15:50:38.042Z",
      "updated_at": "2024-11-19T15:50:38.042Z",
      "__v": 0
    }
  ])

  const fetchCustomDomains = async () => {
    busy.value = true
    busy.value = false
  }

  return {
    fetchCustomDomains,
    customDomains,
  }
})
