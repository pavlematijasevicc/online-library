import Binding from '@/components/Binding'
import Categories from '@/components/Categories'
import Format from '@/components/Format'
import Genres from '@/components/Genres'
import Policy from '@/components/Policy'
import Scripts from '@/components/Scripts'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Tab } from '@mui/material'
import { useState } from 'react'
import Publishers from '@/components/Publishers'

export default function Settings() {
  const [value, setValue] = useState('1')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  return (
    <Box className="py-6 text-xl font-medium">
      <h1 className="ml-4"> Settings </h1>
      <Box
        sx={{ width: '100%', typography: 'body1' }}
        className="mt-[20px] mb-0"
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
                label="Polisa"
                value="1"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Kategorije"
                value="2"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Zanrovi"
                value="3"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Izdavaci"
                value="4"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Povez"
                value="5"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Format"
                value="6"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Pismo"
                value="7"
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
            <Policy />
          </TabPanel>
          <TabPanel value="2">
            <Categories />
          </TabPanel>
          <TabPanel value="3">
            <Genres />
          </TabPanel>
          <TabPanel value="4">
            <Publishers />
          </TabPanel>
          <TabPanel value="5">
            <Binding />
          </TabPanel>
          <TabPanel value="6">
            <Format />
          </TabPanel>
          <TabPanel value="7">
            <Scripts />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}
