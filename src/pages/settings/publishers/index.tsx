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
import { createPublisher } from '@/utils/apiService'

export default function NewPublisher() {
  const [name, setName] = useState<string>('')
  const [showAlert, setShowAlert] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setName('')
    setSubmitted(false)
  }

  function handleAlert() {
    console.log('usao u alert')
    setShowAlert(true)
  }

  async function handleCreatePublisher(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const data = {
      name: name,
    }

    try {
      const res = await createPublisher(data)
      console.log('Izdavac kreiran:', res)
      handleAlert()
    } catch (error) {
      console.error('Greška prilikom kreiranja izdavaca:', error)
    }
  }

  return (
    <Box className="py-3 text-xl font-medium overflow-y-hidden">
      <Box className="px-4">
        <h1 className="capitalize"> Novi izdavac </h1>
        <Box className="mt-1 text-xs font-normal">
          <Link href={'/settings'}>
            <span className="text-blue">Settings</span>
          </Link>
          <span> / Novi izdavac</span>
        </Box>
      </Box>
      <Box
        className="mx-4 w-[724px]"
        component="form"
        onSubmit={handleCreatePublisher}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          paddingTop: '28px',
        }}
      >
        <TextField
          label="Unesite Naziv Izdavaca.."
          variant="outlined"
          className="w-[724px] mr-4"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
          sx={{ width: 720 }}
          error={submitted && name.length < 8}
          helperText={
            submitted && name.length < 8
              ? 'Ime mora imati bar 8 karaktera!'
              : null
          }
        />
        <Box className="flex ml-auto">
          <Button
            variant="contained"
            type="submit"
            className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
            onClick={handleCreatePublisher}
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
            Izdavac uspjesno kreiran!
          </Alert>
        )}
      </Box>
    </Box>
  )
}
