const BUY_NOW_BLUE = { text: 'Buy now', type: 'blue', justifycontent: 'center' };
const FREE_TRIAL_OUTLINE = { text: 'Free trial', type: 'outline', justifycontent: 'center' };

module.exports = {
  FeatureName: 'Comparison Table Block',
  features: [
    {
      tcid: '0',
      name: 'Comparison table',
      path: '/drafts/nala/blocks/comparison-table/comparison-table',
      tags: '@comparison @smoke @regression @milo',
      data: {
        tableSectionCount: 2,
        rowsCount: 8,
        headerColCount: 5,
        sectionRowCount: 8,

        subHeaders: [
          {
            colIndex: 1,
            visibility: true,
            titleText: 'SubHeader-2',
            imageVisible: true,
            heading: 'Heading Title-2',
            pricingText: 'Pricing-2',
            descriptionText: 'Sub copy displays outside of the box.',
            descriptionLinkText: 'Read more',
            buttons: [FREE_TRIAL_OUTLINE, BUY_NOW_BLUE],
          },
          {
            colIndex: 2,
            visibility: true,
            titleText: 'SubHeader-3',
            imageVisible: true,
            heading: 'Heading Title-3',
            pricingText: 'Pricing-3',
            buttons: [BUY_NOW_BLUE],
          },
          {
            colIndex: 3,
            visibility: true,
            titleText: 'SubHeader-4',
            imageVisible: true,
            heading: 'Heading Title-4',
            pricingText: 'Pricing-4',
            buttons: [BUY_NOW_BLUE],
          },
          {
            colIndex: 4,
            visibility: true,
            titleText: 'SubHeader-5',
            imageVisible: true,
            heading: 'Heading Title-5',
            pricingText: 'Pricing-5',
            buttons: [BUY_NOW_BLUE],
          },
        ],

        firstSection: {
          sectionTitle: 'First table section',
          expand: false,
          expectedExpanded: 'true',
          rows: [
            {
              rowIndex: 0,
              rowHeaderText: 'Row-1.1, Title',
              cells: [
                { colIndex: 1, checkmark: 'green' },
                { colIndex: 2, checkmark: 'default' },
                { colIndex: 3, checkmark: 'green' },
                { colIndex: 4, checkmark: 'default' },
              ],
            },
            {
              rowIndex: 1,
              rowHeaderText: 'Row-1.2, Title',
              rowHeaderTooltipText: 'Tooltip position set to top',
              cells: [
                { colIndex: 1, expectClose: true },
                { colIndex: 2, expectClose: true },
                { colIndex: 3, expectClose: true },
                { colIndex: 4, expectClose: true },
              ],
            },
            {
              rowIndex: 2,
              rowHeaderText: 'Row-1.3, Title',
              cells: [
                { colIndex: 1, text: 'Description', tooltipText: 'Tooltip position set to top' },
                { colIndex: 2 },
                { colIndex: 3 },
                { colIndex: 4 },
              ],
            },
          ],
        },

        secondSection: {
          sectionTitle: 'Second table section',
          expand: true,
          expectedExpanded: 'true',
          rows: [
            {
              rowIndex: 0,
              rowHeaderText: 'Row-2.1, Title',
              cells: [
                { colIndex: 1, text: 'Value 2' },
                { colIndex: 2, text: 'Value 2' },
                { colIndex: 3 },
                { colIndex: 4 },
              ],
            },
            {
              rowIndex: 1,
              rowHeaderText: 'Row-2.2, Title',
              cells: [
                { colIndex: 1, text: 'Value Text', description: 'Description' },
                { colIndex: 2 },
                { colIndex: 3 },
                { colIndex: 4 },
              ],
            },
            {
              rowIndex: 2,
              rowHeaderText: 'Row-2.3, Title',
              linkText: 'link',
              cells: [
                { colIndex: 1 },
                { colIndex: 2 },
                { colIndex: 3 },
                { colIndex: 4 },
              ],
            },
          ],
        },
      },
    },

    {
      tcid: '1',
      name: 'Comparison table - static header',
      path: '/drafts/nala/blocks/comparison-table/comparison-table-static-header',
      tags: '@comparison-static @smoke @regression @milo',
      data: {
        tableSectionCount: 2,
        rowsCount: 7,
        headerColCount: 4,

        subHeaders: [
          {
            colIndex: 1,
            visibility: true,
            titleText: 'Static table heading-2',
            heading: 'Heading Title-2',
            pricingText: 'Pricing-2',
            buttons: [BUY_NOW_BLUE],
          },
          {
            colIndex: 2,
            visibility: true,
            titleText: 'Static table heading-3',
            heading: 'Heading Title-3',
            pricingText: 'Pricing-3',
            buttons: [BUY_NOW_BLUE],
          },
          {
            colIndex: 3,
            visibility: true,
            titleText: 'Static table heading-4',
            heading: 'Heading Title-4',
            pricingText: 'Pricing-4',
            buttons: [BUY_NOW_BLUE],
          },
        ],

        firstSection: {
          sectionTitle: 'First table section title',
          expand: false,
          expectedExpanded: 'true',
          rows: [
            { rowIndex: 0, rowHeaderText: 'Row-1.1, Title', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
            { rowIndex: 1, rowHeaderText: 'Row-1.2, Title', rowHeaderTooltipText: 'Tooltip position set to top', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
            { rowIndex: 2, rowHeaderText: 'Row-1.3, Title', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
          ],
        },

        secondSection: {
          sectionTitle: 'Second table section title',
          expand: true,
          expectedExpanded: 'true',
          rows: [
            { rowIndex: 0, rowHeaderText: 'Row-2.1, Title', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
            { rowIndex: 1, rowHeaderText: 'Row-2.2, Title', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
          ],
        },
      },
    },

    {
      tcid: '2',
      name: 'Comparison table - dark',
      path: '/drafts/nala/blocks/comparison-table/comparison-table-dark',
      tags: '@comparison-dark @smoke @regression @milo',
      data: {
        tableSectionCount: 2,
        rowsCount: 7,
        headerColCount: 4,

        subHeaders: [
          {
            colIndex: 1, visibility: true, titleText: 'Table heading-2', heading: 'Heading Title-2', pricingText: 'Pricing-2', buttons: [BUY_NOW_BLUE],
          },
          {
            colIndex: 2, visibility: true, titleText: 'Table heading-3', heading: 'Heading Title-3', pricingText: 'Pricing-3', buttons: [BUY_NOW_BLUE],
          },
          {
            colIndex: 3, visibility: true, titleText: 'Table heading-4', heading: 'Heading Title-4', pricingText: 'Pricing-4', buttons: [BUY_NOW_BLUE],
          },
        ],

        firstSection: {
          sectionTitle: 'First table section title',
          expand: false,
          expectedExpanded: 'true',
          rows: [
            {
              rowIndex: 0,
              rowHeaderText: 'Row-1.1, Title',
              cells: [
                { colIndex: 1, expectClose: true },
                { colIndex: 2, checkmark: 'default' },
                { colIndex: 3 },
              ],
            },
            { rowIndex: 1, rowHeaderText: 'Row-1.2, Title', rowHeaderTooltipText: 'Tooltip position set to top', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
            { rowIndex: 2, rowHeaderText: 'Row-1.3, Title', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
          ],
        },

        secondSection: {
          sectionTitle: 'Second table section title',
          expand: true,
          expectedExpanded: 'true',
          rows: [
            {
              rowIndex: 0,
              rowHeaderText: 'Row-2.1, Title',
              cells: [
                { colIndex: 1 },
                { colIndex: 2 },
                { colIndex: 3, checkmark: 'green' },
              ],
            },
            { rowIndex: 1, rowHeaderText: 'Row-2.2, Title', cells: [{ colIndex: 1 }, { colIndex: 2 }, { colIndex: 3 }] },
          ],
        },
      },
    },
  ],
};
