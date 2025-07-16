import BookForm from '@/components/BookForm'
import BookSpecification from '@/components/BookSpecification'
import Multimedia from '@/components/Multimedia'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Link, Tab } from '@mui/material'
import React, { useRef, useState } from 'react'
import { BookData } from '../../../../types'
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import Records from '@/components/Records'
import { usePathname } from 'next/navigation'

export default function Book() {
  const [value, setValue] = React.useState('1')
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const path = usePathname()
  const [bookData, setBookData] = React.useState<BookData>({
    // BookForm
    name: '',
    description: '',
    categories: [],
    genres: [],
    authors: [],
    publishers: [],
    year: null,
    number_of_copies_available: null,

    // BookSpecification
    number_of_pages: null,
    script: '',
    binding: '',
    dimensions: '',
    isbn: '',
    format: '',
    language: '',

    // Multimedia
    images: null as File[] | null,
  })

  const handleEditClick = () => {
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
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
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center px-4 mr-4 border-r-1 border-grey-line">
            <Link
              href={
                path.endsWith('/write-of-the-book') // greska, obavezno ispraviti posle odmora !!!!!!!!!!
                  ? path
                  : `${path}/write-of-the-book`
              }
            >
              <div className="px-2 pl-3 pr-4 text-grey-text text-sm hover:cursor-pointer">
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

      <Box
        sx={{ width: '100%', typography: 'body1' }}
        className="mt-[10px] mb-0"
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#3392EA',
                },
              }}
            >
              <Tab
                label="Osnovni detalji"
                value="1"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Specifikacija"
                value="2"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Multimedia"
                value="3"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Evidencija iznajmljivanja"
                value="4"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
            </TabList>
            <Box className="z-1 p-8 flex flex-col absolute ml-[1500px] bg-white border-l-1 border-b-1 border-grey-line -mt-12.5 text-base font-normal w-[349px]">
              <Box className="flex items-center justify-between text-grey-text mb-4">
                Na raspolaganju:
                <Button
                  variant="outlined"
                  className="text-sm font-normal px-3 py-2 border-green-500 text-green-500"
                >
                  5 primjeraka
                </Button>
              </Box>
              <Box className="flex items-center justify-between text-grey-text mb-4">
                Rezervisano:
                <Button
                  variant="outlined"
                  className="text-sm font-normal px-3 py-2 text-orange-400 border-orange-400"
                >
                  2 primjerka
                </Button>
              </Box>
              <Box className="flex items-center justify-between text-grey-text mb-4">
                Izdato:
                <Button
                  variant="outlined"
                  className="text-sm font-normal px-3 py-2 border-blue text-blue"
                >
                  102 primjerka
                </Button>
              </Box>
              <Box className="flex items-center justify-between text-grey-text mb-4">
                U prekoracenju:
                <Button
                  variant="outlined"
                  className="text-sm font-normal px-3 py-2 border-red-500 text-red-500"
                >
                  2 primjerka
                </Button>
              </Box>
              <Box className="flex items-center justify-between text-grey-text mb-4">
                Ukupna kolicina:
                <Button
                  variant="outlined"
                  className="text-sm font-normal px-3 py-2 border-gray-500 text-gray-500"
                >
                  15 primjeraka
                </Button>
              </Box>
            </Box>
            <Box className="p-8 flex flex-col absolute ml-[1500px] bg-white border-l-1 z-0 border-grey-line mt-71 text-base font-normal w-[349px] h-[100%]"></Box>
          </Box>
          <TabPanel value="1">
            <BookForm
              nameInputRef={nameInputRef}
              bookData={bookData}
              setBookData={setBookData}
              value={value}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value="2">
            <BookSpecification
              nameInputRef={nameInputRef}
              bookData={bookData}
              setBookData={setBookData}
              value={value}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value="3">
            <Multimedia
              nameInputRef={nameInputRef}
              bookData={bookData}
              setBookData={setBookData}
              value={value}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value="4">
            <Records />
          </TabPanel>
        </TabContext>
        {showDeleteModal && (
          <div className="fixed inset-0 z-99 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            {/* Modal box */}
            <div className="z-50 bg-white p-6 rounded-xl shadow-lg w-[320px] relative text-center">
              <p className="text-gray-800 text-base font-medium mb-6">
                Da li ste sigurni da želite da obrišete knjigu?
              </p>
              <div className="flex justify-between">
                <button
                  //onClick={() => handleDeleteBook()}
                  className="uppercase w-[124px] text-sm font-medium py-2 px-4 bg-blue text-white rounded hover:bg-blue-500 transition-colors duration-200 hover:cursor-pointer"
                >
                  Potvrdi
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="uppercase w-[124px] bg-blue text-sm font-medium py-2 px-4 text-white rounded hover:cursor-pointer hover:bg-blue-500 transition-colors duration-200"
                >
                  Poništi
                </button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </div>
  )
}
