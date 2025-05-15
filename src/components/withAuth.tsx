import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// HOC za zaštitu autentifikovanih ruta
export default function withAuth(Component: React.ComponentType<any>) {
  return function AuthProtectedRoute(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      // Proveri da li korisnik ima token

      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        // Ako nema tokena, preusmeri na login
        router.push("/login");
      } else {
        // Ako ima token, korisnik je autorizovan
        setIsAuthorized(true);
      }
    }, []);

    // Prikaži komponentu samo ako je korisnik autorizovan
    return isAuthorized ? <Component {...props} /> : null;
  };
}
