import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
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
import CircularProgress from '@mui/material/CircularProgress'
import { Avatar } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { getComparator, Order } from '@/utils/utiles'
import { getReturnedBooks } from '@/utils/apiService'
import { ReturnedRecord, Student } from '../../../types'

interface Data {
  id: number
  bookTitle: string
  issueDate: string
  returnDate: string
  retentionStatus: string
  receivedBy: string
}

interface HeadCell {
  id: keyof Data
  numeric: boolean
  disablePadding: boolean
  label: string
}

const headCells: readonly HeadCell[] = [
  {
    id: 'bookTitle',
    numeric: false,
    disablePadding: false,
    label: 'Naziv knjige',
  },
  {
    id: 'issueDate',
    numeric: false,
    disablePadding: false,
    label: 'Datum izdavanja',
  },
  {
    id: 'returnDate',
    numeric: false,
    disablePadding: false,
    label: 'Datum vraćanja',
  },
  {
    id: 'retentionStatus',
    numeric: false,
    disablePadding: false,
    label: 'Zadržavanje knjige',
  },
  {
    id: 'receivedBy',
    numeric: false,
    disablePadding: false,
    label: 'Knjigu primio',
  },
]

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  order: Order
  orderBy: keyof Data
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
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: 'bold',
              borderBottom: '2px solid rgba(224,224,224,1)',
            }}
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

const calculateRetentionStatus = (
  issueDate: string,
  returnDate: string
): string => {
  const start = new Date(issueDate)
  const end = new Date(returnDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diffDays / 7)
  const days = diffDays % 7
  if (weeks > 0 && days > 0) return `${weeks} nedelje i ${days} dana`
  if (weeks > 0) return `${weeks} nedelje`
  return `${days} dana`
}

type ReturnedBooksStudentProps = {
  data: Student
  width: number | string
}

export default function ReturnedBooksStudent({
  data,
  width,
}: ReturnedBooksStudentProps) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('bookTitle')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [returnedData, setReturnedData] = useState<ReturnedRecord[]>([])

  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true)
        const rentals = await getReturnedBooks({
          student_id: data.id,
          per_page: 20,
        })
        setReturnedData(rentals.data.data as ReturnedRecord[])
      } catch {
        setError('Greška pri učitavanju podataka.')
      } finally {
        setLoading(false)
      }
    }
    loadRentals()
  }, [data.id])

  const filteredRows: Data[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const mapped = returnedData.map<Data>((r) => ({
      id: r.rental_id,
      bookTitle: r.book_title,
      issueDate: r.rental_date.split(' ')[0],
      returnDate: r.returned_at!.split(' ')[0],
      retentionStatus: calculateRetentionStatus(r.rental_date, r.returned_at!),
      receivedBy: `${r.rented_out_by.first_name} ${r.rented_out_by.last_name}`,
    }))
    if (!q) return mapped
    return mapped.filter(
      (row) =>
        row.bookTitle.toLowerCase().includes(q) ||
        row.receivedBy.toLowerCase().includes(q)
    )
  }, [returnedData, searchQuery])

  const visibleRows = useMemo(() => {
    const sorted = [...filteredRows].sort(getComparator(order, orderBy))
    const start = page * rowsPerPage
    return sorted.slice(start, start + rowsPerPage)
  }, [filteredRows, order, orderBy, page, rowsPerPage])

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0

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
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width }} className="ml-4">
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              '& td': { borderBottom: '1px solid rgba(224, 224, 224, 1)' },
              '& th': { borderBottom: '1px solid rgba(224, 224, 224, 1)' },
            }}
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="left">
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography variant="body2">{row.bookTitle}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="left">{row.issueDate}</TableCell>
                  <TableCell align="left">{row.returnDate}</TableCell>
                  <TableCell align="left">{row.retentionStatus}</TableCell>
                  <TableCell align="left">{row.receivedBy}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
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
