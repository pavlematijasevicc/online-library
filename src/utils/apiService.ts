import { ApiResponse, BookData, FetchAuthorResponse, FetchBookResponse, logInData, NewAuthorData } from "../../types";
import api from "./axios";

export const get = async(
    url:string, page=1
):Promise <ApiResponse>=>{
        const response=await api.get(url,{
            params: {page},
        })
        console.log(response.data)
        return response.data;
        
};

async function login(data: logInData) {
    try {
        const res = await api.post('/login', data)
        // Sacuvaj token u localStorage
        if(res.data.access_token){
         localStorage.setItem('access_token',res.data.access_token);
        }
        return res.data;
    } catch(error: any) {

        console.log("error:", error)
        return error.response.data.error;
    }
}

export const createAuthor = async (data: FormData) => {
    try {
        const response = await api.post('/authors/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('Error creating author:', error);
        throw error;
      }
    };
    
export const fetchAllAuthors = async (perPage = 20) => {
  try {
        const response = await api.get('/authors', {
        params: { per_page: perPage }
        });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching authors:', error);
        throw error;
      }
    };

export const fetchAuthorById = async (authorId: number):  Promise<FetchAuthorResponse> => {
      try {
        const response = await api.get(`/authors/${authorId}`);
        return response.data;
      } catch (error: any) {
        console.error(`Error fetching author with ID ${authorId}:`, error);
        throw error;
      }
};


export const editAuthor = async (
  authorId: number,
  data: any
): Promise<any> => {
  try {
    const response = await api.patch(`/authors/${authorId}/update`, data);
    console.log("Response data:",response.data)
    return response.data;
  } catch (error: any) {
    console.error(`Greska pri editovanju autora sa ID-em ${authorId}:`, error);
    throw error;
  }
};

export const deleteAuthor = async (authorId: number): Promise<any> => {
  try {
    const response = await api.delete(`/authors/${authorId}/destroy`);
    console.log(`Autor sa ID-em ${authorId} je obrisan.`);
    return response.data;
  } catch (error: any) {
    console.error(`Greška pri brisanju autora sa ID-em ${authorId}:`, error);
    throw error;
  }
};

export const createBook = async (data: any) => {
  const response = await api.post('/books/create', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export async function getAllBooks(perPage = 20, searchValue = '') {
  try {
    const response = await api.get('/books', {
      params: {
        per_page: perPage,
        search_value: searchValue
      }
    });
    return response.data;
  } catch (error) {
    console.error('Greška prilikom dohvaćanja knjiga:', error);
    throw error;
  }
}

export const deleteBook = async (bookId: number): Promise<any> => {
  try {
    const response = await api.delete(`/books/${bookId}/destroy`);
    console.log(`Knjiga sa ID-em ${bookId} je obrisana.`);
    return response.data;
  } catch (error: any) {
    console.error(`Greška pri brisanju knjige sa ID-em ${bookId}:`, error);
    throw error;
  }
};
    

export const fetchAllCategories = async (perPage = 20) => {
  try {
        const response = await api.get('/categories', {
        params: { per_page: perPage }
        });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    };

    export const fetchAllGenres = async (perPage = 20) => {
      try {
            const response = await api.get('/genres', {
            params: { per_page: perPage }
            });
            return response.data;
          } catch (error: any) {
            console.error('Error fetching genres:', error);
            throw error;
          }
        };

        export const fetchBookById = async (bookId: number):  Promise<FetchBookResponse> => {
          try {
            const response = await api.get(`/books/${bookId}`);
            return response.data;
          } catch (error: any) {
            console.error(`Error fetching book with ID ${bookId}:`, error);
            throw error;
          }
    };

    export const editBook = async (
      bookId: number,
      data: BookData
    ): Promise<BookData> => {
      try {
        const response = await api.patch(`/books/${bookId}/update`, data);
        console.log("Response data:",response.data)
        return response.data;
      } catch (error: any) {
        console.error(`Greska pri editovanju knjige sa ID-em ${bookId}:`, error);
        throw error;
      }
    };

export {
    login,
}