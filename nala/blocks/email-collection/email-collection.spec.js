module.exports = {
  name: 'Email Collection Block',
  features: [
    {
      tcid: '0',
      name: 'Email Collection form',
      path: '/drafts/nala/blocks/email-collection/email-collection',
      data: {

        marquee: {
          h2Text: 'Heading XL Marquee standard medium left',
          bodyText: 'Body M Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          outlineButtonText: 'Full form',
          blueButtonText: 'Large image form',
        },
        emailCollectionForm: {
          bodyText: 'Sign up to join the beta waitlist and get notified when it’s available.',
          firstNameLabel: 'Biljana',
          lastNameLabel: 'Cvijanovic',
          organizationLabel: 'Company',
          occupationLabel: 'Job',
          countryLabel: 'RS',
          consentText: 'The Adobe family of companies may keep me informed with personalized emails about Adobe MAX 2025. See our Privacy Policy for more details or to opt-out at any time.',
          links: [
            { text: 'Adobe family of companies', number: 1 },
            { text: 'personalized', number: 2 },
            { text: 'Privacy Policy', number: 3 },
          ],
          bodyXS: 'This field is required.',
          outlineButtonText: 'Submit',
        },
        submitedMessage: {
          h2Text: 'We’ve received your response.',
          bodyText: 'Thank you for your interest in Generative Video (beta) powered by Adobe Firefly.',
          outlineButtonText: 'Back to the website',
        },
      },
      tags: '@emailCollection @smoke @regression @milo @nopr',
    },
    {
      tcid: '1',
      name: 'Mailing list',
      path: '/drafts/nala/blocks/email-collection/email-collection-mailing-list',
      data: {
        marquee: {
          h2Text: 'Heading XL Marquee standard small light',
          bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
          outlineButtonText: 'Mailing list',
          blueButtonText: 'Mailing list no image',
        },
        mailingListForm: {
          countryLabel: 'Country',
          bodyXS: 'This field is required.',
          blueButtonText: 'Submit',
        },
        mailingSubmitedMessage: {
          h2Text: 'We’ve received your response.',
          bodyText: 'Thank you for your interest in Generative Video (beta) powered by Adobe Firefly.',
          outlineButtonText: 'Back to the website',
        },
      },
      tags: '@emailCollection @smoke @regression @milo',
    },
  ],
};
