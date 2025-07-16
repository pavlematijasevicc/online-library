import { Alert, Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { BookData } from '../../../types'
import { Props } from '../../../types'
import { createBook } from '@/utils/apiService'

export default function Multimedia({
  bookData,
  setBookData,
  nameInputRef,
}: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validImages = files.filter((file) => file.type.startsWith('image/'))

    setBookData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...validImages],
    }))
  }

  function handleAlert() {
    console.log('usao u alert')
    setShowAlert(true)
  }

  const deleteFields = (e: React.FormEvent) => {
    e.preventDefault()
    setBookData((prev) => ({
      ...prev,
      images: null,
    }))
    setSubmitted(false)
    setShowAlert(false)
  }

  const handleMultimediaConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    let base64Images: string[] = []

    if (bookData.images && bookData.images.length > 0) {
      const convertImagesToBase64 = async (files: File[]) => {
        const promises = files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        })
        return await Promise.all(promises)
      }

      base64Images = await convertImagesToBase64(bookData.images)
    }

    const filteredBookData = Object.entries(bookData).reduce(
      (acc, [key, value]) => {
        const isEmptyArray = Array.isArray(value) && value.length === 0
        const isEmptyString = typeof value === 'string' && value.trim() === ''
        const isNullOrUndefined = value === null || value === undefined

        if (!isEmptyArray && !isEmptyString && !isNullOrUndefined) {
          acc[key as keyof BookData] = value
        }

        return acc
      },
      {} as Partial<BookData>
    )

    // 2. Uključi konvertovane slike samo ako ih ima
    const dataToSend = {
      ...filteredBookData,
      ...(base64Images.length > 0 && { images: base64Images }),
    }

    console.log('Data to send:', dataToSend)

    try {
      const response = await createBook(dataToSend)
      console.log('Book created successfully:', response)
    } catch (err) {
      console.error('Error while saving book:', err)
      setShowAlert(true)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleMultimediaConfirmation}
      sx={{
        width: 724,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        className="bg-transparent border-1 border-inputB shadow-none w-[724px] h-[234px] hover:cursor-default relative"
      >
        <TextField
          id="file-upload"
          type="file"
          placeholder="Add photo"
          className="hidden"
          inputProps={{ accept: '.jpg,.jpeg,.png', multiple: true }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="w-full h-full absolute top-0 left-0 z-50 cursor-pointer"
        ></label>

        {bookData.images && bookData.images.length > 0 ? (
          <Box
            className="absolute inset-0 w-full h-full overflow-auto p-2 grid grid-cols-3 gap-2"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          >
            {bookData.images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`image-${idx}`}
                className="w-full h-[100px] object-cover rounded-md"
              />
            ))}
          </Box>
        ) : (
          <div className="absolute flex flex-col justify-center items-center w-full h-full z-0">
            <ImageOutlinedIcon
              sx={{ color: '#00000099' }}
              className="mx-auto mb-1"
            />
            <span className="text-base font-normal text-grey-text">
              Drag your files here or click in this area.
            </span>
          </div>
        )}
      </Button>

      <Box className="flex ml-auto">
        <Button
          variant="contained"
          type="submit"
          className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
        >
          <CheckIcon />
          Sačuvaj
        </Button>
        <Button
          variant="contained"
          type="button"
          className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-transparent self-end text-blue border-blue border-1"
          onClick={deleteFields}
        >
          <CloseIcon />
          Poništi
        </Button>
      </Box>
      {showAlert && (
        <Alert
          className="mt-4"
          severity="success"
          onClose={() => setShowAlert(false)}
          variant="filled"
        >
          Knjiga uspjesno kreirana!
        </Alert>
      )}
    </Box>
  )
}
