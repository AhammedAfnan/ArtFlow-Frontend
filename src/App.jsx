import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./util/AppRoutes";
import Toaster from 'react-hot-toast'

export default function App() {
  return (
    <>
    <Router>
      <AppRoutes/>
    </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}
