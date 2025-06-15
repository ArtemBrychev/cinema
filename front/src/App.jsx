import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import List from './pages/List';
import RuTubePlayer from './pages/RuTubePlayer';
import NavigationBar from './components/NavigationBar';
import { Container } from 'react-bootstrap';
import UserProfile from './pages/UserProfile';
import RegisterForm from './pages/RegisterForm';
import { AuthProvider } from './context/AuthContext'; // ⬅️ добавили
import LoginForm from './pages/LoginForm';
import FavouriteList from './pages/FavouriteList';
import SearchPage from './pages/SearchPage';
import EditProfilePage from './pages/EditProfilePage';
import ProfilePhotoEditor from './components/ProfilePhotoEditor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Container>
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/player/:id" element={<RuTubePlayer />} />
            <Route path="/user_profile/:id" element={<UserProfile />} />
            <Route path="/register/" element={<RegisterForm />} />
            <Route path="/login/" element={<LoginForm/>}/>
            <Route path="/favourites/" element={<FavouriteList/>}/>
            <Route path="/search/" element={<SearchPage/>}/>
            <Route path="/editProfile/" element={<EditProfilePage/>}/>
            <Route path="/editProfilePic/" element={<ProfilePhotoEditor/>}/>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
