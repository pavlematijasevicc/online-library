import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Paper,
  Checkbox,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import {
  deleteCategory,
  deletePublisher,
  fetchAllCategories,
  fetchAllPublishers,
} from '@/utils/apiService'

interface Data {
  publisher_id: number
  publisher_name: string
  icon: string
}

interface HeadCell {
  publisher_id: keyof Data
  numeric: boolean
  disablePadding: boolean
  label: string
}

const headCells: readonly HeadCell[] = [
  {
    publisher_id: 'publisher_name',
    numeric: false,
    disablePadding: false,
    label: 'Naziv izdavaca',
  },
]

export default function Publishers() {
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dataPublishers, setDataPublishers] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  useEffect(() => {
    const loadPublishers = async () => {
      try {
        setLoading(true)
        const categories = await fetchAllPublishers(20)
        console.log(categories.data)
        setDataPublishers(categories.data)
      } catch (error) {
        console.error('Greška prilikom učitavanja izdavaca:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPublishers()
  }, [])

  console.log('dataPublishers:', dataPublishers)

  const handleDeletePublisher = async (id: number) => {
    console.log('id:', id)
    try {
      await deletePublisher(id)
      setShowDeleteModal(false)
      setCategoryToDelete(null)
      location.reload()
    } catch (err) {
      alert('Greška pri brisanju izdavaca.')
    }
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const deleteConfirmation = (id: number) => {
    setCategoryToDelete(id)
    setShowDeleteModal(true)
    closeMenu()
  }

  const closeDeleteModal = () => {
    setCategoryToDelete(null)
    setShowDeleteModal(false)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = dataPublishers.map((n) => n.publisher_id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = [...selected, id]
    } else {
      newSelected = selected.filter((item) => item !== id)
    }
    setSelected(newSelected)
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

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const visibleRows = dataPublishers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="mb-4">
        <Link href="/settings/publishers">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mb-7">
            <AddIcon className="mr-2" /> novi izdavac
          </Button>
        </Link>
      </Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < dataPublishers.length
                    }
                    checked={
                      dataPublishers.length > 0 &&
                      selected.length === dataPublishers.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.publisher_id}>
                    {headCell.label}
                  </TableCell>
                ))}
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row: Data, index: number) => {
                const isItemSelected = isSelected(row.publisher_id)
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.publisher_id}
                    selected={isItemSelected}
                  >
                    {/* ✅ Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleClick(row.publisher_id)}
                      />
                    </TableCell>

                    {/* 🖼️ Naziv izdavaca + slika */}
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar
                          src={row.icon}
                          alt={row.publisher_name}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography>{row.publisher_name}</Typography>
                      </Box>
                    </TableCell>
                    {/* ⋮ Meni ikonica */}
                    <TableCell align="right">
                      <div
                        className="cursor-pointer p-2"
                        onClick={
                          openMenu === index
                            ? () => closeMenu()
                            : () => toggleMenu(index)
                        }
                      >
                        <MoreVertIcon />
                        {openMenu === index && (
                          <>
                            <div
                              className="fixed inset-0 bg-transparent"
                              onClick={() => setOpenMenu(null)}
                            ></div>

                            <div className="absolute w-[200px] ml-30 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-99 text-left">
                              <Link
                                href={`/settings/publishers/${row.publisher_id}`}
                              >
                                <div className="capitalize px-4 py-3 flex items-center">
                                  <CreateOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izmjeni izdavaca
                                </div>
                              </Link>
                              <div
                                className="capitalize px-4 py-3 flex items-center hover:cursor-pointer"
                                onClick={() =>
                                  deleteConfirmation(row.publisher_id)
                                }
                              >
                                <DeleteOutlineIcon
                                  sx={{ width: 20, height: 20 }}
                                  className="mr-1"
                                />
                                Izbriši izdavaca
                              </div>
                            </div>
                          </>
                        )}
                      </div>
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
          count={dataPublishers.length}
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
              {categoryToDelete !== null
                ? 'Da li ste sigurni da želite da izbrišete izdavaca?'
                : `Da li ste sigurni da želite da izbrišete ${selected.length} izdavaca?`}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (categoryToDelete !== null)
                    handleDeletePublisher(categoryToDelete)
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
