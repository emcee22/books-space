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

// call back for when we have a value set
const _document = <any>document;
const speechSearchEl = _document.querySelector('speech-search');
const booksCarouselEl = _document.querySelector('books-carousel');
const relativeTimeEl = _document.querySelector('relative-time');

// this will be called when we fill the input with some values
speechSearchEl.callback = (text: string) => {
	if (!text) {
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

	// make API call so we display the books
	const bookService = new BooksService();
	bookService.searchBooks(text).then(rsp => {
		// gather all isbn list from the list
		const isbnList: string[] = [];
		rsp.docs.forEach((doc: any) => {
			if (doc.isbn) {
				isbnList.push(doc.isbn[0]);
			}
		});

		// request all the books
		bookService.getBooks(isbnList).then(rsp => {
			// filter out books that don't have covers
			const onlyBooksWithCovers = bookService.filterBooksWithCovers(rsp);
			bookService.books = onlyBooksWithCovers;

			// send data to the carousel
			if (bookService.books.length) {
				booksCarouselEl.removeAttribute('hidden');
				booksCarouselEl.slides = bookService.books;
			} else {
				_document.querySelector('.no-results').style.display = 'flex';
			}

			// hide loading text
			_document.querySelector('.loading').style.display = 'none';
		});
	});
};

// set a default value
speechSearchEl.inputvalue = 'Javascript';

// add speech-search custom element
customElements.define('books-carousel', BooksCarousel);
