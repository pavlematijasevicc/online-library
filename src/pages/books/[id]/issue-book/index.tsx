import Link from 'next/link'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import CloseIcon from '@mui/icons-material/Close'
import {
  createRental,
  getActiveRentals,
  getActiveReservations,
  getOverdueBooks,
} from '@/utils/apiService'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import {
  BookData,
  OverdueRecord,
  Rental,
  RentalRecord,
} from '../../../../../types'
import { deleteBook, fetchBookById, getAllStudents } from '@/utils/apiService'
import { useRouter } from 'next/router'
import { Reservation } from '@/components/ActiveReservationsTable'
import useRole from '@/hooks/useRole'

interface StudentData {
  id: number
  fullName: string
}

export default function IssuedBook() {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [id, setId] = useState<number>()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<BookData>()
  const [rentalData, setRentalData] = useState<Rental>({
    book_id: 0,
    student_id: 0,
  })
  const [studentsData, setStudentsData] = useState<StudentData[]>([])
  const [studentError, setStudentError] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rentalBooks, setRentalBooks] = useState<RentalRecord[]>()
  const [overdueBooks, setOverdueBooks] = useState<OverdueRecord[]>([])
  const [overdueLength, setOverdueLength] = useState<number>()
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const router = useRouter()
  const path = usePathname()
  const role = useRole()

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
    if (id && role === 'librarian') {
      const loadBook = async () => {
        const book = await fetchBookById(id)
        setData(book.book)
        setRentalData((prev) => ({ ...prev, book_id: id }))
      }

      const loadRentals = async () => {
        const rentals = await getActiveRentals({
          book_id: id,
          per_page: 20,
        })
        setRentalBooks(rentals.data.data)
      }
      const loadOverdue = async () => {
        const overdue = await getOverdueBooks({ book_id: id, per_page: 20 })
        setOverdueBooks(overdue.data.data)
      }

      const loadReservations = async () => {
        const rentals = await getActiveReservations()
        const reservations = rentals.reservations.data
        const reservation = reservations.filter((res: Reservation) => {
          return res.book_id === id
        })

        setReservationsData(reservation)
      }

      loadReservations()
      loadRentals()
      loadOverdue()
      loadBook()
    }
  }, [id, role])

  console.log('Data:', data)

  console.log('overdue data:', overdueBooks)

  useEffect(() => {
    setOverdueLength(
      overdueBooks.filter((book) => {
        return book.days_overdue > 0
      }).length
    )
  }, [overdueBooks])

  useEffect(() => {
    if (role === 'librarian') {
      const fetchStudents = async () => {
        try {
          const response = await getAllStudents(50, '', 1)

          const fetchedStudents = response.data.data || []

          const mapped: StudentData[] = fetchedStudents.map((student: any) => ({
            id: student.id,
            fullName: `${student.first_name || ''} ${
              student.last_name || ''
            }`.trim(),
          }))

          setStudentsData(mapped)
        } catch (error) {
          console.log('greska prilikom ucitavanja ucenika!')
        }
      }

      fetchStudents()
    }
  }, [role])

  function handleAlert() {
    console.log('usao u alert')
    setShowAlert(true)
  }

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

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setRentalData((prev) => ({
      ...prev!,
      student_id: 0,
    }))
    setStudentError(false)
  }

  function openIssueConfirm() {
    if (!rentalData.student_id) {
      setStudentError(true)
      return
    }
    setStudentError(false)
    handleIssueBook() // <-- odmah šaljemo podatke
  }

  async function handleIssueBook() {
    try {
      setIsSubmitting(true)
      await createRental(rentalData) // API poziv
      setShowAlert(true) // pokaži alert
    } catch (err) {
      console.error('Greška pri izdavanju knjige:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (
    path &&
    studentsData &&
    overdueBooks &&
    rentalBooks &&
    reservationsData &&
    role === 'librarian'
  )
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
              <span className="capitalize text-blue"> izdaj knjigu</span>
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
              <div className="px-2 pl-3 mr-4 text-blue text-sm hover:cursor-pointer bg-active py-2 rounded-sm">
                <WavingHandOutlinedIcon
                  sx={{ width: '18px', height: '18px' }}
                />
                <span> Izdaj knjigu </span>
              </div>
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
              <Link
                href={`${path
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/reserve-the-book`}
              >
                <div className="text-grey-text text-sm hover:cursor-pointer">
                  <EventAvailableIcon sx={{ width: '18px', height: '18px' }} />
                  <span> Rezervisi knjigu </span>
                </div>
              </Link>
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
                    <div className="capitalize px-4 py-3 hover:cursor-pointer">
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
            sx={{
              width: 720,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 className="pb-4 font-medium text-xl">Izdaj knjigu</h2>
            <FormControl
              sx={{ minWidth: 120 }}
              className="mb-3"
              error={studentError}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Izaberite ucenika..
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={rentalData?.student_id || ''}
                onChange={(e) => {
                  setRentalData((prev) => ({
                    ...prev!,
                    student_id: Number(e.target.value),
                  }))
                  setStudentError(false)
                }}
              >
                {studentsData.map((student) => (
                  <MenuItem value={student.id} key={student.id}>
                    {student.fullName}
                  </MenuItem>
                ))}
              </Select>
              {studentError && (
                <FormHelperText>Morate izabrati učenika</FormHelperText>
              )}
            </FormControl>

            <Box className="flex ml-auto">
              <Button
                variant="contained"
                type="button"
                onClick={openIssueConfirm}
                className="uppercase text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
                disabled={isSubmitting}
              >
                <WavingHandOutlinedIcon className="mr-2" />
                Izdaj knjigu
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
                {reservationsData.length} primjerak(a)
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text mb-4">
              Izdato:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-blue text-blue"
              >
                {rentalBooks.length} primjerak(a)
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text mb-4">
              U prekoracenju:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-red-500 text-red-500"
              >
                {overdueLength} primjerak(a)
              </Button>
            </Box>
            <Box className="flex items-center justify-between text-grey-text">
              Ukupna kolicina:
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-gray-500 text-gray-500"
              >
                {Number(data?.number_of_copies_available) +
                  Number(rentalBooks.length) +
                  Number(reservationsData.length)}
                primjerak(a)
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
        {showAlert && (
          <Alert
            className="mt-4 ml-4 w-[720px]"
            severity="success"
            onClose={() => setShowAlert(false)}
            variant="filled"
          >
            Knjiga uspjesno izdata!
          </Alert>
        )}
      </div>
    )
}
