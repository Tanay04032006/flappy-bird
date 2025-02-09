import React from 'react'
// import Bird from './components/Bird'
// import FlappyBirdGame from './components/FlappyBird'
import SceneComponent from './components/scene'
const App = () => {
  return (
    <div>
    <div className='absolute bg-red-500 text-white p-4 align-middle text-center m-5 mb-20'>
     FLAPPY BIRD KHELENGE
    </div>
    
<div>
      <SceneComponent/>
      </div>
    
    </div>
  )
}

export default App
