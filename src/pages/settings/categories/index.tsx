import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useState } from 'react'
import Link from 'next/link'
import { createCategory } from '@/utils/apiService'

export default function NewCategory() {
  const [profile_picture, setProfilePicture] = useState<File | null>(null)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [showAlert, setShowAlert] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePicture(file)
    }
  }

  function handleAlert() {
    console.log('usao u alert')
    setShowAlert(true)
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const data = {
      name: name,
      description: description,
      icon: profile_picture,
    }

    try {
      const res = await createCategory(data)
      console.log('Kategorija kreirana:', res)
      handleAlert()
    } catch (error) {
      console.error('Greška prilikom kreiranja kategorije:', error)
    }
  }

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setDescription('')
    setName('')
    setProfilePicture(null)
    setSubmitted(false)
  }

  return (
    <Box className="py-3 text-xl font-medium overflow-y-hidden">
      <Box className="px-4">
        <h1 className="capitalize"> Nova kategorija </h1>
        <Box className="mt-1 text-xs font-normal">
          <Link href={'/settings'}>
            <span className="text-blue">Settings</span>
          </Link>
          <span> / Nova kategorija</span>
        </Box>
      </Box>
      <Box
        className="mx-4 w-[724px]"
        component="form"
        onSubmit={handleCreateCategory}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          paddingTop: '28px',
        }}
      >
        <Box className="flex">
          <TextField
            label="Unesite Naziv Kategorije.."
            variant="outlined"
            className="w-[607px] mr-4"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
            sx={{ width: 720 }}
            error={submitted && name.length < 1}
            helperText={
              submitted && name.length < 1 ? 'Unesite ime kategorije!' : null
            }
          />
          <Button
            variant="contained"
            className="bg-transparent border-1 border-inputB shadow-none w-[140px] h-[56px] hover:cursor-default relative"
            sx={{
              '& .MuiInputBase-root': {
                height: '48px',
              },
            }}
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
            {profile_picture ? (
              <img
                src={URL.createObjectURL(profile_picture)}
                alt="thumbnail"
                className="absolute inset-0 w-full h-full object-cover rounded-md z-0"
              />
            ) : (
              <div className="absolute flex flex-col justify-center items-center z-0">
                <ImageOutlinedIcon
                  sx={{ color: '#00000099' }}
                  className="mx-auto mb-1"
                />
                <span className="text-xs font-normal text-grey-text">
                  Add icon
                </span>
              </div>
            )}
          </Button>
        </Box>

        <TextField
          label="Unesite Opis.."
          variant="outlined"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          className="w-[724px]"
          sx={{
            '& .MuiInputBase-root': {
              height: '212px',
              alignItems: 'flex-start',
            },
          }}
          error={submitted && description.length < 1}
          helperText={
            submitted && description.length < 1 ? 'Unesite opis!' : null
          }
        />
        <Box className="flex ml-auto">
          <Button
            variant="contained"
            type="submit"
            className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
            onClick={handleCreateCategory}
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
        {showAlert && (
          <Alert
            className="mt-4"
            severity="success"
            onClose={() => setShowAlert(false)}
            variant="filled"
          >
            Kategorija uspjesno kreirana!
          </Alert>
        )}
      </Box>
    </Box>
  )
}
