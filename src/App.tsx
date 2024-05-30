import { useState, useEffect } from 'react'
import Cross from "/cross.png"
import Snack from "/snack.png"
import './App.css'

function App() {
  const [snacks, setSnacks] = useState<string[]>([]);
  const [newSnack, setNewSnack] = useState<string>('');

  const PANTRY_API = import.meta.env.VITE_PANTRY_API

  const getData = async () => {
    try {
      const response = await fetch("https://getpantry.cloud/apiv1/pantry/" + PANTRY_API + "/basket/newBasket99")
      const data = await response.json();
      setSnacks(data["snacks"] || [])
    } catch (error) {
      console.error('Error fetching snacks:', error);
    }
  };

  useEffect(() => {
    getData()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newSnack === "") {
      return
    }
    const snackToAdd = newSnack
    setSnacks([...snacks, snackToAdd])
    console.log(snacks)
    setNewSnack("")

    try {
      const response = await fetch("https://getpantry.cloud/apiv1/pantry/" + PANTRY_API + "/basket/newBasket99", {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({snacks: [...snacks, snackToAdd]})
      })
      if (response.ok) {
        console.log("post request sent!")
      }
    }
    catch (error) {
      console.error(error)
      throw error;
    }
  }

  async function deleteSnack (snackToDelete: string) {
    const updatedSnacks = snacks.filter(snack => snack !== snackToDelete);
    setSnacks(updatedSnacks)
    try {
      const response = await fetch("https://getpantry.cloud/apiv1/pantry/" + PANTRY_API + "/basket/newBasket99", {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({snacks: updatedSnacks})
      })
      if (response.ok) {
        console.log("post request sent!")
      }
    }
    catch (error) {
      console.error(error)
      throw error;
    }
  }

  return (
    <div className='bg-orange-300 h-screen w-screen flex flex-col items-center justify-center gap-4'>
      <div className='flex items-center gap-2'>
        <h1 className='text-3xl font-bold font-mochiy text-slate-800'>
          Aliyah's Snacks 
        </h1>
        <img src={Snack} className='h-10'/>
      </div>
      <div className='bg-white rounded-xl shadow-lg py-8 px-4 flex flex-col gap-4 w-[21rem]'>
        <form onSubmit={handleSubmit} className='flex gap-4'>
          <input 
            type="text" 
            name="name" 
            value={newSnack} 
            onChange={(e) => setNewSnack(e.target.value)}
            className='border-slate-400 border-2 rounded-lg py-1 px-2'
          />
          <button 
            className='bg-orange-600 rounded-lg py-1 px-2 cursor-pointer active:scale-95 active:bg-orange-700 font-mono text-white'
          >
            Add Snack!
          </button>
        </form>
        <ul className='flex flex-col gap-1'>
          {snacks.map(snack => (
            <div className='group flex flex-row justify-between items-center px-8'>
              <li className='font-mono list-disc text-slate-800'>{snack}</li>
              <img 
                src={Cross}
                onClick={() => deleteSnack(snack)}
                className='hidden group-hover:block cursor-pointer h-4' />
            </div>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default App
