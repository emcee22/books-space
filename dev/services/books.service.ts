export class BooksService {
	_books: any[] = [];

	constructor() {}

	get books(): any[] {
		return this._books;
	}

	set books(books: any[]) {
		this._books = books;
	}

	searchBooks(query: string = 'the lord of the rings', page: number = 1) {
		const transformedQuery = query
			.toLowerCase()
			.split(' ')
			.join('+');
		return fetch(
			`http://openlibrary.org/search.json?title=${transformedQuery}&page=${page}`
		).then(response => response.json());
	}

	getBooks(isbnList: string[]) {
		const transformedIsbn = isbnList.join(',ISBN:');
		return fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${transformedIsbn}&jscmd=data&format=json`
		).then(response => response.json());
	}

	getOnlyBooksWithCovers(books: any) {
		const arrayBooks = Object.keys(books)
			.map(key => books[key])
			.filter(book => book.cover);
		return arrayBooks;
	}
}
