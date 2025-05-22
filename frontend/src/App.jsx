import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import { useAuthContext } from './context/Authcontext'
import Login from './pages/login/Login'
import Signup from './pages/Signup'
import Footer from './components/Footer'
import Home from './components/Home'
import FailureResponse from './components/FailureResponse'
import ViewPricing from './components/ViewPricing'
import PaymentForAdmin from './components/PaymentForAdmin'
import ForgotPassword from './pages/ForgotPassword'
import AdminDashboard from './components/InterviewComponents/AdminDashboard'
import InterviewPage from './components/InterviewComponents/InterviewPage'
import InterviewPortal from './components/InterviewComponents/InterviewPortal'
import IntervieweeLogin from './components/InterviewComponents/IntervieweeLogin'
import InterviewLogin from './components/InterviewComponents/InterviewLogin'
import CheckLink from './components/InterviewComponents/CheckLink'
import ImportStudentsPage from './components/InterviewComponents/ImportCsv'
function App() {
  const { Authuser ,AuthInterviewee} = useAuthContext();
  return (
    <div className='h-screen flex flex-col'>
      <div className='w-full flex-grow'>
        <Routes>
          <Route path='/' element={Authuser? <AdminDashboard/>:<Login/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path="/forgot-password/" element={<ForgotPassword />} />
          <Route path='/footer' element={<Footer/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/footer' element={<Footer/>}/>
          <Route path='/view-pricing' element={<ViewPricing/>}/>
          {/* <Route path='/interview/:uniqueID/:DB_name' element={AuthInterviewee===null?<Navigate to='/login-interviewee'/>: <InterviewPage/>}/> */}
          <Route path='/interview/:uniqueID/:DB_name' element={<CheckLink/>}/>
          <Route path='/interview/:uniqueID/:DB_name/locked' element={AuthInterviewee===null?<CheckLink/>:
          <InterviewPage/>}/>
          <Route path='/login-interviewee' element={<IntervieweeLogin/>}/>
          <Route path='/pay' element={Authuser && !Authuser?.PaidByAdmin? <PaymentForAdmin/>:<Navigate to='/admin-dashboard'/>}/>
          <Route path="/admin-dashboard" element={Authuser && !Authuser?.PaidByAdmin? <Navigate to='/pay'/>:
       Authuser && Authuser?.PaidByAdmin? <AdminDashboard/>:<Navigate to='/login'/>}/>
              <Route path='/Check-Status/:PaymentId/:amount' element={<FailureResponse/>}/>
              <Route path='/interview-portal' element={<InterviewPortal/>}/>
              <Route path='/admin-dashboard/import-students' element={<ImportStudentsPage/>}/>
              <Route path='/interview-login' element={<InterviewLogin/>}/>

        </Routes>
      </div>
    </div>
  )
}
export default App
