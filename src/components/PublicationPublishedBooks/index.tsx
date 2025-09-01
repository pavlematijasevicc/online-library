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
import { Avatar, Button, TextField } from '@mui/material'
import { getComparator, Order } from '@/utils/utiles'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  deleteAuthor,
  fetchAllPolicies,
  getActiveRentals,
} from '@/utils/apiService'
import { usePathname } from 'next/navigation'
import { RentalRecord } from '../../../types'

interface IssuedBook {
  id: number
  book: { image: string; title: string }
  student: string
  issuedDate: string
  durationHeld: string
  issuedBy: string
}

const headCells = [
  { id: 'book', label: 'Naziv knjige' },
  { id: 'student', label: 'Izdato uceniku' },
  { id: 'issuedDate', label: 'Datum izdavanja' },
  { id: 'durationHeld', label: 'Trenutno zadržavanje knjige' },
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
        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  )
}

export default function PublicationPublishedBooks() {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof IssuedBook>('issuedBy')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [rentalData, setRentalData] = useState<RentalRecord[]>()
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadRentals = async () => {
      const rentals = await getActiveRentals({
        per_page: 20,
      })
      setRentalData(rentals.data.data)
    }
    loadRentals()
  }, [])

  console.log('rental data:', rentalData)

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const rows: IssuedBook[] = (rentalData ?? []).map((rental) => ({
    id: rental.rental_id,
    book: {
      image: '', // ako nemaš sliku, može ostati prazan string
      title: rental.book_title,
    },
    student: `${rental.rented_by.first_name} ${rental.rented_by.last_name}`,
    issuedDate: rental.rental_date.split(' ')[0],
    durationHeld: `${rental.active_days} dan(a)`, // ili pretvori u sedmice/dane
    issuedBy: `${rental.rented_out_by.first_name} ${rental.rented_out_by.last_name}`,
  }))

  const filteredRows = React.useMemo(() => {
    if (!searchQuery) return rows
    return rows.filter((row) => {
      const query = searchQuery.toLowerCase()
      return (
        row.book.title.toLowerCase().includes(query) ||
        row.student.toLowerCase().includes(query) ||
        row.issuedBy.toLowerCase().includes(query)
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

  const handleIconClick = () => {
    inputRef.current?.focus()
  }

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
                          src={row.book.image}
                          alt={row.book.title}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography>{row.book.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.student}</TableCell>
                    <TableCell>{row.issuedDate}</TableCell>
                    <TableCell>{row.durationHeld}</TableCell>

                    <TableCell>{row.issuedBy}</TableCell>
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
                              <Link href={`/publication/${row.id}`}>
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
