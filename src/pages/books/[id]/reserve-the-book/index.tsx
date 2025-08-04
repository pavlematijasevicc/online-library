import Link from 'next/link'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import CloseIcon from '@mui/icons-material/Close'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { BookData } from '../../../../../types'
import { deleteBook, fetchBookById } from '@/utils/apiService'

export default function ReserveTheBook() {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pupil, setPupil] = useState<string>('')
  const [id, setId] = useState<number>()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [issueDate, setIssueDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [data, setData] = useState<BookData>()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (path) {
      try {
        let string = path.split('/')
        setId(Number(string[2]))
      } catch (error) {
        console.error('Greška prilikom učitavanja knjige:', error)
      }
    }
  }, [path])

  useEffect(() => {
    if (id) {
      const loadBook = async () => {
        const book = await fetchBookById(id)
        setData(book.book)
      }

      loadBook()
    }
  }, [id])

  console.log('Data:', data)

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id)
      setShowDeleteModal(false)
      router.push('/books')
    } catch (err) {
      alert('Greška pri brisanju knjige.')
    }
  }

  const deleteConfirmation = (id: number) => {
    setShowDeleteModal(true)
    setOpenMenu(false)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  const handleEditClick = () => {
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  const handleIssueBook = () => {
    console.log('issued')
  }

  function deleteFields(e: React.FormEvent) {
    /* e.preventDefault()
      setBookData((pre: BookData) => ({
        ...pre,
        name: '',
        description: '',
        categories: [],
        genres: [],
        publishers: [],
        authors: [],
        year: null,
        number_of_copies_available: null,
      }))
      setBookNameError(null)
      setSubmitted(false)*/
  }

  if (path)
    return (
      <div className="py-3 text-xl font-medium overflow-y-hidden">
        <div className="px-4 flex justify-between">
          <div className="flex flex-col">
            <h1 className="capitalize"> {data?.name} </h1>
            <div className="mt-1 text-xs font-normal">
              <Link href={'/books'}>
                <span className="text-blue">Evidencija knjiga</span>
              </Link>
              <span> /</span>
              <Link href={`/books/${id}`}>
                <span className="uppercase text-blue"> knjiga-{id}</span>
              </Link>

              <span> /</span>
              <span className="capitalize text-blue"> rezervisi knjigu</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center px-4 mr-4 border-r-1 border-grey-line">
              <Link
                href={`${path
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/write-of-the-book`}
              >
                <div className="px-2 pl-3 mr-4 text-grey-text text-sm hover:cursor-pointer">
                  <HistoryEduOutlinedIcon
                    sx={{ width: '18px', height: '18px' }}
                  />
                  <span> Otpisi knjigu </span>
                </div>
              </Link>
              <Link
                href={`${path.split('/').slice(0, -1).join('/')}/issue-book`}
              >
                <div className="text-grey-text text-sm hover:cursor-pointer">
                  <WavingHandOutlinedIcon
                    sx={{ width: '18px', height: '18px' }}
                  />
                  <span> Izdaj knjigu </span>
                </div>
              </Link>
              <Link
                href={`${path
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/return-the-book`}
              >
                <div className="px-2 pl-3 mr-4 text-grey-text text-sm hover:cursor-pointer">
                  <AssignmentReturnOutlinedIcon
                    sx={{ width: '18px', height: '18px' }}
                  />
                  <span> Vrati knjigu </span>
                </div>
              </Link>
              <div className="px-2 pl-3 mr-4 text-blue text-sm hover:cursor-pointer bg-active py-2 rounded-sm">
                <EventAvailableIcon sx={{ width: '18px', height: '18px' }} />
                <span> Rezervisi knjigu </span>
              </div>
            </div>
            <div onClick={() => toggleMenu()}>
              <MoreVertIcon className="text-grey-text hover:cursor-pointer" />
            </div>
            {openMenu === true && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-transparent"
                  onClick={() => setOpenMenu(false)}
                ></div>
                <div className="absolute w-[320px] -mr-40 mt-40 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-90 text-left">
                  <Link href={`${path.split('/').slice(0, -1).join('/')}`}>
                    <div
                      className="capitalize px-4 py-3 hover:cursor-pointer"
                      onClick={() => {
                        handleEditClick()
                      }}
                    >
                      <CreateOutlinedIcon
                        sx={{
                          width: '20px',
                          height: '20px',
                        }}
                        className="mr-1"
                      />
                      Izmijeni podatke
                    </div>
                  </Link>
                  <div
                    className="capitalize px-4 py-3 hover:cursor-pointer"
                    onClick={() => deleteConfirmation(id!)}
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
          </div>
        </div>
        <Box
          className="pl-4 pt-8"
          sx={{
            display: 'flex',
          }}
        >
          <Box
            component="form"
            onSubmit={handleIssueBook}
            sx={{
              width: 720,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 className="pb-4 font-medium text-xl">Rezervisi knjigu</h2>
            <FormControl sx={{ minWidth: 120 }} className="mb-3">
              <InputLabel id="demo-simple-select-helper-label">
                Izaberite ucenika..
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="ucenik"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display="flex" gap="16px" className="mb-6">
                <DatePicker
                  label="Datum izdavanja"
                  value={issueDate}
                  onChange={(newValue) => setIssueDate(newValue)}
                  slotProps={{
                    textField: {
                      placeholder: 'Unesite datum',
                      helperText: 'Format dd/mm/yyyy',
                      fullWidth: true,
                    },
                  }}
                />

                <DatePicker
                  label="Datum vraćanja"
                  value={returnDate}
                  onChange={(newValue) => setReturnDate(newValue)}
                  slotProps={{
                    textField: {
                      placeholder: 'Datum vraćanja',
                      helperText: 'Rok vraćanja: 30 dana',
                      fullWidth: true,
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
            <Box className="flex ml-auto">
              <Button
                variant="contained"
                type="submit"
                className="uppercase text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
              >
                <WavingHandOutlinedIcon className="mr-2" />
                Rezervisi knjigu
              </Button>
              <Button
                variant="contained"
                type="button"
                className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-transparent self-end text-blue border-blue border-1"
                onClick={deleteFields}
              >
                <CloseIcon className="mr-1" />
                Ponisti
              </Button>
            </Box>
          </Box>
          <Box className="ml-16 text-base w-[350px] border-grey-line border-1 p-4">
            <h3 className="font-medium text-base mb-8">Kolicine</h3>
            <Box className="flex items-center justify-between text-grey-text mb-4">
              Na raspolaganju:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-green-500 text-green-500"
              >
                {data?.number_of_copies_available} primjeraka
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text mb-4">
              Rezervisano:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 text-orange-400 border-orange-400"
              >
                0 primjeraka
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text mb-4">
              Izdato:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-blue text-blue"
              >
                0 primjeraka
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text mb-4">
              U prekoracenju:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-red-500 text-red-500"
              >
                0 primjeraka
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text">
              Ukupna kolicina:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-gray-500 text-gray-500"
              >
                {data?.number_of_copies_available} primjeraka
              </Button>
            </Box>
          </Box>
        </Box>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={closeDeleteModal}
            />
            <div className="z-50 bg-white p-6 rounded-xl shadow-lg w-[320px] relative text-center">
              <p className="text-gray-800 text-base font-medium mb-6">
                Da li ste sigurni da želite da izbrišete knjigu?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleDeleteBook(id!)}
                  className="uppercase w-[124px] text-sm font-medium py-2 px-4 bg-blue text-white rounded hover:bg-blue-500 transition-colors duration-200 hover:cursor-pointer"
                >
                  Potvrdi
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="uppercase w-[124px] bg-blue text-sm font-medium py-2 px-4 text-white rounded hover:cursor-pointer hover:bg-blue-500 transition-colors duration-200"
                >
                  Poništi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
}
