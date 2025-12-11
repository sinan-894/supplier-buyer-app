import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SupplierApp from './Supplier'
import BuyerApp from './Buyer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BuyerApp></BuyerApp>
    </>
  )
}

export default App
