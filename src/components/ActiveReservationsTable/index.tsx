import {
  confirmReservation,
  createRentalFromReservation,
  getActiveReservations,
  rejectReservation,
} from '@/utils/apiService'
import { Box, Button } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import { visuallyHidden } from '@mui/utils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { getComparator, Order } from '@/utils/utiles'
import {
  CircularProgress,
  Paper,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import Link from 'next/link'

// Define the row type to match your API data
interface Data {
  id: number
  book_id: number
  student_id: number
  reserved_at: string
  expires_at: string
  studentName: string
  status: string
}

const headCells: { id: keyof Data; label: string }[] = [
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
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  )
}

type ActiveReservationsProps = {
  id: number
}

export type Reservation = {
  id: number
  book_id: number
  status: 'reserved' | 'pending' | 'rejected'
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

export default function ActiveReservationsTable({
  id,
}: ActiveReservationsProps) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('reserved_at')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])

  const loadReservations = async () => {
    const rentals = await getActiveReservations()
    console.log(rentals.reservations.data)
    const reservations = rentals.reservations.data
    const reservation = reservations.filter((res: Reservation) => {
      return res.book_id === id
    })
    setReservationsData(reservation)
    console.log('rezervacije:', reservation)
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const confirmation = async (reservation_id: number) => {
    try {
      await confirmReservation(reservation_id)
      await loadReservations() // <--- osvježi tabelu
    } catch (error) {
      console.log(error)
    }
  }

  const rejectRes = async (reservation_id: number) => {
    try {
      await rejectReservation(reservation_id)
      await loadReservations() // <--- osvježi tabelu
    } catch (error) {
      console.log(error)
    }
  }

  const rows: Data[] = reservationsData.map((res) => {
    const firstName = res.student.first_name ?? ''
    const lastName = res.student.last_name ?? ''

    return {
      id: res.id,
      student_id: res.student?.id,
      book_id: res.book_id,
      reserved_at: res.reserved_at.split(' ')[0],
      expires_at: res.expires_at.split(' ')[0],
      studentName: `${firstName} ${lastName}`.trim(),
      status: res.status,
    }
  })

  console.log('rows:', rows)

  const rentABook = async (
    reservation_id: number,
    book_id: number,
    student_id: number
  ) => {
    const data = {
      reservation_id,
      book_id,
      student_id,
    }
    try {
      const res = await createRentalFromReservation(data)
      console.log(res)
      loadReservations()
    } catch (error) {
      console.log('Greska prilikom izdavanja rezervisane knjige:', error)
    }
  }

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

  const visibleRows = React.useMemo(() => {
    const sorted = [...rows].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1

      if (orderBy === 'status') {
        return order === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      }
      return getComparator(order, orderBy)(a, b)
    })

    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [order, orderBy, page, rowsPerPage, rows])

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
                      Trenutno nema rezervisanih knjiga
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{
                      backgroundColor:
                        row.status === 'pending' ? '#f0f0f0' : 'inherit',
                    }}
                  >
                    <TableCell>{row.reserved_at}</TableCell>
                    <TableCell>{row.expires_at}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>
                      {row.status === 'reserved' && (
                        <Button
                          variant="outlined"
                          className="text-sm font-normal px-3 py-2 text-orange-400 border-orange-400 rounded-4xl"
                        >
                          Rezervacija
                        </Button>
                      )}
                      {row.status === 'pending' && (
                        <Box className="flex">
                          <Button onClick={() => confirmation(row.id)}>
                            <CheckIcon className="text-grey-text w-[24px]" />
                          </Button>
                          <Button onClick={() => rejectRes(row.id)}>
                            <CloseIcon className="text-grey-text w-[24px]" />
                          </Button>
                        </Box>
                      )}
                      {row.status === 'rejected' && (
                        <Button
                          variant="outlined"
                          className="text-sm font-normal px-3 py-2 border-red-500 text-red-500 rounded-4xl"
                        >
                          Odbijeno
                        </Button>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {row.status !== 'pending' && (
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
                                <Box
                                  className="capitalize px-4 py-3 flex items-center"
                                  onClick={() =>
                                    rentABook(
                                      row.id,
                                      row.book_id,
                                      row.student_id
                                    )
                                  }
                                >
                                  <WavingHandOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izdaj knjigu
                                </Box>
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
