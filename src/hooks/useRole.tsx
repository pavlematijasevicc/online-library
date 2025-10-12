import { useEffect, useState } from 'react'
import { ActiveUser } from '../../types'

const useRole = () => {
  const [role, setRole] = useState<string>('')
  const [user,setUser]=useState< ActiveUser | null>(null)

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      const parsedUser: ActiveUser = JSON.parse(userString)
      console.log('User ucitan iz localStorage:', parsedUser)
      setUser(parsedUser)
    }
  }, [])

  useEffect(()=>{
    if(user)
        setRole(user.role)
  },[user])

  return role
}

export default useRole
