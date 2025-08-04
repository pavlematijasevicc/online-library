import { Button } from '@mui/material'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import LibrariansTable from '@/components/LibrariansTable'

export default function Librarians() {
  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1> Bibliotekari </h1>

      <div className="mt-11 mb-4">
        <Link href="/librarians/new-librarian">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mt-10 mb-7">
            <AddIcon className="mr-2" /> novi bibliotekar
          </Button>
        </Link>
      </div>
      <LibrariansTable />
    </div>
  )
}
