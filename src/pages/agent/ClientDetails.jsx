import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import API_URLS from "../../utilities/apiConfig";
import ClientInfoForm from "../../components/ClientDetails/ClientInforForm";
import AssignedPropertiesTable from "../../components/ClientDetails/AssignedPropertiesTable";
import PropertySelectionModal from "../../components/ClientDetails/PropertySelectionModal";
import PropertyCarouselDialog from "../../components/ClientDetails/PropertyCarouselDialog";
import PropertyDetailsModal from "../../components/ClientDetails/PropertyDetailsModal";
import useClientData from "../../hooks/useClientData";
import useNotification from "../../hooks/useNotification";
import useCarousel from "../../hooks/useCarousel";

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // Custom hooks for client data, notifications and carousel images.
  const {
    clientData,
    setClientData,
    assignedProperties,
    setAssignedProperties,
    loading,
    saving,
    saveClientData,
  } = useClientData(clientId);
  const { notification, showNotification, closeNotification } = useNotification();
  const {
    carouselImages,
    openCarousel,
    currentIndex,
    openCarouselWithProperty,
    prevImage,
    nextImage,
    closeCarousel,
  } = useCarousel();

  // Local state for active status changes from the assigned properties table.
  const [assignedActive, setAssignedActive] = useState({});

  // Other state variables...
  const [allProperties, setAllProperties] = useState([]);
  const [openPropertySelection, setOpenPropertySelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("building");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [loadingAssignedProps, setLoadingAssignedProps] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openPropertyDetails, setOpenPropertyDetails] = useState(false);
  const [generatingLogin, setGeneratingLogin] = useState(false);

  // Helper: Highlight matching text
  const highlightText = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = String(text).split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span key={idx} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Fetch all properties (for selection modal).
  useEffect(() => {
    fetch(API_URLS.PROPERTIES)
      .then((resp) => resp.json())
      .then((data) => setAllProperties(data))
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, []);

  // Fetch countries for nationality dropdown.
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Sorting handler for property selection modal.
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Filtering and sorting for properties list.
  const filteredProperties = allProperties.filter((prop) => {
    const term = searchTerm.toLowerCase();
    return (
      String(prop.building).toLowerCase().includes(term) ||
      String(prop.unit).toLowerCase().includes(term) ||
      String(prop.owner).toLowerCase().includes(term) ||
      String(prop.contact).toLowerCase().includes(term) ||
      String(prop.size).toLowerCase().includes(term) ||
      String(prop.bedrooms).toLowerCase().includes(term) ||
      String(prop.bathrooms).toLowerCase().includes(term) ||
      String(prop.status).toLowerCase().includes(term) ||
      String(prop.price).toLowerCase().includes(term) ||
      String(prop.preferred_tenant).toLowerCase().includes(term)
    );
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    aVal = String(aVal).toLowerCase();
    bVal = String(bVal).toLowerCase();
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Toggle selection of a property in the selection modal.
  const handleTogglePropertySelection = (propertyId) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Handle adding selected properties to the client.
  const handleAddSelectedProperties = async () => {
    setLoadingAssignedProps(true);
    setOpenPropertySelection(false);
    if (clientId === "new") {
      showNotification("Please save the client before assigning properties.", "warning");
      setLoadingAssignedProps(false);
      return;
    }
    try {
      for (const propertyId of selectedProperties) {
        const res = await fetch(`${API_URLS.CLIENTS}/${clientId}/properties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ property_id: propertyId }),
        });
        if (!res.ok) {
          throw new Error("Failed to assign property with ID " + propertyId);
        }
      }
      showNotification("Properties assigned successfully!", "success");
      const newlyAssigned = allProperties.filter((prop) =>
        selectedProperties.includes(prop.id)
      );
      setAssignedProperties((prev) => [
        ...prev,
        ...newlyAssigned.filter((np) => !prev.some((p) => p.id === np.id)),
      ]);
      setSelectedProperties([]);
    } catch (err) {
      console.error("Error assigning properties:", err);
      showNotification("Error assigning properties.", "error");
    } finally {
      setLoadingAssignedProps(false);
    }
  };

  // Remove a property assignment.
  const handleRemoveProperty = async (propId) => {
    if (clientId === "new") {
      showNotification("Please save the client first.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_URLS.CLIENTS}/${clientId}/properties/${propId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to remove property.");
      }
      showNotification("Property removed successfully!", "success");
      setAssignedProperties((prev) => prev.filter((p) => p.id !== propId));
    } catch (err) {
      console.error("Error removing property:", err);
      showNotification("Error removing property.", "error");
    }
  };

  // View property details.
  const handleViewPropertyDetails = async (propertyId) => {
    try {
      const response = await fetch(`${API_URLS.PROPERTIES}/${propertyId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }
      const data = await response.json();
      setSelectedProperty(data);
      setOpenPropertyDetails(true);
    } catch (err) {
      console.error("Error fetching property details:", err);
      showNotification("Error fetching property details.", "error");
    }
  };

  // Function to update assigned properties active status in bulk.
  const saveAssignedActiveStatus = async () => {
    for (const prop of assignedProperties) {
      const currentActive = prop.is_active ? "true" : "false";
      if (assignedActive[prop.id] && assignedActive[prop.id] !== currentActive) {
        try {
          const response = await fetch(
            `${API_URLS.CLIENTS}/${clientId}/properties/${prop.id}/comment`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ is_active: assignedActive[prop.id] === "true" }),
            }
          );
          if (!response.ok) {
            console.error(`Failed to update active status for property ${prop.id}`);
          }
        } catch (err) {
          console.error(`Error updating active status for property ${prop.id}:`, err);
        }
      }
    }
  };

  // Combined save: update client data then assigned active statuses.
  const handleCombinedSave = async () => {
    await saveClientData(showNotification, navigate);
    await saveAssignedActiveStatus();
  };

  // Function to update comment for assigned properties.
  const handleCommentUpdate = async (propertyId, comment) => {
    try {
      const response = await fetch(
        `${API_URLS.CLIENTS}/${clientId}/properties/${propertyId}/comment`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update comment");
      }
      showNotification("Comment updated successfully", "success");
      setAssignedProperties((prev) =>
        prev.map((prop) =>
          prop.id === propertyId ? { ...prop, comment } : prop
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
      showNotification("Error updating comment", "error");
    }
  };

  // Define generateLoginDetails function if needed.
  const generateLoginDetails = async () => {
    setGeneratingLogin(true);
    try {
      const res = await fetch(`${API_URLS.CLIENTS}/${clientId}/generate_login`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to generate login details");
      }
      const data = await res.json();
      setClientData((prev) => ({
        ...prev,
        login_link: data.login_link,
        access_key: data.access_key,
      }));
      showNotification("Login details generated successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Error generating login details.", "error");
    } finally {
      setGeneratingLogin(false);
    }
  };

  if (loading) {
    return <Typography>Loading client data...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        {clientId === "new" ? "Add New Client" : `Client Details (ID: ${clientId})`}
      </Typography>
      <ClientInfoForm
        clientData={clientData}
        handleChange={(field, value) =>
          setClientData((prev) => ({ ...prev, [field]: value }))
        }
        handleSave={handleCombinedSave}
        navigateBack={() => navigate(-1)}
        countries={countries}
        saving={saving}
        clientId={clientId}
      />

      {/* Login Details Section */}
      <Box sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Login Details
        </Typography>
        <Typography variant="body1">
          <strong>Login Link:</strong>{" "}
          {clientData.login_link ? (
            <a href={clientData.login_link} target="_blank" rel="noopener noreferrer">
              {clientData.login_link}
            </a>
          ) : (
            "Not generated"
          )}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Access Key:</strong> {clientData.access_key || "Not generated"}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={clientId === "new" ? null : () => generateLoginDetails()}
          disabled={clientId === "new" || generatingLogin || saving}
        >
          {clientId === "new"
            ? "Auto-generated upon creation"
            : generatingLogin ? "Generating..." : "Generate Login Details"}
        </Button>
      </Box>

      <AssignedPropertiesTable
        assignedProperties={assignedProperties}
        loadingAssignedProps={loadingAssignedProps}
        handleViewPropertyDetails={handleViewPropertyDetails}
        handleRemoveProperty={handleRemoveProperty}
        handleCommentUpdate={handleCommentUpdate}
        clientId={clientId}
        editedActive={assignedActive}
        setEditedActive={setAssignedActive}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => {
          setSelectedProperties([]);
          setOpenPropertySelection(true);
        }}
        disabled={saving}
      >
        Add Property
      </Button>
      <PropertySelectionModal
        open={openPropertySelection}
        onClose={() => setOpenPropertySelection(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortedProperties={sortedProperties}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        selectedProperties={selectedProperties}
        handleTogglePropertySelection={handleTogglePropertySelection}
        handleAddSelectedProperties={handleAddSelectedProperties}
        saving={saving}
        handleOpenCarousel={(property) =>
          openCarouselWithProperty(property, showNotification)
        }
        highlightText={highlightText}
      />
      <PropertyCarouselDialog
        open={openCarousel}
        onClose={closeCarousel}
        carouselImages={carouselImages}
        currentIndex={currentIndex}
        handlePrevImage={prevImage}
        handleNextImage={nextImage}
      />
      <PropertyDetailsModal
        open={openPropertyDetails}
        onClose={() => setOpenPropertyDetails(false)}
        selectedProperty={selectedProperty}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientDetails;
