import { getArchivedReservations } from '@/utils/apiService'
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

interface Data {
  id: number
  reserved_at: string
  expires_at: string
  studentName: string
  status: string
}

const headCells: { id: keyof Data; label: string }[] = [
  { id: 'reserved_at', label: 'Datum rezervacije' },
  { id: 'expires_at', label: 'Rezervacija ističe' },
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
        <TableCell /> {/* akcije */}
      </TableRow>
    </TableHead>
  )
}

type ActiveReservationsProps = {
  id: number
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

export default function ArchivedReservationsTable({
  id,
}: ActiveReservationsProps) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('reserved_at')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true)
      try {
        const rentals = await getArchivedReservations()
        const reservations = rentals.reservations.data
        setReservationsData(reservations)
      } finally {
        setLoading(false)
      }
    }

    loadReservations()
  }, [])

  const rows: Data[] = reservationsData.map((res) => {
    const firstName = res.student.first_name ?? ''
    const lastName = res.student.last_name ?? ''

    return {
      id: res.id,
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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const visibleRows = [...rows]
    .sort((a, b) => {
      if (orderBy === 'studentName') {
        return order === 'asc'
          ? a.studentName.localeCompare(b.studentName)
          : b.studentName.localeCompare(a.studentName)
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
                      Trenutno nema rezervisanih knjiga
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.reserved_at}</TableCell>
                    <TableCell>{row.expires_at}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>
                      {row.status === 'rejected' && (
                        <Button
                          variant="outlined"
                          className="text-sm font-normal px-3 py-2 border-red-500 text-red-500 rounded-3xl"
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
                          className="text-sm font-normal px-3 py-2 border-orange-500 text-orange-500 rounded-3xl"
                        >
                          Otkazano
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        onClick={() =>
                          openMenu === row.id
                            ? setOpenMenu(null)
                            : setOpenMenu(row.id)
                        }
                      >
                        <MoreVertIcon className="hover:cursor-pointer" />
                        {openMenu === row.id && (
                          <>
                            <Box
                              className="fixed inset-0 bg-transparent"
                              onClick={() => setOpenMenu(null)}
                            />
                            <Box className="absolute w-[200px] -ml-40 py-2 bg-white items-start text-gray-700 text-sm font-normal border z-50 text-left shadow-md">
                              <Link href={`/publication/${row.id}`}>
                                <Box className="capitalize px-4 py-3 flex items-center hover:bg-gray-100">
                                  <DescriptionOutlinedIcon
                                    sx={{ width: 20, height: 20 }}
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
