export const userSelection = [
  {
    selectedQuestion: {
      questions: 'q-category',
      'max-selections': '3',
      'min-selections': '1',
    },
    selectedCards: {
      photo: true,
      video: true,
    },
  },
  {
    selectedQuestion: {
      questions: 'q-rather',
      'max-selections': '1',
      'min-selections': '1',
    },
    selectedCards: { custom: true },
  },
  {
    selectedQuestion: {
      questions: 'q-photo',
      'max-selections': '1',
      'min-selections': '1',
    },
    selectedCards: { organize: true },
  },
  {
    selectedQuestion: {
      questions: 'q-video',
      'max-selections': '1',
      'min-selections': '1',
    },
    selectedCards: { social: true },
  },
  {
    selectedQuestion: {
      questions: 'q-customer',
      'max-selections': '1',
      'min-selections': '1',
    },
    selectedCards: { individual: true },
  },
];

export const answers = [
  ['q-category', ['photo', 'video']],
  ['q-rather', ['custom']],
  ['q-photo', ['organize']],
  ['q-video', ['social']],
  ['q-customer', ['individual']],
];

export const resultRules = [
  {
    result: '(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)&(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
    'umbrella-result': 'cc',
    url: '/path/to/result',
    'basic-fragments': 'marquee, card-list',
    'nested-fragments-primary': '',
    'nested-fragments-secondary': 'marquee-product, commerce-card',
  },
  {
    result: '(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
    'umbrella-result': '',
    url: '/path/to/result',
    'basic-fragments': 'marquee, card-list',
    'nested-fragments-primary': 'check-bullet,marquee-plan',
    'nested-fragments-secondary': 'commerce-card',
  },
  {
    result: '(3d,ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)&(3d,ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
    'umbrella-result': '3d-umbrella',
    url: '/path/to/result',
    'basic-fragments': 'marquee, card-list',
    'nested-fragments-primary': '',
    'nested-fragments-secondary': '',
  },
  {
    result: 'default',
    'umbrella-result': '',
    url: '/path/to/result',
    'basic-fragments': 'marquee, card-list',
    'nested-fragments-primary': '',
    'nested-fragments-secondary': 'commerce-card',
  },
  {
    result: 'express',
    'umbrella-result': '',
    url: '/path/to/result',
    'basic-fragments': 'marquee, card-list',
    'nested-fragments-primary': '',
    'nested-fragments-secondary': 'commerce-card',
  },
];

export const resultData = {
  primary: [
    'lr-ind',
    'pr-ind',
  ],
  secondary: [
    'ps-ind',
    'au-ind',
  ],
  matchedResults: [
    {
      result: '(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)&(ai,ai-edu,ai-bus,ai-ind,au-edu,au-bus,au-ind,an-edu,an-bus,an-ind,ae-edu,ae-bus,ae-ind,lr-edu,lr-bus,lr-ind,id,pr-edu,pr-bus,pr-ind,ps-bus,ps-edu,ps-ind,ac,pdf)',
      'umbrella-result': 'cc',
      url: '/path/to/result',
      'basic-fragments': 'marquee, card-list',
      'nested-fragments': 'marquee-product, commerce-card',
    },
  ],
};

export const storedData = {
  userFlow: [
    'q-rather',
    'q-photo',
    'q-video',
    'q-design',
  ],
  userSelection: [
    {
      selectedQuestion: {
        questions: 'q-category',
        'max-selections': '3',
        'min-selections': '1',
      },
      selectedCards: {
        photo: true,
        video: true,
        design: true,
      },
    },
  ],
};
