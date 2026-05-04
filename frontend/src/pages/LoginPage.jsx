import { useState, useContext } from 'react' 
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios' 
import Input from '../components/Input'
import Button from '../components/Button'
import { GlobalContext } from '../context/Context' 

function LoginPage() {
  // Context se state aur dispatch nikaln
  const { state, dispatch } = useContext(GlobalContext)
  
  const [email, setEmail] = useState(() => {
    const qp = new URLSearchParams(window.location.search).get('email')
    return qp?.trim() || 'admin@fieldops.com'
  })
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()

  const roleHint = 'Use: admin@fieldops.com, tech@fieldops.com, client@fieldops.com'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Backend URL context se li hai
      const response = await axios.post(`${state.baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      
      console.log("Login Success:", response.data);

    if(response.token || response.data.token){
      
      // Dispatch mein user aur token dono bhejein (agar backend se aa raha hai)
      dispatch({
        type: "USER_LOGIN", 
        user: response.data.user || response.user,
        token: response.data.token || response.token // Token handle karne ke liye
      })
    }  

      // Navigation se pehle thora wait taaki state update ho jaye
      setTimeout(() => {
          navigate('/dashboard')
      } , 500)

    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message)
      alert(error.response?.data?.message || "Login failed!")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <motion.form 
        initial={{ opacity: 0, y: 18 }} 
        animate={{ opacity: 1, y: 0 }} 
        onSubmit={handleSubmit} 
        className="w-full max-w-md rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70"
      >
        <h1 className="mb-1 text-2xl font-bold text-[#0f2d5f] dark:text-indigo-300">FieldOps</h1>
        <p className="mb-6 text-sm text-slate-500">Field Service Management Platform</p>
        
        <div className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button className="w-full" type="submit">Sign In</Button>
        </div>

        <p className="mt-4 text-xs text-slate-500">{roleHint}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          No account? <Link to="/register" className="font-medium text-[#0f2d5f] dark:text-indigo-300">Register</Link>
        </p>
      </motion.form>
    </div>
  )
}

export default LoginPage