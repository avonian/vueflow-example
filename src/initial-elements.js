const position = { x: 0, y: 0 }

export const initialNodes = [
  {
    id: '1',
    type: 'entry',
    data: {
      condition: 'contact_added_to_list',
      list_ids: ['673cb3ca1e7d6ac47069e561'],
      count: 100
    },
    position
  },
  {
    id: '2',
    type: 'entry',
    data: {
      condition: 'contact_added_to_segment',
      segment_ids: ['000000000000000005f5e100'],
      count: 100
    },
    position
  },
  {
    id: 'add-entry-node',
    type: 'entry',
    data: {
      placeholder: true
    },
    position
  },
  {
    id: '3',
    type: 'start',
    data: {},
    position
  },
  {
    id: '4',
    type: 'action',
    data: {
      action: 'send_email',
      subject: 'Welcome to the community!',
      sender_name: 'GamerNet',
      sender_alias: 'announcements',
      template_id: "000000000000000005f5e100",
      sender_domain_id: "000000000000000005f5e100",
      count: 50
    },
    position
  },
  {
    id: '5',
    type: 'branch',
    data: {
      condition: 'opened_specific_email',
      timer_unit: 'days',
      timer_value: 3,
      count: 50
    },
    position
  },
  {
    id: '6',
    type: 'action',
    data: {
      action: 'send_email',
      subject: 'Discover the benefits of GamerNet!',
      sender_name: 'GamerNet',
      sender_alias: 'announcements',
      template_id: "00000000000000000bebc201",
      sender_domain_id: "000000000000000005f5e100",
      count: 50
    },
    position
  },
  {
    id: '7',
    type: 'wait',
    data: {
      timer_unit: 'days',
      timer_value: 3,
      count: 50
    },
    position
  },
  {
    id: '8',
    type: 'action',
    data: {
      action: 'send_email',
      subject: 'Refer your friends for free GMTs!',
      sender_name: 'GamerNet',
      sender_alias: 'announcements',
      template_id: "00000000000000000bebc201",
      sender_domain_id: "000000000000000005f5e100",
      count: 50
    },
    position
  },
  {
    id: '9',
    type: 'exit',
    data: {
      condition: 'unsubscribed',
      count: 50
    },
    position
  }
]

export const initialEdges = [
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    type: 'button',
    selectable: false
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    type: 'button',
    selectable: false
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: false,
    type: 'button',
    selectable: false
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: false,
    type: 'button',
    selectable: false
  },
  {
    id: 'e5-6-true',
    source: '5',
    target: '6',
    animated: false,
    sourceHandle: 'source-true',
    type: 'button',
    selectable: false
  },
  {
    id: 'e5-9-false',
    source: '5',
    target: '9',
    animated: false,
    sourceHandle: 'source-false',
    type: 'button',
    selectable: false
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    animated: false,
    type: 'button',
    selectable: false
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    animated: false,
    type: 'button',
    selectable: false
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    animated: false,
    type: 'button',
    selectable: false
  }
]
