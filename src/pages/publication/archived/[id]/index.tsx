import { Box, Button, Link } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import book from '../../../../../public/book.jpg'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Image from 'next/image'
import {
  deleteBook,
  getActiveReservations,
  getArchivedReservations,
  viewTransaction,
} from '@/utils/apiService'
import useRole from '@/hooks/useRole'

export type Reservation = {
  id: number
  book_id?: number
  status: 'reserved' | 'canceled' | 'completed' // promjena
  reserved_at: string
  expires_at: string
  created_at?: string
  updated_at?: string
  librarian_id: number
  book: {
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

export default function ViewArchivedBook() {
  const path = usePathname()
  const [id, setId] = useState<number>()
  const [reservationsData, setReservationsData] = useState<Reservation[]>([])
  const [reservation, setReservation] = useState<Reservation>()
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()
  const role = useRole()

  useEffect(() => {
    if (path) {
      try {
        let string = path.split('/')
        setId(Number(string[3]))
      } catch (error) {
        console.error('Greška prilikom učitavanja transakcije:', error)
      }
    }
  }, [path])

  console.log('id:', id)

  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  useEffect(() => {
    const loadReservations = async () => {
      const rentals = await getArchivedReservations()
      console.log(rentals.reservations.data)
      const reservations = rentals.reservations.data
      setReservationsData(reservations)
    }
    loadReservations()
  }, [id])

  useEffect(() => {
    reservationsData.forEach((res) => {
      if (res.id === id) setReservation(res)
    })
  }, [reservationsData])

  console.log('rezervacije:', reservationsData)

  function diffDays(dateStr: string): number {
    const reservedDate = new Date(dateStr.split(' ')[0])
    const today = new Date()

    const diffTime = today.getTime() - reservedDate.getTime()
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id)
      setShowDeleteModal(false)
      router.push('/publication')
    } catch (err) {
      alert('Greška pri brisanju knjige.')
    }
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  if (reservation)
    return (
      <Box className="px-4 py-3 text-xl font-medium ">
        <Box className="flex">
          <Box className="flex justify-between items-center">
            <Box className="max-w-[463px]">
              <h1 className="capitalize">{reservation.book.name}</h1>
              <Box className="mt-1 text-xs font-normal">
                <Link href={'/publication'}>
                  <span className="text-blue">Evidencija knjiga</span>
                </Link>
                {role === 'librarian' && (
                  <>
                    <span> / </span>
                    <span className="text-blue">
                      Knjiga-{reservation.book.id}
                    </span>
                  </>
                )}

                <span> / </span>
                <span className="text-blue">ID-{id}</span>
              </Box>
            </Box>
          </Box>
          <Box className="flex ml-auto items-center justify-center">
            <Box
              className={
                role === 'librarian'
                  ? 'flex items-center px-4 mr-4 border-r-1 border-grey-line'
                  : 'flex items-center px-4 mr-4'
              }
            >
              {role === 'librarian' && (
                <>
                  <Link
                    href={`/books/${reservation.book.id}/write-of-the-book`}
                  >
                    <div className="px-2 pl-3 pr-4 text-grey-text text-sm hover:cursor-pointer">
                      <HistoryEduOutlinedIcon
                        sx={{ width: '18px', height: '18px' }}
                      />
                      <span> Otpisi knjigu </span>
                    </div>
                  </Link>
                  <Link href={`/books/${reservation.book.id}/issue-book`}>
                    <div className="px-2 pl-3 pr-4 text-grey-text text-sm hover:cursor-pointer">
                      <WavingHandOutlinedIcon
                        sx={{ width: '18px', height: '18px' }}
                      />
                      <span> Izdaj knjigu </span>
                    </div>
                  </Link>
                  <Link href={`/books/${reservation.book.id}/return-the-book`}>
                    <div className="px-2 pl-3 pr-4 text-grey-text text-sm hover:cursor-pointer">
                      <AssignmentReturnOutlinedIcon
                        sx={{ width: '18px', height: '18px' }}
                      />
                      <span> Vrati knjigu </span>
                    </div>
                  </Link>
                </>
              )}

              <Link href={`/books/${reservation.book.id}/reserve-the-book`}>
                <div className="text-grey-text text-sm hover:cursor-pointer">
                  <EventAvailableIcon sx={{ width: '18px', height: '18px' }} />
                  <span> Rezervisi knjigu </span>
                </div>
              </Link>
            </Box>
            {role === 'librarian' && (
              <div onClick={() => toggleMenu()}>
                <MoreVertIcon className="text-grey-text hover:cursor-pointer" />
              </div>
            )}

            {openMenu === true && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-transparent"
                  onClick={() => setOpenMenu(false)}
                ></div>
                <div className="absolute w-[320px] -mr-40 mt-40 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-90 text-left">
                  <div
                    className="capitalize px-4 py-3 hover:cursor-pointer"
                    onClick={() => {
                      setShowDeleteModal(true)
                      setOpenMenu(false)
                    }}
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
          </Box>
        </Box>

        <Box>
          <Image alt="profilna slika" src={book} className="mt-6 w-[132px]" />
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Tip transakcije </span>
            <span className="text-mytext">
              <Button
                variant="outlined"
                className="text-sm font-normal px-3 py-2 border-blue text-blue rounded-4xl"
              >
                Izdato
              </Button>
            </span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col">
            <span className="text-grey-text mb-2"> Datum akcije </span>
            <span className="text-mytext">
              {reservation.reserved_at.split(' ')[0]}
            </span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2">
              Trenutno zadrzavanje knjige
            </span>
            <span className="text-mytext">
              {diffDays(reservation.reserved_at)} dana(a)
            </span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Prekoracenje </span>

            {diffDays(reservation.reserved_at) < 7 ? (
              <span className="text-mytext">Nema prekoracenja</span>
            ) : (
              <span>{diffDays(reservation.reserved_at) - 7} dan(a)</span>
            )}
          </Box>

          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Ucenik </span>
            {role === 'librarian' ? (
              <Link href={`/librarians/${reservation.student.username}`}>
                <span className="text-blue">
                  {reservation.student.first_name}{' '}
                  {reservation.student.last_name}
                </span>
              </Link>
            ) : (
              <span>
                {reservation.student.first_name} {reservation.student.last_name}
              </span>
            )}
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
                  onClick={() => handleDeleteBook(reservation.book.id)}
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
      </Box>
    )
}
