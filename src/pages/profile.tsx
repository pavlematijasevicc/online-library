import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import photo from '../../public/peroperovic.png'
import { useEffect, useState } from 'react'
import { ActiveUser } from '../../types'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { RollerShades, Visibility, VisibilityOff } from '@mui/icons-material'
import { deleteUser } from '@/utils/apiService'
import { useRouter } from 'next/router'
import { checkPassword } from '@/utils/utiles'

export default function Profile() {
  const [user, setUser] = useState<ActiveUser | null>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [resetModal, setResetModal] = useState(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [password_repeat, setPasswordRepeat] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordRepeatError, setPasswordRepeatError] = useState<string | null>(
    null
  )
  const router = useRouter()

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      const parsedUser: ActiveUser = JSON.parse(userString)
      console.log('User ucitan iz localStorage:', parsedUser)
      setUser(parsedUser)
    }
  }, [])

  console.log('user:', user)

  const handleToggleVisibility = () => setShowPassword((prev) => !prev)
  const handleToggleVisibility2 = () => setShowPassword2((prev) => !prev)

  //Funkcija koja otvara meni kada se kliknu tri tacke
  function toggleMenu() {
    setOpenMenu((prev) => !prev)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const closePasswordModal = () => {
    setResetModal(false)
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id)
      setShowDeleteModal(false)
      router.push('/')
    } catch (err) {
      alert('Greška pri brisanju profila.')
    }
  }

  const handleDeleteFields = (e: React.FormEvent) => {
    e.preventDefault()
    setPassword('')
    setPasswordRepeat('')
  }

  const sendPasswords = () => {
    console.log('poslato')
  }

  if (user)
    return (
      <Box className="py-3 text-xl font-medium overflow-y-hidden px-4">
        <Box className="flex">
          <Box>
            <h1 className="capitalize">
              {user.first_name} {user.last_name}
            </h1>
            <Box className="mt-1 text-xs font-normal">
              <Link
                href={user.role === 'librarian' ? '/librarians' : '/students'}
              >
                <span className="text-blue">
                  {user.role === 'librarian'
                    ? 'Svi bibliotekari'
                    : 'Svi ucenici'}
                </span>
              </Link>
              <span className="uppercase"> / ID-{user.id} </span>
            </Box>
          </Box>
          <Box className="flex items-center justify-center ml-auto">
            <Box className="flex items-center px-4 mr-4 border-r-1 border-grey-line">
              <Box
                className="text-grey-text text-sm hover:cursor-pointer mr-4"
                onClick={() => setResetModal(true)}
              >
                <RestartAltIcon
                  sx={{
                    width: '20px',
                    height: '20px',
                  }}
                  className="mr-1"
                />
                <span> Resetuj sifru </span>
              </Box>

              <Link
                href={
                  user.role === 'librarian'
                    ? `/librarians/${user.username}`
                    : `/students/${user.username}`
                }
              >
                <Box className="text-grey-text text-sm hover:cursor-pointer">
                  <CreateOutlinedIcon
                    sx={{
                      width: '20px',
                      height: '20px',
                    }}
                    className="mr-1"
                  />
                  <span> Izmijeni podatke </span>
                </Box>
              </Link>
            </Box>
            <div onClick={() => toggleMenu()}>
              <MoreVertIcon className="text-grey-text hover:cursor-pointer" />
            </div>
          </Box>
          {openMenu === true && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-transparent"
                onClick={() => setOpenMenu(false)}
              ></div>
              <div className="absolute w-[320px] ml-350 mt-16 py-2 bg-white items-start text-grey-text text-sm font-normal border-1 border-border z-90 text-left">
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
                  Izbrisi korisnika
                </div>
              </div>
            </>
          )}
        </Box>

        <Box>
          <Image alt="profilna slika" src={photo} className="mt-6" />
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Ime i prezime </span>
            <span className="text-mytext">
              {user.first_name} {user.last_name}
            </span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col">
            <span className="text-grey-text mb-2"> JMBG </span>
            <span className="text-mytext"> {user.jmbg}</span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Email </span>
            <span className="text-blue"> {user.email}</span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Korisnicko ime </span>
            <span className="text-mytext"> {user.username}</span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Broj logovanja </span>
            <span className="text-mytext"> {user.login_count}</span>
          </Box>
          <Box className="mb-8 text-base font-normal flex flex-col mt-8">
            <span className="text-grey-text mb-2"> Poslednji put logovan </span>
            <span className="text-mytext"> {user.last_login_at}</span>
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
                Da li ste sigurni da želite da izbrišete vas nalog?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleDeleteUser(user.id!)}
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
        {resetModal && (
          <Box className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay pozadina */}
            <Box
              className="absolute inset-0"
              sx={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={closePasswordModal}
            />

            {/* Sadržaj modala */}
            <Box
              component="form"
              autoComplete="off"
              className="relative flex flex-col p-6 bg-white rounded-2xl w-[400px] shadow-lg z-10"
              onSubmit={(e) => e.preventDefault()} // spreči da Chrome vidi submit forme
            >
              <h3 className="mb-4 text-base">Unesite novu šifru</h3>

              {/* Prvo polje */}
              <FormControl variant="outlined" fullWidth className="mb-3">
                <InputLabel
                  htmlFor="custom_pass"
                  className={submitted && passwordError ? 'text-red-500' : ''}
                >
                  Unesite novu sifru..
                </InputLabel>
                <OutlinedInput
                  id="custom_pass"
                  name="custom_pass"
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    const error = checkPassword(e.target.value)
                    setPasswordError(error)
                  }}
                  error={submitted && !!passwordError}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText className="text-red-500">
                  {submitted && passwordError ? passwordError : null}
                </FormHelperText>
              </FormControl>

              {/* Ponovljena šifra */}
              <FormControl variant="outlined" fullWidth className="mb-6">
                <InputLabel
                  htmlFor="custom_pass_repeat"
                  className={
                    submitted && passwordRepeatError ? 'text-red-500' : ''
                  }
                >
                  Ponovo unesite novu sifru..
                </InputLabel>
                <OutlinedInput
                  id="custom_pass_repeat"
                  name="custom_pass_repeat"
                  autoComplete="new-password"
                  type={showPassword2 ? 'text' : 'password'}
                  value={password_repeat}
                  onChange={(e) => {
                    setPasswordRepeat(e.target.value)
                    const error = checkPassword(e.target.value)
                    setPasswordRepeatError(error)
                  }}
                  error={submitted && !!passwordRepeatError}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleVisibility2}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText className="text-red-500">
                  {submitted && passwordRepeatError
                    ? passwordRepeatError
                    : null}
                </FormHelperText>
              </FormControl>

              {/* Dugmad */}
              <Box className="flex justify-between gap-4">
                <button
                  type="submit"
                  onClick={() => sendPasswords()}
                  className="uppercase w-[124px] text-sm font-medium py-2 px-4 bg-blue text-white rounded hover:bg-blue-500 transition-colors duration-200 hover:cursor-pointer"
                >
                  Potvrdi
                </button>
                <button
                  type="button"
                  onClick={handleDeleteFields}
                  className="uppercase w-[124px] text-sm font-medium py-2 px-4 bg-blue text-white rounded hover:bg-blue-500 transition-colors duration-200 hover:cursor-pointer"
                >
                  Poništi
                </button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    )
}
