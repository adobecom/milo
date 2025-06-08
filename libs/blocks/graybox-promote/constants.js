export const ADMIN = 'https://admin.hlx.page';

export const KEYS = {
  PROJECT_INFO: {
    EXPERIENCE_NAME: 'experienceName',
    GRAYBOX_IO_ENV: 'grayboxIoEnv',
  },
  CONFIG: {
    PROMOTE_DRAFTS_ONLY: 'sharepoint.site.promoteDraftsOnly',
    ENABLE_PROMOTE: 'sharepoint.site.enablePromote',
    PROMOTE_URL: {
      DEV: 'dev.graybox.promote.url',
      STAGE: 'stage.graybox.promote.url',
      PROD: 'prod.graybox.promote.url',
    },
    BASE_URL: {
      DEV: 'dev.graybox.base.url',
      STAGE: 'stage.graybox.base.url',
      PROD: 'prod.graybox.base.url',
    },
    PROMOTE_IGNORE_PATHS: 'PromoteIgnorePaths',
  },
};

export const TELEMETRY = { application: { appName: 'Adobe Graybox Promote' } };

export const CONFIG = {
  login: { redirectUri: '/tools/graybox-promote/spauth' },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const STATUS_COLORS = {
  initiated: '#808080',
  initial_preview_in_progress: '#FFA500',
  initial_preview_done: '#4CAF50',
  process_content_in_progress: '#FFA500',
  processed: '#4CAF50',
  promoted: '#4CAF50',
  final_preview_in_progress: '#FFA500',
  final_preview_done: '#4CAF50',
  paused: '#FF0000',
};

export const ALL_STATUSES = [
  'initiated',
  'initial_preview_in_progress',
  'initial_preview_done',
  'process_content_in_progress',
  'processed',
  'promoted',
  'final_preview_in_progress',
  'final_preview_done',
];
