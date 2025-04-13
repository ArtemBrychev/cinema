import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import List from './pages/List'; // Список фильмов
import RuTubePlayer from './pages/RuTubePlayer';  // Плеер
import NavigationBar from './components/NavigationBar';
import { Container } from 'react-bootstrap';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <div>
      <div>
        <Router>
          <NavigationBar/>
          <Container>
          <Routes >
            {/* Главная страница с фильмами */}
            <Route path="/" element={<List />} />
            <Route path="/player/:id" element={<RuTubePlayer />} />
            <Route path="/user_profile/" element={<UserProfile />} />
          </Routes>
          </Container>
        </Router>
      </div>
    </div>
  );
}

export default App;
