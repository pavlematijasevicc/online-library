import { Box, Button } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import WarningIcon from '@mui/icons-material/Warning'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventNoteIcon from '@mui/icons-material/EventNote'
import { useEffect, useState } from 'react'
import PublicationPublishedBooks from '@/components/PublicationPublishedBooks'
import PublicationReturnedBooks from '@/components/PublicationReturnedBooks'
import PublicationOverdueBooks from '@/components/PublicationOverdueBooks'
import PublicationReservationsActive from '@/components/PublicationReservationsActive'
import PublicationArchivedReservations from '@/components/PublicationReservationsArchived'
import { useRouter } from 'next/router'

export default function Publication() {
  const [activeItem, setActiveItem] = useState<number>(1)
  const router = useRouter()
  const { tab } = router.query

  useEffect(() => {
    if (tab) {
      setActiveItem(Number(tab))
    }
  }, [tab])

  return (
    <Box className="px-4 py-6 text-xl font-medium">
      <h1> Izdavanje knjiga </h1>

      <Box className="mt-11 mb-4"></Box>
      <Box className="flex">
        <Box className="text-base font-normal text-grey-text w-[247px]">
          <Box
            className={
              activeItem === 1
                ? 'text-blue mb-4 flex items-center hover:cursor-pointer bg-active p-2'
                : 'text-grey-text mb-4 flex items-center hover:cursor-pointer p-2'
            }
            onClick={() => setActiveItem(1)}
          >
            <FileCopyIcon className="mr-4" /> Izdate knjige
          </Box>
          <Box
            className={
              activeItem === 2
                ? 'text-blue mb-4 flex items-center hover:cursor-pointer bg-active p-2'
                : 'text-grey-text mb-4 flex items-center hover:cursor-pointer p-2'
            }
            onClick={() => setActiveItem(2)}
          >
            <InsertDriveFileIcon className="mr-4" /> Vracene knjige
          </Box>
          <Box
            className={
              activeItem === 3
                ? 'text-blue mb-4 flex items-center hover:cursor-pointer bg-active p-2'
                : 'text-grey-text mb-4 flex items-center hover:cursor-pointer p-2'
            }
            onClick={() => setActiveItem(3)}
          >
            <WarningIcon className="mr-4" /> Knjige u prekoracenju
          </Box>
          <Box
            className={
              activeItem === 4
                ? 'text-blue mb-4 flex items-center hover:cursor-pointer bg-active p-2'
                : 'text-grey-text mb-4 flex items-center hover:cursor-pointer p-2'
            }
            onClick={() => setActiveItem(4)}
          >
            <EventAvailableIcon className="mr-4" /> Aktivne rezervacije
          </Box>
          <Box
            className={
              activeItem === 5
                ? 'text-blue mb-4 flex items-center hover:cursor-pointer bg-active p-2'
                : 'text-grey-text mb-4 flex items-center hover:cursor-pointer p-2'
            }
            onClick={() => setActiveItem(5)}
          >
            <EventNoteIcon className="mr-4" /> Arhivirane rezervacije
          </Box>
        </Box>
        {activeItem === 1 && <PublicationPublishedBooks />}
        {activeItem === 2 && <PublicationReturnedBooks />}
        {activeItem === 3 && <PublicationOverdueBooks />}
        {activeItem === 4 && <PublicationReservationsActive />}
        {activeItem === 5 && <PublicationArchivedReservations />}
      </Box>
    </Box>
  )
}
