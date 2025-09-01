import ActivityMain from '@/components/ActivityMain'
import ReservationsTable from '@/components/ReservationsTable'
import Statistics from '@/components/Statistics'
import { Box } from '@mui/material'

export default function Dashboard() {
  return (
    <Box className="px-4 py-6 text-xl font-medium capitalize">
      <h1>Dashboard</h1>
      <Box className="flex">
        <ActivityMain />
        <Box>
          <ReservationsTable />
          <Statistics />
        </Box>
      </Box>
    </Box>
  )
}
