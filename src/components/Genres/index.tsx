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
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import { deleteCategory, deleteGenre, fetchAllGenres } from '@/utils/apiService'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { Genre } from '../../../types'

interface Data {
  id: number
  name: string
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

export default function GenresTable() {
  const [selected, setSelected] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dataGenres, setDataGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [genreToDelete, setGenreToDelete] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function toggleMenu(id: number | null) {
    setOpenMenu(id)
  }

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true)
        const genres = await fetchAllGenres(20)
        const cleanedGenres = genres.genres.data
        setDataGenres(cleanedGenres)
      } catch (error) {
        console.error('Greška prilikom učitavanja kategorija:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGenres()
  }, [])

  const handleDeleteGenre = async (id: number) => {
    try {
      await deleteGenre(id)
      setShowDeleteModal(false)
      setGenreToDelete(null)
      location.reload()
    } catch (err) {
      alert('Greška pri brisanju zanra.')
    }
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  const deleteConfirmation = (id: number) => {
    setGenreToDelete(id)
    setShowDeleteModal(true)
    closeMenu()
  }

  const closeDeleteModal = () => {
    setGenreToDelete(null)
    setShowDeleteModal(false)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = dataGenres
        .map((n) => n.id)
        .filter((id): id is number => id !== undefined)

      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (id?: number) => {
    if (id === undefined) return // Ako nema id-a, izađi

    const selectedIndex = selected.indexOf(id)
    let newSelected: number[] = [] // ne treba readonly

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

  const visibleRows = dataGenres.slice(
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
        <Link href="/settings/genres">
          <Button className="uppercase text-white bg-blue flex items-center text-sm font-medium mb-7">
            <AddIcon className="mr-2" /> novi zanr
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
                      selected.length > 0 && selected.length < dataGenres.length
                    }
                    checked={
                      dataGenres.length > 0 &&
                      selected.length === dataGenres.length
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
            <TableBody className="z-40">
              {visibleRows.map((row: Genre, index: number) => {
                const isItemSelected = isSelected(row.id!)
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
                        onChange={() => handleClick(row.id!)}
                      />
                    </TableCell>

                    {/* ✅ Samo naziv bez slike */}
                    <TableCell>
                      <Typography>{row.name}</Typography>
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

                            <div className="absolute w-[200px] -ml-50 border-1 py-2 bg-white items-start text-grey-text text-sm font-normal border-border text-left">
                              <Link href={`/settings/genres/${row.id}`}>
                                <div className="capitalize px-4 py-3 flex items-center">
                                  <CreateOutlinedIcon
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className="mr-1"
                                  />
                                  Izmjeni zanr
                                </div>
                              </Link>
                              <div
                                className="capitalize px-4 py-3 flex items-center hover:cursor-pointer"
                                onClick={() => deleteConfirmation(row.id!)}
                              >
                                <DeleteOutlineIcon
                                  sx={{ width: 20, height: 20 }}
                                  className="mr-1"
                                />
                                Izbriši zanr
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
          className="z-1"
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={dataGenres.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* ✅ Modal za brisanje */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeDeleteModal}
          ></div>

          <div className="z-50 bg-white p-6 rounded-xl shadow-lg w-[320px] relative text-center">
            <p className="text-gray-800 text-base font-medium mb-6">
              {genreToDelete !== null
                ? 'Da li ste sigurni da želite da izbrišete zanr?'
                : `Da li ste sigurni da želite da izbrišete ${selected.length} zanrova?`}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (genreToDelete !== null) handleDeleteGenre(genreToDelete)
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
