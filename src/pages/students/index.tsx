import { Button } from '@mui/material'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import StudentsTable from '@/components/StudentsTable'

export default function Students() {
  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1> Ucenici </h1>

      <div className="mt-11 mb-4 w-[157px]">
        <Link href="/students/new-student">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mt-10 mb-7">
            <AddIcon className="mr-2" /> novi ucenik
          </Button>
        </Link>
      </div>
      <StudentsTable />
    </div>
  )
}
