// not sure if I need this, looking at xerror string returned in error result
const getStatusMessage = (status) => {
  switch (status) {
    case 400:
      return 'Invalid Request URL';
    default:
      return '';
  }
};
// test result for building out UI
const testJob = (topic, paths) => (new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      status: 202,
      messageId: '37e92eec-020c-4eae-8f80-3db444c25056',
      job: {
        topic,
        name: 'job-123',
        state: 'created',
        startTime: '2021-05-31T23:00:00Z',
        status: [202, 400][Math.floor(Math.random() * 2)],
        data: { paths },
      },
      link: {
        self: 'https://admin.hlx.page/job/adobe/blog/main/preview/job-123',
        list: 'https://admin.hlx.page/job/adobe/blog/main/preview',
      },
    });
  }, 3000);
}));

const testStatus = (paths) => (new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      topic: 'preview',
      name: 'job-123',
      state: 'Finished',
      startTime: '2021-05-31T23:00:00Z',
      stopTime: '2021-05-31T23:00:00Z',
      progress: {
        total: 10,
        processed: 6,
        failed: 4,
      },
      data: {
        resources: paths.map((path) => ({
          path,
          status: [202, 400][Math.floor(Math.random() * 2)],
        })),
        paths,
      },
      links: {
        self: 'https://admin.hlx.page/job/adobe/blog/main/preview/job-123/details',
        job: 'https://admin.hlx.page/job/adobe/blog/main/preview/job-123',
        list: 'https://admin.hlx.page/job/adobe/blog/main/preview',
      },
    });
  }, 3000);
}));

export { getStatusMessage, testJob, testStatus };
