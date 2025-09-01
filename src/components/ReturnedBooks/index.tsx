import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import { visuallyHidden } from '@mui/utils'
import { getComparator, Order } from '@/utils/utiles'
import {
  fetchAllPolicies,
  getReturnedBooks,
  deleteAuthor,
} from '@/utils/apiService'
import { usePathname } from 'next/navigation'
import {
  Avatar,
  CircularProgress,
  Paper,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'

// Define the row type to match your API data
interface ReturnedBook {
  id: number
  student: { image: string; name: string }
  issuedDate: string
  returnedDate: string
  retention: string
  issuedOutBy: string
}

const headCells: { id: keyof ReturnedBook; label: string }[] = [
  { id: 'student', label: 'Izdato učeniku' },
  { id: 'issuedDate', label: 'Datum izdavanja' },
  { id: 'returnedDate', label: 'Datum vraćanja' },
  { id: 'retention', label: 'Zadržavanje knjige' },
  { id: 'issuedOutBy', label: 'Knjigu primio' },
]

interface EnhancedTableProps {
  order: Order
  orderBy: keyof ReturnedBook
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ReturnedBook
  ) => void
}

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof ReturnedBook) => (event: React.MouseEvent<unknown>) =>
      onRequestSort(event, property)

  return (
    <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
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


export default function ReturnedBooks() {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ReturnedBook>('issuedDate')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [returnedBooksData, setReturnedBooksData] = useState<any[]>([])
  const path = usePathname()
  const [bookId, setBookId] = useState<number>()

  useEffect(() => {
    if (path) {
      const parts = path.split('/')
      setBookId(Number(parts[2]))
    }
  }, [path])

  useEffect(() => {
    if (bookId) {
      setLoading(true)
      getReturnedBooks({ book_id: bookId, per_page: 20 })
        .then((res) => setReturnedBooksData(res.data.data))
        .finally(() => setLoading(false))
    }
  }, [bookId])

  const rows: ReturnedBook[] = returnedBooksData.map((book, index) => {
    const issuedDate = book.rental_date.split(' ')[0]
    const returnedDate = book.returned_at.split(' ')[0]

    // Calculate retention (days held)
    const retentionDays = Math.ceil(
      (new Date(book.returned_at).getTime() -
        new Date(book.rental_date).getTime()) /
        (1000 * 60 * 60 * 24)
    )

    console.log('Returned books:', returnedBooksData)

    return {
      id: index + 1,
      student: {
        image: '', // If you have an image URL, place it here
        name: `${book.returned_by.first_name} ${book.returned_by.last_name}`,
      },
      issuedDate,
      returnedDate,
      retention: `${retentionDays} dan(a)`,
      issuedOutBy: `${book.rented_out_by.first_name} ${book.rented_out_by.last_name}`,
    }
  })

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ReturnedBook
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const visibleRows = [...rows]
    .sort((a, b) => {
      if (orderBy === 'student') {
        return order === 'asc'
          ? a.student.name.localeCompare(b.student.name)
          : b.student.name.localeCompare(a.student.name)
      }
      return getComparator(order, orderBy)(a, b)
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '65%' }} className="mx-4">
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
                  <TableCell colSpan={headCells.length + 1} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      Trenutno nema vraćenih knjiga
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => (
                  <TableRow hover key={row.id}>
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
                    <TableCell>{row.returnedDate}</TableCell>
                    <TableCell>{row.retention}</TableCell>
                    <TableCell>{row.issuedOutBy}</TableCell>
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
