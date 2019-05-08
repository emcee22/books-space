import { styles } from './relative-time.css.js';
import { htmlTemplate } from './relative-time.template.js';
const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style> ${htmlTemplate}`;
export class RelativeTime extends HTMLElement {
    constructor() {
        super();
        this.language = 'en';
        this._reset = false;
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.textHolderEl = this._shadowRoot.querySelector('small');
        this.language = navigator.language;
        const intl = Intl;
        this.rtf = new intl.RelativeTimeFormat(this.language.split('-')[0] || 'en');
    }
    get reset() {
        return this._reset;
    }
    set reset(value) {
        this._reset = value;
        clearInterval(this.interval);
        this.displayElapsedTime();
    }
    displayElapsedTime() {
        var loadingTimeDate = new Date();
        this.interval = setInterval(() => {
            var nowDate = new Date();
            var difference = Math.floor((nowDate.getTime() - loadingTimeDate.getTime()) / 1000);
            this.textHolderEl.innerHTML = this.rtf.format(-difference, 'seconds');
        }, 1000);
    }
}
//# sourceMappingURL=relative-time.component.js.map