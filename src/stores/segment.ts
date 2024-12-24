import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSegmentStore = defineStore('segmentStore', () => {
  const busy = ref(false)
  const segments = ref([
    {
      "_id": "000000000000000005f5e100",
      "tenant_id": "000000000000000000000001",
      "name": "Segment A",
      "rules": [
        [
          {
            "value": "email",
            "operand": "not_empty",
            "expression": "",
            "selections": []
          }
        ]
      ],
      "count": 100,
      "created_at": "2024-11-19T15:52:04.426Z",
      "updated_at": "2024-11-19T15:52:04.449Z",
      "__v": 0
    },
    {
      "_id": "000000000000000005f5e101",
      "tenant_id": "000000000000000000000001",
      "name": "Segment B",
      "rules": [
        [
          {
            "value": "wallet_address",
            "operand": "not_empty",
            "expression": "",
            "selections": []
          }
        ]
      ],
      "count": 50,
      "created_at": "2024-11-19T15:52:04.467Z",
      "updated_at": "2024-11-19T15:52:04.480Z",
      "__v": 0
    },
    {
      "_id": "673cb46603746c6f44e10be5",
      "tenant_id": "000000000000000000000001",
      "name": "Segment C",
      "rules": [
        [
          {
            "value": "first_name",
            "expression": "John",
            "selections": [],
            "smartContractId": null,
            "operand": "equal_to"
          }
        ],
        [
          {
            "value": "member_of",
            "expression": "",
            "selections": [
              "000000000000000005f5e100"
            ],
            "smartContractId": null,
            "operand": null
          }
        ]
      ],
      "count": 0,
      "created_at": "2024-11-19T15:53:10.376Z",
      "updated_at": "2024-11-20T09:25:51.350Z",
      "__v": 0
    }
  ])

  const fetchSegments = async () => {
    busy.value = true
    busy.value = false
  }

  return {
    fetchSegments,
    segments,
  }
})
