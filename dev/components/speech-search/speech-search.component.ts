import { styles } from './speech-search.css.js';
import { htmlTemplate } from './speech-search.template.js';

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style> ${htmlTemplate}`;

export class SpeechSearch extends HTMLElement {
    _shadowRoot: ShadowRoot;
    recognition!: SpeechRecognition;
    interimTranscript: string = '';
    finalTranscript: string = '';
    _inputvalue: string = '';
    _window = window as any;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // set-up speech recognition API
        this._window.SpeechRecognition =
            this._window.SpeechRecognition ||
            this._window.webkitSpeechRecognition ||
            this._window.mozSpeechRecognition ||
            this._window.msSpeechRecognition ||
            null;

        if (this._window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 10;
            this.recognition.continuous = true;
            this.recognition.lang = navigator.language;
            this.recognition.onresult = this.onResult.bind(this);
        } else {
            this._shadowRoot.querySelector('button').setAttribute('disabled', '');
        }
    }

    get inputvalue() {
        return this._inputvalue;
    }

    set inputvalue(value: string) {
        this._inputvalue = value;
        this._shadowRoot.querySelector('input').value = this._inputvalue;

        // dispatch event
        this.dispatchEvent(
            new CustomEvent('speech-text-updated', {
                detail: this._inputvalue,
            }),
        );
    }

    connectedCallback() {
        this._shadowRoot.querySelector('button').addEventListener('click', this.recordHandler.bind(this));

        // debounce and listen to input changes
        const handler = () => {
            this.inputvalue = this._shadowRoot.querySelector('input').value;
        };
        const dHandler = this.debounced(1000, handler);
        this._shadowRoot.querySelector('input').addEventListener('input', dHandler);
    }

    recordHandler(event: any) {
        if (!event.target.hasAttribute('voice-on')) {
            this.finalTranscript = '';
            this.start();
            event.target.setAttribute('voice-on', true);
            event.target.src = './assets/img/mic-animate.gif';
        } else {
            this.stop();
            event.target.removeAttribute('voice-on');
            event.target.src = './assets/img/mic.gif';
        }
    }

    onResult(event: any) {
        this.interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            const { transcript } = event.results[i][0];
            if (event.results[i].isFinal) {
                this.finalTranscript += transcript;
            } else {
                this.interimTranscript += transcript;
            }
        }
        this._shadowRoot.querySelector('input').value = this.finalTranscript;
        this._shadowRoot.querySelector('input').dispatchEvent(new Event('input'));
    }

    // stop recording
    stop(): void {
        this.recognition.stop();
    }

    // start recording
    start(): void {
        this.recognition.start();
    }

    debounced(delay: number, fn: any) {
        let timerId: any;
        return function(...args: any) {
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
