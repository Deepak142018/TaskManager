import { useState } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskDashboard from './components/Dashboard/TaskDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={setUser} onSwitch={() => setShowRegister(true)} />
    );
  }

  return <TaskDashboard user={user} onLogout={() => setUser(null)} />;
}

export default App;
