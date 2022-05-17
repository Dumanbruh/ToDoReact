import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import About from "./components/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() =>{
    const getTasks = async () => {
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer) 
    }

    getTasks()
  }, [])

  const fetchTasks = async () => {
    const responce = await fetch('http://localhost:5000/tasks')
    const data = await responce.json()

    return data
  }

  const fetchTask = async (id) => {
    const responce = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await responce.json()

    return data
  }

  const deleteTask = async (id) =>{
    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) =>{
    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const responce = await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await responce.json()

    setTasks(tasks.map((task) => 
                task.id === id ? {...task, reminder: 
                data.reminder} : task
              )
    )
  }

  const addTask = async (task) => {
    const responce = await fetch('http://localhost:5000/tasks',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(task),
    })

    const data = await responce.json()

    setTasks([...tasks, data])

    
    // const id = Math.floor(Math.random() * 10000) + 1  
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }


  return (      
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
          <Routes>
            <Route path="/" element={
              <>
                {showAddTask && <AddTask onAdd={addTask}/>}
                <Tasks tasks={tasks} onDelete = {deleteTask} onToggle = {toggleReminder} />
              </>
            }/>
            <Route path="/about" element={<About />}/>
          </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
