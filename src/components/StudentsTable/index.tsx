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
import { deleteBook, deleteUser, getAllBooks } from '@/utils/apiService'
import Link from 'next/link'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { stringAvatar } from '@/utils/utiles'
import CircularProgress from '@mui/material/CircularProgress'
import { Avatar, Button, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { getComparator, Order } from '@/utils/utiles'
import { getAllStudents } from '@/utils/apiService' // ili odgovarajuća putanja

interface Data {
  username: string
  id: number
  image: string
  fullName: string
  email: string
  lastAccess: string
}

interface HeadCell {
  id: keyof Data
  numeric: boolean
  disablePadding: boolean
  label: string
}

const headCells: readonly HeadCell[] = [
  {
    id: 'fullName',
    numeric: false,
    disablePadding: false,
    label: 'Ime i Prezime',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'userType' as keyof Data,
    numeric: false,
    disablePadding: false,
    label: 'Tip korisnika',
  },
  {
    id: 'lastAccess',
    numeric: false,
    disablePadding: false,
    label: 'Zadnji pristup',
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
              fontWeight: headCell.id === 'fullName' ? 'bold' : 'normal',
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
  onBulkDeleteClick: () => void
}

function EnhancedTableToolbar({
  numSelected,
  onBulkDeleteClick,
}: EnhancedTableToolbarProps) {
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
        <IconButton onClick={onBulkDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  ) : null
}

export default function StudentsTable() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('fullName')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<Data[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const response = await getAllStudents(50, '', 1)

        const fetchedStudents = response.data.data || []

        const mapped: Data[] = fetchedStudents.map((student: any) => ({
          id: student.id,
          username: student.username, // Dodaj ovo
          image: student.image || '',
          fullName: `${student.first_name || ''} ${
            student.last_name || ''
          }`.trim(),
          email: student.email || '',
          lastAccess: student.last_access || 'Prije 8 dana',
        }))

        setData(mapped)
      } catch (error) {
        setError('Greška pri učitavanju učenika.')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id)
      setShowDeleteModal(false)
      setUserToDelete(null)
      location.reload
    } catch (err) {
      alert('Greška pri brisanju korisnika.')
    }
  }

  const handleBulkDelete = async () => {
    try {
      for (const id of selected) {
        await deleteUser(id)
      }
      setSelected([])
      setShowDeleteModal(false)
      location.reload()
    } catch (err) {
      alert('Greška pri brisanju korisnika.')
    }
  }

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const deleteConfirmation = (id: number) => {
    setUserToDelete(id) // možeš kasnije precizirati tip
    setShowDeleteModal(true)
    closeMenu()
  }

  const closeDeleteModal = () => {
    setUserToDelete(null)
    setShowDeleteModal(false)
  }

  let rows = data.filter((row) =>
    row.fullName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Box className="absolute -mt-14 ml-392 flex items-center justify-center">
          <TextField
            inputRef={inputRef}
            className="text-sm font-normal pt-1 height-[30px] pr-0 m-0 w-[150px]"
            label="Pretrazi ucenike.."
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
          <EnhancedTableToolbar
            numSelected={selected.length}
            onBulkDeleteClick={() => {
              setUserToDelete(null) // znači masovno brisanje
              setShowDeleteModal(true)
            }}
          />

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
                      {/* ✅ Checkbox */}
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, row.id)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      {/* 🧑‍🎓 Ime i Prezime + Avatar */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Avatar
                          alt={row.fullName}
                          src={row.image}
                          sx={{ width: 32, height: 32 }}
                        />
                        {row.fullName}
                      </TableCell>

                      {/* 📧 Email */}
                      <TableCell align="left">{row.email}</TableCell>

                      {/* 👤 Tip korisnika */}
                      <TableCell align="left">Učenik</TableCell>

                      {/* ⏰ Zadnji pristup */}
                      <TableCell align="left">{row.lastAccess}</TableCell>

                      {/* ⋮ Meni ikonica */}
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

                            <div className="absolute w-[200px] -ml-40 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-99 text-left">
                              <Link href={`/students/${row.username}`}>
                                <div className="capitalize px-4 py-3 flex items-center">
                                  <CreateOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izmjeni korisnika
                                </div>
                              </Link>
                              <div
                                className="capitalize px-4 py-3 flex items-center hover:cursor-pointer"
                                onClick={() => deleteConfirmation(row.id)} // ← izmena ovde
                              >
                                <DeleteOutlineIcon
                                  sx={{ width: 20, height: 20 }}
                                  className="mr-1"
                                />
                                Izbriši korisnika
                              </div>
                            </div>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
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
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={closeDeleteModal}
            ></div>

            <div className="z-50 bg-white p-6 rounded-xl shadow-lg w-[320px] relative text-center">
              <p className="text-gray-800 text-base font-medium mb-6">
                {userToDelete !== null
                  ? 'Da li ste sigurni da želite da izbrišete korisnika?'
                  : `Da li ste sigurni da želite da izbrišete ${selected.length} korisnika?`}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (userToDelete !== null) {
                      handleDeleteUser(userToDelete)
                    } else {
                      handleBulkDelete()
                    }
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
