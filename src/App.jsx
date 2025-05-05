import {Routes, Route} from 'react-router-dom'
import LoginPage from './LoginPage.jsx'  // Можно переименовать файл позже
import RegisterPage from './RegisterPage'   // Создадим этот файл
import HomePage from './HomePage.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
        </Routes>
    )
}

export default App
