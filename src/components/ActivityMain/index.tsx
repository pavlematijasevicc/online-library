import {
  getActiveRentals,
  getActiveReservations,
  getReturnedBooks,
} from '@/utils/apiService'
import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import ActivityBox from '../ActivityBox'
import { Activity, RentalRecord } from '../../../types'
import Link from 'next/link'

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

type Props = {
  role: string
}

export default function ActivityMain({ role }: Props) {
  const [rentalData, setRentalData] = useState<RentalRecord[]>()
  const [returnedBooksData, setReturnedBooksData] = useState<any[]>([])
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const [dataActivity, setDataActivity] = useState<Activity[]>([])
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

    console.log('rezervacije:', reservationsData)

    // sortiraj po datumu (najskoriji prvi)
    combined.sort(
      (a, b) =>
        new Date(b.rental_date).getTime() - new Date(a.rental_date).getTime()
    )

    setDataActivity(combined)
  }, [rentalData, returnedBooksData, reservationsData])

  return (
    <Box className="w-[1000px]">
      {/* Aktivnosti */}
      <Box className="mt-10">
        <h2 className="font-normal text-base">Aktivnosti</h2>
        {dataActivity.slice(0, 10).map((activity) => (
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
      <Link href={'/activity'}>
        <Button className="bg-transparent text-blue border-[1px] border-blue w-[900px] mt-8">
          Show
        </Button>
      </Link>
    </Box>
  )
}
