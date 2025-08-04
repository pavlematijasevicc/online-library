import {
  Alert,
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  MenuItem,
  Select,
} from '@mui/material'
import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import checkJmbg, {
  checkEmail,
  checkIme,
  checkPassword,
  checkPrezime,
  checkUsername,
} from '@/utils/utiles'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { createLibrarian, createStudent } from '@/utils/apiService'

export default function LibrerianForm() {
  const [profile_picture, setProfilePicture] = useState<File | null>(null)
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [jmbg, setJmbg] = useState('')
  const [username, setUsername] = useState<string>('')
  const [role_id, setRoleId] = useState<number>(2)
  const [password, setPassword] = useState<string>('')
  const [password_repeat, setPasswordRepeat] = useState<string>('')
  const [firstNameError, setFirstNameError] = useState<string | null>(null)
  const [lastNameError, setLastNameError] = useState<string | null>(null)
  const [jmbgError, setJmbgError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordRepeatError, setPasswordRepeatError] = useState<string | null>(
    null
  )
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleToggleVisibility = () => setShowPassword((prev) => !prev)
  const handleToggleVisibility2 = () => setShowPassword2((prev) => !prev)

  //FUNKCIJA KOJA GOVORI DA LI SU PODACI USPJESNO POSLATI
  function handleAlert() {
    console.log('usao u alert')
    setShowAlert(true)
  }

  function validatePasswordMatch(pass: string, repeat: string): string | null {
    return pass !== repeat ? 'Lozinke se ne poklapaju' : null
  }

  async function handleCreateLibrarian(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    const firstNameValidation = checkIme(first_name)
    const lastNameValidation = checkPrezime(last_name)
    const jmbgValidation = checkJmbg(jmbg)
    const emailValidation = checkEmail(email)
    const usernameValidation = checkUsername(username)
    const passwordValidation = checkPassword(password)
    const passwordRepeatValidation = checkPassword(password_repeat)

    const passwordMatchError = validatePasswordMatch(password, password_repeat)
    setPasswordRepeatError(passwordMatchError)

    setFirstNameError(firstNameValidation)
    setLastNameError(lastNameValidation)
    setJmbgError(jmbgValidation)
    setEmailError(emailValidation)
    setUsernameError(usernameValidation)
    setPasswordError(passwordValidation)
    setPasswordRepeatError(passwordRepeatValidation)

    if (
      firstNameValidation ||
      lastNameValidation ||
      jmbgValidation ||
      emailValidation ||
      usernameValidation ||
      passwordValidation ||
      passwordRepeatValidation ||
      passwordMatchError
    ) {
      console.log('ovdje je bag, first_name:', firstNameValidation)
      console.log('last:', lastNameValidation)
      console.log('jmbg:', jmbgValidation)
      console.log(
        'email:',
        emailValidation,
        usernameValidation,
        passwordRepeatValidation,
        passwordMatchError
      )
      return
    }

    const librarianToSend = {
      first_name,
      last_name,
      email,
      username,
      jmbg,
      role_id,
      password,
    }

    try {
      const res = await createLibrarian(librarianToSend)
      console.log('Biblioetekar kreiran:', res)
      handleAlert()
    } catch (error) {
      console.error('Greška prilikom kreiranja bibliotekara:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePicture(file)
    }
  }

  function deleteFields(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(false)
    setFirstName('')
    setLastName('')
    setEmail('')
    setJmbg('')
    setUsername('')
    setPassword('')
    setPasswordRepeat('')
    setProfilePicture(null)
    setFirstNameError(null)
    setLastNameError(null)
    setJmbgError(null)
    setEmailError(null)
    setUsernameError(null)
    setPasswordError(null)
    setPasswordRepeatError(null)
  }

  return (
    <Box
      component="form"
      onSubmit={handleCreateLibrarian}
      sx={{
        width: 720,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingTop: '28px',
      }}
    >
      <Button
        variant="contained"
        className="bg-transparent border-1 border-inputB shadow-none w-45 h-35 hover:cursor-default relative"
      >
        <TextField
          id="file-upload"
          type="file"
          placeholder="Add photo"
          className="hidden hover:cursor-pointer"
          inputProps={{ accept: '.jpg,.jpeg,.png' }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="w-full h-full bg-transparent shadow-none hover:cursor-pointer z-999"
        ></label>
        {profile_picture ? (
          <img
            src={URL.createObjectURL(profile_picture)}
            alt="thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-md z-0"
          />
        ) : (
          <div className="absolute flex flex-col justify-center items-center w-full h-full z-0">
            <ImageOutlinedIcon
              sx={{ color: '#00000099' }}
              className="mx-auto mb-1"
            />
            <span className="text-base font-normal text-grey-text">
              Add photo
            </span>
          </div>
        )}
      </Button>

      <TextField
        label="Unesite Ime.."
        variant="outlined"
        value={first_name}
        onChange={(e) => {
          setFirstName(e.target.value)
          const error = checkIme(e.target.value)
          setFirstNameError(error)
        }}
        sx={{ width: 720 }}
        error={submitted && !!firstNameError}
        helperText={submitted && firstNameError ? firstNameError : null}
      />
      <TextField
        label="Unesite Prezime.."
        variant="outlined"
        value={last_name}
        onChange={(e) => {
          setLastName(e.target.value)
          const error = checkPrezime(e.target.value)
          setLastNameError(error)
        }}
        sx={{ width: 720 }}
        error={submitted && !!lastNameError}
        helperText={submitted && lastNameError ? lastNameError : null}
      />
      <FormControl fullWidth disabled>
        <Select id="role" value={role_id}>
          <MenuItem value={2}>Bibliotekar</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Unesite JMBG.."
        variant="outlined"
        value={jmbg}
        onChange={(e) => {
          setJmbg(e.target.value)
          const error = checkJmbg(e.target.value)
          setJmbgError(error)
        }}
        sx={{ width: 720 }}
        error={submitted && !!jmbgError}
        helperText={submitted && jmbgError ? jmbgError : null}
      />
      <TextField
        label="Unesite E-mail.."
        variant="outlined"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          const error = checkEmail(e.target.value)
          setEmailError(error)
        }}
        sx={{ width: 720 }}
        error={submitted && !!emailError}
        helperText={submitted && emailError ? emailError : null}
      />
      <TextField
        label="Unesite korisnicko ime.."
        variant="outlined"
        autoComplete="new-username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value)
          const error = checkUsername(e.target.value)
          setUsernameError(error)
        }}
        sx={{ width: 720 }}
        error={submitted && !!usernameError}
        helperText={submitted && usernameError ? usernameError : null}
      />
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          htmlFor="password"
          className={submitted && passwordError ? 'text-red-500' : ''}
        >
          Unesite željenu šifru..
        </InputLabel>
        <OutlinedInput
          id="password"
          autoComplete="new-password" // ← sprečava autofill
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            const error = checkPassword(e.target.value)
            setPasswordError(
              error || validatePasswordMatch(e.target.value, password_repeat)
            )
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
        {/*prikaz greške*/}
        <FormHelperText className="text-red-500">
          {submitted && passwordError ? passwordError : null}
        </FormHelperText>
      </FormControl>
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          htmlFor="password_repeat"
          className={submitted && passwordRepeatError ? 'text-red-500' : ''}
        >
          Ponovo unesite šifru..
        </InputLabel>
        <OutlinedInput
          id="password_repeat"
          type={showPassword2 ? 'text' : 'password'}
          value={password_repeat}
          onChange={(e) => {
            setPasswordRepeat(e.target.value)
            const error = checkPassword(e.target.value)
            setPasswordRepeatError(
              error || validatePasswordMatch(password, e.target.value)
            )
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
          {submitted && passwordRepeatError ? passwordRepeatError : null}
        </FormHelperText>
      </FormControl>
      <Box className="flex ml-auto">
        <Button
          variant="contained"
          type="submit"
          className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-blue mr-2 self-end"
          onClick={handleCreateLibrarian}
        >
          <CheckIcon />
          Sacuvaj
        </Button>
        <Button
          variant="contained"
          type="button"
          className="uppercase w-[124px] text-sm font-medium pt-[10px] px-4 bg-transparent self-end text-blue border-blue border-1"
          onClick={deleteFields}
        >
          <CloseIcon />
          Ponisti
        </Button>
      </Box>
      {showAlert && (
        <Alert
          className="mt-4"
          severity="success"
          onClose={() => setShowAlert(false)}
          variant="filled"
        >
          Bibliotekar uspjesno kreiran!
        </Alert>
      )}
    </Box>
  )
}
