import Navbar from '@/components/Navbar'
import SideMenu from '@/components/SideMenu'
import BookTable from '@/components/BookTable'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import Link from 'next/link'
import { getAllBooks } from '@/utils/apiService'
import { useEffect, useState } from 'react'
import { ActiveUser } from '../../../types'
import useRole from '@/hooks/useRole'

export default function Books() {
  const role = useRole()
  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1 className={role === 'librarian' ? 'mb-11' : 'mb-22'}>Knjige</h1>
      {role === 'librarian' && (
        <div className="mb-4 w-[157px]">
          <Link href="/books/new-book">
            <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mt-10 mb-7">
              <AddIcon className="mr-2" /> nova knjiga
            </Button>
          </Link>
        </div>
      )}

      <BookTable role={role} />
    </div>
  )
}
