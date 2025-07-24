import { checkIsbn, checkPages } from '@/utils/utiles'
import { Alert, Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { BookData, Props } from '../../../types'

export default function BookSpecification({
  bookData,
  setBookData,
  setValue,
  nameInputRef,
}: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isbnError, setIsbnError] = useState<string | null>(null)
  const [pagesError, setPagesError] = useState<string | null>(null)

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
      format: '',
      language: '',
    }))
    setIsbnError(null)
    setPagesError(null)
    setSubmitted(false)
  }
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
      <TextField
        label="Unesite vrstu pisma"
        variant="outlined"
        value={bookData.script && bookData.script}
        className="mb-4"
        onChange={(e) => {
          setBookData((pre: BookData) => ({
            ...pre,
            script: e.target.value,
          }))
        }}
        sx={{ width: 720 }}
      />
      <TextField
        label="Unesite vrstu poveza"
        variant="outlined"
        value={bookData.binding}
        className="mb-4"
        onChange={(e) => {
          setBookData((pre: BookData) => ({
            ...pre,
            binding: e.target.value,
          }))
        }}
        sx={{ width: 720 }}
      />
      <TextField
        label="Unesite vrstu formata"
        variant="outlined"
        value={bookData.format}
        className="mb-4"
        onChange={(e) => {
          setBookData((pre: BookData) => ({
            ...pre,
            format: e.target.value,
          }))
        }}
        sx={{ width: 720 }}
      />
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
