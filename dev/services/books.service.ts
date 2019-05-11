// import interfaces
import { ISearch } from '../interfaces/search.interface';
import { IBooks } from '../interfaces/books.interface';
import { IBooksValue } from '../interfaces/books.interface';

export class BooksService {
	_books: IBooksValue[] = [];

	constructor() {}

	get books(): IBooksValue[] {
		return this._books;
	}

	set books(books: IBooksValue[]) {
		this._books = books;
	}

	searchBooks(
		query: string = 'the lord of the rings',
		page: number = 1
	): Promise<ISearch> {
		const transformedQuery = query
			.toLowerCase()
			.split(' ')
			.join('+');
		return fetch(
			`http://openlibrary.org/search.json?title=${transformedQuery}&page=${page}`
		).then(response => response.json());
	}

	getBooks(isbnList: string[]): Promise<IBooks> {
		const transformedIsbn = isbnList.join(',ISBN:');
		return fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${transformedIsbn}&jscmd=data&format=json`
		).then(response => response.json());
	}

	getOnlyBooksWithCovers(books: IBooks) {
		const arrayBooks = Object.keys(books)
			.map(key => books[key])
			.filter(book => book.cover);
		return arrayBooks;
	}
}
