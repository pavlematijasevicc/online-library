import { FormEvent, useEffect, useState } from 'react'
import { Box, TextField, FormHelperText } from '@mui/material'
import { editPeriod, fetchAllPolicies } from '@/utils/apiService'

type Policy = {
  id: number
  period: number
  name?: string
}

export default function Rokovi() {
  const [reservationPeriod, setReservationPeriod] = useState('')
  const [rentalPeriod, setRentalPeriod] = useState('')

  const [reservationError, setReservationError] = useState('')
  const [returnError, setReturnError] = useState('')
  const [policies, setPolicies] = useState<Policy[]>([])

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await fetchAllPolicies()
        setPolicies(data)
      } catch (err) {
        console.error('Greška prilikom učitavanja politika:', err)
      }
    }

    loadPolicies()
  }, [])

  const handleSubmitReservation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!reservationPeriod.trim()) {
      setReservationError('Polje ne smije biti prazno')
      return
    }

    if (!/^\d+$/.test(reservationPeriod)) {
      setReservationError('Unesite isključivo broj')
      return
    }

    setReservationError('')

    try {
      console.log('Rok za rezervaciju:', reservationPeriod)
      await editPeriod(2, { period: Number(reservationPeriod) })
      console.log('Period rezervacije uspješno ažuriran')
    } catch (error) {
      console.error('Greška pri ažuriranju perioda rezervacije:', error)
      setReservationError('Došlo je do greške pri spremanju podataka')
    }
  }

  const handleSubmitReturn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!rentalPeriod.trim()) {
      setReturnError('Polje ne smije biti prazno')
      return
    }

    if (!/^\d+$/.test(rentalPeriod)) {
      setReturnError('Unesite isključivo broj')
      return
    }

    setReturnError('')

    try {
      console.log('Rok vraćanja:', rentalPeriod)
      await editPeriod(1, { period: Number(rentalPeriod) })
      console.log('Period vraćanja uspješno ažuriran')
    } catch (error) {
      console.error('Greška pri ažuriranju perioda vraćanja:', error)
      setReturnError('Došlo je do greške pri spremanju podataka')
    }
  }

  if (policies)
    return (
      <>
        {/* Rok za rezervaciju */}
        <Box className="flex items-center">
          <Box className="w-[320px] my-4 mr-8">
            <h3 className="text-base font-medium">Rok za rezervaciju</h3>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fringilla
              mauris dolor sed duis quam mi faucibus sit eleifend. Sed lobortis
              ornare porttitor lectus dictum. Turpis diam non pellentesque nisl
              rhoncu.
            </p>
          </Box>
          <Box className="flex flex-col">
            <Box
              component="form"
              onSubmit={(e) => handleSubmitReservation(e)}
              className="flex items-center"
            >
              <TextField
                className="w-[280px] h-[48px]"
                placeholder={
                  policies.length > 0 ? String(policies[1].period) : '...'
                }
                value={reservationPeriod}
                onChange={(e) => setReservationPeriod(e.target.value)}
                error={Boolean(reservationError)}
              />
              <span className="ml-3 text-base">dana!</span>
            </Box>
            {reservationError && (
              <FormHelperText className="mt-4" error>
                {reservationError}
              </FormHelperText>
            )}
          </Box>
        </Box>

        {/* Rok vraćanja */}
        <Box className="flex items-center">
          <Box className="w-[320px] my-4 mr-8">
            <h3 className="text-base font-medium">Rok vraćanja</h3>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fringilla
              mauris dolor sed duis quam mi faucibus sit eleifend. Sed lobortis
              ornare porttitor lectus dictum. Turpis diam non pellentesque nisl
              rhoncu.
            </p>
          </Box>
          <Box className="flex flex-col">
            <Box
              component="form"
              onSubmit={(e) => handleSubmitReturn(e)}
              className="flex items-center"
            >
              <TextField
                className="w-[280px] h-[48px]"
                placeholder={
                  policies.length > 0 ? String(policies[0].period) : '...'
                }
                value={rentalPeriod}
                onChange={(e) => setRentalPeriod(e.target.value)}
                error={Boolean(returnError)}
              />
              <span className="ml-3 text-base">dana!</span>
            </Box>
            {returnError && (
              <FormHelperText className="mt-4" error>
                {returnError}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </>
    )
}
