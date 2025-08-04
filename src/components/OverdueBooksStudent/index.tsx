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
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { deleteAuthor, fetchAllAuthors } from '@/utils/apiService'
import Link from 'next/link'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { stringAvatar } from '@/utils/utiles'
import CircularProgress from '@mui/material/CircularProgress'
import { Avatar, Button, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { getComparator, Order } from '@/utils/utiles'

interface Data {
  id: number
  bookTitle: string
  bookImage: string
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
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: 'normal',
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
        <TableCell align="right" padding="normal">
          {/* prazno zaglavlje za dugme */}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}
interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props
  return numSelected > 0 ? (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        Izbrisi {numSelected} autora
      </Typography>

      <Tooltip title="Izbrisi">
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  ) : null
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

export default function OverdueBooksStudent() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('bookTitle')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<Data[]>([
    {
      id: 1,
      bookTitle: 'Mali Princ',
      bookImage: 'https://picsum.photos/seed/malip/60/90',
      issueDate: '2025-02-20',
      overdueDays: 5,
      retentionStatus: '3 mjeseca i 30 dana',
    },
    {
      id: 2,
      bookTitle: '1984',
      bookImage: 'https://picsum.photos/seed/orwell1984/60/90',
      issueDate: '2025-03-15',
      overdueDays: 3,
      retentionStatus: '3 mjeseca i 3 dana',
    },
    {
      id: 3,
      bookTitle: 'Zločin i kazna',
      bookImage: 'https://picsum.photos/seed/dostojevski/60/90',
      issueDate: '2025-04-10',
      overdueDays: 2,
      retentionStatus: '2 mjeseca i 8 dana',
    },
    {
      id: 4,
      bookTitle: 'Zločin i kazna',
      bookImage: 'https://picsum.photos/seed/dostojevski/60/90',
      issueDate: '2025-04-10',
      overdueDays: 1,
      retentionStatus: '2 mjeseca i 19 dana',
    },
    {
      id: 5,
      bookTitle: 'Zločin i kazna',
      bookImage: 'https://picsum.photos/seed/dostojevski/60/90',
      issueDate: '2025-02-25',
      overdueDays: 6,
      retentionStatus: '3 mjeseca i 24 dana',
    },
  ])

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  /*useEffect(() => {
        const loadAuthors = async () => {
          setLoading(true)
          try {
            const authors = await fetchAllAuthors(20)
            setData(authors.data.data)
          } catch (error) {
            console.error('Greška prilikom učitavanja autora:', error)
            setError('Nije moguće učitati autore. Pokušajte ponovo kasnije.')
          } finally {
            setLoading(false)
          }
        }
    
        loadAuthors()
      }, [])
    
      console.log('Data:', data)
    */
  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  let rows = data.filter((row) =>
    row.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleIconClick = () => {
    inputRef.current?.focus()
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
      <Box sx={{ width: '1470px' }} className="ml-4">
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
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
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = selected.includes(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.bookTitle}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ verticalAlign: 'middle' }}
                          color="primary"
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, row.id)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <Box display="flex" alignItems="center">
                          <img
                            src={row.bookImage}
                            alt={row.bookTitle}
                            style={{
                              width: 40,
                              height: 60,
                              objectFit: 'cover',
                              marginRight: 12,
                              borderRadius: 4,
                            }}
                          />
                          <Typography variant="body2">
                            {row.bookTitle}
                          </Typography>
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

                      <TableCell align="right">
                        <div
                          onClick={
                            openMenu === index
                              ? () => closeMenu()
                              : () => toggleMenu(index)
                          }
                        >
                          <MoreVertIcon className="hover:cursor-pointer" />
                        </div>
                        {/*openMenu === index && (
                          <>
                            <div
                              className="fixed inset-0 bg-transparent"
                              onClick={() => setOpenMenu(null)}
                            ></div>
                            <div className="absolute w-[320px] -ml-80 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-99 text-left">
                              <Link href={`/books/${row.id}`}>
                                <div className="capitalize px-4 py-3 flex items-center">
                                  <CreateOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izmjeni knjigu
                                </div>
                              </Link>
                              <div
                                className="capitalize px-4 py-3 flex items-center hover:cursor-pointer"
                                onClick={() => deleteConfirmation(row.id)}
                              >
                                <DeleteOutlineIcon
                                  sx={{
                                    width: '20px',
                                    height: '20px',
                                  }}
                                  className="mr-1"
                                />
                                Izbrisi knjigu
                              </div>
                            </div>
                          </>
                        )*/}
                      </TableCell>
                    </TableRow>
                  )
                })}

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
