import Image from 'next/image'
import slika from '@/../public/default.png'
import { fetchAuthorById } from '@/utils/apiService'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Author } from '../../../../types'
import { Box, CircularProgress, Typography } from '@mui/material'

//Promijeniti sliku da bude dinamicna kasnije

export default function ShowAuthor() {
  const [data, setData] = useState<Author>()
  const [id, setId] = useState<number>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const path = usePathname()

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
      }

      loadAuthors()
    }
  }, [id])

  console.log('Data', data)

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
          minHeight: '300px', // da loader ne bude sabijen
        }}
      >
        <CircularProgress />
      </Box>
    )
  } else if (data)
    return (
      <div className="px-4 py-3 text-xl font-medium max-w-[463px]">
        <h1 className="capitalize">
          {data.first_name} {data.last_name}
        </h1>
        <div className="mt-1 text-xs font-normal">
          <span className="text-blue">Evidencija autora</span>
          <span> / </span>
          <span className="text-blue">ID-{data.id}</span>
        </div>
        <div className="mt-7 flex flex-col">
          <Image
            alt="slika korisnika"
            src={slika}
            width={200}
            height={160}
            className="mb-8"
          />
          <span className="text-grey-text font-normal text-base mb-2">
            Ime i Prezime
          </span>
          <span className="font-normal text-base mb-8">
            {data.first_name} {data.last_name}
          </span>
          <span className="text-grey-text font-normal text-base mb-2">
            Opis
          </span>
          <span className="font-normal text-base">
            {data.biography
              ? data.biography
              : 'Nema podataka o biografiji autora.'}
          </span>
        </div>
      </div>
    )
}
