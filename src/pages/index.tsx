'use client'
import { useState, useEffect } from 'react'
import withAuth from '../components/withAuth'
import Navbar from '@/components/Navbar'
import SideMenu from '@/components/SideMenu'
import Link from 'next/link'
import { Button } from '@mui/material'

function Home() {
  function handleLogin() {
    localStorage.removeItem('access_token')
  }

  return (
    <Link href={'/login'}>
      <Button className="hover:cursor-pointer" onClick={() => handleLogin()}>
        Log out
      </Button>
    </Link>
  )
}

export default withAuth(Home)
