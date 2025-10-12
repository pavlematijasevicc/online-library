import {
  getActiveReservations,
  getArchivedReservations,
} from '@/utils/apiService'
import { Box, Button, TextField } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import { visuallyHidden } from '@mui/utils'
import { getComparator, Order } from '@/utils/utiles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  CircularProgress,
  Paper,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import Link from 'next/link'

interface Data {
  id: number
  bookTitle: string
  reserved_at: string
  expires_at: string
  studentName: string
  status: string
}

const headCells: { id: keyof Data; label: string }[] = [
  { id: 'bookTitle', label: 'Naziv knjige' },
  { id: 'reserved_at', label: 'Datum rezervacije' },
  { id: 'expires_at', label: 'Rezervacija istice' },
  { id: 'studentName', label: 'Rezervaciju podnio' },
  { id: 'status', label: 'Status' },
]

interface EnhancedTableProps {
  order: Order
  orderBy: keyof Data
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
}

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) =>
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
        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  )
}

export type Reservation = {
  id: number
  book_id?: number
  status: 'rejected' | 'rented'
  reserved_at: string
  expires_at: string
  created_at?: string
  updated_at?: string
  book?: {
    id: number
    name: string
  }
  student: {
    id: number
    first_name?: string
    last_name?: string
    name?: string
  }
}

export default function PublicationArchivedReservations() {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('reserved_at')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadReservations = async () => {
      const rentals = await getArchivedReservations()
      console.log(rentals.reservations.data)
      const reservations = rentals.reservations.data
      setReservationsData(reservations)
    }

    loadReservations()
  }, [])

  console.log('arhivirane:', reservationsData)

  const rows: Data[] = reservationsData.map((res) => {
    const firstName = res.student.first_name ?? ''
    const lastName = res.student.last_name ?? ''

    return {
      id: res.id,
      bookTitle: res.book!.name,
      reserved_at: res.reserved_at.split(' ')[0],
      expires_at: res.expires_at.split(' ')[0],
      studentName: `${firstName} ${lastName}`.trim(),
      status: res.status,
    }
  })

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
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
        row.bookTitle.toLowerCase().includes(query) ||
        row.studentName.toLowerCase().includes(query)
      )
    })
  }, [rows, searchQuery])

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort((a, b) => {
          if (orderBy === 'bookTitle') {
            return order === 'asc'
              ? a.bookTitle.localeCompare(b.bookTitle)
              : b.bookTitle.localeCompare(a.bookTitle)
          }
          return getComparator(order, orderBy)(a, b)
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  )

  const handleIconClick = () => {
    inputRef.current?.focus()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
                  <TableCell colSpan={headCells.length + 1} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      Trenutno nema arhiviranih knjiga
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.bookTitle}</TableCell>
                    <TableCell>{row.reserved_at}</TableCell>
                    <TableCell>{row.expires_at}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>
                      {row.status === 'rejected' && (
                        <Button
                          variant="outlined"
                          className="text-sm font-normal px-3 py-2 border-red-500 text-red-500 rounded-4xl"
                        >
                          Odbijeno
                        </Button>
                      )}
                      {row.status === 'rented' && (
                        <Button
                          variant="outlined"
                          className="text-sm font-normal px-3 py-2 border-blue text-blue rounded-4xl"
                        >
                          Izdato
                        </Button>
                      )}
                      {row.status === 'cancelled' && (
                        <Button
                          variant="outlined"
                          className="text-sm font-normal px-3 py-2 border-orange-500 text-orange-500 rounded-4xl"
                        >
                          Otkazano
                        </Button>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {row.status === 'rented' && (
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
                                <Link href={`/publication/archived/${row.id}`}>
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
                      )}
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
