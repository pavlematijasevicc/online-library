import { Dispatch, SetStateAction } from "react";

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
    publisher_id: number | null
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
    id?: number
    name: string
    description: string
    icon?: File | null
    created_at?: string
    updated_at?: string
  }
  
  export interface Genre {
    id?: number;
    name: string;
    description: string;
    created_at?: string;  // ISO 8601 format
    updated_at?: string;  // ISO 8601 format
  }
  
  export type Props = {
    bookData: BookData
    setBookData: React.Dispatch<React.SetStateAction<BookData>>
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
    nameInputRef:  React.RefObject<HTMLInputElement | null>
  }

export interface Student {
  id?:number
  first_name: string
  last_name: string
  email: string
  username: string
  jmbg: string
  role_id: number | null
  password: string
  profile_picture?: File | null
}

export type StudentProps={
  data?: Student,
  setData?: Dispatch<SetStateAction<Student | undefined>>,
  nameInputRef:React.RefObject<HTMLInputElement | null>
}

export type Period={
  period:number
}

export type Binding = {
  bindings: string[]
}

export type Script={
  scripts: string[]
}

export type Dimensions={
  dimensions:string[]
}

export type BookOptions={
  bindings:string[],
  scripts:string[],
  dimensions:string[]
}

export type Publisher={
  publisher_id?:number,
  publisher_name:string
}


export type PublisherCreate={
  name:string
}

