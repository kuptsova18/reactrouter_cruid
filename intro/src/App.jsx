import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PostsList from './components/PostsList';
import PostView from './components/PostView';
import PostNew from './components/PostNew';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/posts/:id" element={<PostView />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
