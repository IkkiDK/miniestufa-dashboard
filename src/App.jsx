import React from "react";
import Dashboard from "./pages/Dashboard";
import RealtimeSensorDisplay from './components/RealtimeSensorDisplay';
import "./index.css";

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🌱 Mini Estufa - Dashboard
      </h1>
      <RealtimeSensorDisplay />
    </div>
  );
}
