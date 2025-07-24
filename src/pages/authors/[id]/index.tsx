import Image from 'next/image'
import slika from '@/../public/default.png'
import {
  createAuthor,
  deleteAuthor,
  editAuthor,
  fetchAuthorById,
} from '@/utils/apiService'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Author } from '../../../../types'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Link from 'next/link'
import { checkIme, checkPrezime } from '@/utils/utiles'
import CheckIcon from '@mui/icons-material/Check'
import PhotoIcon from '@mui/icons-material/Photo'
import { useRouter } from 'next/router'

export default function ShowAuthor() {
  const [data, setData] = useState<Author>()
  const [id, setId] = useState<number>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [description, setDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [surnameError, setSurnameError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [image, setImage] = useState<File | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [editMode, setEditMode] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const path = usePathname()
  let router = useRouter()

  useEffect(() => {
    setLoading(true)
    if (path) {
      try {
        let string = path.split('/')
        setId(Number(string[2]))
      } catch (error) {
        console.error('Greška prilikom učitavanja autora:', error)
        setError('Nije moguće učitati autora. Pokušajte ponovo kasnije.')
      } finally {
        setLoading(false)
      }
    }
  }, [path])

  useEffect(() => {
    if (id) {
      const loadAuthors = async () => {
        const author = await fetchAuthorById(id)
        setData(author.author)

        setName(author.author.first_name)
        setSurname(author.author.last_name)
        setDescription(author.author.biography || '')
      }

      loadAuthors()
    }
  }, [id])

  console.log('Data', data)

  const handleEditAuthor = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    // Validacija (opcionalno)
    if (!name || !surname || nameError || surnameError) {
      setErrorMessage('Popunite ispravno sva polja.')
      return
    }

    const data = {
      first_name: name,
      last_name: surname,
      biography: description,
      picture: image,
    }

    try {
      if (id) {
        const result = await editAuthor(id, data)
        console.log('Uspješno ažurirano:', result)
        setShowAlert(true)
      }
    } catch (err: any) {
      setErrorMessage('Došlo je do greške pri ažuriranju autora.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
    }
  }

  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  const handleEditClick = () => {
    setEditMode(true)
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  const handleDeleteAuthor = async () => {
    setShowDeleteModal(false)
    try {
      if (id) {
        await deleteAuthor(id)
        router.push('/authors')
      }
    } catch (err) {
      alert('Greška pri brisanju autora.')
    }
  }

  if (error) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="body1"
          color="error"
          sx={{ mt: 4, textAlign: 'center' }}
        >
          {error}
        </Typography>
      </Box>
    )
  } else if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          padding: '50px',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  } else if (data)
    return (
      <div className="px-4 py-3 text-xl font-medium ">
        <div className="flex justify-between items-center">
          <div className="max-w-[463px]">
            <h1 className="capitalize">
              {data.first_name} {data.last_name}
            </h1>
            <div className="mt-1 text-xs font-normal">
              <span className="text-blue">Evidencija autora</span>
              <span> / </span>
              <span className="text-blue">ID-{data.id}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div
              className="px-2 pl-3 pr-4 text-grey-text text-sm border-r-1 border-grey-line mr-4 hover:cursor-pointer"
              onClick={handleEditClick}
            >
              <CreateOutlinedIcon sx={{ width: '18px', height: '18px' }} />
              <span> Izmjeni podatke </span>
            </div>

            <div onClick={() => toggleMenu()}>
              <MoreVertIcon className="text-grey-text hover:cursor-pointer" />
            </div>

            {openMenu === true && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-transparent"
                  onClick={() => setOpenMenu(false)}
                ></div>
                <div className="absolute w-[320px] -ml-32 mt-30 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-90 text-left">
                  <div
                    className="capitalize px-4 py-3 hover:cursor-pointer"
                    onClick={() => {
                      setShowDeleteModal(true)
                      setOpenMenu(false)
                    }}
                  >
                    <DeleteOutlineIcon
                      sx={{
                        width: '20px',
                        height: '20px',
                      }}
                      className="mr-1"
                    />
                    Izbrisi autora
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Box
          component="form"
          onSubmit={handleEditAuthor}
          sx={{
            width: 720,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingTop: '28px',
          }}
        >
          <Button
            variant="contained"
            className="bg-transparent border-1 border-inputB shadow-none w-50 h-40 hover:cursor-default relative"
          >
            <TextField
              id="file-upload"
              type="file"
              placeholder="Add photo"
              className="hidden hover:cursor-pointer"
              inputProps={{ accept: '.jpg,.jpeg,.png' }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="w-full h-full bg-transparent shadow-none hover:cursor-pointer z-999"
            ></label>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="thumbnail"
                className="absolute inset-0 w-full h-full object-cover rounded-md z-0"
              />
            ) : (
              <div className="absolute flex flex-col justify-center items-center w-full h-full z-0">
                <PhotoIcon color="disabled" className="mx-auto mb-1" />
                <span className="text-base font-normal text-grey-text">
                  Add photo
                </span>
              </div>
            )}
          </Button>

          <TextField
            inputRef={nameInputRef}
            label="Unesite Ime.."
            variant="outlined"
            value={name}
            onChange={(e) => {
              setErrorMessage('')
              setName(e.target.value)
              const error = checkIme(e.target.value)
              setNameError(error)
            }}
            sx={{ width: 720 }}
            error={submitted && (!!nameError || errorMessage != '')}
            helperText={submitted && nameError ? nameError : ''}
          />

          {errorMessage && (
            <div className="text-red-600 mb-4 -mt-2">{errorMessage}</div>
          )}
          <TextField
            label="Unesite Prezime.."
            variant="outlined"
            value={surname}
            onChange={(e) => {
              setErrorMessage('')
              setSurname(e.target.value)
              const error = checkPrezime(e.target.value)
              setSurnameError(error)
            }}
            sx={{ width: 720 }}
            error={submitted && (!!surnameError || errorMessage != '')}
            helperText={submitted && surnameError ? surnameError : ''}
          />
          <TextField
            label="Unesite Opis.."
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: 724 }}
            multiline
            InputProps={{
              sx: {
                height: 212,
                alignItems: 'flex-start',
              },
            }}
          />

          <Box className="flex ml-auto">
            <Button
              variant="contained"
              type="submit"
              className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
            >
              <CheckIcon />
              Sacuvaj
            </Button>
          </Box>
          {showAlert && (
            <Alert
              className="mt-4"
              severity="success"
              onClose={() => setShowAlert(false)}
              variant="filled"
            >
              Autor uspjesno izmijenjen!
            </Alert>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 z-99 flex items-center justify-center">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setShowDeleteModal(false)}
              ></div>

              {/* Modal box */}
              <div className="z-50 bg-white p-6 rounded-xl shadow-lg w-[320px] relative text-center">
                <p className="text-gray-800 text-base font-medium mb-6">
                  Da li ste sigurni da želite da obrišete autora?
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleDeleteAuthor()}
                    className="uppercase w-[124px] text-sm font-medium py-2 px-4 bg-blue text-white rounded hover:bg-blue-500 transition-colors duration-200 hover:cursor-pointer"
                  >
                    Potvrdi
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="uppercase w-[124px] bg-blue text-sm font-medium py-2 px-4 text-white rounded hover:cursor-pointer hover:bg-blue-500 transition-colors duration-200"
                  >
                    Poništi
                  </button>
                </div>
              </div>
            </div>
          )}
        </Box>
      </div>
    )
}
