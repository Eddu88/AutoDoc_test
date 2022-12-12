// @ts-ignore
import favicon from '../assets/img/favicon.png'
import {router} from '../router/index.router.js'
import { Tooltip } from 'bootstrap';
import { startChecker } from './checker'

/**
 * This function is called when the page loads, and it sets the favicon, initializes the tooltip, and
 * starts the router.
 */
const initialize = () => {
    const headTitle = document.querySelector('head');
    const setFavicon = document.createElement('link');
    setFavicon.setAttribute('rel','shortcut icon');
    setFavicon.setAttribute('href',favicon);
    headTitle.appendChild(setFavicon);

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl)
    });

    startChecker(() => {
        router(window.location.hash)
    });
}

export { initialize };