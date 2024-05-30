import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [snacks, setSnacks] = useState([])
  const [newSnack, setNewSnack] = useState("")

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSnacks([...snacks, newSnack])
    console.log(snacks)

    try {
      const response = await fetch("https://getpantry.cloud/apiv1/pantry/" + PANTRY_API + "/basket/newBasket99", {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({snacks: [...snacks, newSnack]})
      })
      if (response.ok) {
        console.log("post request sent!")
      }
      setNewSnack("")
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
    <>
      <h1>
        Aliyah's Snacks
      </h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" id="name" value={newSnack} onChange={(e) => setNewSnack(e.target.value)}/>
          <button>Add Snack!</button>
        </form>
        <ul>
          {snacks.map(snack => <div><li>{snack}</li><span onClick={() => deleteSnack(snack)}>X</span></div>)}
        </ul>
      </div>
    </>
  )
}

export default App
