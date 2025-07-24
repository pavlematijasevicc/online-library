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
import { deleteBook, getAllBooks } from '@/utils/apiService'
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
  image: string
  name: string // Naziv knjige
  author: string
  category: string
  available: number
  reserved: number
  issued: number
  overdue: number
  total: number
}

interface HeadCell {
  id: keyof Data
  numeric: boolean
  disablePadding: boolean
  label: string
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Naziv Knjige',
  },
  {
    id: 'author',
    numeric: false,
    disablePadding: false,
    label: 'Autor',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Kategorija',
  },
  {
    id: 'available',
    numeric: true,
    disablePadding: false,
    label: 'Na raspolaganju',
  },
  {
    id: 'reserved',
    numeric: true,
    disablePadding: false,
    label: 'Rezervisano',
  },
  {
    id: 'issued',
    numeric: true,
    disablePadding: false,
    label: 'Izdato',
  },
  {
    id: 'overdue',
    numeric: true,
    disablePadding: false,
    label: 'U prekoračenju',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'Ukupna količina',
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
              fontWeight: headCell.id === 'name' ? 'bold' : 'normal',
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
export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<Data[]>([])

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await getAllBooks(20, '')
        console.log('Response:', response)
        const fetchedBooks = response.books.data

        const mapped: Data[] = fetchedBooks.map((book: any, index: number) => ({
          id: book.id ?? `${book.name}_${index}`, // jedinstveni ID
          image: book.image ?? '',
          name: book.name ?? '',
          author: Array.isArray(book.authors)
            ? book.authors
                .map((a: any) =>
                  `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim()
                )
                .join(', ')
            : '',
          category: Array.isArray(book.categories)
            ? book.categories.map((c: any) => c.name).join(', ')
            : '',
          available: book.number_of_copies_available - 0,
          reserved: 0,
          issued: 0,
          overdue: 0,
          total: book.number_of_copies_available,
        }))

        // Filtriraj duplikate po imenu
        const seen = new Set()
        const uniqueBooks = mapped.filter((book) => {
          if (seen.has(book.name)) return false
          seen.add(book.name)
          return true
        })

        setData(uniqueBooks)
      } catch (err) {
        console.error(err)
        setError('Greška pri dohvaćanju knjiga.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  console.log('knjige:', data)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id)
      setShowDeleteModal(false)
      setBookToDelete(null)
      window.location.reload()
    } catch (err) {
      alert('Greška pri brisanju knjige.')
    }
  }

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const deleteConfirmation = (id: number) => {
    setBookToDelete(id)
    setShowDeleteModal(true)
    closeMenu()
  }

  const closeDeleteModal = () => {
    setBookToDelete(null)
    setShowDeleteModal(false)
  }
  
  let rows = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.author.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Box sx={{ width: '100%' }}>
        <Box className="absolute -mt-14 ml-400 flex items-center justify-center">
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
                      key={row.id}
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

                      {/* Prva kolona: Slika i ime knjige */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 2, // standardna visina reda
                          borderBottom: '1px solid rgba(224, 224, 224, 1)', // dodatna sigurnost
                        }}
                      >
                        <Avatar
                          alt={row.name}
                          src={row.image}
                          sx={{ width: 32, height: 32, marginRight: 1 }}
                          variant="square"
                        />
                        {row.name}
                      </TableCell>

                      {/* Ostale kolone */}
                      <TableCell align="left">{row.author}</TableCell>
                      <TableCell align="left">{row.category}</TableCell>
                      <TableCell align="left">{row.available}</TableCell>
                      <TableCell align="left">{row.reserved}</TableCell>
                      <TableCell align="left">{row.issued}</TableCell>
                      <TableCell align="left">{row.overdue}</TableCell>
                      <TableCell align="left">{row.total}</TableCell>
                      <TableCell align="left">
                        <div
                          onClick={
                            openMenu === index
                              ? () => closeMenu()
                              : () => toggleMenu(index)
                          }
                        >
                          <MoreVertIcon className="hover:cursor-pointer" />
                        </div>
                        {openMenu === index && (
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
                        )}
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
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={closeDeleteModal}
            ></div>

            {/* Modal box */}
            <div className="z-50 bg-white p-6 rounded-xl shadow-lg w-[320px] relative text-center">
              <p className="text-gray-800 text-base font-medium mb-6">
                Da li ste sigurni da želite da izbrišete knjigu?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (bookToDelete !== null) handleDeleteBook(bookToDelete)
                  }}
                  className="uppercase w-[124px] text-sm font-medium py-2 px-4 bg-blue text-white rounded hover:bg-blue-500 transition-colors duration-200 hover:cursor-pointer"
                >
                  Potvrdi
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="uppercase w-[124px] bg-blue text-sm font-medium py-2 px-4 text-white rounded hover:cursor-pointer  hover:bg-blue-500 transition-colors duration-200"
                >
                  Poništi
                </button>
              </div>
            </div>
          </div>
        )}
      </Box>
    )
}
