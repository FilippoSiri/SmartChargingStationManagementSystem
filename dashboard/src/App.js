import React from "react";
import CustomNavbar from "./components/CustomNavbar";
import { Routes, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import EditStation from "./screens/EditStation";

function App() {
  return (
    <div className="App">
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/station/:id" element={<EditStation />} />
      </Routes>
    </div>
  );
}

export default App;
