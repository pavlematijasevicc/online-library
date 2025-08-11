import Tabs from '@mui/material/Tabs'
import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import BookForm from '@/components/BookForm'
import BookSpecification from '@/components/BookSpecification'
import Multimedia from '@/components/Multimedia'
import { BookData } from '../../../../types'
import Link from 'next/link'

export default function NewBook() {
  const [value, setValue] = React.useState('1')
  const nameInputRef = React.useRef(null)
  const [bookData, setBookData] = React.useState<BookData>({
    // BookForm
    name: '',
    description: '',
    categories: [],
    genres: [],
    authors: [],
    publisher_id: null,
    year: null,
    number_of_copies_available: null,

    // BookSpecification
    number_of_pages: null,
    script: '',
    binding: '',
    dimensions: '',
    isbn: '',
    format: '',
    language: '',

    // Multimedia
    images: null as File[] | null,
  })

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  console.log('Data:', bookData)
  return (
    <div className="py-3 text-xl font-medium overflow-y-hidden">
      <div className="px-4">
        <h1 className="capitalize"> Nova knjiga </h1>
        <div className="mt-1 text-xs font-normal">
          <Link href={'/books'}>
            <span className="text-blue">Evidencija knjiga</span>
          </Link>
          <span> / Nova knjiga</span>
        </div>
      </div>

      <Box
        sx={{ width: '100%', typography: 'body1' }}
        className="mt-[10px] mb-0"
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
                label="Osnovni detalji"
                value="1"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Specifikacija"
                value="2"
                className="p-4 text-sm font-normal ml-4"
                sx={{
                  '&.Mui-selected': {
                    color: '#3392EA', // boja kada je tab aktivan
                  },
                }}
              />
              <Tab
                label="Multimedia"
                value="3"
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
            <BookForm
              nameInputRef={nameInputRef}
              bookData={bookData}
              setBookData={setBookData}
              value={value}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value="2">
            <BookSpecification
              nameInputRef={nameInputRef}
              bookData={bookData}
              setBookData={setBookData}
              value={value}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value="3">
            <Multimedia
              nameInputRef={nameInputRef}
              bookData={bookData}
              setBookData={setBookData}
              value={value}
              setValue={setValue}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}
