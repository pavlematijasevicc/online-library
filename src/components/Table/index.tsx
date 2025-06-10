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
import { stringToColor, stringAvatar } from '@/utils/utiles'
import { Author } from '../../../types'
import CircularProgress from '@mui/material/CircularProgress'
import { Avatar, Button, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

interface Data {
  id: number
  image: string
  name: string
  description: string
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Naziv Autora',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: true,
    label: 'Opis',
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
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: headCell.id === 'description' ? 'normal' : 'bold',
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
  const [orderBy, setOrderBy] = React.useState<keyof Data>('description')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<Author[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [authorToDelete, setAuthorToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
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

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const handleDeleteAuthor = async (id: number) => {
    try {
      await deleteAuthor(id)
      setShowDeleteModal(false)
      setAuthorToDelete(null)
      window.location.reload()
    } catch (err) {
      alert('Greška pri brisanju autora.')
    }
  }

  const deleteConfirmation = (id: number) => {
    setAuthorToDelete(id)
    setShowDeleteModal(true)
    closeMenu()
  }

  const closeDeleteModal = () => {
    setAuthorToDelete(null)
    setShowDeleteModal(false)
  }
  let rows = data
    .map((author) => ({
      id: author.id,
      image: author.picture ? `http://localhost/${author.picture}` : '',
      name: `${author.first_name} ${author.last_name}`,
      description: author.biography || 'Nema opisa',
    }))
    .filter(
      (row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Box className="absolute -mt-14 ml-390 flex items-center justify-center">
          <TextField
            inputRef={inputRef}
            className="text-sm font-normal pt-1 height-[30px] pr-0 m-0 w-[140px]"
            label="Pretrazi autore.."
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
            <Table sx={{ minWidth: 750 }} size="medium">
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

                  return (
                    <TableRow
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(event) => handleClick(event, row.id)}
                          color="primary"
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Avatar {...stringAvatar(`${row.name}`)} />
                          <Typography variant="body1">{row.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {row.description}
                      </TableCell>

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
                        {openMenu === index && (
                          <>
                            <div
                              className="fixed inset-0 bg-transparent"
                              onClick={() => setOpenMenu(null)}
                            ></div>
                            <div className="absolute w-[320px] -ml-42 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-99 text-left">
                              <Link href={`/authors/${row.id}`}>
                                <div className="capitalize px-4 py-3 flex items-center">
                                  <CreateOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izmjeni autora
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
                                Izbrisi autora
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
                Da li ste sigurni da želite da obrišete autora?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (authorToDelete !== null)
                      handleDeleteAuthor(authorToDelete)
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
