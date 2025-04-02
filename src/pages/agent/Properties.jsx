import React, { useState } from "react";
import { Box, Typography, Snackbar, Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropertiesControls from "../../components/Properties/PropertiesControls";
import PropertiesFilterModal from "../../components/Properties/PropertiesFilterModal";
import PropertiesTable from "../../components/Properties/PropertiesTable";
import useProperties from "../../hooks/useProperties";
import AssignPropertiesToClientsModal from "../../components/Properties/AssignPropertiesToClientsModal";

const Properties = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    snackbar,
    handleSnackbarClose,
    handleRefresh,
    handleDelete,
    handleSort,
    sortColumn,
    sortOrder,
    finalList,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    numericFilters,
    setNumericFilters,
    handleResetFilters,
    bulkEditMode,
    setBulkEditMode,
    bulkEdits,
    setBulkEdits,
    setOriginalBulkEdits,
    handleBulkSave,
    setSnackbar,
  } = useProperties();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);

  const areFiltersApplied = () => {
    return (
      searchQuery.trim() !== "" ||
      filters.building.trim() !== "" ||
      filters.owner.trim() !== "" ||
      filters.status.trim() !== "" ||
      numericFilters.size.min.trim() !== "" ||
      numericFilters.size.max.trim() !== "" ||
      numericFilters.bedrooms.min.trim() !== "" ||
      numericFilters.bedrooms.max.trim() !== "" ||
      numericFilters.bathrooms.min.trim() !== "" ||
      numericFilters.bathrooms.max.trim() !== "" ||
      numericFilters.price.min.trim() !== "" ||
      numericFilters.price.max.trim() !== ""
    );
  };

  const propertiesToAssign =
    selectedProperties.length > 0
      ? finalList.filter((prop) => selectedProperties.includes(prop.id))
      : finalList;

  const showAssignButton =
    (selectedProperties.length > 0 || areFiltersApplied()) && finalList.length > 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Property Management
      </Typography>

      <PropertiesControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={handleRefresh}
        onAddProperty={() => navigate("/property/new")}
      />

      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Button variant="outlined" onClick={() => setFilterModalOpen(true)}>
          Show Filters
        </Button>
        {!bulkEditMode ? (
          <>
            <Button
              variant="contained"
              onClick={() => {
                setBulkEditMode(true);
                const initial = {};
                finalList.forEach((prop) => {
                  initial[prop.id] = {
                    area: prop.area || "",
                    status: prop.status || "",
                    price: prop.price != null ? String(prop.price) : "",
                  };
                });
                setBulkEdits(initial);
                setOriginalBulkEdits(initial);
              }}
            >
              Edit List
            </Button>
            {showAssignButton && (
              <Button variant="contained" color="secondary" onClick={() => setAssignModalOpen(true)}>
                Assign to Client
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleBulkSave}>
              Save All
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => setBulkEditMode(false)}>
              Cancel All
            </Button>
          </>
        )}
      </Box>

      <PropertiesFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={() => setFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        numericFilters={numericFilters}
        setNumericFilters={setNumericFilters}
        handleResetFilters={handleResetFilters}
      />

      <PropertiesTable
        finalList={finalList}
        isLoading={isLoading}
        searchQuery={searchQuery}
        headers={[
          { key: "property_code", label: "Property Code" },
          { key: "building", label: "Building" },
          { key: "unit", label: "Unit" },
          { key: "year_built", label: "Year Built" },
          { key: "size", label: "SQM" },
          { key: "bedrooms", label: "BR" },
          { key: "bathrooms", label: "BA" },
          { key: "area", label: "Area" },
          { key: "status", label: "Status" },
          { key: "price", label: "Price" },
          { key: "actions", label: "Actions" },
        ]}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        handleSort={handleSort}
        handleDelete={handleDelete}
        handleRowClick={(id) => navigate(`/property/${id}`)}
        refreshList={handleRefresh}
        bulkEditMode={bulkEditMode}
        bulkEdits={bulkEdits}
        setBulkEdits={setBulkEdits}
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
      />

      <AssignPropertiesToClientsModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        filteredProperties={propertiesToAssign}
        onAssignmentComplete={() => {
          handleResetFilters();
          setSelectedProperties([]);
          setSnackbar({
            open: true,
            severity: "success",
            message: "Properties successfully assigned to client(s)!",
          });
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Properties;
