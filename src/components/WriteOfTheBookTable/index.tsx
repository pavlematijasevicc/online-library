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
import { visuallyHidden } from '@mui/utils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { deleteAuthor, fetchAllAuthors } from '@/utils/apiService'
import Link from 'next/link'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import { Avatar, Button, TextField } from '@mui/material'
import { getComparator, Order } from '@/utils/utiles'
import CloseIcon from '@mui/icons-material/Close'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'

interface IssuedBook {
  id: number
  student: {
    image: string
    name: string
  }
  issuedDate: string
  durationHeld: string // npr. "2 nedelje i 3 dana"
  overdueDays: number
  issuedBy: string
}

interface HeadCell {
  id: keyof IssuedBook
  numeric: boolean
  disablePadding: boolean
  label: string
}

const headCells: readonly {
  id: keyof IssuedBook
  numeric: boolean
  disablePadding: boolean
  label: string
}[] = [
  {
    id: 'student',
    numeric: false,
    disablePadding: false,
    label: 'Izdato učeniku',
  },
  {
    id: 'issuedDate',
    numeric: false,
    disablePadding: false,
    label: 'Datum izdavanja',
  },
  {
    id: 'durationHeld',
    numeric: false,
    disablePadding: false,
    label: 'Trenutno zadržavanje knjige',
  },
  {
    id: 'overdueDays',
    numeric: true,
    disablePadding: false,
    label: 'Prekoračenje u danima',
  },
  {
    id: 'issuedBy',
    numeric: false,
    disablePadding: false,
    label: 'Knjigu izdao',
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IssuedBook
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
    (property: keyof IssuedBook) => (event: React.MouseEvent<unknown>) => {
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

export default function WriteOfTheBookTable() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof IssuedBook>('issuedBy')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const data: IssuedBook[] = [
    {
      id: 1,
      student: {
        image: 'http://localhost/images/student1.jpg',
        name: 'Ana Jovanović',
      },
      issuedDate: '2025-06-01',
      durationHeld: '2 nedelje i 2 dana',
      overdueDays: 3,
      issuedBy: 'Milan Petrović',
    },
    {
      id: 2,
      student: {
        image: 'http://localhost/images/student2.jpg',
        name: 'Marko Nikolić',
      },
      issuedDate: '2025-05-28',
      durationHeld: '3 nedelje i 1 dan',
      overdueDays: 7,
      issuedBy: 'Ivana Marković',
    },
  ]

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [authorToDelete, setAuthorToDelete] = useState<number | null>(null)
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
  let rows = data.filter(
    (row) =>
      row.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.issuedBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IssuedBook
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
        .sort((a, b) => {
          if (orderBy === 'student') {
            const nameA = a.student.name.toLowerCase()
            const nameB = b.student.name.toLowerCase()
            return order === 'asc'
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA)
          }
          return getComparator(order, orderBy as keyof IssuedBook)(a, b)
        })
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
      <Box sx={{ width: '98%' }} className="mx-4 mt-8">
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
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, row.id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

                      {/* Izdato učeniku */}
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={row.student.image}
                            alt={row.student.name}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                          <Typography>{row.student.name}</Typography>
                        </Box>
                      </TableCell>

                      {/* Datum izdavanja */}
                      <TableCell>{row.issuedDate}</TableCell>

                      {/* Trenutno zadržavanje */}
                      <TableCell>{row.durationHeld}</TableCell>

                      {/* Prekoračenje */}
                      <TableCell
                        sx={{
                          color: row.overdueDays > 0 ? 'error.main' : 'inherit',
                        }}
                      >
                        {row.overdueDays}
                      </TableCell>

                      {/* Knjigu izdao */}
                      <TableCell>{row.issuedBy}</TableCell>
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
        <Box className="flex justify-end">
          <Button
            variant="contained"
            type="submit"
            className="uppercase text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
            disabled={selected.length === 0}
            sx={{
              backgroundColor: '#007bff',
              color: 'white',
              opacity: selected.length === 0 ? 0.5 : 1,
              '&.Mui-disabled': {
                color: 'white',
                backgroundColor: '#007bff',
              },
            }}
          >
            <HistoryEduOutlinedIcon className="mr-1" />
            Otpisi knjigu
          </Button>
          <Button
            variant="contained"
            type="button"
            className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-transparent self-end text-blue border-blue border-1"
          >
            <CloseIcon />
            Ponisti
          </Button>
        </Box>
      </Box>
    )
}
