import { styles } from './books-carousel.css.js';
import { htmlTemplate } from './books-carousel.template.js';
const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style> ${htmlTemplate}`;
export class BooksCarousel extends HTMLElement {
    constructor() {
        super();
        this._document = document;
        this._window = window;
        this._slides = [];
        this.slideWidth = 0;
        this.animationDuration = 500;
        this.autoplayInterval = 3000;
        this.imageType = 'medium';
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._prevLink = this._shadowRoot.querySelector('a.control_prev');
        this._nextLink = this._shadowRoot.querySelector('a.control_next');
        this._slider = this._shadowRoot.querySelector('.slider ul');
        this.imageType = this.typeOfImageToLoad();
    }
    get slides() {
        return this._slides;
    }
    set slides(slides) {
        this._slides = slides;
        clearInterval(this.animationInterval);
        this.createSlides();
        this.slideInit();
    }
    connectedCallback() {
        this._prevLink.addEventListener('click', this.moveLeft.bind(this));
        this._nextLink.addEventListener('click', this.moveRight.bind(this));
        this._window.addEventListener('resize', this.windowResize.bind(this));
        this.watchPageVisibility();
    }
    disconnectedCallback() {
        this._prevLink.removeEventListener('click', this.moveLeft.bind(this));
        this._nextLink.removeEventListener('click', this.moveRight.bind(this));
        this._window.removeEventListener('resize', this.windowResize.bind(this));
    }
    createSlides() {
        this._slider.innerHTML = '';
        this._slides.forEach((slide, index) => {
            let listItem = document.createElement('li');
            let image = document.createElement('img');
            image.setAttribute('data-src', slide.cover[this.imageType]);
            listItem.appendChild(image);
            this._slider.appendChild(listItem);
        });
        this.removeAttribute('hidden');
    }
    slideInit() {
        const slideCount = this._shadowRoot.querySelectorAll('.slider ul li')
            .length;
        this.slideWidth = this._shadowRoot.querySelector('.slider ul li').offsetWidth;
        const slideHeight = this._shadowRoot.querySelector('.slider ul li')
            .offsetHeight;
        const sliderUlWidth = slideCount * this.slideWidth;
        this._shadowRoot.querySelector('.slider ul').style.width =
            sliderUlWidth + 'px';
        this._shadowRoot.querySelector('.slider ul').style.marginLeft =
            -this.slideWidth + 'px';
        this._shadowRoot
            .querySelector('.slider ul')
            .prepend(this._shadowRoot.querySelector('.slider ul li:last-child'));
        this.animationInterval = setInterval(() => {
            this.moveRight();
        }, this.autoplayInterval);
        this.lazyLoadImages();
    }
    moveLeft(event = null) {
        if (event) {
            event.preventDefault();
            clearInterval(this.animationInterval);
        }
        const animation = this._shadowRoot.querySelector('.slider ul').animate([
            { transform: 'translateX(0px)' },
            { transform: `translateX(${+this.slideWidth}px)` }
        ], {
            duration: this.animationDuration,
            easing: 'ease-in-out'
        });
        animation.onfinish = () => {
            this._shadowRoot
                .querySelector('.slider ul')
                .prepend(this._shadowRoot.querySelector('.slider ul li:last-child'));
        };
    }
    moveRight(event = null) {
        if (event) {
            event.preventDefault();
            clearInterval(this.animationInterval);
        }
        const animation = this._slider.animate([
            { transform: 'translateX(0px)' },
            { transform: `translateX(-${+this.slideWidth}px)` }
        ], {
            duration: this.animationDuration,
            easing: 'ease-in-out'
        });
        animation.onfinish = () => {
            this._shadowRoot
                .querySelector('.slider ul')
                .append(this._shadowRoot.querySelector('.slider ul li:first-child'));
        };
    }
    watchPageVisibility() {
        let hidden = '';
        let visibilityChange = '';
        if (typeof this._document.hidden !== 'undefined') {
            hidden = 'hidden';
            visibilityChange = 'visibilitychange';
        }
        else if (typeof this._document.webkitHidden !== 'undefined') {
            hidden = 'webkitHidden';
            visibilityChange = 'webkitvisibilitychange';
        }
        if (typeof this._document[hidden] === 'undefined') {
            console.log(`Browser doesn't supports the Page Visibility API.`);
        }
        else {
            const eventHandler = () => {
                if (this._document.hidden) {
                    clearInterval(this.animationInterval);
                }
            };
            document.removeEventListener(visibilityChange, eventHandler);
            document.addEventListener(visibilityChange, eventHandler, false);
        }
    }
    lazyLoadImages() {
        const config = {
            rootMargin: '100% 100%',
            threshold: 0
        };
        let observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.preloadImage(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, config);
        const slides = this._shadowRoot.querySelectorAll('.slider ul li');
        slides.forEach((li) => {
            observer.observe(li);
        });
    }
    preloadImage(element) {
        const src = element
            .querySelector('[data-src]')
            .getAttribute('data-src');
        element.querySelector('[data-src]').setAttribute('src', src);
    }
    windowResize() {
        let typeOfImage = this.typeOfImageToLoad();
        if (typeOfImage !== this.imageType) {
            this.imageType = typeOfImage;
            clearInterval(this.animationInterval);
            this.createSlides();
            this.slideInit();
        }
    }
    typeOfImageToLoad() {
        const width = this._document.body.clientWidth;
        let typeOfImage = 'medium';
        if (width > 1000)
            typeOfImage = 'large';
        return typeOfImage;
    }
}
//# sourceMappingURL=books-carousel.component.js.map