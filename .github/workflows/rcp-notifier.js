const {
  slackNotification,
  getLocalConfigs,
  RCPDates,
} = require('./helpers.js');

const isWithin24Hours = (targetDate) =>
  Math.abs(new Date() - targetDate) <= 24 * 60 * 60 * 1000;

const calculateDateOffset = (date, offset) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - offset);
  return newDate;
};

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/rcp-notifier.js
const main = async () => {
  console.log('Action: RCP Notifier started');
  for (const rcp of RCPDates) {
    const start = new Date(rcp.start);
    const end = new Date(rcp.end);
    const tenDaysBefore = calculateDateOffset(start, 10);
    const fourDaysBefore = calculateDateOffset(start, 4);
    const stageOffset = Number(process.env.STAGE_RCP_OFFSET_DAYS) || 2;
    const slackText = (days) =>
      `Reminder RCP starts in ${days} days: from ${start.toUTCString()} to ${end.toUTCString()}. Merges to stage will be disabled beginning ${calculateDateOffset(start, stageOffset).toUTCString()}.`;
    if (isWithin24Hours(tenDaysBefore)) {
      console.log('Is within 24 hours of 10 days before RCP');
      await slackNotification(slackText(10), process.env.MILO_DEV_HOOK);
    }

    if (isWithin24Hours(fourDaysBefore)) {
      console.log('Is within 24 hours of 4 days before RCP');
      await slackNotification(slackText(4), process.env.MILO_DEV_HOOK);
    }
  }

  console.log('Action: RCP Notifier completed');
};

if (process.env.LOCAL_RUN) {
  const { context } = getLocalConfigs();
  main({ context });
}

module.exports = main;
