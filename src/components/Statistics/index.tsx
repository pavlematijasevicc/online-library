import {
  getActiveRentals,
  getActiveReservations,
  getOverdueBooks,
  getReturnedBooks,
} from '@/utils/apiService'
import { Box, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { RentalRecord, Reservation } from '../../../types'
import Link from 'next/link'

interface DataOverdue {
  id: number
  book: { image: string; title: string }
  issueDate: string
  issuedTo: string
  overdueDays: number
  retentionStatus: string
}

export default function Statistics() {
  const [rentalData, setRentalData] = useState<RentalRecord[]>()
  const [overdueData, setOverdueData] = useState<DataOverdue[]>([])
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const [rentalsLength, setRentalsLength] = useState<number>(0)
  const [overdueLength, setOverdueLength] = useState<number>(0)
  const [reservationsLength, setReservationsLength] = useState<number>(0)

  useEffect(() => {
    getOverdueBooks({ per_page: 20 }).then((res) => {
      const mappedData: DataOverdue[] = res.data.data.map((item: any) => ({
        id: item.rental_id,
        book: {
          image: '', // ako nema slike, može ostati prazan string
          title: item.book_title,
        },
        issuedTo: `${item.rented_by.name} ${item.rented_by.last_name}`,
        issueDate: item.rental_date.split(' ')[0], // samo datum bez vremena
        overdueDays: item.days_overdue,
        retentionStatus: `${item.total_rental_days} dana`,
      }))
      setOverdueData(mappedData)
    })
  }, [])

  console.log('overdue:', overdueData)

  useEffect(() => {
    const loadRentals = async () => {
      const rentals = await getActiveRentals({
        per_page: 20,
      })
      setRentalData(rentals.data.data)
    }

    const loadReservations = async () => {
      const rentals = await getActiveReservations()
      console.log(rentals.reservations.data)
      const reservations = rentals.reservations.data
      setReservationsData(reservations)
    }

    loadReservations()

    loadRentals()
  }, [])

  useEffect(() => {
    if (rentalData) {
      setRentalsLength(rentalData.length)
    }
  }, [rentalData])

  useEffect(() => {
    if (overdueData) {
      setOverdueLength(overdueData.length)
    }
  }, [overdueData])

  useEffect(() => {
    if (reservationsData) {
      setReservationsLength(reservationsData.length)
    }
  }, [reservationsData])

  const axisValues = [0, 20, 40, 60, 80, 100]

  if (rentalData && overdueData && reservationsData)
    return (
      <Box sx={{ width: '650px' }}>
        <h2 className="font-normal text-base mb-4">Statistika</h2>
        {/* Bars */}
        <Box key="0" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* Label */}
          <Link href={'/publication'}>
            <Typography
              variant="body2"
              className="text-blue"
              align="right"
              sx={{ width: 150, mr: 2 }}
            >
              Izdate knjige
            </Typography>
          </Link>

          {/* Progress bar */}
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress
              variant="determinate"
              value={rentalsLength}
              color="success"
              sx={{ height: 15, borderRadius: 2 }}
            />
          </Box>

          <Typography variant="body2">{rentalsLength}</Typography>
        </Box>
        <Box key="1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* Label */}
          <Link href={'/publication?tab=4'}>
            <Typography
              variant="body2"
              className="text-blue"
              align="right"
              sx={{ width: 150, mr: 2 }}
            >
              Rezervisane knjige
            </Typography>
          </Link>

          {/* Progress bar */}
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress
              variant="determinate"
              value={reservationsLength}
              color="warning"
              sx={{ height: 15, borderRadius: 2 }}
            />
          </Box>

          <Typography variant="body2">{reservationsLength}</Typography>
        </Box>
        <Box key="2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* Label */}
          <Link href={'/publication?tab=3'}>
            <Typography
              variant="body2"
              className="text-blue"
              align="right"
              sx={{ width: 150, mr: 2 }}
            >
              Knjige u prekoracenju
            </Typography>
          </Link>

          {/* Progress bar */}
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress
              variant="determinate"
              value={overdueLength}
              color="error"
              sx={{ height: 15, borderRadius: 2 }}
            />
          </Box>

          <Typography variant="body2">{overdueLength}</Typography>
        </Box>

        {/* Brojevi */}
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: '150px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 'calc(100% - 40px)',
              ml: 2,
            }}
          >
            {axisValues.map((val) => (
              <Typography key={val} variant="body2">
                {val}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    )
}
