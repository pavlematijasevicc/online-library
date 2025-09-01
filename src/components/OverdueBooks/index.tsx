import * as React from 'react'
import { useEffect, useState } from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { deleteAuthor, getOverdueBooks } from '@/utils/apiService'
import Link from 'next/link'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import { getComparator, Order } from '@/utils/utiles'
import { usePathname } from 'next/navigation'

interface Data {
  id: number
  issueDate: string
  issuedTo: string
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
    id: 'issueDate',
    numeric: false,
    disablePadding: false,
    label: 'Datum izdavanja',
  },
  {
    id: 'issuedTo',
    numeric: false,
    disablePadding: false,
    label: 'Izdato učeniku',
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
}

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
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

export default function OverdueBooks() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('issuedTo')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<Data[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [bookId, setBookId] = useState<number>()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const path = usePathname()

  useEffect(() => {
    if (path) {
      const parts = path.split('/')
      setBookId(Number(parts[2]))
    }
  }, [path])

  useEffect(() => {
    if (bookId) {
      setLoading(true)
      getOverdueBooks({ book_id: bookId, per_page: 20 })
        .then((res) => {
          const mappedData: Data[] = res.data.data.map((item: any) => ({
            id: item.rental_id,
            issuedTo: `${item.rented_by.name} ${item.rented_by.last_name}`,
            issueDate: item.rental_date.split(' ')[0], // samo datum bez vremena
            overdueDays: item.days_overdue,
            retentionStatus: `${item.total_rental_days} dana`,
          }))
          setData(mappedData)
        })
        .finally(() => setLoading(false))
    }
  }, [bookId])

  let rows = data.filter(
    (row) =>
      row.overdueDays > 0 &&
      row.issuedTo.toLowerCase().includes(searchQuery.toLowerCase())
  )
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
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
      <Box sx={{ width: '1120px' }} className="ml-4">
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
              />
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 2} align="center">
                      <Typography variant="body1" sx={{ py: 3 }}>
                        Trenutno nema knjiga u prekoracenju
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.issuedTo}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell align="left">{row.issueDate}</TableCell>
                        <TableCell align="left">{row.issuedTo}</TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            color: row.overdueDays > 0 ? 'red' : 'inherit',
                          }}
                        >
                          {row.overdueDays}
                        </TableCell>
                        <TableCell align="left">
                          {row.retentionStatus}
                        </TableCell>
                      </TableRow>
                    )
                  })
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
