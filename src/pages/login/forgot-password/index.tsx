import AuthLayout from '@/components/AuthLayout'
import { Box, Button, TextField } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import loginImage from '../../../../public/login.jpg'
import { useState } from 'react'
import { checkEmail } from '@/utils/utiles'
import { forgotPassword } from '@/utils/apiService'

export default function ForgotPassword() {
  const year: number = new Date().getFullYear()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>('')
  const router = useRouter()

  const handleReset = async () => {
    try {
      const res = await forgotPassword(email)
      console.log(res.data)
    } catch (error: any) {
      console.log('greska:', error)
    }
  }

  return (
    <Box
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center "
      style={{ backgroundImage: `url(${loginImage.src})` }}
    >
      <Box className="bg-loginbackground p-8 mx-auto w-[495px] rounded-md">
        <h1 className="mb-4 text-mytext text-center font-semibold text-xl">
          Online biblioteka
        </h1>
        <Box className="bg-grey-line w-full h-[1px] "></Box>
        <form>
          <TextField
            className="mb-6 mt-6 w-full rounded-sm"
            id="outlined-required"
            label="Email"
            placeholder="example@example.net"
            onChange={(e) => {
              setEmail(e.target.value)
              setErrorMessage('')
              const error = checkEmail(e.target.value)
              setEmailError(error)
            }}
            error={submitted && (!!emailError || errorMessage != '')}
            helperText={submitted && emailError ? emailError : ''}
          />
          <Button
            variant="contained"
            className="bg-blue w-full mb-4 font-medium text-sm p-3 uppercase"
            onClick={() => handleReset()}
          >
            posalji zahtjev za resetovanje
          </Button>
        </form>
        <Link href={'/login'}>
          <Button
            variant="text"
            className="text-blue p-2 capitalize mb-4 block"
          >
            Login page
          </Button>
        </Link>

        <div className=" text-grey-text text-xs text-center">
          {`©${year} ICT Cortex. All rights reserved.`}
        </div>
      </Box>
    </Box>
  )
}

ForgotPassword.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>
}
