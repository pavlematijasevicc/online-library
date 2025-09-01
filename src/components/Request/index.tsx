import { Box, Button } from '@mui/material'
import Image from 'next/image'
import avatar from '../../../public/pero.png'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { confirmReservation, rejectReservation } from '@/utils/apiService'

export type RequestProps = {
  book: string
  reserved_at: string
  student: string
  reservation_id: number
}

export default function Request({
  book,
  reserved_at,
  student,
  reservation_id,
}: RequestProps) {
  const confirmation = async () => {
    try {
      const res = await confirmReservation(reservation_id)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const rejectRes = async () => {
    try {
      const res = await rejectReservation(reservation_id)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box className="flex border-grey-line border-b-1 text-sm  items-center w-[838px] py-2 px-4">
      <Box className="flex items-center w-[230px] mr-4">
        <Image
          alt="avatar"
          src={avatar}
          className="mr-4 hover:cursor-pointer w-[35px] h-[35px]"
        />
        <span className="font-bold"> {student}</span>
      </Box>

      <span className="w-[230px] mr-4"> {book}</span>
      <span className="mr-25"> {reserved_at.split(' ')[0]}</span>
      <span>
        <Button onClick={() => confirmation()}>
          <CheckIcon className="text-grey-text" />
        </Button>
        <Button onClick={() => rejectRes()}>
          <CloseIcon className="text-grey-text" />
        </Button>
      </span>
    </Box>
  )
}
