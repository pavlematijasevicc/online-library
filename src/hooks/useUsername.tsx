import { useEffect, useState } from 'react'
import { ActiveUser } from '../../types'

const useUsername = () => {
  const [username, setUsername] = useState<string>('')
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
        setUsername(user.username)
  },[user])

  return username
}

export default useUsername
