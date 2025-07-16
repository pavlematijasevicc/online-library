import Link from 'next/link'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import WriteOfTheBookTable from '@/components/WriteOfTheBookTable'

export default function WriteOfTheBook() {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const path = usePathname()
  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  const handleEditClick = () => {
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  return (
    <div className="py-3 text-xl font-medium overflow-y-hidden">
      <div className="px-4 flex justify-between">
        <div className="flex flex-col">
          <h1 className="capitalize"> Tom Sojer </h1>
          <div className="mt-1 text-xs font-normal">
            <span className="text-blue">Evidencija knjiga</span>
            <span> /</span>
            <span className="uppercase text-blue"> knjiga-467</span>
            <span> /</span>
            <span className="capitalize text-blue"> otpisi knjigu</span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center px-4 mr-4 border-r-1 border-grey-line">
            <Link href={`${path}/write-of-the-book`}>
              <div className="px-2 pl-3 pr-4 text-blue text-sm hover:cursor-pointer bg-active py-2 rounded-sm">
                <HistoryEduOutlinedIcon
                  sx={{ width: '18px', height: '18px' }}
                />
                <span> Otpisi knjigu </span>
              </div>
            </Link>
            <div className="px-2 pl-3 pr-4 text-grey-text text-sm hover:cursor-pointer">
              <WavingHandOutlinedIcon sx={{ width: '18px', height: '18px' }} />
              <span> Izdaj knjigu </span>
            </div>
            <div className="px-2 pl-3 pr-4 text-grey-text text-sm hover:cursor-pointer">
              <AssignmentReturnOutlinedIcon
                sx={{ width: '18px', height: '18px' }}
              />
              <span> Vrati knjigu </span>
            </div>
            <div className="text-grey-text text-sm hover:cursor-pointer">
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
                <div
                  className="capitalize px-4 py-3 hover:cursor-pointer"
                  onClick={() => {
                    handleEditClick()
                  }}
                >
                  <CreateOutlinedIcon
                    sx={{
                      width: '20px',
                      height: '20px',
                    }}
                    className="mr-1"
                  />
                  Izmijeni podatke
                </div>
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
        </div>
      </div>
      <WriteOfTheBookTable />
    </div>
  )
}
