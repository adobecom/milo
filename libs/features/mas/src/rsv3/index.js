import React from 'react';
import { Button, defaultTheme, Provider } from '@adobe/react-spectrum';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';

const color = ['light', 'dark', 'darkest'].find(
    (theme) => document.querySelector(`spectrum--${theme}`) !== undefined,
);

function MasButton({ variant, style, content, target }) {
    const buttonRef = React.useRef();
    React.useLayoutEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.UNSAFE_getDOMNode().append(content);
        }
    }, []);
    return React.createElement(
        Provider,
        { theme: defaultTheme, color, scale: 'medium' },
        createPortal(
            React.createElement(Button, {
                ref: buttonRef,
                variant,
                style,
            }),
            target,
        ),
    );
}

export function renderMasButton(variant, style, content, target) {
    const el = document.createElement('div');
    const root = createRoot(el);
    root.render(
        React.createElement(MasButton, {
            theme: defaultTheme,
            color,
            variant,
            style,
            target,
            content,
        }),
    );
    return el;
}
