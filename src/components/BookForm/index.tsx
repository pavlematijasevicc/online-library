import {
  Box,
  FormHelperText,
  OutlinedInput,
  TextField,
  Theme,
  useTheme,
} from '@mui/material'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Author, BookData, Category, Props, Genre } from '../../../types'
import {
  checkAuthors,
  checkBookName,
  checkDescription,
  checkQuantity,
} from '@/utils/utiles'
import {
  fetchAllAuthors,
  fetchAllCategories,
  fetchAllGenres,
} from '@/utils/apiService'
import { usePathname } from 'next/navigation'

export default function BookForm({
  bookData,
  setBookData,
  value,
  setValue,
  nameInputRef,
}: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [bookNameError, setBookNameError] = useState<string | null>(null)
  const [authorsError, setAuthorsError] = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [quantityError, setQuantityError] = useState<string | null>(null)
  const [dataCategories, setDataCategories] = useState<Category[]>([])
  const [dataGenres, setDataGenres] = useState<Genre[]>([])
  const [data, setData] = useState<Author[]>([])

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const authors = await fetchAllAuthors(20)
        setData(authors.data.data)
      } catch (error) {
        console.error('Greška prilikom učitavanja autora:', error)
      }
    }

    const loadCategories = async () => {
      try {
        const categories = await fetchAllCategories(20)
        setDataCategories(categories.categories.data)
      } catch (error) {
        console.error('Greška prilikom učitavanja kategorija:', error)
      }
    }

    const loadGenres = async () => {
      try {
        const genres = await fetchAllGenres(20)
        setDataGenres(genres.genres.data)
      } catch (error) {
        console.error('Greška prilikom učitavanja zanrova:', error)
      }
    }

    loadGenres()
    loadAuthors()
    loadCategories()
  }, [])

  console.log('Genres:', dataGenres)
  console.log('Categories: ', dataCategories)

  let names: string[] = []
  if (data && data.length > 0) {
    names = data.map((author) => `${author.first_name} ${author.last_name}`)
  }

  async function handleCreateBook(e: React.FormEvent) {
    e.preventDefault()

    const nameError = checkBookName(bookData.name)
    const descriptionErr = checkDescription(bookData.description)
    const authorsErr = checkAuthors(bookData.authors)
    const quantityErr = checkQuantity(bookData.number_of_copies_available)

    setBookNameError(nameError)
    setAuthorsError(authorsErr)
    setDescriptionError(descriptionErr)
    setQuantityError(quantityErr)
    setSubmitted(true)

    if (nameError || authorsErr || descriptionErr || quantityErr) {
      return // prekid ako ima grešaka
    }

    setValue((pre) => String(Number(pre) + 1))
  }

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setBookData((pre: BookData) => ({
      ...pre,
      name: '',
      description: '',
      categories: [],
      genres: [],
      publishers: [],
      authors: [],
      year: null,
      number_of_copies_available: null,
    }))
    setBookNameError(null)
    setSubmitted(false)
  }
  return (
    <Box
      component="form"
      onSubmit={handleCreateBook}
      sx={{
        width: 720,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TextField
        inputRef={nameInputRef}
        label="Unesite Naziv knjige.."
        variant="outlined"
        value={bookData.name && bookData.name}
        className="mb-3 -mt-2"
        onChange={(e) => {
          setBookNameError('')
          setBookData((pre: BookData) => ({
            ...pre,
            name: e.target.value,
          }))
          const error = checkBookName(e.target.value)
          setBookNameError(error)
        }}
        sx={{ width: 720 }}
        error={submitted && !!bookNameError}
        helperText={submitted && bookNameError ? bookNameError : ''}
      />
      <TextField
        label="Unesite kratak sadrzaj knjige.."
        className="mb-3"
        variant="outlined"
        value={bookData.description && bookData.description}
        onChange={(e) => {
          setDescriptionError('')
          setBookData((pre: BookData) => ({
            ...pre,
            description: e.target.value,
          }))
          const error = checkDescription(e.target.value)
          setDescriptionError(error)
        }}
        sx={{ width: 720 }}
        multiline
        InputProps={{
          sx: {
            height: 150,
            alignItems: 'flex-start',
          },
        }}
        error={submitted && !!descriptionError}
        helperText={submitted && descriptionError ? descriptionError : ''}
      />
      <FormControl sx={{ minWidth: 120 }} className="mb-3">
        <InputLabel id="category-select-label">Izaberite kategoriju</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          multiple
          value={bookData.categories || []}
          label="kategorija"
          onChange={(e) => {
            const {
              target: { value },
            } = e

            setBookData((prev: BookData) => ({
              ...prev,
              categories: typeof value === 'string' ? value.split(',') : value,
            }))
          }}
        >
          {dataCategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }} className="mb-3">
        <InputLabel id="demo-simple-select-helper-label">
          Izaberite zanr
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={bookData.genres && bookData.genres}
          label="zanr"
          multiple
          onChange={(e) => {
            const {
              target: { value },
            } = e

            const updatedGenres =
              typeof value === 'string' ? value.split(',') : value
            setBookData((pre: BookData) => ({
              ...pre,
              genres: updatedGenres,
            }))
          }}
        >
          {dataGenres.map((genre) => {
            return (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <FormControl className="mb-3" error={submitted && !!authorsError}>
        <InputLabel id="demo-multiple-name-label">Izaberite autore</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={bookData.authors}
          onChange={(e) => {
            const {
              target: { value },
            } = e

            // Convertuje sve stringove u brojeve ako treba
            const updatedAuthors = (
              typeof value === 'string' ? value.split(',') : value
            ).map(Number)

            setBookData((pre: BookData) => ({
              ...pre,
              authors: updatedAuthors,
            }))

            const error = checkAuthors(updatedAuthors)
            setAuthorsError(error || '')
          }}
          input={<OutlinedInput label="Name" />}
        >
          {data.map((author) => (
            <MenuItem key={author.id} value={author.id}>
              {author.first_name} {author.last_name}
            </MenuItem>
          ))}
        </Select>

        {submitted && authorsError && (
          <FormHelperText>{authorsError}</FormHelperText>
        )}
      </FormControl>

      <FormControl sx={{ minWidth: 120 }} className="mb-3">
        <InputLabel id="demo-simple-select-helper-label">
          Izaberite izdavaca
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={bookData.publishers && bookData.publishers}
          label="izdavac"
          multiple
          onChange={(e) => {
            const {
              target: { value },
            } = e

            const updatedPublishers =
              typeof value === 'string' ? value.split(',') : value
            setBookData((pre: BookData) => ({
              ...pre,
              publishers: updatedPublishers,
            }))
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Unesite godinu izdavanja.."
        variant="outlined"
        className="mb-3"
        value={bookData.year !== null ? bookData.year : ''}
        onChange={(e) => {
          const value = e.target.value
          if (/^\d*$/.test(value)) {
            // dozvoli samo cifre
            setBookData((pre: BookData) => ({
              ...pre,
              year: value === '' ? null : Number(value),
            }))
          }
        }}
        sx={{ width: 720 }}
      />
      <TextField
        label="Unesite kolicinu.."
        variant="outlined"
        className="mb-3"
        value={
          bookData.number_of_copies_available !== null
            ? bookData.number_of_copies_available
            : ''
        }
        onChange={(e) => {
          const value = e.target.value
          if (/^\d*$/.test(value)) {
            setBookData((pre: BookData) => ({
              ...pre,
              number_of_copies_available: value === '' ? null : Number(value),
            }))
            const error = checkQuantity(value === '' ? null : Number(value))
            setQuantityError(error)
          }
        }}
        sx={{ width: 720 }}
        error={submitted && !!quantityError}
        helperText={submitted && quantityError ? quantityError : ''}
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
        <Button
          variant="contained"
          type="button"
          className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-transparent self-end text-blue border-blue border-1"
          onClick={deleteFields}
        >
          <CloseIcon />
          Ponisti
        </Button>
      </Box>
    </Box>
  )
}
