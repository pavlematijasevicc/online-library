import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createGenre, editGenre, fetchGenreById } from '@/utils/apiService'
import { usePathname } from 'next/navigation'
import { Genre } from '../../../../../types'

export default function EditGenre() {
  const [name, setName] = useState<string>('')
  const [showAlert, setShowAlert] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Genre | null>(null)
  const [id, setId] = useState<number | null>(null)
  const path = usePathname()

  useEffect(() => {
    if (path) {
      try {
        const parts = path.split('/')
        setId(Number(parts[3]))
      } catch (error) {
        console.error('Greška prilikom učitavanja kategorije:', error)
        setError('Nije moguće učitati kategoriju. Pokušajte ponovo kasnije.')
      }
    }
  }, [path])

  useEffect(() => {
    if (id !== null) {
      const loadCategory = async () => {
        const genre = await fetchGenreById(id)
        setData(genre)
      }
      loadCategory()
    }
  }, [id])

  useEffect(() => {
    if (data) {
      setName(data.name || '')
      setDescription(data.description || '')
    }
  }, [data])

  console.log('Data:', data)

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setName('')
    setDescription('')
    setSubmitted(false)
  }

  function handleAlert() {
    console.log('usao u alert')
    setShowAlert(true)
  }

  async function handleEditGenre(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    if (name.trim().length < 1 || description.trim().length < 1) return

    try {
      const payload = {
        name,
        description,
      }
      if (id) await editGenre(id, payload as Genre)
      setShowAlert(true)
    } catch (err) {
      setError('Greška prilikom izmjene zanra.')
    }
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="py-3 text-xl font-medium overflow-y-hidden">
      <Box className="px-4">
        <h1 className="capitalize"> {name} </h1>
        <Box className="mt-1 text-xs font-normal">
          <Link href={'/settings'}>
            <span className="text-blue">Settings</span>
          </Link>
          <span> / Izmjena zanra</span>
        </Box>
      </Box>
      <Box
        className="mx-4 w-[724px]"
        component="form"
        onSubmit={handleEditGenre}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          paddingTop: '28px',
        }}
      >
        <TextField
          label="Unesite Naziv Zanra.."
          variant="outlined"
          className="w-[724px] mr-4"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
          sx={{ width: 720 }}
          error={submitted && name.length < 1}
          helperText={
            submitted && name.length < 1 ? 'Ime ne moze biti prazno!' : null
          }
        />

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
            submitted && description.length < 1
              ? 'Opis ne moze biti prazan!'
              : null
          }
        />
        <Box className="flex ml-auto">
          <Button
            variant="contained"
            type="submit"
            className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
            onClick={handleEditGenre}
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
            Zanr uspjesno izmijenjen!
          </Alert>
        )}
      </Box>
    </Box>
  )
}
