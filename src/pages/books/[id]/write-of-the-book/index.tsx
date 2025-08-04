'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { useEffect, useRef, useState } from 'react'
import WriteOfTheBookTable from '@/components/WriteOfTheBookTable'
import { BookData } from '../../../../../types'
import { deleteBook, fetchBookById } from '@/utils/apiService'

export default function WriteOfTheBook() {
  const [openMenu, setOpenMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [id, setId] = useState<number>()
  const [data, setData] = useState<BookData>()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      try {
        const parts = path.split('/')
        setId(Number(parts[2]))
      } catch (error) {
        console.error('Greška prilikom parsiranja ID-a:', error)
      }
    }
  }, [path])

  useEffect(() => {
    if (id) {
      const loadBook = async () => {
        try {
          const book = await fetchBookById(id)
          setData(book.book)
        } catch (err) {
          console.error('Greška prilikom učitavanja knjige:', err)
        }
      }

      loadBook()
    }
  }, [id])

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id)
      setShowDeleteModal(false)
      router.push('/books')
    } catch (err) {
      alert('Greška pri brisanju knjige.')
    }
  }

  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  const deleteConfirmation = (id: number) => {
    setShowDeleteModal(true)
    setOpenMenu(false)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleEditClick = () => {
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  if (path)
    return (
      <div className="py-3 text-xl font-medium overflow-y-hidden">
        <div className="px-4 flex justify-between">
          <div className="flex flex-col">
            <h1 className="capitalize"> {data?.name} </h1>
            <div className="mt-1 text-xs font-normal">
              <Link href={'/books'}>
                <span className="text-blue">Evidencija knjiga</span>
              </Link>
              <span> /</span>
              <Link href={`/books/${id}`}>
                <span className="uppercase text-blue"> knjiga-{id}</span>
              </Link>

              <span> /</span>
              <span className="capitalize text-blue"> otpisi knjigu</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center px-4 mr-4 border-r-1 border-grey-line">
              <div className="px-2 pl-3 mr-4 text-blue text-sm hover:cursor-pointer bg-active py-2 rounded-sm">
                <HistoryEduOutlinedIcon
                  sx={{ width: '18px', height: '18px' }}
                />
                <span> Otpisi knjigu </span>
              </div>
              <Link
                href={`${path.split('/').slice(0, -1).join('/')}/issue-book`}
              >
                <div className="px-2 pl-3 mr-4 text-grey-text text-sm hover:cursor-pointer">
                  <WavingHandOutlinedIcon
                    sx={{ width: '18px', height: '18px' }}
                  />
                  <span> Izdaj knjigu </span>
                </div>
              </Link>
              <Link
                href={`${path
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/return-the-book`}
              >
                <div className="px-2 pl-3 mr-4 text-grey-text text-sm hover:cursor-pointer">
                  <AssignmentReturnOutlinedIcon
                    sx={{ width: '18px', height: '18px' }}
                  />
                  <span> Vrati knjigu </span>
                </div>
              </Link>
              <Link
                href={`${path
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/reserve-the-book`}
              >
                <div className="text-grey-text text-sm hover:cursor-pointer">
                  <EventAvailableIcon sx={{ width: '18px', height: '18px' }} />
                  <span> Rezervisi knjigu </span>
                </div>
              </Link>
            </div>
            <div onClick={toggleMenu}>
              <MoreVertIcon className="text-grey-text hover:cursor-pointer" />
            </div>
            {openMenu && (
              <>
                <div
                  className="fixed inset-0 bg-transparent"
                  onClick={() => setOpenMenu(false)}
                />
                <div className="absolute w-[320px] -mr-40 mt-40 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-90 text-left">
                  <Link href={`${path.split('/').slice(0, -1).join('/')}`}>
                    <div
                      className="capitalize px-4 py-3 hover:cursor-pointer"
                      onClick={handleEditClick}
                    >
                      <CreateOutlinedIcon
                        className="mr-1"
                        sx={{ width: '20px', height: '20px' }}
                      />
                      Izmijeni podatke
                    </div>
                  </Link>
                  <div
                    className="capitalize px-4 py-3 hover:cursor-pointer"
                    onClick={() => deleteConfirmation(id!)}
                  >
                    <DeleteOutlineIcon
                      className="mr-1"
                      sx={{ width: '20px', height: '20px' }}
                    />
                    Izbrisi knjigu
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <WriteOfTheBookTable />

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
                  onClick={() => handleDeleteBook(id!)}
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
      </div>
    )
}
