import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/home/home.jsx';
import Editor from './page/editor/editor.jsx';
import Header from './page/header.jsx';

function HomeP(){
  return(
    <>
    <Header />
    <Home />
  </>
  )
}
function EditorP(){
  return(
    <>
    <Header />
    <Editor />
  </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeP/>} />
      <Route path="/editor" element={<EditorP />} />
    </Routes>
  )
}

export default App