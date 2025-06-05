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
    firstName: string;
    lastName: string;
    biography?: string;
    picture?: string | null; 
  }