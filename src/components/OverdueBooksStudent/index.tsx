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
import { visuallyHidden } from '@mui/utils'
import CircularProgress from '@mui/material/CircularProgress'
import { getComparator, Order } from '@/utils/utiles'
import { OverdueRecord, Student } from '../../../types'
import { getOverdueBooks } from '@/utils/apiService'

interface Data {
  id: number
  bookTitle: string
  issueDate: string
  overdueDays: number
  retentionStatus: string
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
    id: 'overdueDays',
    numeric: true,
    disablePadding: false,
    label: 'Prekoračenje u danima',
  },
  {
    id: 'retentionStatus',
    numeric: false,
    disablePadding: false,
    label: 'Trenutno zadržavanje knjige',
  },
]

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

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
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const calculateOverdueDays = (
  issueDate: string,
  retentionStatus: string
): number => {
  if (retentionStatus !== 'U prekoračenju') return 0

  const issue = new Date(issueDate)
  const now = new Date()
  const diffTime = Math.max(0, now.getTime() - issue.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 14 ? diffDays - 14 : 0
}

type OverdueBooksStudentProps = {
  data: Student
  width: number
}

export default function OverdueBooksStudent({
  data,
  width,
}: OverdueBooksStudentProps) {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('bookTitle')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [overdueData, setOverdueData] = useState<OverdueRecord[]>([])

  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true)
        const rentals = await getOverdueBooks({
          student_id: data.id,
          per_page: 20,
        })
        console.log('podaci:', rentals.data.data)
        setOverdueData(rentals.data.data as OverdueRecord[])
      } catch {
        setError('Greška pri učitavanju podataka.')
      } finally {
        setLoading(false)
      }
    }
    loadRentals()
  }, [data.id])

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredRows: Data[] = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const mapped: Data[] = overdueData
      .map((r) => ({
        id: r.rental_id,
        bookTitle: r.book_title,
        issueDate: r.rental_date.split(' ')[0],
        overdueDays: r.days_overdue,
        retentionStatus:
          r.days_overdue > 0
            ? `U prekoračenju ${r.days_overdue} dana`
            : `${r.total_rental_days} dana`,
      }))
      // 🚨 filtriraj da se prikažu samo oni sa overdueDays > 0
      .filter((row) => row.overdueDays > 0)

    if (!q) return mapped
    return mapped.filter((row) => row.bookTitle.toLowerCase().includes(q))
  }, [overdueData, searchQuery])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
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
  } else if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px', // da loader ne bude sabijen
        }}
      >
        <CircularProgress />
      </Box>
    )
  } else
    return (
      <Box sx={{ width: '1470px' }} className="ml-4">
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table
              sx={{
                minWidth: 750,
                '& td': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)', // standardna MUI linija
                },
                '& th': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
              }}
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={filteredRows.length}
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
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2">{row.bookTitle}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.issueDate}</TableCell>
                    <TableCell
                      align="left"
                      sx={{ color: row.overdueDays > 0 ? 'red' : 'inherit' }}
                    >
                      {row.overdueDays}
                    </TableCell>
                    <TableCell align="left">{row.retentionStatus}</TableCell>
                  </TableRow>
                ))}

                {/* Ako nema redova, prikaži poruku */}
                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      <Typography
                        variant="body1"
                        sx={{ py: 3, color: 'text.secondary' }}
                      >
                        Trenutno nema knjiga u prekoračenju
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
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
