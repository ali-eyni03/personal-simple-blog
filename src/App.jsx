import './App.css'
import {BrowserRouter as Router, Routes , Route} from "react-router-dom"
import { About } from "./pages/about"
import Contact from "./pages/contact"
import  Home from "./pages/homepage"
import { Fashion } from './pages/Fashion'
import BlogSingle from './pages/blogSingle'
import SearchResults from './pages/searchResults'

function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/blog" element={<Fashion/>} />
      <Route path="/blog/:postId" element={<BlogSingle/>} />
      <Route path="/search" element={<SearchResults />} />
    </Routes>
   </Router>
  )
}

export default App
