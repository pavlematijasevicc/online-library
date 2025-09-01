import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Link from 'next/link'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import { Avatar, Button } from '@mui/material'
import { getComparator, Order } from '@/utils/utiles'
import CloseIcon from '@mui/icons-material/Close'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import {
  deleteAuthor,
  fetchAllPolicies,
  getActiveRentals,
} from '@/utils/apiService'
import { usePathname } from 'next/navigation'
import { RentalRecord } from '../../../types'

interface IssuedBook {
  id: number
  student: { image: string; name: string }
  issuedDate: string
  durationHeld: string
  overdueDays: number
  issuedBy: string
}

const headCells = [
  { id: 'student', label: 'Izdato učeniku' },
  { id: 'issuedDate', label: 'Datum izdavanja' },
  { id: 'durationHeld', label: 'Trenutno zadržavanje knjige' },
  { id: 'overdueDays', label: 'Prekoračenje u danima' },
  { id: 'issuedBy', label: 'Knjigu izdao' },
] as const

interface EnhancedTableProps {
  order: Order
  orderBy: string
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IssuedBook
  ) => void
}

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof IssuedBook) => (event: React.MouseEvent<unknown>) =>
      onRequestSort(event, property)

  return (
    <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

type Policy = {
  id: number
  period: number
  name?: string
}

type PublishedBooksTableProps = {
  width: number
}

export default function PublishedBooksTable({
  width,
}: PublishedBooksTableProps) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof IssuedBook>('issuedBy')
  const [selected, setSelected] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState<number>()
  const [rentalData, setRentalData] = useState<RentalRecord[]>()
  const path = usePathname()
  const [policies, setPolicies] = useState<Policy[]>([])

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await fetchAllPolicies()
        setPolicies(data)
      } catch (err) {
        console.error('Greška prilikom učitavanja politika:', err)
      }
    }

    loadPolicies()
  }, [])

  console.log('policy:', policies)

  useEffect(() => {
    if (path) {
      try {
        let string = path.split('/')
        setId(Number(string[2]))
      } catch (error) {
        console.error('Greška prilikom učitavanja knjige:', error)
      }
    }
  }, [path])

  useEffect(() => {
    if (id) {
      console.log(id)
      const loadRentals = async () => {
        const rentals = await getActiveRentals({
          book_id: id,
          per_page: 20,
        })
        setRentalData(rentals.data.data)
      }
      loadRentals()
    }
  }, [id])

  console.log('rental data:', rentalData)

  const rows: IssuedBook[] = (rentalData ?? []).map((rental, index) => ({
    id: index + 1, // ili rental.rented_by.id ako je unikat
    student: {
      image: '', // ako nemaš sliku, može ostati prazan string
      name: `${rental.rented_by.first_name} ${rental.rented_by.last_name}`,
    },
    issuedDate: rental.rental_date.split(' ')[0],
    durationHeld: `${rental.active_days} dan(a)`, // ili pretvori u sedmice/dane
    overdueDays: Math.max(
      0,
      Number(rental.active_days) - Number(policies[0]?.period ?? 0)
    ),

    issuedBy: `${rental.rented_out_by.first_name} ${rental.rented_out_by.last_name}`,
  }))

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IssuedBook
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort((a, b) => {
          if (orderBy === 'student') {
            return order === 'asc'
              ? a.student.name.localeCompare(b.student.name)
              : b.student.name.localeCompare(a.student.name)
          }
          return getComparator(order, orderBy)(a, b)
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  )

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
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: width }} className="mx-4">
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 2} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      Trenutno nema izdatih knjiga
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => (
                  <TableRow hover key={row.id} tabIndex={-1}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={row.student.image}
                          alt={row.student.name}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography>{row.student.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.issuedDate}</TableCell>
                    <TableCell>{row.durationHeld}</TableCell>
                    <TableCell
                      sx={{
                        color: row.overdueDays > 0 ? 'error.main' : 'inherit',
                      }}
                    >
                      {row.overdueDays}
                    </TableCell>
                    <TableCell>{row.issuedBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
