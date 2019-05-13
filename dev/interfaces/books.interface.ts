interface IPublishers {
    name: string;
}

interface IAuthors {
    url: string;
    name: string;
}

interface ICover {
    large: string;
    medium: string;
    small: string;
}

export interface IBooksValue {
    authors: IAuthors[];
    key: string;
    publish_date: string;
    publishers: IPublishers[];
    subtitle: string;
    title: string;
    url: string;
    cover: ICover;
}

export interface IBooks {
    [propName: string]: IBooksValue;
}
