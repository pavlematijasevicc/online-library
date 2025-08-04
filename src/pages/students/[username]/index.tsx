import RecordsStudent from '@/components/RecordsStudent'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Link, Tab } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Student } from '../../../../types'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { usePathname, useRouter } from 'next/navigation'
import { deleteUser, viewUser } from '@/utils/apiService'
import StudentForm from '@/components/StudentForm'
import EditStudent from '@/components/EditStudent'

export default function StudentPage() {
  const [value, setValue] = useState('1')
  const [data, setData] = useState<Student>()
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [username, setUsername] = useState<string>('')
  const nameInputRef = useRef<HTMLInputElement>(null)
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      try {
        let string = path.split('/')
        setUsername(string[2])
      } catch (error) {
        console.error('Greška prilikom učitavanja knjige:', error)
      }
    }
  }, [path])

  console.log('Username:', username)
  console.log('fetchec data, fetched name:', data, data?.first_name)

  useEffect(() => {
    if (!username) return // Izbjegava poziv ako je username prazan

    const fetchData = async () => {
      try {
        const userData = await viewUser(username)
        console.log(userData)
        setData(userData[0])
      } catch (error) {
        console.error('Greška pri dohvatu podataka o studentu:', error)
      }
    }

    fetchData()
  }, [username])

  const handleEditClick = () => {
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  const handleDeleteStudent = async (id: number) => {
    try {
      await deleteUser(id)
      setShowDeleteModal(false)
      router.push('/students')
    } catch (err) {
      alert('Greška pri brisanju ucenika.')
    }
  }

  const deleteConfirmation = (id: number) => {
    setShowDeleteModal(true)
    setOpenMenu(false)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  //Funkcija koja mijenja koji je task prikazan
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  //Funkcija koja otvara meni kada se kliknu tri tacke
  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  if (data)
    return (
      <div className="py-3 text-xl font-medium overflow-y-hidden">
        <div className="px-4 flex justify-between">
          <div className="flex flex-col">
            <h1 className="capitalize">
              {data.first_name} {data.last_name}
            </h1>
            <div className="mt-1 text-xs font-normal">
              <Link href={'/students'}>
                <span className="text-blue">Svi Ucenici</span>
              </Link>
              <span> /</span>
              <span className="uppercase text-blue"> ID-{data.id}</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center px-4 mr-4 border-r-1 border-grey-line">
              <div
                className="text-grey-text text-sm hover:cursor-pointer"
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
                <span> Izmijeni podatke </span>
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
                <div className="absolute w-[320px] mr-30 mt-40 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-90 text-left">
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
                    Izbrisi ucenika
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
                  label="Evidencija iznajmljivanja"
                  value="2"
                  className="p-4 text-sm font-normal ml-4"
                  sx={{
                    '&.Mui-selected': {
                      color: '#3392EA', // boja kada je tab aktivan
                    },
                  }}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <EditStudent
                data={data}
                setData={setData}
                nameInputRef={nameInputRef}
              />
            </TabPanel>
            <TabPanel value="2">
              <RecordsStudent />
            </TabPanel>
          </TabContext>
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
                    onClick={() => handleDeleteStudent(data.id!)}
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
      </div>
    )
}
