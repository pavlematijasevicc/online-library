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
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import { Category } from '../../../types'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { deleteCategory, fetchAllCategories } from '@/utils/apiService'

interface Data {
  id: number
  name: string
  icon: string
  description: string
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
    label: 'Naziv kategorije',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Opis',
  },
]

export default function CategoryTable() {
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dataCategories, setDataCategories] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const categories = await fetchAllCategories(20)
        setDataCategories(categories.categories.data)
      } catch (error) {
        console.error('Greška prilikom učitavanja kategorija:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  console.log('datacategories:', dataCategories)

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id)
      setShowDeleteModal(false)
      setCategoryToDelete(null)
      location.reload()
    } catch (err) {
      alert('Greška pri brisanju korisnika.')
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
      const newSelected = dataCategories.map((n) => n.id)
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

  const visibleRows = dataCategories.slice(
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
        <Link href="/settings/categories">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mb-7">
            <AddIcon className="mr-2" /> nova kategorija
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
                      selected.length < dataCategories.length
                    }
                    checked={
                      dataCategories.length > 0 &&
                      selected.length === dataCategories.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>{headCell.label}</TableCell>
                ))}
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row: Data, index: number) => {
                const isItemSelected = isSelected(row.id)
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {/* ✅ Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleClick(row.id)}
                      />
                    </TableCell>

                    {/* 🖼️ Naziv kategorije + slika */}
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar
                          src={row.icon}
                          alt={row.name}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography>{row.name}</Typography>
                      </Box>
                    </TableCell>

                    {/* 📝 Opis */}
                    <TableCell>{row.description}</TableCell>

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

                            <div className="absolute w-[200px] -ml-20 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-99 text-left">
                              <Link href={`/settings/categories/${row.id}`}>
                                <div className="capitalize px-4 py-3 flex items-center">
                                  <CreateOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izmjeni kategoriju
                                </div>
                              </Link>
                              <div
                                className="capitalize px-4 py-3 flex items-center hover:cursor-pointer"
                                onClick={() => deleteConfirmation(row.id)}
                              >
                                <DeleteOutlineIcon
                                  sx={{ width: 20, height: 20 }}
                                  className="mr-1"
                                />
                                Izbriši kategoriju
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
          count={dataCategories.length}
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
                ? 'Da li ste sigurni da želite da izbrišete kategoriju?'
                : `Da li ste sigurni da želite da izbrišete ${selected.length} kategorija?`}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (categoryToDelete !== null)
                    handleDeleteCategory(categoryToDelete)
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
