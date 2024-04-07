import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

  useEffect(() => {
    if (currentLocation) {
      const map = L.map('map').setView([currentLocation.lat, currentLocation.lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const userMarker = L.marker([currentLocation.lat, currentLocation.lng]).addTo(map);
      userMarker.bindPopup('You are here').openPopup();
    }
  }, [currentLocation]);

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
