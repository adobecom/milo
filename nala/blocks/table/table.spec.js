module.exports = {
  FeatureName: 'Table Block',
  features: [
    {
      tcid: '0',
      name: '@Table (default)',
      path: '/drafts/nala/blocks/table/table',
      data: {
        rowsCount: 9,
        headerRowColCount: 5,
        sectionRowCount: 8,
        headerCell2: {
          heading: 'Heading Title-2',
          pricingText: 'Pricing-2',
          outlineButtonText: 'Free trial',
          blueButtonText: 'Buy now',
        },
        sectionRow2: {
          sectionRowTitle: 'Row-1.1, Title',
          cell22: 'Content',
        },
      },
      tags: '@table @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Table (highlight)',
      path: '/drafts/nala/blocks/table/table-hightlight',
      data: {
        rowsCount: 10,
        headerRowColCount: 5,
        sectionRowCount: 8,
        hightlightRow: {
          cell12: 'Highlight-2',
          cell13: 'Highlight-3',
          cell14: 'Highlight-4',
        },
        headerCell3: {
          heading: 'Heading Title-3',
          pricingText: 'Pricing-3',
          outlineButtonText: 'Free trial',
          blueButtonText: 'Buy now',
        },
        sectionRow2: {
          sectionRowTitle: 'Row-1.1, Title',
          cell22: 'Content',
        },
      },
      tags: '@table @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@Table (sticky)',
      path: '/drafts/nala/blocks/table/table-sticky',
      data: {
        rowsCount: 9,
        headerRowColCount: 5,
        sectionRowCount: 8,
        headerCell4: {
          heading: 'Heading Title-4',
          pricingText: 'Pricing-4',
          outlineButtonText: 'Free trial',
          blueButtonText: 'Buy now',
        },
        sectionRow2: {
          sectionRowTitle: 'Row-1.1, Title',
          cell22: 'Content',
        },
      },
      tags: '@table @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: '@Table (highlight, collapse, sticky)',
      path: '/drafts/nala/blocks/table/table-highlight-collapse-sticky',
      data: {
        rowsCount: 10,
        headerRowColCount: 5,
        sectionRowCount: 8,
        hightlightRow: {
          cell12: 'Highlight-2',
          cell13: 'Highlight-3',
          cell14: 'Highlight-4',
        },
        headerCell5: {
          heading: 'Heading Title-5',
          pricingText: 'Pricing-5',
          outlineButtonText: 'Free trial',
          blueButtonText: 'Buy now',
        },
        sectionRow2: {
          sectionRowTitle: 'Row-1.1, Title',
          cell22: 'Content',
        },
      },
      tags: '@table @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: '@Table (merch)',
      path: '/drafts/nala/blocks/table/table-merch',
      data: {
        rowsCount: 9,
        headerRowColCount: 3,
        sectionRowCount: 8,
        headerCell1: {
          heading: 'Heading Title-1',
          pricingText: 'Pricing-1',
          AdditionalText: 'Additional Text-1',
          outlineButtonText: 'Free trial',
          blueButtonText: 'Buy now',
        },
        sectionRow2: {
          merchContent: 'Section Content-1.1',
          image: 'yes',
        },
      },
      tags: '@table @smoke @regression @milo',
    },
  ],
};
