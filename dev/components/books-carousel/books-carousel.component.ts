import { styles } from './books-carousel.css.js';
import { htmlTemplate } from './books-carousel.template.js';

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style> ${htmlTemplate}`;

export class BooksCarousel extends HTMLElement {
	_document = <any>document;
	_window = <any>window;
	_shadowRoot: any;
	_prevLink: HTMLElement;
	_nextLink: HTMLElement;
	_slider: any;
	_slides: any[] = [];

	slideWidth: number = 0;
	animationDuration: number = 500;
	animationInterval: any; // holds the interval so we can clearInterval
	autoplayInterval: number = 3000;
	imageType: string = 'medium'; // property that is updated based upon screen width

	constructor() {
		super();
		this._shadowRoot = this.attachShadow({ mode: 'open' });
		this._shadowRoot.appendChild(template.content.cloneNode(true));
		this._prevLink = this._shadowRoot.querySelector('a.control_prev');
		this._nextLink = this._shadowRoot.querySelector('a.control_next');
		this._slider = this._shadowRoot.querySelector('.slider ul');

		// set image type
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

		// call function that will stop the slider if we leave the page
		this.watchPageVisibility();
	}

	disconnectedCallback() {
		this._prevLink.removeEventListener('click', this.moveLeft.bind(this));
		this._nextLink.removeEventListener('click', this.moveRight.bind(this));
		this._window.removeEventListener(
			'resize',
			this.windowResize.bind(this)
		);
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
		// get number of slides
		const slideCount = this._shadowRoot.querySelectorAll('.slider ul li')
			.length;

		// get slide width
		this.slideWidth = this._shadowRoot.querySelector(
			'.slider ul li'
		).offsetWidth;

		// get slide height
		const slideHeight = this._shadowRoot.querySelector('.slider ul li')
			.offsetHeight;

		// calculate total width
		const sliderUlWidth = slideCount * this.slideWidth;

		// set the total width for the wrapper of the slides
		this._shadowRoot.querySelector('.slider ul').style.width =
			sliderUlWidth + 'px';
		this._shadowRoot.querySelector('.slider ul').style.marginLeft =
			-this.slideWidth + 'px';

		// move last child to first spot in case we go left
		this._shadowRoot
			.querySelector('.slider ul')
			.prepend(
				this._shadowRoot.querySelector('.slider ul li:last-child')
			);

		// autoplay slider
		this.animationInterval = setInterval(() => {
			this.moveRight();
		}, this.autoplayInterval);

		// intersection observer that will load images lazy
		this.lazyLoadImages();
	}

	moveLeft(event: any = null) {
		if (event) {
			event.preventDefault();
			clearInterval(this.animationInterval);
		}

		// transition element
		const animation = this._shadowRoot.querySelector('.slider ul').animate(
			[
				// keyframes
				{ transform: 'translateX(0px)' },
				{ transform: `translateX(${+this.slideWidth}px)` }
			],
			{
				// timing options
				duration: this.animationDuration,
				easing: 'ease-in-out'
			}
		);

		// append new child
		animation.onfinish = () => {
			this._shadowRoot
				.querySelector('.slider ul')
				.prepend(
					this._shadowRoot.querySelector('.slider ul li:last-child')
				);
		};
	}

	moveRight(event: any = null) {
		if (event) {
			event.preventDefault();
			clearInterval(this.animationInterval);
		}

		// transition element
		const animation = this._slider.animate(
			[
				// keyframes
				{ transform: 'translateX(0px)' },
				{ transform: `translateX(-${+this.slideWidth}px)` }
			],
			{
				// timing options
				duration: this.animationDuration,
				easing: 'ease-in-out'
			}
		);

		animation.onfinish = () => {
			this._shadowRoot
				.querySelector('.slider ul')
				.append(
					this._shadowRoot.querySelector('.slider ul li:first-child')
				);
		};
	}

	watchPageVisibility() {
		let hidden = '';
		let visibilityChange = '';
		if (typeof this._document.hidden !== 'undefined') {
			hidden = 'hidden';
			visibilityChange = 'visibilitychange';
		} else if (typeof this._document.webkitHidden !== 'undefined') {
			hidden = 'webkitHidden';
			visibilityChange = 'webkitvisibilitychange';
		}

		if (typeof this._document[hidden] === 'undefined') {
			console.log(`Browser doesn't supports the Page Visibility API.`);
		} else {
			const eventHandler = () => {
				// if document is hidden don't stop the loop animation
				if (this._document.hidden) {
					clearInterval(this.animationInterval);
				}
			};
			// Handle page visibility change
			document.removeEventListener(visibilityChange, eventHandler);
			document.addEventListener(visibilityChange, eventHandler, false);
		}
	}

	lazyLoadImages() {
		const config = {
			rootMargin: '100% 100%',
			threshold: 0
		};

		// register the config object with an instance
		// of intersectionObserver
		let observer = new IntersectionObserver((entries, self) => {
			// iterate over each entry
			entries.forEach(entry => {
				// process just the images that are intersecting.
				// isIntersecting is a property exposed by the interface
				if (entry.isIntersecting) {
					// custom function that copies the path to the img
					// from data-src to src
					this.preloadImage(entry.target);

					// the image is now in place, stop watching
					self.unobserve(entry.target);
				}
			});
		}, config);

		const slides = this._shadowRoot.querySelectorAll('.slider ul li');
		slides.forEach((li: any) => {
			observer.observe(li);
		});
	}

	preloadImage(element: any) {
		const src: string = element
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

	typeOfImageToLoad(): string {
		const width = this._document.body.clientWidth;
		let typeOfImage = 'medium';
		if (width > 1000) typeOfImage = 'large';
		return typeOfImage;
	}
}
