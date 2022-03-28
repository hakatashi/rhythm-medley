/* eslint-disable import/prefer-default-export */

// https://stackoverflow.com/a/4819886
export const isTouchDevice = ({}.hasOwnProperty.call(window, 'ontocuhstart')) ||
    navigator.maxTouchPoints > 0;
