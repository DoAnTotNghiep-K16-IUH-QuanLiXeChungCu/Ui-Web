import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routers from "./routes/Routers";

function App() {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
}

export default App;
