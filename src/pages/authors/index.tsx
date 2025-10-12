import { Button, Link } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Table from '@/components/Table'
import { useEffect, useState } from 'react'
import { ActiveUser } from '../../../types'
import useRole from '@/hooks/useRole'

export default function Authors() {
  const role = useRole()

  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1 className={role === 'librarian' ? 'mb-11' : 'mb-22'}>Autori</h1>
      {role === 'librarian' && (
        <Link href="/authors/new-author">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mb-7">
            <AddIcon className="mr-2" /> novi autor
          </Button>
        </Link>
      )}

      <Table role={role} />
    </div>
  )
}
