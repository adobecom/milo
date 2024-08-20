export const mockPayload = {
  batchFiles: ["File 1", "File 2", "File 3"],
  batchResults: {
    failedPromotes: ["Page1", "Page2", "Page3"],
    failedPreviews: ["Page4", "Page5"],
    failedPublishes: ["Page6", "Page7", "Page8"],
  },
  promoteResults: {
    failedPromotes: ["Page1", "Page2", "Page3"],
    failedPreviews: ["Page4", "Page5"],
    failedPublishes: ["Page6", "Page7", "Page8"],
  },
  promoteStatus: {
    batchesInfo: [
      {
        batchNumber: 1,
        startTime: '2024-01-22T12:00:00Z',
        endTime: '2024-01-22T14:00:00Z',
        status: 'COMPLETED WITH ERROR',
      },
      {
        batchNumber: 2,
        startTime: '2024-01-22T14:30:00Z',
        endTime: '2024-01-22T16:30:00Z',
        status: 'COMPLETED',
      },
    ],
  },
  resourcePath: 'trial',
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: new Headers(),
  configs: {
    data: [
      { key: 'prod.sharepoint.driveId', value: 'some_drive_id' },
    ],
  },
  floodgate: {
    data: [
      { key: 'production.service.type.url', value: 'some_value' },
      { key: 'sharepoint.site.shareUrl', value: 'some_value' },
      { key: 'sharepoint.site.fgShareUrl', value: 'some_value' },
      { key: 'sharepoint.site.fgRootFolder', value: 'some_value' },
      { key: 'stage.milofg.promotestatus', value: 'some_value' },
      { key: 'stage.milofg.status.url', value: 'some_value' },
      { key: 'stage.milofg.delete.url', value: 'some_value' },
      { key: 'stage.milofg.copy.url', value: 'some_value' },
      { key: 'stage.milofg.promote.url', value: 'some_value' },
      { key: 'stage.milofg.copy.url', value: 'some_value' },
    ],
  },
  promoteignorepaths: {
    data: [
      { color: 'red', paths: 'path1, path2, path3' },
    ],
  },
  payload: {
    action: {
      status: 'IN PROGRESS',
    },
  },
  copyStatus: {
    payload: {
      action: {
        status: 'IN PROGRESS',
        startTime: Date.now(),
        message: 'Copying in progress...',
      },
    },
  },
  promoteStatus: {
    payload: {
      action: {
        status: 'NOT STARTED',
        startTime: null,
        message: 'Promotion has not started yet.',
      },
    },
  },
  deleteStatus: {
    payload: {
      action: {
        status: 'COMPLETED',
        startTime: Date.now() - 60000,
        message: 'Deletion completed successfully.',
      },
    },
  },
};

export const mockPayloadPromote = {
  batchFiles: ["File 1", "File 2", "File 3"],
  batchResults: {
    failedPromotes: ["Page1", "Page2", "Page3"],
    failedPreviews: ["Page4", "Page5"],
    failedPublishes: ["Page6", "Page7", "Page8"],
  },
  promoteResults: {
    failedPromotes: ["Page1", "Page2", "Page3"],
    failedPreviews: ["Page4", "Page5"],
    failedPublishes: ["Page6", "Page7", "Page8"],
  },
  promoteStatus: {
    batchesInfo:  [
      {
        batchNumber: 1,
        startTime: '2024-01-22T12:00:00Z',
        endTime: '2024-01-22T14:00:00Z',
        status: 'COMPLETED WITH ERROR',
      },
      {
        batchNumber: 2,
        startTime: '2024-01-22T14:30:00Z',
        endTime: '2024-01-22T16:30:00Z',
        status: 'COMPLETED',
      },
    ]
  },
  resourcePath: 'trial',
  ok: true,         
  status: 200,       
  statusText: 'OK', 
  headers: new Headers(), 
  configs: {
    data: [
      { key: 'prod.sharepoint.driveId', value: 'some_drive_id' },
    ],
  },
  floodgate: {
    data: [
      { key: 'production.service.type.url', value: 'some_value' },
      { key: 'sharepoint.site.shareUrl', value: 'some_value' },
      { key: 'sharepoint.site.fgShareUrl', value: 'some_value' },
      { key: 'sharepoint.site.fgRootFolder', value: 'some_value' },
      { key: 'stage.milofg.promotestatus', value: 'some_value' },
    ],
  },
  promoteignorepaths: {
    data: [
      { color: 'red', paths: 'path1, path2, path3' },
    ],
  },
};

export const mockPayloadDelete = {
  batchFiles: ["File 1", "File 2", "File 3"],
  batchResults: {
    failedPromotes: ["Page1", "Page2", "Page3"],
    failedPreviews: ["Page4", "Page5"],
    failedPublishes: ["Page6", "Page7", "Page8"],
  },
  promoteResults: {
    failedPromotes: ["Page1", "Page2", "Page3"],
    failedPreviews: ["Page4", "Page5"],
    failedPublishes: ["Page6", "Page7", "Page8"],
  },
  promoteStatus: {
    batchesInfo:  [
      {
        batchNumber: 1,
        startTime: '2024-01-22T12:00:00Z',
        endTime: '2024-01-22T14:00:00Z',
        status: 'COMPLETED WITH ERROR',
      },
      {
        batchNumber: 2,
        startTime: '2024-01-22T14:30:00Z',
        endTime: '2024-01-22T16:30:00Z',
        status: 'COMPLETED',
      },
    ]
  },
  resourcePath: 'trial',
  ok: true,         
  status: 200,       
  statusText: 'OK',  
  headers: new Headers(),  
  configs: {
    data: [
      { key: 'prod.sharepoint.driveId', value: 'some_drive_id' },
    ],
  },
  floodgate: {
    data: [
      { key: 'production.service.type.url', value: 'some_value' },
      { key: 'sharepoint.site.shareUrl', value: 'some_value' },
      { key: 'sharepoint.site.fgShareUrl', value: 'some_value' },
      { key: 'sharepoint.site.fgRootFolder', value: 'some_value' },
      { key: 'stage.milofg.promotestatus', value: 'some_value' },
      { key: 'stage.milofg.status.url', value: 'some_value' },
    ],
  },
  promoteignorepaths: {
    data: [
      { color: 'red', paths: 'path1, path2, path3' },
    ],
  },
  payload: {
    action: {
      status: 'IN PROGRESS'
    }
  },
  copyStatus: {
    payload: {
      action: {
        status: 'IN PROGRESS',
        startTime: Date.now(),
        message: 'Copy in progress',
      },
    },
  },
  promoteStatus: {
    payload: {
      action: {
        status: 'NOT STARTED',
        startTime: null,
        message: 'Promotion has not started yet.',
      },
    },
  },
  deleteStatus: {
    payload: {
      action: {
        status: 'COMPLETED',
        startTime: Date.now() - 60000, 
        message: 'Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.',
      },
    },
  },
};


