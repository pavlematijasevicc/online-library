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
  CircularProgress,
} from '@mui/material'
import { fetchAllBookOptions, fetchAllGenres } from '@/utils/apiService'

interface Data {
  id: number
  name: string
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
    label: 'Naziv formata',
  },
]

export default function Format() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [formats, setFormats] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFormat = async () => {
      try {
        setLoading(true)
        const options = await fetchAllBookOptions()
        console.log('Fetched formats:', options.dimensions)
        const cleanedOptions = options.dimensions.map(
          (b: string, index: number) => ({
            id: index,
            name: b,
          })
        )
        setFormats(cleanedOptions)
      } catch (error) {
        console.error('Greška prilikom učitavanja formata:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFormat()
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const visibleRows = formats.slice(
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

  console.log('Format:', formats)

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{
              minWidth: 650,
              borderCollapse: 'collapse',
            }}
            aria-label="tabela žanrova"
          >
            <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{
                      border: '1px solid #ccc',
                      fontWeight: 'bold',
                    }}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row: Data) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                  sx={{ border: '1px solid #ccc' }}
                >
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                    }}
                  >
                    <Typography>{row.name}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={formats.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
