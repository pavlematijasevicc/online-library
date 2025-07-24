import Box from '@mui/material/Box'
import Image from 'next/image'
import logo from '../../../public/Vector.png'
import avatar from '../../../public/Avatar.png'
import AddIcon from '@mui/icons-material/Add'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { Avatar } from '@mui/material'

export default function Navbar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '72px',
        borderRadius: 0,
        bgcolor: '#3392EA',
        display: 'flex',
        justifyContent: 'space-between',
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
        <NotificationsNoneIcon className="mx-2 hover:cursor-pointer text-white" />
        <Box sx={{ width: '1px', height: '26px', bgcolor: 'white' }}></Box>
        <AddIcon className="mx-2 hover:cursor-pointer text-white" />
        <h2 className="text-white font-bold text-2xl mx-2 mr-4">bildstudio</h2>
        <Image
          alt="avatar"
          src={avatar}
          className="mr-4 hover:cursor-pointer"
        />
      </Box>
    </Box>
  )
}

/*<Avatar alt="Remy Sharp" src="../../../public/Avatar.png" />* nije radilo u kodu kad se ubacilo (prikazivalo slovo R umjesto slike), zato sam koristio Image */
