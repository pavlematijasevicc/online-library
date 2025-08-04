import AuthorForm from '@/components/NewAuthorForm'
import Link from 'next/link'

export default function NewAuthor() {
  return (
    <div className="px-4 py-3 text-xl font-medium">
      <h1 className="capitalize"> Novi autor </h1>
      <div className="mt-1 text-xs font-normal">
        <Link href={'/authors'}>
          <span className="text-blue">Evidencija autora</span>
        </Link>
        <span> / Novi Autor</span>
      </div>
      <AuthorForm />
    </div>
  )
}
