import { RelativeTime } from './components/relative-time/relative-time.component.js';
import { SpeechSearch } from './components/speech-search/speech-search.component.js';
import { BooksCarousel } from './components/books-carousel/books-carousel.component.js';
import { BooksService } from './services/books.service.js';
customElements.define('relative-time', RelativeTime);
customElements.define('speech-search', SpeechSearch);
const _document = document;
const speechSearchEl = _document.querySelector('speech-search');
const booksCarouselEl = _document.querySelector('books-carousel');
const relativeTimeEl = _document.querySelector('relative-time');
speechSearchEl.callback = (text) => {
    if (!text) {
        return;
    }
    _document.querySelector('.loading').style.display = 'flex';
    _document.querySelector('.no-results').style.display = 'none';
    booksCarouselEl.setAttribute('hidden', true);
    relativeTimeEl.reset = true;
    const bookService = new BooksService();
    bookService.searchBooks(text).then(rsp => {
        const isbnList = [];
        rsp.docs.forEach((doc) => {
            if (doc.isbn) {
                isbnList.push(doc.isbn[0]);
            }
        });
        bookService.getBooks(isbnList).then(rsp => {
            const onlyBooksWithCovers = bookService.filterBooksWithCovers(rsp);
            bookService.books = onlyBooksWithCovers;
            if (bookService.books.length) {
                booksCarouselEl.removeAttribute('hidden');
                booksCarouselEl.slides = bookService.books;
            }
            else {
                _document.querySelector('.no-results').style.display = 'flex';
            }
            _document.querySelector('.loading').style.display = 'none';
        });
    });
};
speechSearchEl.inputvalue = 'Javascript';
customElements.define('books-carousel', BooksCarousel);
//# sourceMappingURL=main.js.map