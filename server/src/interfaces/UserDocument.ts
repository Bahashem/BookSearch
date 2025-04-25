export interface UserDocument {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: Array<{
        bookId: string;
        authors: Array<string>;
        description: string;
        title: string;
        image: string;
        link: string;
    }>;
}