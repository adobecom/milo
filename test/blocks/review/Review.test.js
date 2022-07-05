import React from 'react';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Review from '../Review';

const ACTIVE_CLASS = 'is-Active';
const COMMENT_FIELD_CLASS = 'hlx-Review-commentFields';

test('sets is-Active class on current ratings and below the clicked rating', () => {
    render(<Review />);
    const ratingFields = document.getElementsByClassName('hlx-Review-ratingFields')[0];
    userEvent.click(ratingFields.childNodes[3]);
    expect(ratingFields.childNodes[5]).not.toHaveClass(ACTIVE_CLASS);
    expect(ratingFields.childNodes[4]).not.toHaveClass(ACTIVE_CLASS);
    expect(ratingFields.childNodes[3]).toHaveClass(ACTIVE_CLASS);
    expect(ratingFields.childNodes[2]).toHaveClass(ACTIVE_CLASS);
    expect(ratingFields.childNodes[1]).toHaveClass(ACTIVE_CLASS);
});

test('Shows comment field when rated below comment threshold', () => {
    const getRatingFields = () =>
        document.getElementsByClassName('hlx-Review-ratingFields')[0];
    const clickOpt = { clientX: 99, clientY: 99 };

    render(<Review commentThreshold={2} />);
    let ratingFields = getRatingFields();
    userEvent.click(ratingFields.childNodes[3], clickOpt);
    expect(document.getElementsByClassName(COMMENT_FIELD_CLASS)).toHaveLength(0);
    cleanup();

    render(<Review commentThreshold={2} />);
    ratingFields = getRatingFields();
    userEvent.click(ratingFields.childNodes[1], clickOpt);
    expect(document.getElementsByClassName(COMMENT_FIELD_CLASS)).toHaveLength(1);
    cleanup();

    render(<Review commentThreshold={2} />);
    ratingFields = getRatingFields();
    userEvent.click(ratingFields.childNodes[5], clickOpt);
    expect(document.getElementsByClassName(COMMENT_FIELD_CLASS)).toHaveLength(0);
    cleanup();

    render(<Review commentThreshold={2} />);
    ratingFields = getRatingFields();
    userEvent.click(ratingFields.childNodes[2], clickOpt);
    expect(document.getElementsByClassName(COMMENT_FIELD_CLASS)).toHaveLength(1);
});