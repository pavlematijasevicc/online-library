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
  ActiveUser,
  BookData,
  OverdueRecord,
  Rental,
  RentalRecord,
} from '../../../../../types'
import {
  createRental,
  createReservation,
  createReservationByStudent,
  deleteBook,
  fetchBookById,
  getActiveRentals,
  getActiveReservations,
  getAllStudents,
  getOverdueBooks,
} from '@/utils/apiService'
import { Reservation } from '@/components/ActiveReservationsTable'
import useRole from '@/hooks/useRole'

interface StudentData {
  id: number
  fullName: string
}

export default function ReserveTheBook() {
  const [openMenu, setOpenMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reservationData, setReservationData] = useState<{
    book_id: number
    student_id: number
  }>({
    book_id: 0,
    student_id: 0,
  })
  const [studentsData, setStudentsData] = useState<StudentData[]>([])
  const [studentError, setStudentError] = useState(false)
  const [id, setId] = useState<number>()
  const [showAlert, setShowAlert] = useState(false)
  const [data, setData] = useState<BookData>()
  const [rentalBooks, setRentalBooks] = useState<RentalRecord[]>()
  const [overdueBooks, setOverdueBooks] = useState<OverdueRecord[]>([])
  const [overdueLength, setOverdueLength] = useState<number>()
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const router = useRouter()
  const path = usePathname()
  const role = useRole()

  useEffect(() => {
    setOverdueLength(
      overdueBooks.filter((book) => {
        return book.days_overdue > 0
      }).length
    )
  }, [overdueBooks])

  useEffect(() => {
    if (path) {
      try {
        const string = path.split('/')
        const parsedId = Number(string[2])
        setId(parsedId)
        setReservationData((prev) => ({ ...prev, book_id: parsedId })) // postavi book_id
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
        console.log('reservations:', reservations)
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
  }, [id])

  async function handleReservation() {
    if (!reservationData.student_id) {
      setStudentError(true)
      return
    }
    try {
      await createReservation(
        reservationData.book_id,
        reservationData.student_id
      )
      console.log('Knjiga uspešno rezervisana!')
      setShowAlert(true)
    } catch (error: any) {
      console.log('Greška prilikom rezervacije knjige', error)
      setStudentError(true)
    }
  }

  async function handleReservationByStudent() {
    try {
      await createReservationByStudent(reservationData.book_id)
      console.log('Poslat zathtjev za rezervacijom!')
      setShowAlert(true)
    } catch (error: any) {
      console.log('Greška prilikom rezervacije knjige', error)
      setStudentError(true)
    }
  }

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setReservationData((prev) => ({ ...prev, student_id: 0 }))
    setStudentError(false)
  }

  console.log('Data:', data)

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

  if (path && overdueBooks && rentalBooks && reservationData)
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
              {role === 'librarian' && (
                <>
                  <Link href={`/books/${id}`}>
                    <span className="uppercase text-blue"> knjiga-{id}</span>
                  </Link>

                  <span> /</span>
                </>
              )}

              <span className="capitalize text-blue"> rezervisi knjigu</span>
            </div>
          </div>
          {role === 'librarian' && (
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
          )}
        </div>

        <Box className="flex">
          <Box className="pl-4 pt-8" sx={{ display: 'flex' }}>
            {role === 'librarian' ? (
              <Box
                component="form"
                sx={{
                  width: 720,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h2 className="pb-4 font-medium text-xl">Rezervisi knjigu</h2>
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
                    value={reservationData?.student_id || ''}
                    onChange={(e) => {
                      setReservationData((prev) => ({
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
                    onClick={() => handleReservation()}
                    variant="contained"
                    type="button"
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
            ) : (
              <Box
                component="form"
                sx={{
                  width: 720,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <p className="mb-4 text-xl font-normal">
                  Molim Vas potvrdite da zelite da rezervisete knjigu
                  <span className="font-semibold"> {data?.name} </span>?
                </p>
                <Box className="flex">
                  <Button
                    onClick={() => handleReservationByStudent()}
                    variant="contained"
                    type="button"
                    className="uppercase text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-start"
                  >
                    <WavingHandOutlinedIcon className="mr-2" />
                    Rezervisi knjigu
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
          {role === 'librarian' && (
            <Box className="ml-16 text-base w-[350px] border-grey-line border-1 p-4 mt-8">
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
          )}
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
            className="mt-6 w-[600px] mx-4"
            severity="success"
            onClose={() => setShowAlert(false)}
            variant="filled"
          >
            {role === 'librarian'
              ? 'Knjiga uspjesno rezervisana!'
              : 'Poslat zahtjev za rezervacijom!'}
          </Alert>
        )}
        {studentError && (
          <Alert
            className="mt-12 w-[600px] mx-4"
            severity="error"
            onClose={() => setStudentError(false)}
            variant="filled"
          >
            {role === 'student'
              ? 'Vec ste poslali zahtjev za rezervaciju ove knjige!'
              : 'Ovom uceniku je vec rezervisana ova knjiga!'}
          </Alert>
        )}
      </div>
    )
}
