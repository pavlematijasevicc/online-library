import Image from 'next/image'
import slika from '@/../public/default.png'
import { fetchAuthorById } from '@/utils/apiService'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

//Promijeniti sliku da bude dinamicna kasnije

export default function showAuthor() {
  const [data, setData] = useState<any>()
  const [id, setId] = useState<number>()

  const path = usePathname()

  useEffect(() => {
    if (path) {
      let string = path.split('/')
      setId(Number(string[2]))
    }
  }, [path])

  console.log('Id:', id)

  useEffect(() => {
    if (id) {
      const loadAuthors = async () => {
        const author = await fetchAuthorById(id) //ISPRAVITI DA BUDE DINAMICNO
        //console.log('Author:', author)
        setData(author.author)
      }

      loadAuthors()
    }
  }, [id])

  console.log('Data', data)

  if (data)
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
