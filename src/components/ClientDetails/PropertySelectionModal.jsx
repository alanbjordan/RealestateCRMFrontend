// src/components/ClientDetails/PropertySelectionModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";

const PropertySelectionModal = ({
  open,
  onClose,
  searchTerm,
  setSearchTerm,
  sortedProperties,
  sortBy,
  sortOrder,
  handleSort,
  selectedProperties,
  handleTogglePropertySelection,
  handleAddSelectedProperties,
  saving,
  handleOpenCarousel,
  highlightText,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Select Properties</DialogTitle>
      <DialogContent>
        <TextField
          label="Search Properties"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "building"}
                    direction={sortBy === "building" ? sortOrder : "asc"}
                    onClick={() => handleSort("building")}
                  >
                    Building
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "unit"}
                    direction={sortBy === "unit" ? sortOrder : "asc"}
                    onClick={() => handleSort("unit")}
                  >
                    Unit
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "owner"}
                    direction={sortBy === "owner" ? sortOrder : "asc"}
                    onClick={() => handleSort("owner")}
                  >
                    Owner
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "contact"}
                    direction={sortBy === "contact" ? sortOrder : "asc"}
                    onClick={() => handleSort("contact")}
                  >
                    Contact
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "size"}
                    direction={sortBy === "size" ? sortOrder : "asc"}
                    onClick={() => handleSort("size")}
                  >
                    Size
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "bedrooms"}
                    direction={sortBy === "bedrooms" ? sortOrder : "asc"}
                    onClick={() => handleSort("bedrooms")}
                  >
                    Bedrooms
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "bathrooms"}
                    direction={sortBy === "bathrooms" ? sortOrder : "asc"}
                    onClick={() => handleSort("bathrooms")}
                  >
                    Bathrooms
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "status"}
                    direction={sortBy === "status" ? sortOrder : "asc"}
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "price"}
                    direction={sortBy === "price" ? sortOrder : "asc"}
                    onClick={() => handleSort("price")}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "preferred_tenant"}
                    direction={sortBy === "preferred_tenant" ? sortOrder : "asc"}
                    onClick={() => handleSort("preferred_tenant")}
                  >
                    Preferred Tenant
                  </TableSortLabel>
                </TableCell>
                <TableCell>Images</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12}>No properties available.</TableCell>
                </TableRow>
              ) : (
                sortedProperties.map((prop) => {
                  const propertyImages =
                    prop.photo_urls && typeof prop.photo_urls === "object"
                      ? Object.values(prop.photo_urls).flat()
                      : [];
                  return (
                    <TableRow key={prop.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProperties.includes(prop.id)}
                          onChange={() => handleTogglePropertySelection(prop.id)}
                        />
                      </TableCell>
                      <TableCell>{highlightText(prop.building, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.unit, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.owner, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.contact, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.size, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.bedrooms, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.bathrooms, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.status, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.price, searchTerm)}</TableCell>
                      <TableCell>{highlightText(prop.preferred_tenant, searchTerm)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenCarousel(prop)}
                          disabled={propertyImages.length === 0}
                        >
                          View Images
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAddSelectedProperties}
          disabled={saving || selectedProperties.length === 0}
        >
          Add Selected Properties
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertySelectionModal;
