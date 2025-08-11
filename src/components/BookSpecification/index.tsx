import { checkIsbn, checkPages } from '@/utils/utiles'
import { CircularProgress, Typography } from '@mui/material'
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { BookData, BookOptions, Props } from '../../../types'
import { fetchAllBookOptions } from '@/utils/apiService'

export default function BookSpecification({
  bookData,
  setBookData,
  setValue,
  nameInputRef,
}: Props) {
  const [bookOptions, setBookOptions] = useState<BookOptions>()
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isbnError, setIsbnError] = useState<string | null>(null)
  const [pagesError, setPagesError] = useState<string | null>(null)

  useEffect(() => {
    const loadFormat = async () => {
      try {
        const options = await fetchAllBookOptions()
        console.log('Fetched scripts:', options)
        setBookOptions(options)
      } catch (error) {
        console.error('Greška prilikom učitavanja vrsta pisama:', error)
      }
    }

    loadFormat()
  }, [])

  async function handleCreateBookSpecification(e: React.FormEvent) {
    e.preventDefault()

    const isbnErr = checkIsbn(bookData.isbn)
    const pagesErr = checkPages(bookData.number_of_pages)

    setIsbnError(isbnErr)
    setPagesError(pagesErr)
    setSubmitted(true)

    if (pagesErr || isbnErr) {
      return // prekid ako ima grešaka
    }
    //nastavi dalje
    setValue((pre) => String(Number(pre) + 1))
  }
  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setBookData((pre: BookData) => ({
      ...pre,
      number_of_pages: null,
      script: '',
      binding: '',
      dimensions: '',
      isbn: '',
      language: '',
    }))
    setIsbnError(null)
    setPagesError(null)
    setSubmitted(false)
  }

  if (!bookOptions) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
        }}
      >
        <CircularProgress />
      </Box>
    )
  } else
    return (
      <Box
        component="form"
        onSubmit={handleCreateBookSpecification}
        sx={{
          width: 720,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          inputRef={nameInputRef}
          label="Unesite broj strana"
          variant="outlined"
          className="mb-4 -mt-2"
          value={
            bookData.number_of_pages !== null ? bookData.number_of_pages : ''
          }
          onChange={(e) => {
            setPagesError('')
            if (/^\d*$/.test(e.target.value)) {
              setBookData((pre: BookData) => ({
                ...pre,
                number_of_pages:
                  e.target.value === '' ? null : Number(e.target.value),
              }))
              const error = checkPages(
                e.target.value === '' ? null : Number(e.target.value)
              )
              setPagesError(error)
            }
          }}
          sx={{ width: 720 }}
          error={submitted && !!pagesError}
          helperText={submitted && pagesError ? pagesError : ''}
        />
        <FormControl sx={{ minWidth: 120 }} className="mb-3">
          <InputLabel id="script-select-label">Unesite vrstu pisma</InputLabel>
          <Select
            labelId="script-select-label"
            id="script-select"
            value={bookData.script !== null ? String(bookData.script) : ''}
            label="izdavač"
            onChange={(e) => {
              setBookData((pre: BookData) => ({
                ...pre,
                script: e.target.value,
              }))
            }}
          >
            {bookOptions.scripts.map((script: string) => (
              <MenuItem key={script} value={script}>
                {script}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} className="mb-3">
          <InputLabel id="binding-select-label">
            Unesite vrstu poveza
          </InputLabel>
          <Select
            labelId="binding-select-label"
            id="binding-select"
            value={bookData.binding !== null ? String(bookData.binding) : ''}
            label="izdavač"
            onChange={(e) => {
              setBookData((pre: BookData) => ({
                ...pre,
                binding: e.target.value,
              }))
            }}
          >
            {bookOptions.bindings.map((binding: string) => (
              <MenuItem key={binding} value={binding}>
                {binding}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} className="mb-3">
          <InputLabel id="dimensions-select-label">
            Unesite vrstu formata
          </InputLabel>
          <Select
            labelId="dimensions-select-label"
            id="dimensions-select"
            value={
              bookData.dimensions !== null ? String(bookData.dimensions) : ''
            }
            label="izdavač"
            onChange={(e) => {
              setBookData((pre: BookData) => ({
                ...pre,
                dimensions: e.target.value,
              }))
            }}
          >
            {bookOptions.dimensions.map((dimension: string) => (
              <MenuItem key={dimension} value={dimension}>
                {dimension}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Unesite jezik knjige"
          variant="outlined"
          value={bookData.language}
          className="mb-4"
          onChange={(e) => {
            setBookData((pre: BookData) => ({
              ...pre,
              language: e.target.value,
            }))
          }}
          sx={{ width: 720 }}
        />
        <TextField
          label="Unesite ISBN"
          variant="outlined"
          value={bookData.isbn}
          className="mb-4"
          onChange={(e) => {
            setIsbnError('')
            setBookData((pre: BookData) => ({
              ...pre,
              isbn: e.target.value,
            }))
            const error = checkIsbn(e.target.value)
            setIsbnError(error)
          }}
          sx={{ width: 720 }}
          error={submitted && !!isbnError}
          helperText={
            submitted && isbnError
              ? `${isbnError} (International Standard Book Number)`
              : 'International Standard Book Number'
          }
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
