import LibrarianForm from '@/components/LibrarianForm'
import Link from 'next/link'

export default function NewLibrerian() {
  return (
    <div className="px-4 py-3 text-xl font-medium">
      <h1 className="capitalize"> Novi bibliotekar </h1>
      <div className="mt-1 text-xs font-normal">
        <Link href={'/librarians'}>
          <span className="text-blue">Svi bibliotekari</span>
        </Link>
        <span> / Novi Bibliotekar</span>
      </div>
      <LibrarianForm />
    </div>
  )
}
