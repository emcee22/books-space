import { styles } from './relative-time.css.js';
import { htmlTemplate } from './relative-time.template.js';

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style> ${htmlTemplate}`;

export class RelativeTime extends HTMLElement {
    _shadowRoot: ShadowRoot;
    textHolderEl: HTMLElement;
    language: string = 'en';
    interval: number;
    rtf: any;
    _reset: boolean = false;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // cache elements
        this.textHolderEl = this._shadowRoot.querySelector('small');

        // set the language
        this.language = navigator.language;
        const intl: any = Intl;

        // check browser support
        if (intl.RelativeTimeFormat) {
            this.rtf = new intl.RelativeTimeFormat(this.language.split('-')[0] || 'en');
        }
    }

    get reset() {
        return this._reset;
    }

    set reset(value: boolean) {
        this._reset = value;
        clearInterval(this.interval);
        if (this.rtf) this.displayElapsedTime();
    }

    displayElapsedTime() {
        let loadingTimeDate = new Date();
        this.textHolderEl.innerHTML = this.rtf.format(0, 'seconds');
        this.interval = setInterval(() => {
            let nowDate = new Date();
            let difference = Math.floor((nowDate.getTime() - loadingTimeDate.getTime()) / 1000);
            this.textHolderEl.innerHTML = this.rtf.format(-difference, 'seconds');
        }, 1000);
    }
}
