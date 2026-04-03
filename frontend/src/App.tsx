import { useState } from 'react'
import './App.css'
import FuelPrices from './page/FuelPrices'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <FuelPrices />
    </>
  )
}

export default App
