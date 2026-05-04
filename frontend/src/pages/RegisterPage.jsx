import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/Input'
import Button from '../components/Button'
import { GlobalContext } from '../context/Context.jsx'
import axios from 'axios'

function RegisterPage() {
  const navigate = useNavigate()
  const { state } = useContext(GlobalContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Client') // Default role
  const [error, setError] = useState('')


  const submit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${state.baseUrl}/auth/signup`, {
        name: name,
        email: email,
        password: password,
        role: role
      })
      console.log(response.data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error(error)
    }
  }

  // const submit = (e) => {
  //   e.preventDefault()
  //   if (!name.trim() || !email.trim() || password.length < 6) {
  //     setError('Please enter your name, email, and a password (6+ characters).')
  //     return
  //   }
  //   setError('')
  //   // Demo-only: real apps would POST /register here.
  //   navigate(`/login?email=${encodeURIComponent(email.trim())}`, { replace: true })
  // }

  // return (
  //   <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950">
  //     <motion.form
  //       initial={{ opacity: 0, y: 18 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       onSubmit={submit}
  //       className="w-full max-w-md rounded-3xl border border-white/50 bg-white/75 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
  //     >
  //       <h1 className="mb-1 text-2xl font-bold text-[#0f2d5f] dark:text-indigo-300">Create account</h1>
  //       <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">Join FieldOps to coordinate field teams with clarity.</p>

  //       <div className="space-y-4">
  //         <Input label="Full name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
  //         <Input label="Email" type="email" placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
  //         <Input label="Password" type="password" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
  //         {error ? <p className="text-sm text-rose-600">{error}</p> : null}
  //         <Button className="w-full" type="submit">
  //           Create account
  //         </Button>
  //       </div>
  //       <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
  //         Already have an account?{' '}
  //         <Link to="/login" className="font-medium text-[#0f2d5f] dark:text-indigo-300">
  //           Login
  //         </Link>
  //       </p>
  //     </motion.form>
  //   </div>
  // )

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-white/50 bg-white/75 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
      >
        <h1 className="mb-1 text-2xl font-bold text-[#0f2d5f] dark:text-indigo-300">Create account</h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">Join FieldOps to coordinate field teams with clarity.</p>

        <div className="space-y-4">
          <Input 
            label="Full name" 
            placeholder="John Doe" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          
          <Input 
            label="Email" 
            type="email" 
            placeholder="john@company.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          {/* ROLE FIELD ADDED HERE */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 ml-1">Select Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#0f2d5f] focus:ring-2 focus:ring-[#0f2d5f]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-indigo-500"
            >
              <option value="Client">Client</option>
              <option value="Technician">Technician</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <Input 
            label="Password" 
            type="password" 
            placeholder="Minimum 6 characters" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          {error ? <p className="text-sm text-rose-600 font-medium ml-1">{error}</p> : null}

          <Button className="w-full mt-2" type="submit">
            Create account
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#0f2d5f] dark:text-indigo-300 hover:underline transition-all">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  )
}

export default RegisterPage
