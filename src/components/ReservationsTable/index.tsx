import { getActiveReservations } from '@/utils/apiService'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import Request from '../Request'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import Link from 'next/link'

export type Reservation = {
  id: number
  book_id: number
  status: 'reserved' | 'pending' | 'rejected'
  reserved_at: string
  expires_at: string
  created_at?: string
  updated_at?: string
  book?: {
    id: number
    name: string
  }
  student: {
    id: number
    first_name?: string
    last_name?: string
    name?: string
  }
}

export default function ReservationsTable() {
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const loadReservations = async () => {
    const rentals = await getActiveReservations()
    console.log(rentals.reservations.data)
    const reservations = rentals.reservations.data
    const reservation = reservations.filter((res: Reservation) => {
      return res.status === 'pending'
    })
    setReservationsData(reservation)
  }

  console.log('rezervacije:', reservationsData)

  useEffect(() => {
    loadReservations()
  }, [])

  if (reservationsData)
    return (
      <Box className="w-[830px]  mb-8 ">
        {/* Aktivnosti */}
        <Box className="mt-10 mb-4">
          <h2 className="font-normal text-base">Rezervacije knjiga</h2>
          {reservationsData.length === 0 && (
            <Box>
              <span className="text-sm font-normal normal-case ">
                Trenutno nema zahtjeva za rezervacijom!
              </span>
            </Box>
          )}
          {reservationsData.map((r) => (
            <Request
              key={r.id}
              book={r.book!.name}
              reserved_at={r.reserved_at}
              student={r.student.first_name!}
              reservation_id={r.id}
            />
          ))}
        </Box>
        {reservationsData.length > 0 && (
          <Link href={'/publication?tab=4'}>
            <Box className="flex capitalize text-blue text-sm items-center justify-end mr-2">
              <InsertInvitationIcon className="w-[24px] mr-2" />
              prikazi sve
            </Box>
          </Link>
        )}
      </Box>
    )
}
