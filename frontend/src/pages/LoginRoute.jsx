import { useSearchParams } from 'react-router-dom'
import LoginPage from './LoginPage'

function LoginRoute() {
  const [searchParams] = useSearchParams()

  // Remounting keeps form state in sync with `?email=` without effects.
  return <LoginPage key={searchParams.toString()} />
}

export default LoginRoute
