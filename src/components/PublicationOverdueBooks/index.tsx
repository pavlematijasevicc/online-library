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
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { visuallyHidden } from '@mui/utils'
import { getOverdueBooks } from '@/utils/apiService'
import Link from 'next/link'
import CircularProgress from '@mui/material/CircularProgress'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { getComparator, Order } from '@/utils/utiles'
import { Avatar, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

interface Data {
  id: number
  book: { image: string; title: string }
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
    id: 'book',
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
        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  )
}

export default function PublicationOverdueBooks() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('issuedTo')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<Data[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    getOverdueBooks({ per_page: 20 }).then((res) => {
      const mappedData: Data[] = res.data.data.map((item: any) => ({
        id: item.rental_id,
        book: {
          image: '', // ako nema slike, može ostati prazan string
          title: item.book_title,
        },
        issuedTo: `${item.rented_by.name} ${item.rented_by.last_name}`,
        issueDate: item.rental_date.split(' ')[0], // samo datum bez vremena
        overdueDays: item.days_overdue,
        retentionStatus: `${item.total_rental_days} dana`,
      }))
      setData(mappedData)
    })
  }, [])

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  // rows sada samo čuva sve koji imaju prekoračenje
  let rows = data.filter((row) => row.overdueDays > 0)

  const filteredRows = React.useMemo(() => {
    if (!searchQuery) return rows
    const query = searchQuery.toLowerCase()
    return rows.filter(
      (row) =>
        row.book.title.toLowerCase().includes(query) ||
        row.issuedTo.toLowerCase().includes(query)
    )
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

  const handleIconClick = () => {
    inputRef.current?.focus()
  }
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

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
      <Box sx={{ width: '1480px' }} className="ml-4">
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
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 2} align="center">
                      <Typography variant="body1" sx={{ py: 3 }}>
                        Nema rezultata za pretragu
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
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                      >
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
