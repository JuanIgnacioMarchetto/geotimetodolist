import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      error => {
        console.error(error);
      }
    );
  }, []);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>Fecha: {new Date().toLocaleDateString()}</p>
          <hr />
          <div id="map" style={{ height: '400px', width: '100%' }}></div>
        </div>
        <div>
          <h1>Lista de Tareas</h1>
          <input type="text" value={newTask} onChange={handleInputChange} />
          <button onClick={handleAddTask}>Agregar Tarea</button>
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
