import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routers from "./routes/Routers";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
