import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import React, { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PhotoIcon from '@mui/icons-material/Photo'
import { checkIme } from '@/utils/utiles'
import { checkPrezime } from '@/utils/utiles'
import { createAuthor } from '@/utils/apiService'

export default function AuthorForm() {
  const [ime, setIme] = useState('')
  const [prezime, setPrezime] = useState('')
  const [opis, setOpis] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>('')
  const [ImeGreska, setImeGreska] = useState<string | null>(null)
  const [PrezimeGreska, setPrezimeGreska] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [image, setImage] = useState<File | null>(null)

  async function handleCreateAuthor(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    const imeError = checkIme(ime)
    const prezimeError = checkPrezime(prezime)

    setImeGreska(imeError)
    setPrezimeGreska(prezimeError)

    if (!imeError && !prezimeError) {
      const formData = new FormData()
      formData.append('first_name', ime)
      formData.append('last_name', prezime)
      formData.append('biography', opis)
      if (image) {
        formData.append('picture', image) // <- pravi fajl
      }

      try {
        const response = await createAuthor(formData)
        console.log('Author created:', response)
        // success
      } catch (error) {
        console.error('Error submitting form:', error)
        // show error
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
    }
  }

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setIme('')
    setPrezime('')
    setOpis('')
    setImage(null)
  }

  return (
    <Box
      component="form"
      onSubmit={handleCreateAuthor}
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
        label="Unesite Ime.."
        variant="outlined"
        value={ime}
        onChange={(e) => {
          setErrorMessage('')
          setIme(e.target.value)
          const error = checkIme(e.target.value)
          setImeGreska(error)
        }}
        sx={{ width: 720 }}
        error={submitted && (!!ImeGreska || errorMessage != '')}
        helperText={submitted && ImeGreska ? ImeGreska : ''}
      />
      {errorMessage && (
        <div className="text-red-600 mb-4 -mt-2">{errorMessage}</div>
      )}
      <TextField
        label="Unesite Prezime.."
        variant="outlined"
        value={prezime}
        onChange={(e) => {
          setErrorMessage('')
          setPrezime(e.target.value)
          const error = checkPrezime(e.target.value)
          setPrezimeGreska(error)
        }}
        sx={{ width: 720 }}
        error={submitted && (!!PrezimeGreska || errorMessage != '')}
        helperText={submitted && PrezimeGreska ? PrezimeGreska : ''}
      />
      <TextField
        label="Unesite Opis.."
        variant="outlined"
        value={opis}
        onChange={(e) => setOpis(e.target.value)}
        sx={{ width: 724 }}
        InputProps={{
          sx: { height: 212 },
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
