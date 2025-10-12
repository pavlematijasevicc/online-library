'use client'
import Box from '@mui/material/Box'
import Image from 'next/image'
import logo from '../../../public/Vector.png'
import avatar from '../../../public/Avatar.png'
import AddIcon from '@mui/icons-material/Add'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonIcon from '@mui/icons-material/Person'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import { Avatar } from '@mui/material'
import { useEffect, useState } from 'react'
import withAuth from '../withAuth'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from 'next/link'
import { ActiveUser } from '../../../types'
import useRole from '@/hooks/useRole'

function Navbar() {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [userMenu, setUserMenu] = useState<boolean>(false)
  const role = useRole()

  function handleLogout() {
    localStorage.removeItem('access_token')
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '72px',
        borderRadius: 0,
        bgcolor: '#3392EA',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'fixed',
        top: '0px',
        left: '0px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '273px',
          height: '72px',
          borderRadius: 0,
          bgcolor: '#0000001F',
        }}
      >
        <Image src={logo} height={40} width={40} alt="logo" />
        <h1 className="capitalize text-xl font-bold ml-4 text-white">
          Online biblioteka
        </h1>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        <Link href={'/activity'}>
          <NotificationsNoneIcon className="mx-2 hover:cursor-pointer text-white" />
        </Link>
        {role === 'librarian' && (
          <>
            <Box sx={{ width: '1px', height: '26px', bgcolor: 'white' }}></Box>

            <AddIcon
              className="mx-2 hover:cursor-pointer text-white"
              onClick={() => {
                setOpenMenu((pre) => !pre)
              }}
            />
          </>
        )}

        <h2 className="text-white font-bold text-2xl mx-2 mr-4">bildstudio</h2>
        <Image
          alt="avatar"
          src={avatar}
          onClick={() => {
            setUserMenu((pre) => !pre)
          }}
          className="mr-4 hover:cursor-pointer"
        />
      </Box>
      {openMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-transparent z-[99998]"
            onClick={() => setOpenMenu(false)}
          ></div>

          {/* Menu */}
          <Box
            className="py-2 text-grey-text font-normal bg-white text-sm w-[317px] absolute mt-12 z-[99999] ml-320 rounded-sm shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()} // sprečava zatvaranje kad klikneš u meni
          >
            <Box className="px-4 py-3">
              <Link href={'/librarians/new-librarian'}>
                <PersonIcon className="mr-2 w-[24px] h-[24px]" /> Bibliotekar
              </Link>
            </Box>
            <Box className="px-4 py-3">
              <Link href={'/students/new-student'}>
                <GroupsIcon className="mr-2 w-[24px] h-[24px]" /> Ucenik
              </Link>
            </Box>
            <Box className="px-4 py-3">
              <Link href={'/books/new-book'}>
                <MenuBookIcon className="mr-2 w-[24px] h-[24px]" /> Knjiga
              </Link>
            </Box>
            <Box className="px-4 py-3">
              <Link href={'/authors/new-author'}>
                <ClassOutlinedIcon className="mr-2 w-[24px] h-[24px]" /> Autor
              </Link>
            </Box>
          </Box>
        </>
      )}

      {userMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-transparent z-[99998]"
            onClick={() => setUserMenu(false)}
          ></div>

          {/* Menu */}
          <Box
            className="py-2 text-grey-text font-normal bg-white text-sm w-[220px] absolute mt-16 z-[99999] ml-400 rounded-sm shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()} // sprečava zatvaranje kad klikneš unutar menija
          >
            <Box className="px-4 py-3">
              <Link href={'/profile'}>
                <GroupsIcon className="mr-2 w-[24px] h-[24px]" /> Profil
              </Link>
            </Box>
            <Box className="px-4 py-3" onClick={() => handleLogout()}>
              <Link href={'/login'}>
                <LogoutIcon className="mr-2 w-[24px] h-[24px]" /> Logout
              </Link>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Navbar
/*<Avatar alt="Remy Sharp" src="../../../public/Avatar.png" />* nije radilo u kodu kad se ubacilo (prikazivalo slovo R umjesto slike), zato sam koristio Image */
