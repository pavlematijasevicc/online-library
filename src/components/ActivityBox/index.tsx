import { Box } from '@mui/material'
import Image from 'next/image'
import avatar from '../../../public/pero.png'
import { useEffect, useState } from 'react'
import { getAllStudents } from '@/utils/apiService'
import Link from 'next/link'

export type ActivityBoxProps = {
  id: number
  librarian: string
  role: number
  book_title: string
  student: string
  date: string
  student_username: string
  librarian_username: string
  roleUser: string
}
interface Data {
  username: string
  id: number
  image: string
  fullName: string
  email: string
  lastAccess: string
}
export default function ActivityBox({
  id,
  librarian,
  role,
  book_title,
  student,
  date,
  student_username,
  librarian_username,
  roleUser,
}: ActivityBoxProps) {
  function daysAgo(dateString: string): number {
    const today = new Date()
    const givenDate = new Date(dateString)

    // razlika u milisekundama
    const diffTime = today.getTime() - givenDate.getTime()

    // pretvori u dane
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  return (
    <Box className="flex items-center mt-4 w-[900px] mr-4 normal-case">
      <Image
        alt="avatar"
        src={avatar}
        className="mr-4 hover:cursor-pointer w-[50px] h-[50px]"
      />
      <Box>
        <span className="font-medium text-xs text-grey-text mb-2">
          {role === 1 && 'Izdavanje knjige'} {role === 2 && 'Vracanje knjige'}
          {role === 3 && 'Rezervacija knjige'} - {daysAgo(date.split(' ')[0])}{' '}
          days ago
        </span>
        {librarian !== 'Nema' ? (
          <Box className="text-xs">
            {roleUser === 'librarian' ? (
              <Link href={`/librarians/${librarian_username}`}>
                <span className="text-blue"> {librarian} </span>
              </Link>
            ) : (
              <span> {librarian} </span>
            )}

            <span>
              {role === 1 && ` je izdala knjigu ${book_title} uceniku`}
              {role === 2 &&
                ` je primila knjigu ${book_title} koju je vratio ucenik`}
              {role === 3 && ` je rezervisala knjigu ${book_title} za ucenika`}
            </span>
            {roleUser === 'librarian' ? (
              <Link href={`/students/${student_username}`}>
                <span className="text-blue"> {student} </span>
              </Link>
            ) : (
              <span> {student} </span>
            )}

            <span>
              dana {date.split(' ')[0]}. Period vracanja knjige, 7 dana.
            </span>

            {roleUser === 'librarian' && (
              <Link
                href={
                  role === 3
                    ? `publication/reservations/${id}`
                    : `publication/${id}`
                }
              >
                <span className="text-blue">pogledaj detaljnije {`>>>`}</span>
              </Link>
            )}
          </Box>
        ) : (
          <Box className="text-xs">
            <span>Ucenik</span>
            {roleUser === 'librarian' ? (
              <Link href={`/students/${student_username}`}>
                <span className="text-blue"> {student} </span>
              </Link>
            ) : (
              <span> {student} </span>
            )}

            <span>
              {` je poslao zahtjev za rezervaciju knjige ${book_title} `}
            </span>
            <span>
              dana {date.split(' ')[0]}. Period potvrde rezervacije 1 dan.
            </span>
            {roleUser === 'librarian' && (
              <Link href={'/publication?tab=4'}>
                <span className="text-blue">pogledaj detaljnije {`>>>`}</span>
              </Link>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
