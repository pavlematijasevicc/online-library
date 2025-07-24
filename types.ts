export type ApiResponse={
    message:string,
    access_token: string,
    token_type: string
}

export type logInData={
    email:string,
    password:string
}
export interface NewAuthorData {
    firstName: string;
    lastName: string;
    biography?: string;
    picture?: File | null;
  }

  export interface Author {
    id: number;
    first_name: string;
    last_name: string;
    biography?: string;
    picture?: string | null; 
  }
  
  export type FetchAuthorResponse = {
    author: Author;
  };

  export type FetchBookResponse={
    book: BookData;
  }
  export interface BookData {
    name: string
    description: string
    categories: string[]
    genres: string[]
    authors: number[]
    publishers: string[]
    year: number | null
    number_of_copies_available: number | null
    number_of_pages: number | null
    script: string
    binding: string
    dimensions: string
    isbn: string
    images: File[] | null,
    format: string,
    language:string
  }

  export interface Category {
    id: number
    name: string
    description: string
    icon: string | null
    created_at: string
    updated_at: string
  }
  
  export interface Genre {
    id: number;
    name: string;
    description: string;
    created_at: string;  // ISO 8601 format
    updated_at: string;  // ISO 8601 format
  }
  
  export type Props = {
    bookData: BookData
    setBookData: React.Dispatch<React.SetStateAction<BookData>>
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
    nameInputRef:  React.RefObject<HTMLInputElement | null>
  }