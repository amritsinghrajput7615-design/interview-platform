import { createBrowserRouter } from 'react-router'
import Register from './features/pages/Register'
import Login from './features/pages/Login'
import { Protected } from './features/components/Protected'
import Home from './features/interview/pages/Home'
import Interview from './features/interview/pages/Interview'

export const router = createBrowserRouter([
{
    path:'/login',
    element:<Login />
},
{
    path:'/register',
    element:<Register />
},
{
    path:'/',
    element:<Protected><Home /></Protected>
},
{
    path:"/interview/:interviewId",
    element:<Interview />
},
{
    path:"/report/:interviewId",   // ✅ ADD THIS
    element:<Interview />         // reuse same page
}
])