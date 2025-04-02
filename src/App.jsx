// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Page
import Login from "./pages/Login";

// Agent Portal Pages
import Dashboard from "./pages/agent/Dashboard";
import Settings from "./pages/agent/Settings";
import Clients from "./pages/agent/Clients";
import Properties from "./pages/agent/Properties";
import BulkUpload from "./pages/agent/BulkUpload"; // Import the new BulkUpload page
import ClientDetails from "./pages/agent/ClientDetails";
import PropertyDetails from "./pages/agent/PropertyDetails";
// New Building Pages
import Buildings from "./pages/agent/Buildings";
import BuildingDetails from "./pages/agent/BuildingDetails";

// Agent Layout (shared by all agent pages)
import Layout from "./components/Layout";

// Client Portal Pages
import ClientLogin from "./pages/client/ClientLogin";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientProperties from "./pages/client/ClientProperties";
import AssignedPropertyPage from "./pages/client/AssignedPropertyPage";

// Client Portal Layout (applies to all client-specific routes)
import ClientLayout from "./components/ClientPortal/ClientLayout";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Client Public Route (Login) */}
      <Route path="/client-portal/:clientCode?" element={<ClientLogin />} />

      {/* Client Private Routes wrapped with ClientLayout */}
      <Route element={<ClientLayout />}>
        <Route path="/client-portal/client/:clientCode" element={<ClientDashboard />} />
        <Route
          path="/client-portal/client/:clientCode/property/:propertyId"
          element={<AssignedPropertyPage />}
        />
        <Route path="/client-portal/client/:clientCode/profile" element={<ClientProfile />} />
        <Route path="/client-portal/client/:clientCode/properties" element={<ClientProperties />} />
      </Route>

      {/* Agent Routes wrapped with Agent Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/property" element={<Properties />} />
        <Route path="/property/bulk-upload" element={<BulkUpload />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/client/:clientId" element={<ClientDetails />} />
        <Route path="/settings" element={<Settings />} />
        {/* New Building Routes */}
        <Route path="/buildings" element={<Buildings />} />
        <Route path="/building/:buildingId" element={<BuildingDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
