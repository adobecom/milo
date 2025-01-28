export const CSS = `

merch-card[variant="ccd-slice"] [slot='image'] {
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    width: 134px;
    height: 149px;
    overflow: hidden;
    border-radius: 50%;
    padding: 15px;
    align-self: center;
    padding-inline-start: 0;
}

merch-card[variant="ccd-slice"] [slot='image'] img {
    overflow: hidden;
    border-radius: 50%;
    width: inherit;
    height: inherit;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a.spectrum-Link {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    font-style: normal;
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xxs-line-height);
}

.spectrum--darkest merch-card[variant="ccd-slice"] {
  --consonant-merch-card-background-color:rgb(29, 29, 29);
  --consonant-merch-card-body-s-color:rgb(235, 235, 235);
  --consonant-merch-card-border-color:rgb(48, 48, 48);
  --consonant-merch-card-detail-s-color:rgb(235, 235, 235);
}
`;
