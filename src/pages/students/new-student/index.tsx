import StudentForm from '@/components/StudentForm'
import { Student } from '../../../../types'
import { useRef, useState } from 'react'
import Link from 'next/link'

export default function NewStudent() {
  return (
    <div className="px-4 py-3 text-xl font-medium">
      <h1 className="capitalize"> Novi ucenik </h1>
      <div className="mt-1 text-xs font-normal">
        <Link href={'/students'}>
          <span className="text-blue">Svi ucenici</span>
        </Link>
        <span> / Novi Ucenik</span>
      </div>
      <StudentForm />
    </div>
  )
}
