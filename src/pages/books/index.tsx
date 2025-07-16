import Navbar from '@/components/Navbar'
import SideMenu from '@/components/SideMenu'
import BookTable from '@/components/BookTable'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import Link from 'next/link'

export default function Books() {
  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1> Knjige </h1>

      <div className="mt-10 mb-4 w-[157px]">
        <Link href="/books/new-book">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mt-10 mb-4">
            <AddIcon className="mr-2" /> nova knjiga
          </Button>
        </Link>
      </div>

      <BookTable />
    </div>
  )
}
