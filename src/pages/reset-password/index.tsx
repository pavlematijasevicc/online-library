'use client'
import { get, login, resetPassword } from '@/utils/apiService'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import Image from 'next/image'
import loginImage from '../../../public/login.jpg'
import { useEffect, useState } from 'react'
import { checkEmail, checkPassword } from '../../utils/utiles'
import { useRouter } from 'next/router'
import AuthLayout from '@/components/AuthLayout'
import type { NextPageWithLayout } from './../_app'
import Link from 'next/link'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { usePathname, useSearchParams } from 'next/navigation'

const ResetPassword: NextPageWithLayout = () => {
  const year: number = new Date().getFullYear()

  const [password, setPassword] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [password_repeat, setPasswordRepeat] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [alertBox, setAlertBox] = useState<boolean>(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [passwordRepeatError, setPasswordRepeatError] = useState<string | null>(
    null
  )
  const [alertError, setAlertError] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    localStorage.removeItem('access_token')
  }, [])

  console.log('token:', token, 'email: ', email)

  const handleToggleVisibility = () => setShowPassword((prev) => !prev)
  const handleToggleVisibility2 = () => setShowPassword2((prev) => !prev)

  const sendPasswords = async () => {
    setSubmitted(true)
    if (password !== password_repeat) {
      setPasswordError('sifre moraju da se poklapaju!')
      setPasswordRepeatError('sifre moraju da se poklapaju')
      return
    } else {
      setPasswordError(null)
      setPasswordRepeatError(null)
    }
    const data = {
      password: password,
      password_confirmation: password_repeat,
      token: token !== null ? token : '',
      email: email !== null ? email : '',
    }
    try {
      const res = await resetPassword(data)
      setAlertBox(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      console.log(
        'doslo je do greske prilikom slanja nove sifre!',
        error.message
      )
      setAlertError(true)
    }
  }
  const handleDeleteFields = (e: React.FormEvent) => {
    e.preventDefault()
    setPassword('')
    setPasswordRepeat('')
    setPasswordError(null)
    setPasswordRepeatError(null)
  }

  if (token !== null && email != null)
    return (
      <div
        className="w-screen h-screen bg-cover bg-center flex items-center justify-center "
        style={{ backgroundImage: `url(${loginImage.src})` }}
      >
        <Box
          component="form"
          autoComplete="off"
          className="absolute mx-auto flex flex-col p-6 bg-white rounded-2xl w-[400px] shadow-lg z-10"
          onSubmit={(e) => {
            sendPasswords()
            e.preventDefault()
          }}
        >
          <h1 className="mb-4 text-mytext text-center font-semibold text-xl">
            Online biblioteka
          </h1>
          <div className="bg-grey-line w-full h-[1px] "></div>
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
              className={submitted && passwordRepeatError ? 'text-red-500' : ''}
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
              {submitted && passwordRepeatError ? passwordRepeatError : null}
            </FormHelperText>
          </FormControl>

          {/* Dugmad */}
          <Box className="flex justify-between gap-4">
            <button
              type="submit"
              //onClick={() => sendPasswords()}
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
          {alertBox && (
            <span className="text-green-500 mt-4 text-sm">
              Sifra uspjesno resetovana!
            </span>
          )}
          {alertError && (
            <span className="text-red-500 mt-4 text-sm">Nevalidan token!</span>
          )}
        </Box>
      </div>
    )
}

ResetPassword.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>
}

export default ResetPassword
