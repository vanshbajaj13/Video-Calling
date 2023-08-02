import { Routes, Route, Link } from "react-router-dom";
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";

function App() {
  return (
    <>
      <div className="homeBtn">
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <div className="App">
        <Routes>
          <Route path="/" element={<LobbyScreen />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
