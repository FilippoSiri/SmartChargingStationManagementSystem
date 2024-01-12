import React from "react";
import CustomNavbar from "./components/CustomNavbar";
import { Routes, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import ChargingStation from "./screens/ChargingStation";

function App() {
  return (
    <div className="App">
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/charging" element={<ChargingStation />} />
      </Routes>
    </div>
  );
}

export default App;
