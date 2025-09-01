import { Box, Link } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import book from '../../../../public/book.jpg'
import Image from 'next/image'

export default function ViewPublicationBook() {
  const path = usePathname()
  const [id, setId] = useState<number>()
  useEffect(() => {
    if (path) {
      try {
        let string = path.split('/')
        setId(Number(string[2]))
      } catch (error) {
        console.error('Greška prilikom učitavanja transakcije:', error)
      }
    }
  }, [path])

  console.log('id:', id)

  return (
    <Box className="px-4 py-3 text-xl font-medium ">
      <Box className="flex justify-between items-center">
        <Box className="max-w-[463px]">
          <h1 className="capitalize"></h1>
          <Box className="mt-1 text-xs font-normal">
            <Link href={'/publication'}>
              <span className="text-blue">Evidencija knjiga</span>
            </Link>
            <span> / </span>
            <span className="text-blue">Knjiga-</span>
            <span> / </span>
            <span className="text-blue">ID-{id}</span>
          </Box>
        </Box>
      </Box>
      <Box>
        <Image alt="profilna slika" src={book} className="mt-6 w-[132px]" />
        <Box className="mb-8 text-base font-normal flex flex-col mt-8">
          <span className="text-grey-text mb-2"> Tip transakcije </span>
          <span className="text-mytext"></span>
        </Box>
        <Box className="mb-8 text-base font-normal flex flex-col">
          <span className="text-grey-text mb-2"> Datum akcije </span>
          <span className="text-mytext"> </span>
        </Box>
        <Box className="mb-8 text-base font-normal flex flex-col mt-8">
          <span className="text-grey-text mb-2">
            {' '}
            Trenutno zadrzavanje knjige{' '}
          </span>
          <span className="text-blue"> </span>
        </Box>
        <Box className="mb-8 text-base font-normal flex flex-col mt-8">
          <span className="text-grey-text mb-2"> Prekoracenje </span>
          <span className="text-mytext"> </span>
        </Box>
        <Box className="mb-8 text-base font-normal flex flex-col mt-8">
          <span className="text-grey-text mb-2"> Bibliotekar </span>
          <span className="text-mytext"> </span>
        </Box>
        <Box className="mb-8 text-base font-normal flex flex-col mt-8">
          <span className="text-grey-text mb-2"> Ucenik </span>
          <span className="text-mytext"> </span>
        </Box>
      </Box>
    </Box>
  )
}
