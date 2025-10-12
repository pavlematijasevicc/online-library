import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material'

import { useEffect, useState } from 'react'
import {
  getActiveRentals,
  getActiveReservations,
  getAllBooks,
  getAllStudents,
  getReturnedBooks,
} from '@/utils/apiService'
import { RentalRecord, Activity, ActiveUser } from '../../types'
import ActivityBox from '@/components/ActivityBox'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { DisabledByDefault } from '@mui/icons-material'
import { userAgent } from 'next/server'
import useRole from '@/hooks/useRole'

export type Reservation = {
  id: number
  book_id?: number
  status: 'reserved' | 'canceled' | 'completed' // promjena
  reserved_at: string
  expires_at: string
  created_at?: string
  updated_at?: string
  librarian: {
    first_name: string
    last_name: string
    id: number
    username: string
  }
  book?: {
    id: number
    name: string
  }
  student: {
    id: number
    first_name?: string
    last_name?: string
    name?: string
    username: string
  }
}

export default function ActivityPage() {
  const [selectedStudent, setSelectedStudent] = useState('Svi')
  const [selectedLibrarian, setSelectedLibrarian] = useState('Svi')
  const [selectedBook, setSelectedBook] = useState('Sve')
  const [transaction, setTransaction] = useState('Sve')
  const [date, setDate] = useState('Svi')
  const [books, setBooks] = useState<string[]>([])
  const [librarians, setLibrarians] = useState<string[]>([])
  const [students, setStudents] = useState<string[]>([])
  const [rentalData, setRentalData] = useState<RentalRecord[]>()
  const [returnedBooksData, setReturnedBooksData] = useState<any[]>([])
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const [dataActivity, setDataActivity] = useState<Activity[]>([])
  const [allActivity, setAllActivity] = useState<boolean>(false)
  const role = useRole()

  console.log('role:', role)

  useEffect(() => {
    const loadRentals = async () => {
      const rentals = await getActiveRentals({
        per_page: 20,
      })
      setRentalData(rentals.data.data)
    }

    loadRentals()
  }, [])

  useEffect(() => {
    const res = getReturnedBooks({ per_page: 20 }).then((res) =>
      setReturnedBooksData(res.data.data)
    )
  }, [])

  useEffect(() => {
    const loadReservations = async () => {
      const rentals = await getActiveReservations()
      console.log(rentals.reservations.data)
      const reservations = rentals.reservations.data
      setReservationsData(reservations)
    }

    loadReservations()
  }, [])

  function daysAgo(dateString: string): number {
    const today = new Date()
    const givenDate = new Date(dateString)

    // razlika u milisekundama
    const diffTime = today.getTime() - givenDate.getTime()

    // pretvori u dane
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  useEffect(() => {
    if (!rentalData || !returnedBooksData) return

    const mappedRentals: Activity[] = rentalData.map((r: any) => ({
      role: 1,
      rental_id: r.rental_id,
      book_title: r.book_title,
      rental_date: r.rental_date,
      librarian: `${r.rented_out_by.first_name} ${r.rented_out_by.last_name}`,
      student: `${r.rented_by.first_name} ${r.rented_by.last_name}`,
      student_username: r.rented_by.username,
      librarian_username: r.rented_out_by.username,
    }))

    const mappedReturns: Activity[] = returnedBooksData.map((r: any) => ({
      role: 2,
      rental_id: r.rental_id,
      book_title: r.book_title,
      rental_date: r.rental_date,
      librarian: `${r.rented_out_by.first_name} ${r.rented_out_by.last_name}`,
      student: `${r.returned_by.first_name} ${r.returned_by.last_name}`,
      student_username: r.returned_by.username,
      librarian_username: r.rented_out_by.username,
    }))

    const mappedReservations: Activity[] = reservationsData.map(
      (r: Reservation) => ({
        role: 3,
        rental_id: r.id,
        book_title: r.book!.name,
        rental_date: r.reserved_at,
        librarian: r.librarian
          ? `${r.librarian.first_name} ${r.librarian.last_name}`
          : 'Nema', //POTREBNA PROMJENA NA BACKU DA VRATI BIBLIOTEKARA
        student: `${r.student.first_name} ${r.student.last_name}`,
        student_username: r.student.username,
        librarian_username: r.librarian ? r.librarian.username : 'nema',
      })
    )

    // spoji sve u jedan niz
    const combined = [...mappedRentals, ...mappedReturns, ...mappedReservations]

    //console.log('rezervacije:', reservationsData)

    // sortiraj po datumu (najskoriji prvi)
    combined.sort(
      (a, b) =>
        new Date(b.rental_date).getTime() - new Date(a.rental_date).getTime()
    )

    setDataActivity(combined)
  }, [rentalData, returnedBooksData, reservationsData])

  console.log('Activity:', dataActivity)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks(20, '')
        const fetchedBooks = response.books.data

        const titles = fetchedBooks.map((book: any) => book.name)
        setBooks(titles)
      } catch (err) {
        console.error(err)
      }
    }

    const fetchLibrarians = async () => {
      try {
        const response = await getAllStudents(50, '', 2)

        const fetchedLibrarians = response.data.data
        const names = fetchedLibrarians.map(
          (lib: any) => `${lib.first_name} ${lib.last_name}`
        )
        setLibrarians(names)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchStudents = async () => {
      try {
        const response = await getAllStudents(50, '', 1)

        const fetchedStudents = response.data.data
        const names = fetchedStudents.map(
          (student: any) => `${student.first_name} ${student.last_name}`
        )
        setStudents(names)
      } catch (error) {
        console.log(error)
      }
    }

    fetchStudents() // ispravim
    fetchLibrarians()

    fetchBooks()
  }, [])

  function deselectAll() {
    setTransaction('Sve')
    setSelectedBook('Sve')
    setSelectedStudent('Svi')
    setSelectedLibrarian('Svi')
    setDate('Svi')
  }

  // filtrirane aktivnosti
  const filteredActivity = dataActivity.filter((activity) => {
    // 1. Filtriraj po učeniku
    if (selectedStudent !== 'Svi' && activity.student !== selectedStudent) {
      return false
    }

    if (
      selectedLibrarian !== 'Svi' &&
      activity.librarian !== selectedLibrarian
    ) {
      return false
    }

    if (selectedBook !== 'Sve' && activity.book_title !== selectedBook) {
      return false
    }

    if (date !== 'Svi' && daysAgo(activity.rental_date) > Number(date)) {
      return false
    }

    // 2. Filtriraj po transakciji
    if (transaction !== 'Sve') {
      if (transaction === 'Izdavanje' && activity.role !== 1) return false
      if (transaction === 'Vraćanje' && activity.role !== 2) return false
      if (transaction === 'Rezervisanje' && activity.role !== 3) return false
    }

    return true
  })

  if (books && librarians && students)
    return (
      <Box className="px-4 py-6 text-xl font-medium capitalize">
        <h1>Prikaz Aktivnosti</h1>

        {/* Filteri */}

        <Box className="flex gap-4 mt-10">
          {role === 'librarian' && (
            <>
              <FormControl size="small" className="w-[170px]">
                <InputLabel>Učenici</InputLabel>
                <Select
                  value={selectedStudent}
                  label="Učenici"
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <MenuItem value="Svi">Svi</MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student} value={student}>
                      {student}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" className="w-[170px]">
                <InputLabel>Bibliotekari</InputLabel>
                <Select
                  value={selectedLibrarian}
                  label="Bibliotekari"
                  onChange={(e) => setSelectedLibrarian(e.target.value)}
                >
                  <MenuItem value="Svi">Svi</MenuItem>
                  {librarians.map((lib) => (
                    <MenuItem key={lib} value={lib}>
                      {lib}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>{' '}
            </>
          )}

          <FormControl size="small" className="w-[170px]">
            <InputLabel>Knjige</InputLabel>
            <Select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <MenuItem value="Sve">Sve</MenuItem>
              {books.map((book) => (
                <MenuItem key={book} value={book}>
                  {book}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="w-[170px]">
            <InputLabel>Transakcije</InputLabel>
            <Select
              value={transaction}
              label="Transakcije"
              onChange={(e) => setTransaction(e.target.value)}
            >
              <MenuItem value="Sve">Sve</MenuItem>
              <MenuItem value="Izdavanje">Izdavanje</MenuItem> {/* role = 1 */}
              <MenuItem value="Vraćanje">Vraćanje</MenuItem> {/* role = 2 */}
              <MenuItem value="Rezervisanje">Rezervisanje</MenuItem>{' '}
              {/* role = 3 */}
            </Select>
          </FormControl>

          <FormControl size="small" className="w-[170px]">
            <InputLabel>Datumi</InputLabel>
            <Select
              value={date}
              label="Datumi"
              onChange={(e) => setDate(e.target.value)}
            >
              <MenuItem value="Svi">Svi</MenuItem>
              <MenuItem value="7">Posljednjih 7 dana</MenuItem>
              <MenuItem value="30">Posljednji mjesec</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={() => deselectAll()}>
            <RestartAltIcon className="text-blue" />
          </Button>
        </Box>

        {/* Aktivnosti */}
        <Box className="mt-6">
          {filteredActivity.slice(0, 9).map((activity) => (
            <ActivityBox
              roleUser={role}
              id={activity.rental_id}
              key={`${activity.role}-${activity.rental_id}`}
              librarian={activity.librarian}
              role={activity.role}
              book_title={activity.book_title}
              student={activity.student}
              date={activity.rental_date}
              student_username={activity.student_username}
              librarian_username={activity.librarian_username}
            />
          ))}
        </Box>

        {allActivity && (
          <Box>
            {filteredActivity.slice(9).map((activity) => (
              <ActivityBox
                roleUser={role}
                key={`${activity.role}-${activity.rental_id}`}
                id={activity.rental_id}
                librarian={activity.librarian}
                role={activity.role}
                book_title={activity.book_title}
                student={activity.student}
                date={activity.rental_date}
                student_username={activity.student_username}
                librarian_username={activity.librarian_username}
              />
            ))}
          </Box>
        )}

        <Button
          className="bg-transparent text-blue border-[1px] border-blue w-[800px] mt-8"
          onClick={() => setAllActivity((pre) => !pre)}
        >
          {allActivity === true ? 'Show less' : 'Show'}
        </Button>
      </Box>
    )
}
