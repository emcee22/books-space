import { styles } from './speech-search.css.js';
import { htmlTemplate } from './speech-search.template.js';
const template = document.createElement('template');
template.innerHTML = `
<link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossorigin="anonymous"
/>
<style>${styles}</style> ${htmlTemplate}`;
export class SpeechSearch extends HTMLElement {
    constructor() {
        super();
        this.interimTranscript = '';
        this.finalTranscript = '';
        this._inputvalue = '';
        this._window = window;
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._window.SpeechRecognition =
            this._window.webkitSpeechRecognition ||
                this._window.SpeechRecognition;
        if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 10;
            this.recognition.continuous = true;
            this.recognition.lang = navigator.language;
            this.recognition.onresult = this.onResult.bind(this);
        }
        else {
            this._shadowRoot
                .querySelector('button')
                .setAttribute('disabled', '');
        }
    }
    get inputvalue() {
        return this._inputvalue;
    }
    set inputvalue(value) {
        this._inputvalue = value;
        this._shadowRoot.querySelector('input').value = this._inputvalue;
        this._callback(this._inputvalue);
    }
    get callback() {
        return this._callback;
    }
    set callback(value) {
        this._callback = value;
    }
    connectedCallback() {
        this._shadowRoot
            .querySelector('button')
            .addEventListener('click', this.recordHandler.bind(this));
        const handler = () => {
            this.inputvalue = this._shadowRoot.querySelector('input').value;
        };
        const dHandler = this.debounced(1000, handler);
        this._shadowRoot
            .querySelector('input')
            .addEventListener('input', dHandler);
    }
    recordHandler(event) {
        if (!event.target.hasAttribute('voice-on')) {
            this.finalTranscript = '';
            this.start();
            event.target.setAttribute('voice-on', true);
            event.target.src = './assets/img/mic-animate.gif';
        }
        else {
            this.stop();
            event.target.removeAttribute('voice-on');
            event.target.src = './assets/img/mic.gif';
        }
    }
    onResult(event) {
        this.interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                this.finalTranscript += transcript;
            }
            else {
                this.interimTranscript += transcript;
            }
        }
        this._shadowRoot.querySelector('input').value = this.finalTranscript;
        this._shadowRoot
            .querySelector('input')
            .dispatchEvent(new Event('input'));
    }
    stop() {
        this.recognition.stop();
    }
    start() {
        this.recognition.start();
    }
    debounced(delay, fn) {
        let timerId;
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn(...args);
                timerId = null;
            }, delay);
        };
    }
}
//# sourceMappingURL=speech-search.component.js.map