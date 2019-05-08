export class BooksService {
    constructor() {
        this._books = [];
    }
    get books() {
        return this._books;
    }
    set books(books) {
        this._books = books;
    }
    searchBooks(query = 'the lord of the rings', page = 1) {
        const transformedQuery = query
            .toLowerCase()
            .split(' ')
            .join('+');
        return fetch(`http://openlibrary.org/search.json?title=${transformedQuery}&page=${page}`).then(response => response.json());
    }
    getBooks(isbnList) {
        const transformedIsbn = isbnList.join(',ISBN:');
        return fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${transformedIsbn}&jscmd=data&format=json`).then(response => response.json());
    }
    filterBooksWithCovers(books) {
        const arrayBooks = Object.keys(books)
            .map(key => books[key])
            .filter(book => book.cover);
        return arrayBooks;
    }
}
//# sourceMappingURL=books.service.js.map