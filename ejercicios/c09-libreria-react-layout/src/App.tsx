import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import Libro from "./pages/Libro";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/libro/:id" element={<Libro />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;