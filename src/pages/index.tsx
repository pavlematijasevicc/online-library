import ActivityMain from '@/components/ActivityMain'
import ReservationsTable from '@/components/ReservationsTable'
import Statistics from '@/components/Statistics'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { ActiveUser } from '../../types'
import useRole from '@/hooks/useRole'

export default function Dashboard() {
  const role = useRole()

  console.log('role:', role)

  return (
    <Box className="px-4 py-6 text-xl font-medium capitalize">
      <h1>Dashboard</h1>
      <Box className="flex">
        <ActivityMain role={role} />

        <Box className={role === 'librarian' ? '' : 'mt-12'}>
          {role === 'librarian' && <ReservationsTable />}
          <Statistics />
        </Box>
      </Box>
    </Box>
  )
}
