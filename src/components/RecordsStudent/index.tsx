import { Box } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import WarningIcon from '@mui/icons-material/Warning'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventNoteIcon from '@mui/icons-material/EventNote'
import { useState } from 'react'
import PublishedBooksTable from '../PublishedBooksTable'
import ReturnedBooks from '../ReturnedBooks'
import OverdueBooks from '../OverdueBooks'
import PublishedBooksTableStudents from '../PublishedBooksTableStudents'
import ReturnedBooksStudent from '../ReturnedBooksStudent'
import OverdueBooksStudent from '../OverdueBooksStudent'
import { Student } from '../../../types'
import ActiveReservationsStudent from '../ActiveReservationsStudent'
import ArchivedReservationsStudent from '../ArchivedReservationsStudent'

type RecordsStudentsProps = {
  data: Student
}

export default function RecordsStudent({ data }: RecordsStudentsProps) {
  const [activeItem, setActiveItem] = useState<number>(1)
  return (
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
      {activeItem === 1 && (
        <PublishedBooksTableStudents data={data} width={1465} />
      )}
      {activeItem === 2 && <ReturnedBooksStudent data={data} width={1465} />}
      {activeItem === 3 && <OverdueBooksStudent data={data} width={1465} />}
      {activeItem === 4 && <ActiveReservationsStudent data={data} />}
      {activeItem === 5 && <ArchivedReservationsStudent data={data} />}
    </Box>
  )
}
