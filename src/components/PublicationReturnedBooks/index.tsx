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
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
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
  TextField,
  Typography,
} from '@mui/material'
import Link from 'next/link'

// Define the row type to match your API data
interface ReturnedBook {
  id: number
  book: { image: string; title: string }
  student: string
  issuedDate: string
  returnedDate: string
  retention: string
  issuedOutBy: string
}

const headCells: { id: keyof ReturnedBook; label: string }[] = [
  { id: 'book', label: 'Naziv knjige' },
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
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  )
}

export default function PublicationReturnedBooks() {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ReturnedBook>('issuedDate')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [returnedBooksData, setReturnedBooksData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    const res = getReturnedBooks({ per_page: 20 }).then((res) =>
      setReturnedBooksData(res.data.data)
    )
  }, [])

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const rows: ReturnedBook[] = returnedBooksData.map((book) => {
    const issuedDate = book.rental_date.split(' ')[0]
    const returnedDate = book.returned_at.split(' ')[0]

    // Calculate retention (days held)
    const retentionDays = Math.ceil(
      (new Date(book.returned_at).getTime() -
        new Date(book.rental_date).getTime()) /
        (1000 * 60 * 60 * 24)
    )

    return {
      id: book.rental_id,
      book: {
        image: '', // If you have an image URL, place it here
        title: book.book_title,
      },
      student: `${book.returned_by.first_name} ${book.returned_by.last_name}`,
      issuedDate,
      returnedDate,
      retention: `${retentionDays} dan(a)`,
      issuedOutBy: `${book.rented_out_by.first_name} ${book.rented_out_by.last_name}`,
    }
  })

  console.log('Returned books:', returnedBooksData)

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

  const filteredRows = React.useMemo(() => {
    if (!searchQuery) return rows
    return rows.filter((row) => {
      const query = searchQuery.toLowerCase()
      return (
        row.book.title.toLowerCase().includes(query) ||
        row.student.toLowerCase().includes(query)
      )
    })
  }, [rows, searchQuery])

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort((a, b) => {
          if (orderBy === 'book') {
            return order === 'asc'
              ? a.book.title.localeCompare(b.book.title)
              : b.book.title.localeCompare(a.book.title)
          }
          return getComparator(order, orderBy)(a, b)
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  const handleIconClick = () => {
    inputRef.current?.focus()
  }

  return (
    <Box sx={{ width: 1470 }} className="mx-4">
      <Box className="mb-4 ml-300 flex items-center justify-center">
        <TextField
          inputRef={inputRef}
          className="text-sm font-normal pt-1 height-[30px] pr-0 m-0 w-[140px]"
          label="Pretrazi knjige.."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
              height: 36,
            },
          }}
        />
        <SearchOutlinedIcon
          className="text-grey-text hover:cursor-pointer"
          onClick={handleIconClick}
        />
      </Box>
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
                          src={row.book.image}
                          alt={row.book.title}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography>{row.book.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.student}</TableCell>
                    <TableCell>{row.issuedDate}</TableCell>
                    <TableCell>{row.returnedDate}</TableCell>
                    <TableCell>{row.retention}</TableCell>
                    <TableCell>{row.issuedOutBy}</TableCell>
                    <TableCell align="right">
                      <Box
                        onClick={
                          openMenu === index
                            ? () => closeMenu()
                            : () => toggleMenu(index)
                        }
                      >
                        <MoreVertIcon className="hover:cursor-pointer" />
                        {openMenu === index && (
                          <>
                            <Box
                              className="fixed inset-0 bg-transparent"
                              onClick={() => setOpenMenu(null)}
                            ></Box>

                            <Box className="absolute w-[200px] -ml-50 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-99 text-left">
                              <Link href={`/publication`}>
                                <Box className="capitalize px-4 py-3 flex items-center">
                                  <DescriptionOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Pogledaj detalje
                                </Box>
                              </Link>
                            </Box>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
