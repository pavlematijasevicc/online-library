import { ApiResponse, FetchAuthorResponse, logInData, NewAuthorData } from "../../types";
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


    

export {
    login,
}