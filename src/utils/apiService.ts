import { ApiResponse, BookData, Category, FetchAuthorResponse, FetchBookResponse, Genre, logInData, NewAuthorData, Period, Publisher, PublisherCreate, Student } from "../../types";
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

 export const createStudent = async (data: Student) => {
  const formData = new FormData();

  formData.append('first_name', data.first_name);
  formData.append('last_name', data.last_name);
  formData.append('email', data.email);
  formData.append('username', data.username);
  formData.append('jmbg', data.jmbg);
  formData.append('role_id', String(data.role_id ?? ''));
  formData.append('password', data.password);

  if (data.profile_picture) {
    formData.append('profile_picture', data.profile_picture);
  }

  const response = await api.post('/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};


export async function getAllStudents(perPage = 20, searchValue = '', role_id= 1) {
  try {
    const response = await api.get('/users', {
      params: {
        role_id,
        per_page: perPage,
        search_value: searchValue
      }
    });
    return response.data;
  } catch (error) {
    console.error('Greška prilikom ispisivanja studenata:', error);
    throw error;
  }
}


export const deleteUser = async (id: number): Promise<any> => {
  try {
    const response = await api.delete('/users', {
      data: {
        users_id: [id], 
      },
    });

    console.log(`Korisnik sa ID-em: ${id} je obrisan.`);
    return response.data;
  } catch (error: any) {
    console.error(`Greška pri brisanju korisnika sa ID-em ${id}:`, error);
    throw error;
  }
};


export const viewUser= async (username: string):Promise<Student[]>=>{
  try{
    const response=await api.get(`users/${username}`);
    console.log(`Korisnik sa username-om: ${username} je prikazan.`);
    return response.data;
  }catch(error:any){
    console.error(`Greška pri prikazivanju korisnika sa username-om: ${username}:`, error);
    throw error;
  }
}

export const editUser = async (
     username:string,
     data: Student
    ): Promise<Student> => {
      try {
        const response = await api.patch(`/${username}/update`, data);
        console.log("Response data:",response.data)
        return response.data;
      } catch (error: any) {
        console.error(`Greska pri editovanju ucenika sa username-om: ${username}:`, error);
        throw error;
      }
    };
    
export const createLibrarian = async (data: Student) => {
  console.log('data to send:',data)

  const response = await api.post('/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const editPeriod=async(id: number, data:Period)=>{
  try{
    const response = await api.patch(`policies/${id}`, data, {
  headers: { "Content-Type": "application/json" }
});
    console.log("Response data:",response.data)
    return response.data;
    }
    catch(error:any){
        console.error(`Greska pri editovanju perioda ${id===2 ? 'rezervacije' : 'vracanja'}:`, error);
        throw error;
      } 
}

 export const fetchAllPolicies = async () => {
      try {
            const response = await api.get('/policies')
            return response.data;
          } catch (error: any) {
            console.error('Error fetching policies:', error);
            throw error;
          }
        };

export const createCategory=async(data:Category)=>{
 console.log('data to send:',data)

  const response = await api.post('/categories/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; 
}

export const deleteCategory = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/categories/${id}/destroy`);

    console.log(`Kategorija sa ID-em: ${id} je obrisan.`);
    return response.data;
  } catch (error: any) {
    console.error(`Greška pri brisanju kategorije sa ID-em ${id}:`, error);
    throw error;
  }
};


 export const editCategory = async (
      categoryId: number,
      data: Category
    ): Promise<Category> => {
      try {
        const response = await api.patch(`/categories/${categoryId}/update`, data);
        console.log("Response data:",response.data)
        return response.data;
      } catch (error: any) {
        console.error(`Greska pri editovanju kategorije sa ID-em ${categoryId}:`, error);
        throw error;
      }
    };

      export const fetchCategoryById = async (categoryId: number):  Promise<Category> => {
          try {
            const response = await api.get(`/categories/${categoryId}`);
            return response.data.category;
          } catch (error: any) {
            console.error(`Error fetching category with ID ${categoryId}:`, error);
            throw error;
          }
    };


    export const createGenre=async(data:Genre)=>{
 console.log('data to send:',data)

  const response = await api.post('/genres/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; 
}

export const deleteGenre = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/genres/${id}/destroy`);

    console.log(`Zanr sa ID-em: ${id} je obrisan.`);
    return response.data;
  } catch (error: any) {
    console.error(`Greška pri brisanju zanra sa ID-em ${id}:`, error);
    throw error;
  }
};

export const fetchGenreById = async (genreId: number):  Promise<Genre> => {
          try {
            const response = await api.get(`/genres/${genreId}`);
            return response.data.genre;
          } catch (error: any) {
            console.error(`Error fetching genre with ID ${genreId}:`, error);
            throw error;
          }
    };


    export const editGenre = async (
      genreId: number,
      data: Genre
    ): Promise<Genre> => {
      try {
        const response = await api.patch(`/genres/${genreId}/update`, data);
        console.log("Response data:",response.data)
        return response.data;
      } catch (error: any) {
        console.error(`Greska pri editovanju zanra sa ID-em ${genreId}:`, error);
        throw error;
      }
    };


     export const fetchAllBookOptions = async () => {
      try {
            const response = await api.get('/book-options')
            return response.data;
          } catch (error: any) {
            console.error('Error fetching book options:', error);
            throw error;
          }
        };



export const createPublisher=async(data:PublisherCreate)=>{
 console.log('data to send:',data)

  const response = await api.post('/publishers/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const fetchAllPublishers = async (perPage: number = 20) => {
  try {
    const response = await api.get('/publishers', {
      params: {
        per_page: perPage
      }
    });
    return response.data.publishers;
  } catch (error: any) {
    console.error('Error fetching publishers:', error);
    throw error;
  }
};

export const deletePublisher = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/publishers/${id}`);

    console.log(`Izdavac sa ID-em: ${id} je obrisan.`);
    return response.data;
  } catch (error: any) {
    console.error(`Greška pri brisanju izdavaca sa ID-em ${id}:`, error);
    throw error;
  }
};

export const fetchPublisherById = async (publisherId: number):  Promise<Publisher> => {
          try {
            const response = await api.get(`/publishers/${publisherId}`);
            return response.data;
          } catch (error: any) {
            console.error(`Error fetching publisher with ID ${publisherId}:`, error);
            throw error;
          }
    };

    export const editPublisher = async (
      publisherId: number | null,
      data: PublisherCreate
    ): Promise<Genre> => {
      try {
        const response = await api.patch(`/publishers/${publisherId}/update`, data);
        console.log("Response data:",response.data)
        return response.data;
      } catch (error: any) {
        console.error(`Greska pri editovanju izdavaca sa ID-em ${publisherId}:`, error);
        throw error;
      }
    };



  export {
    login,
}
