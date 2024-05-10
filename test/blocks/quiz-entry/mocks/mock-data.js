const resultsMock = {
  strings: {
    'q-video': {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        {
          options: 'social',
          title: '',
          text: 'Create, edit, and share on social',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-video/1-PR-CreateEditShare.png',
        },
        {
          options: 'pro',
          title: '',
          text: 'Make pro-level edits for high-quality results',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-video/2-PR-ProLevelEdits.png',
        },
        {
          options: 'movement',
          title: '',
          text: 'Create graphics and transitions that move',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-video/3-AE-TitlesAndTransitions.png',
        },
        {
          options: 'animate',
          title: '',
          text: 'Make animations for cartoons or games',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-video/4-AN-Animations.png',
        },
        {
          options: 'sound',
          title: '',
          text: 'Edit, mix, and add sound effects',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-video/5-AU-SoundEffects.png',
        },
      ],
    },
    'q-3d': {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        {
          options: 'stage',
          title: '',
          text: 'Assemble, stage, and render 3D scenes',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q3/3-Stager@1x.png',
        },
        {
          options: 'texture',
          title: '',
          text: 'Texture 3D assets in real time',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q3/2-Painter@1x.png',
        },
        {
          options: 'materials',
          title: '',
          text: 'Create 3D materials from real-life images',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q3/5-Sampler@1x.png',
        },
        {
          options: 'model',
          title: '',
          text: 'Create 3D models with digital clay',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q3/1-Modeler@1x.png',
        },
        {
          options: 'assets',
          title: '',
          text: 'Design 3D assets and materials',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q3/4-Designer@1x.png',
        }
      ],
    },
    'q-category': {
      total: 7,
      offset: 0,
      limit: 7,
      data: [
        {
          options: 'fi_code',
          title: 'Describe your interest here',
          text: 'Ask our AI assistant',
          icon: 'https://milo.adobe.com/drafts/quiz/quiz-ai/search.svg',
          image: '',
        },
        {
          options: 'photo',
          title: 'Photography',
          text: 'Edit or organize my photos',
          icon: '',
          image: 'https://main--milo--adobecom.hlx.page/drafts/colloyd/quiz-entry/images/photography.png',
        },
        {
          options: 'video',
          title: 'Video',
          text: 'Create and edit video or audio',
          icon: '',
          image: 'https://main--milo--adobecom.hlx.page/drafts/colloyd/quiz-entry/images/video.png',
        },
        {
          options: 'design',
          title: 'Graphic design',
          text: 'Design layouts or websites',
          icon: '',
          image: 'https://main--milo--adobecom.hlx.page/drafts/colloyd/quiz-entry/images/design.png',
        },
        {
          options: 'illustration',
          title: 'Illustration',
          text: 'Paint, draw, or create illustrations',
          icon: '',
          image: 'https://main--milo--adobecom.hlx.page/drafts/colloyd/quiz-entry/images/illustration.png',
        },
        {
          options: 'pdf',
          title: 'PDFs',
          text: 'Create, edit, or sign PDFs',
          icon: '',
          image: 'https://main--milo--adobecom.hlx.page/drafts/colloyd/quiz-entry/images/pdf.png',
        },
        {
          options: '3d',
          title: '3D/AR',
          text: 'Model, texture, and render 3D assets and scenes',
          icon: '',
          image: 'https://main--milo--adobecom.hlx.page/drafts/colloyd/quiz-entry/images/3dar.png',
        }
      ],
    },
    questions: {
      total: 10,
      offset: 0,
      limit: 10,
      data: [
        {
          q: 'q-category',
          heading: 'Not sure which apps are best for you?',
          'sub-head': 'Tell us what you’re interested in. We’ll help you figure it out.',
          btn: 'Continue',
          text: 'Or pick up to 3 below',
          background: 'https://milo.adobe.com/drafts/quiz/quiz-2/quiz-background.jpeg',
          footerFragment: '',
        },
        {
          q: 'q-fallback',
          heading: "We're sorry our assistant couldn't help today.",
          'sub-head': 'Please choose up to three options.',
          btn: 'Next',
          text: '',
          background: 'https://milo.adobe.com/drafts/quiz/quiz-2/quiz-background.jpeg',
          footerFragment: '',
        },
        {
          q: 'q-photo',
          heading: 'What do you want to do with photos?',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q2-Photo%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: 'https://milo.adobe.com/fragments/quiz/sample-uar-fragments/footer/footer1',
        },
        {
          q: 'q-video',
          heading: 'What do you want to do with video?',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q2-Photo%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: '',
        },
        {
          q: 'q-design',
          heading: 'What do you want to do with design?',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q2-Design%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: '',
        },
        {
          q: 'q-illustration',
          heading: 'What do you want to do with illustration?',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q2-Illustration%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: '',
        },
        {
          q: 'q-pdf',
          heading: 'What do you want to do with PDFs?',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q2-Acrobat%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: '',
        },
        {
          q: 'q-3d',
          heading: 'What do you want to do with 3D/AR?',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-3D-AR%20BKGD?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: '',
        },
        {
          q: 'q-rather',
          heading: 'For your projects, would you rather:',
          'sub-head': 'Pick one.',
          btn: 'Next',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q3-Learn%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: '',
        },
        {
          q: 'q-customer',
          heading: 'What else are you looking for today?',
          'sub-head': 'Pick one.',
          btn: 'Get your results',
          text: '',
          background: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/DSK-Q4%20BKGD%202X?$pjpeg$&jpegSize=300&wid=1920',
          footerFragment: 'https://milo.adobe.com/fragments/quiz/sample-uar-fragments/footer/footer2',
        }
      ],
    },
    'q-rather': {
      total: 2,
      offset: 0,
      limit: 2,
      data: [
        {
          options: 'template',
          title: '',
          text: 'Edit quickly and customize templates',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/1-Templates.png',
        },
        {
          options: 'custom',
          title: '',
          text: 'Take the time to control every detail',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/2-CustomDesigns.png',
        }
      ],
    },
    'q-photo': {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        {
          options: 'organize',
          title: '',
          text: 'Get them sorted and organized',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-photo/1-LR-StoreAndOrganize.png',
        },
        {
          options: 'batch',
          title: '',
          text: 'Edit lots of photos quickly',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-photo/2-LR-ApplyFilters.png',
        },
        {
          options: 'edit',
          title: '',
          text: 'Edit and finesse the smallest details',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-photo/3-PS-RemoveObjects.png',
        },
        {
          options: 'color',
          title: '',
          text: 'Correct color and lighting like a pro',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-photo/4-PS-MakeDetailedColor.png',
        },
        {
          options: 'blend',
          title: '',
          text: 'Blend multiple shots into something new',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-photo/5-PS-BlendImages.png',
        },
      ],
    },
    'q-fallback': {
      total: 6,
      offset: 0,
      limit: 6,
      data: [
        {
          options: 'photo',
          title: 'Photography',
          text: 'Edit or organize my photos',
          icon: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/1-Photo%20ICON.svg',
          image: '',
        },
        {
          options: 'video',
          title: 'Video',
          text: 'Create and edit video or audio',
          icon: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/2-Video%20ICON.svg',
          image: '',
        },
        {
          options: 'design',
          title: 'Graphic design',
          text: 'Design layouts or websites',
          icon: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/3-Design%20ICON.svg',
          image: '',
        },
        {
          options: 'illustration',
          title: 'Illustration',
          text: 'Paint, draw, or create illustrations',
          icon: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/4-Illustration%20ICON.svg',
          image: '',
        },
        {
          options: 'pdf',
          title: 'PDFs',
          text: 'Create, edit, or sign PDFs',
          icon: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/5-PDF%20ICON.svg',
          image: '',
        },
        {
          options: '3d',
          title: '3D/AR',
          text: 'Model, texture, and render 3D assets and scenes',
          icon: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/6-3D-AR%20ICON.svg',
          image: '',
        }
      ],
    },
    'q-pdf': {
      total: 6,
      offset: 0,
      limit: 6,
      data: [
        {
          options: 'create',
          title: '',
          text: 'Create and export PDFs to Office',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-pdf/1-Ac-CreateExport.png',
        },
        {
          options: 'edit',
          title: '',
          text: 'Edit text and images in PDFs',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-pdf/2-Ac-EditText.png',
        },
        {
          options: 'share',
          title: '',
          text: 'Share PDFs with anyone',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-pdf/3-Ac-Share.png',
        },
        {
          options: 'secure',
          title: '',
          text: 'Protect and secure PDFs',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-pdf/4-Ac-Protect.png',
        },
        {
          options: 'sign',
          title: '',
          text: 'Sign PDFs wherever you are',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-pdf/5-Ac-Sign.png',
        },
        {
          options: 'track',
          title: '',
          text: 'Track signatures and progress',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-pdf/6-Ac-TrackSignatures.png',
        }
      ],
    },
    'q-design': {
      total: 3,
      offset: 0,
      limit: 3,
      data: [
        {
          options: 'layouts',
          title: '',
          text: 'Create layouts for magazines, books, or posters',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-design/1-%20Id-Layouts.png',
        },
        {
          options: 'images',
          title: '',
          text: 'Combine multiple images into new designs',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-design/2-PS-CombineImages.png',
        },
        {
          options: 'graphics',
          title: '',
          text: 'Create graphics and designs that work at any size',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-design/3-Ai-CreateGraphics.png',
        },
      ],
    },
    'q-illustration': {
      total: 4,
      offset: 0,
      limit: 4,
      data: [
        {
          options: 'raster',
          title: '',
          text: 'Paint, draw, or doodle like on paper',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-illustration/1-PS-PaintDraw.png',
        },
        {
          options: 'vector',
          title: '',
          text: 'Make illustrations that work at any size',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-illustration/2-Ai-WorkAtAnySize.png',
        },
        {
          options: 'crisp',
          title: '',
          text: 'Draw crisp lines and smooth curves',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-illustration/3-Ai-CrispLines.png',
        },
        {
          options: 'images',
          title: '',
          text: 'Blend multiple images into something new',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q2-illustration/4-PS-BlendImages.png',
        }
      ],
    },
    'q-customer': {
      total: 3,
      offset: 0,
      limit: 3,
      data: [
        {
          options: 'educational',
          title: '',
          text: 'A student or teacher discount',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q4/2-StudentTeacher.png',
        },
        {
          options: 'business',
          title: '',
          text: 'Licenses and business features for teams',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q4/3-Work.png',
        },
        {
          options: 'individual',
          title: '',
          text: 'Neither apply',
          icon: '',
          image: 'https://www.adobe.com/content/dam/cc/Images/app-recommender/multi-select/quiz-question-card-thumbnails/q4/1-Individual.png',
        },
      ],
    },
    ':version': 3,
    ':names': [
      'q-video',
      'q-3d',
      'q-category',
      'questions',
      'q-rather',
      'q-photo',
      'q-fallback',
      'q-pdf',
      'q-design',
      'q-illustration',
      'q-customer',
    ],
    ':type': 'multi-sheet',
  },
  questions: {
    'q-rather': {
      total: 2,
      offset: 0,
      limit: 2,
      data: [
        {
          options: 'template',
          next: 'RESET,q-customer',
          'data-analytics-title': 'ccx',
        },
        {
          options: 'custom',
          next: 'RESULT',
          'data-analytics-title': 'Flagship',
        },
      ],
    },
    questions: {
      total: 9,
      offset: 0,
      limit: 9,
      data: [
        {
          questions: 'q-category',
          'max-selections': '3',
          'min-selections': '1',
        },
        {
          questions: 'q-rather',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-video',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-photo',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-customer',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-3d',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-pdf',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-design',
          'max-selections': '1',
          'min-selections': '1',
        },
        {
          questions: 'q-illustration',
          'max-selections': '1',
          'min-selections': '1',
        },
      ],
    },
    'q-3d': {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        {
          options: 'stage',
          next: 'q-customer',
        },
        {
          options: 'texture',
          next: 'q-customer',
        },
        {
          options: 'materials',
          next: 'q-customer',
        },
        {
          options: 'model',
          next: 'q-customer',
        },
        {
          options: 'assets',
          next: 'q-customer',
        },
      ],
    },
    'q-pdf': {
      total: 6,
      offset: 0,
      limit: 6,
      data: [
        {
          options: 'create',
          next: 'q-customer',
        },
        {
          options: 'edit',
          next: 'q-customer',
        },
        {
          options: 'share',
          next: 'q-customer',
        },
        {
          options: 'secure',
          next: 'q-customer',
        },
        {
          options: 'sign',
          next: 'q-customer',
        },
        {
          options: 'track',
          next: 'q-customer',
        },
      ],
    },
    'q-category': {
      total: 22,
      offset: 0,
      limit: 22,
      data: [
        {
          options: 'fi_code',
          next: '',
          type: 'form',
          endpoint: 'acom-prd-recom-v01',
          'api-key': 'CCHomeMLRepo1',
          threshold: '0.7',
          fallback: 'photoshop_cc,illustrator_cc,premierepro_cc',
          'ac-endpoint': 'autocomplete',
          'ac-scope': 'adobe_com',
          'ac-client-id': 'adobedotcom2',
        },
        {
          options: 'photo',
          next: 'q-rather,q-photo',
          type: 'card',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'video',
          next: 'q-rather,q-video',
          type: 'card',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'design',
          next: 'q-rather,q-design',
          type: 'card',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'illustration',
          next: 'q-rather,q-illustration',
          type: 'card',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: '3d',
          next: 'NOT(q-rather),q-3d',
          type: 'card',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'pdf',
          next: 'q-rather,q-pdf',
          type: 'card',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'acrobat_dc_pro',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'aftereffects_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'audition_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'flash_professional_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'illustrator_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'indesign_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'lightroom_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'photoshop_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'premierepro_cc',
          next: 'q-rather,q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'sbst_stager',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'sbst_painter',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'sbst_alchemist',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'sbst_shaper',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'sbst_designer',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
        {
          options: 'free_spark',
          next: 'q-customer',
          type: 'api_return_code',
          endpoint: '',
          'api-key': '',
          threshold: '',
          fallback: '',
          'ac-endpoint': '',
          'ac-scope': '',
          'ac-client-id': '',
        },
      ],
    },
    'q-customer': {
      total: 3,
      offset: 0,
      limit: 3,
      data: [
        {
          options: 'educational',
          next: 'RESULT',
        },
        {
          options: 'business',
          next: 'RESULT',
        },
        {
          options: 'individual',
          next: 'RESULT',
        },
      ],
    },
    'q-video': {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        {
          options: 'social',
          next: 'q-customer',
        },
        {
          options: 'pro',
          next: 'q-customer',
        },
        {
          options: 'movement',
          next: 'q-customer',
        },
        {
          options: 'animate',
          next: 'q-customer',
        },
        {
          options: 'sound',
          next: 'q-customer',
        },
      ],
    },
    'q-photo': {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        {
          options: 'organize',
          next: 'q-customer',
        },
        {
          options: 'batch',
          next: 'q-customer',
        },
        {
          options: 'edit',
          next: 'q-customer',
        },
        {
          options: 'color',
          next: 'q-customer',
        },
        {
          options: 'blend',
          next: 'q-customer',
        },
      ],
    },
    'q-design': {
      total: 3,
      offset: 0,
      limit: 3,
      data: [
        {
          options: 'layouts',
          next: 'q-customer',
        },
        {
          options: 'images',
          next: 'q-customer',
        },
        {
          options: 'graphics',
          next: 'q-customer',
        },
      ],
    },
    'q-illustration': {
      total: 4,
      offset: 0,
      limit: 4,
      data: [
        {
          options: 'raster',
          next: 'q-customer',
        },
        {
          options: 'vector',
          next: 'q-customer',
        },
        {
          options: 'crisp',
          next: 'q-customer',
        },
        {
          options: 'images',
          next: 'q-customer',
        },
      ],
    },
    ':version': 3,
    ':names': [
      'q-rather',
      'questions',
      'q-3d',
      'q-pdf',
      'q-category',
      'q-customer',
      'q-video',
      'q-photo',
      'q-design',
      'q-illustration',
    ],
    ':type': 'multi-sheet',
  },
};

export default resultsMock;
