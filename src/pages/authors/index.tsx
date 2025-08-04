import { Button, Link } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Table from '@/components/Table'

export default function Authors() {
  return (
    <div className="px-4 py-6 text-xl font-medium">
      <h1> Autori </h1>
      <Link href="/authors/new-author">
        <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mt-11 mb-7">
          <AddIcon className="mr-2" /> novi autor
        </Button>
      </Link>

      <Table />
    </div>
  )
}
