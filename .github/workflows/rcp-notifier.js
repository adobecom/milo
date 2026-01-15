const {
  slackNotification,
  getLocalConfigs,
  RCPDates,
  isShortRCP,
  getDaysUntilRCP,
  isWeekendOrMondayRCP,
} = require('./helpers.js');

const isWithin24Hours = (targetDate) => {
  const now = new Date();
  return now < targetDate && new Date(now.getTime() + 24 * 60 * 60 * 1000) > targetDate;
};

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
    const isShort = isShortRCP(start, end);
    const firstNoticeOffset = calculateDateOffset(start, 13);
    const lastNoticeOffset = calculateDateOffset(start, 6);
    const stageOffset = Number(process.env.STAGE_RCP_OFFSET_DAYS) || 2;
    const slackText = (days) =>
      `Reminder RCP starts in ${days} days: from ${start.toUTCString()} to ${end.toUTCString()}. Merges to stage will be disabled beginning ${calculateDateOffset(start, stageOffset).toUTCString()}.`;
    const stageFreezeText = (days) =>
      `RCP starts in ${days} days: from ${start.toUTCString()} to ${end.toUTCString()}. Merges to stage are now disabled until the end of the RCP to keep the stage branch clean for emergencies.`;
    
    if (isWithin24Hours(firstNoticeOffset) && !isShort) {
      console.log('Is within 24 hours of 13 days before RCP');
      await slackNotification(slackText(13), process.env.MILO_DEV_HOOK);
    }

    if (isWithin24Hours(lastNoticeOffset) && !isShort) {
      console.log('Is within 24 hours of 6 days before RCP');
      await slackNotification(slackText(6), process.env.MILO_DEV_HOOK);
    }

    const daysUntil = getDaysUntilRCP(start);
    if (daysUntil <= 4 && daysUntil > 0 && !isShort && isWeekendOrMondayRCP(start)) {
      const today = new Date().getDay();
      if (today === 4) {
        console.log('Stage freeze active (RCP starts on weekend/Monday)');
        await slackNotification(stageFreezeText(daysUntil), process.env.MILO_DEV_HOOK);
      }
    }
  }

  console.log('Action: RCP Notifier completed');
};

if (process.env.LOCAL_RUN) {
  const { context } = getLocalConfigs();
  main({ context });
}

module.exports = main;
