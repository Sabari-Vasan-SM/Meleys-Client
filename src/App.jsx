import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return isAuthenticated ? <HomePage onLogout={() => setIsAuthenticated(false)} /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />;
}

export default App;
