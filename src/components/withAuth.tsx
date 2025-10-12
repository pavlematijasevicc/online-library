import { CircularProgress } from '@mui/material'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

// HOC za zaštitu autentifikovanih ruta
export default function withAuth(Component: React.ComponentType<any>) {
  return function AuthProtectedRoute(props: any) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [Indikator, setIndikator] = useState<number>(0)
    const pathname = usePathname()

    const visiblePaths = ['/login', '/reset-password']

    const pathCanBeVisible = useMemo(() => {
      console.log('Pathname', pathname)
      visiblePaths.map((el) => {
        if (pathname?.includes(el)) {
          setIndikator(1)
        }
      })

      if (Indikator === 1) return true
      else return false

      // Kako uporediti elemente niza - sa pathname-om
    }, [pathname])

    console.log('PathCanBeVIsible', pathCanBeVisible)

    useEffect(() => {
      // Proveri da li korisnik ima token

      const accessToken = localStorage.getItem('access_token')

      if (!accessToken && !pathCanBeVisible) {
        // Ako nema tokena, preusmeri na login
        router.push('/login')
      } else {
        // Ako ima token, korisnik je autorizovan
        setIsAuthorized(true)
      }
    }, [])

    // Prikaži komponentu samo ako je korisnik autorizovan
    return isAuthorized ? (
      <Component {...props} />
    ) : (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
        <CircularProgress size={100} />
      </div>
    )
  }
}
