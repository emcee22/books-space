// import components
import { RelativeTime } from './components/relative-time/relative-time.component.js';
import { SpeechSearch } from './components/speech-search/speech-search.component.js';
import { BooksCarousel } from './components/books-carousel/books-carousel.component.js';

// import services
import { BooksService } from './services/books.service.js';

// add relative-time custom element
customElements.define('relative-time', RelativeTime);

// add speech-search custom element
customElements.define('speech-search', SpeechSearch);

// cache elements
const _document = <any>document;
const speechSearchEl = _document.querySelector('speech-search');
const booksCarouselEl = _document.querySelector('books-carousel');
const relativeTimeEl = _document.querySelector('relative-time');

// called when typing in the input
speechSearchEl.addEventListener(
	'speech-text-updated',
	async (event: CustomEvent) => {
		// check if we have text
		if (!event.detail) {
			return;
		}

		// show the loading text
		_document.querySelector('.loading').style.display = 'flex';

		// hide no results
		_document.querySelector('.no-results').style.display = 'none';

		// hide carousel
		booksCarouselEl.setAttribute('hidden', true);

		// reset the relative time
		relativeTimeEl.reset = true;

		// initialize the books service
		const bookService = new BooksService();

		// search for the books
		const foundBooks = await bookService.searchBooks(event.detail);

		// gather all isbn list from the list
		const isbnList: string[] = [];
		foundBooks.docs.forEach(doc => {
			if (doc.isbn) {
				isbnList.push(doc.isbn[0]);
			}
		});

		// get actual books data by provided isbn list
		const foundBooksDetails = await bookService.getBooks(isbnList);

		// hide loading
		_document.querySelector('.loading').style.display = 'none';

		// filter out books that don't have covers
		bookService.books = bookService.getOnlyBooksWithCovers(
			foundBooksDetails
		);

		// send data to the carousel
		if (bookService.books.length) {
			booksCarouselEl.removeAttribute('hidden');
			booksCarouselEl.slides = bookService.books;
		} else {
			_document.querySelector('.no-results').style.display = 'flex';
		}
	}
);

// set a default value
speechSearchEl.inputvalue = 'Javascript';

// add speech-search custom element
customElements.define('books-carousel', BooksCarousel);
