// import interfaces
import { IBooksValue } from '../../interfaces/books.interface';

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
	_sliderContainer: any;
	_slides: IBooksValue[] = [];

	// slider configuration
	slideWidth: number = 0;
	animationDuration: number = 500;
	animationInterval: number; // holds the interval so we can clearInterval
	autoplayInterval: number = 3000;
	minimumSlideWidth: number = 150;
	maximumSlideWidth: number = 250;
	preferredSlidesPerPage: number = 6;

	constructor() {
		super();
		this._shadowRoot = this.attachShadow({ mode: 'open' });
		this._shadowRoot.appendChild(template.content.cloneNode(true));
		this._prevLink = this._shadowRoot.querySelector('a.control_prev');
		this._nextLink = this._shadowRoot.querySelector('a.control_next');
		this._sliderContainer = this._shadowRoot.querySelector('.slider');
		this._slider = this._shadowRoot.querySelector('.slider ul');
	}

	get slides() {
		return this._slides;
	}

	set slides(slides: IBooksValue[]) {
		this._slides = slides;
		this.createSlides();
		this.slideInit();
	}

	connectedCallback() {
		this._prevLink.addEventListener('click', this.moveLeft.bind(this));
		this._nextLink.addEventListener('click', this.moveRight.bind(this));
		this._window.addEventListener('resize', this.slideInit.bind(this));

		// call function that will stop the slider if we leave the page
		this.watchPageVisibility();
	}

	disconnectedCallback() {
		this._prevLink.removeEventListener('click', this.moveLeft.bind(this));
		this._nextLink.removeEventListener('click', this.moveRight.bind(this));
		this._window.removeEventListener('resize', this.slideInit.bind(this));
	}

	createSlides() {
		this._slider.innerHTML = '';
		this._slides.forEach((slide, index) => {
			let listItem = document.createElement('li');
			// book cover
			let image = document.createElement('img');
			image.setAttribute('data-src', slide.cover['medium']);
			// author
			let meta = document.createElement('div');
			let author = document.createElement('h6');
			author.innerHTML =
				slide.authors && slide.authors[0] ? slide.authors[0].name : '-';
			// title
			let title = document.createElement('p');
			title.innerHTML = slide.title;
			// add image
			listItem.appendChild(image);
			// add meta data (author and title)
			meta.appendChild(author);
			meta.appendChild(title);
			listItem.appendChild(meta);
			this._slider.appendChild(listItem);
		});
		// move last child to first spot in case we go left
		this._slider.prepend(
			this._shadowRoot.querySelector('.slider ul li:last-child')
		);
		// autoplay slider
		this.setAnimationInterval();
		this.removeAttribute('hidden');
	}

	slideInit() {
		// get slider width
		const sliderWidth = this._sliderContainer.offsetWidth;

		// calculate the slide width
		this.slideWidth = this.getSlideWidth(
			sliderWidth,
			this.preferredSlidesPerPage
		);

		// set all slide width
		this._shadowRoot
			.querySelectorAll('.slider ul li')
			.forEach((slide: any) => {
				slide.style.width = `${this.slideWidth}px`;
			});

		// get number of slides
		const slideCount = this._shadowRoot.querySelectorAll('.slider ul li')
			.length;

		// calculate total width
		const sliderUlWidth = slideCount * this.slideWidth;

		// set the total width for the wrapper of the slides
		this._slider.style.width = sliderUlWidth + 'px';
		this._slider.style.marginLeft = -this.slideWidth + 'px';

		// intersection observer that will load images lazy
		this.lazyLoadImages();
	}

	getSlideWidth(sliderWidth: number, preferredSlidesPerPage: number): number {
		const calcSlideWidth = sliderWidth / preferredSlidesPerPage;
		if (calcSlideWidth < this.minimumSlideWidth) {
			preferredSlidesPerPage -= 1;
			return this.getSlideWidth(sliderWidth, preferredSlidesPerPage);
		} else if (
			calcSlideWidth > this.maximumSlideWidth &&
			preferredSlidesPerPage > 1
		) {
			preferredSlidesPerPage += 1;
			return this.getSlideWidth(sliderWidth, preferredSlidesPerPage);
		}
		return calcSlideWidth;
	}

	setAnimationInterval() {
		clearInterval(this.animationInterval);
		this.animationInterval = setInterval(() => {
			this.moveRight();
		}, this.autoplayInterval);
	}

	moveLeft(event: any = null) {
		if (event) {
			event.preventDefault();
			clearInterval(this.animationInterval);
		}

		// transition element
		const animation = this._slider.animate(
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
			this._slider.prepend(
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
			this._slider.append(
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
				} else {
					this.setAnimationInterval();
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
}
