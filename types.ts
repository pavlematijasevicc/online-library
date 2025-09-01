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

export type Rental={
  book_id: number,
  student_id: number
}

export type Person = {
  id: number;
  last_name: string;
  first_name?: string;
  name?:string
  username?:string
};
export interface OverdueRecord {
  rental_id: number
  book_title: string
  rental_date: string            
  rented_out_by: Person
  total_rental_days: number
  days_overdue: number
}

export type RentalRecord = {
  rental_id:number,
  active_days?: number;
  book_title: string;
  rental_date: string; // ISO string datuma
  rented_by: Person;
  rented_out_by: Person;
};

export type ReturnedRecord={
  rental_id:number,
  active_days: number;
  book_title: string;
  rental_date: string; 
  returned_by: Person;
  rented_out_by: Person;
  returned_at?:string
}

export type Reservation={
  book_id:number,
  student_id:number
}

export type Activity={
  rental_id:number,
  book_title:string,
  rental_date: string,
  librarian: string,
  student: string,
  student_username:string,
  role:number
  librarian_username:string
}

export type ActiveUser = {
  email: string;
  first_name: string;
  id: number;
  jmbg: string;
  last_login_at: string;
  last_name: string;
  login_count: number;
  profile_picture: string | null;
  role: string;
  username: string;
};