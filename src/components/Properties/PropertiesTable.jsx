// src/components/Properties/PropertiesTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Checkbox,
} from "@mui/material";
// Import additional icons for photos, pets, and tenant preference
import {
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  PhotoCamera,
  Pets,
  Star,
} from "@mui/icons-material";
import API_URLS from "../../utilities/apiConfig";
import bangkokAreas from "../../utilities/propertyData";

// Helper function to highlight matched text
const highlightText = (text, query) => {
  if (!query) return text;
  const parts = String(text).split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const PropertiesTable = (props) => {
  const {
    finalList,
    isLoading,
    searchQuery,
    headers,
    sortColumn,
    sortOrder,
    handleSort,
    handleDelete,
    handleRowClick,
    refreshList,
    bulkEditMode,
    bulkEdits,
    setBulkEdits,
    selectedProperties,
    setSelectedProperties,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Insert a "Select" column at the beginning
  const selectHeader = { key: "select", label: "" };
  // Insert an "icons" column to display photo, pet, and tenant preference icons
  const iconsHeader = { key: "icons", label: "" };

  // Build displayed headers based on device
  const baseHeaders = isMobile
    ? headers
        .map((header) =>
          header.key === "price" ? { key: "floor", label: "Floor" } : header
        )
        .filter((header) =>
          ["building", "unit", "year_built", "owner", "contact", "floor"].includes(header.key)
        )
    : headers.filter((header) => header.key !== "actions");
  const displayedHeaders = [selectHeader, iconsHeader, ...baseHeaders];

  const headerFontSize = { xs: "0.75rem", sm: "0.9rem" };
  const cellFontSize = { xs: "0.7rem", sm: "0.85rem" };

  // State for inline editing, menus, etc.
  const [editingRowId, setEditingRowId] = React.useState(null);
  const [editingValues, setEditingValues] = React.useState({});
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [menuRowId, setMenuRowId] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  // Inline edit handlers
  const handleMenuClick = (event, rowId) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };

  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditingValues({ area: row.area, status: row.status, price: row.price });
    handleMenuClose();
  };

  const handleInlineSave = async (propertyId) => {
    try {
      const updateData = {
        area: editingValues.area,
        status: editingValues.status,
        price: parseFloat(editingValues.price),
      };
      const response = await fetch(`${API_URLS.PROPERTIES}/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      setEditingRowId(null);
      setEditingValues({});
      if (typeof refreshList === "function") {
        refreshList();
      }
    } catch (error) {
      console.error("Inline update error", error);
    }
  };

  const handleInlineCancel = () => {
    setEditingRowId(null);
    setEditingValues({});
  };

  const renderSkeletonRows = () => (
    <TableBody>
      {[...Array(5)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {displayedHeaders.map((_, colIndex) => (
            <TableCell key={colIndex} sx={{ fontSize: cellFontSize, py: isMobile ? 0.5 : 1 }}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  // Build tooltip content for the unit column
  const buildTooltipContent = (property) => {
    let content = `Owner: ${property.owner || "N/A"}`;
    content += ` | Contact: ${property.contact || "N/A"}`;
    if (property.preferred_tenant) {
      content += ` | Preferred Tenant: ${property.preferred_tenant}`;
    }
    return content;
  };

  // --- Begin update for photo icon logic ---
  // Define the default photo URL (the one that indicates no photo is present)
  const defaultPhotoURL = "https://pub-5639854ae5864779be6f398a0fa1c555.r2.dev/noimageyet.jpg";

  // Function to check if property has any real photo (i.e. not the default one)
  const hasRealPhotos = (property) => {
    if (!property.photo_urls) return false;
    return Object.values(property.photo_urls).some((urls) => {
      if (Array.isArray(urls)) {
        return urls.some((url) => url !== defaultPhotoURL);
      }
      return urls !== defaultPhotoURL;
    });
  };
  // --- End update for photo icon logic ---

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            {displayedHeaders.map((header) => (
              <TableCell
                key={header.key}
                sx={{
                  fontWeight: "bold",
                  cursor: header.key !== "actions" ? "pointer" : "default",
                  fontSize: headerFontSize,
                  py: isMobile ? 0.5 : 1,
                }}
                onClick={() => header.key !== "actions" && handleSort(header.key)}
              >
                {header.key === "select" || header.key === "icons" ? "" : header.label}
                {header.key !== "actions" && sortColumn === header.key && (
                  sortOrder === "asc" ? (
                    <ArrowUpward fontSize="small" />
                  ) : (
                    <ArrowDownward fontSize="small" />
                  )
                )}
              </TableCell>
            ))}
            {!isMobile && !bulkEditMode && headers.find((h) => h.key === "actions") && (
              <TableCell sx={{ fontWeight: "bold", fontSize: headerFontSize, py: isMobile ? 0.5 : 1 }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        {isLoading ? (
          renderSkeletonRows()
        ) : finalList.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={displayedHeaders.length}
                align="center"
                sx={{ fontSize: cellFontSize, py: isMobile ? 1 : 2 }}
              >
                No properties available.
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {finalList.map((property) => (
              <TableRow
                key={property.id}
                hover
                sx={{ cursor: "pointer", fontSize: cellFontSize, py: isMobile ? 0.5 : 1 }}
                onClick={() => {
                  if (!bulkEditMode && editingRowId !== property.id) {
                    handleRowClick(property.id);
                  }
                }}
              >
                {/* Checkbox cell */}
                <TableCell sx={{ fontSize: cellFontSize, py: isMobile ? 0.5 : 1 }} onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => {
                      setSelectedProperties((prev) =>
                        prev.includes(property.id)
                          ? prev.filter((id) => id !== property.id)
                          : [...prev, property.id]
                      );
                    }}
                  />
                </TableCell>
                {displayedHeaders.slice(1).map((header) => (
                  <TableCell key={header.key} sx={{ fontSize: cellFontSize, py: isMobile ? 0.5 : 1 }}>
                    {header.key === "icons" ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {/* Photo Icon: Highlight only if property has a real photo (not the default) */}
                        <Tooltip title="Photos">
                          <PhotoCamera
                            color={hasRealPhotos(property) ? "primary" : "disabled"}
                          />
                        </Tooltip>
                        {/* Pet Friendly Icon: Always greyed out for now */}
                        <Tooltip title="Pet Friendly">
                          <Pets color="disabled" />
                        </Tooltip>
                        {/* Tenant Preference Icon: Highlight if preferred tenant is set */}
                        <Tooltip title="Tenant Preference">
                          <Star color={property.preferred_tenant ? "primary" : "disabled"} />
                        </Tooltip>
                      </div>
                    ) : (
                      // Render other cells
                      ["area", "status", "price"].includes(header.key) ? (
                        bulkEditMode ? (
                          header.key === "area" ? (
                            <FormControl fullWidth size="small">
                              <InputLabel id={`area-select-${property.id}`}>Area</InputLabel>
                              <Select
                                labelId={`area-select-${property.id}`}
                                label="Area"
                                value={(bulkEdits[property.id] && bulkEdits[property.id].area) || ""}
                                onChange={(e) =>
                                  setBulkEdits((prev) => ({
                                    ...prev,
                                    [property.id]: {
                                      ...prev[property.id],
                                      area: e.target.value,
                                    },
                                  }))
                                }
                              >
                                {bangkokAreas.map((area) => (
                                  <MenuItem key={area.value} value={area.value}>
                                    {area.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              value={(bulkEdits[property.id] && bulkEdits[property.id][header.key]) || ""}
                              onChange={(e) =>
                                setBulkEdits((prev) => ({
                                  ...prev,
                                  [property.id]: {
                                    ...prev[property.id],
                                    [header.key]: e.target.value,
                                  },
                                }))
                              }
                              size="small"
                            />
                          )
                        ) : editingRowId === property.id ? (
                          header.key === "area" ? (
                            <FormControl fullWidth size="small">
                              <InputLabel id={`area-select-${property.id}`}>Area</InputLabel>
                              <Select
                                labelId={`area-select-${property.id}`}
                                label="Area"
                                value={editingValues.area || ""}
                                onChange={(e) =>
                                  setEditingValues((prev) => ({ ...prev, area: e.target.value }))
                                }
                              >
                                {bangkokAreas.map((area) => (
                                  <MenuItem key={area.value} value={area.value}>
                                    {area.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              value={editingValues[header.key] || ""}
                              onChange={(e) =>
                                setEditingValues((prev) => ({ ...prev, [header.key]: e.target.value }))
                              }
                              size="small"
                            />
                          )
                        ) : header.key === "unit" ? (
                          <Tooltip title={buildTooltipContent(property)}>
                            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                              {highlightText(property[header.key], searchQuery)}
                            </span>
                          </Tooltip>
                        ) : (
                          highlightText(property[header.key], searchQuery)
                        )
                      ) : (
                        header.key === "unit" ? (
                          <Tooltip title={buildTooltipContent(property)}>
                            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                              {highlightText(property[header.key], searchQuery)}
                            </span>
                          </Tooltip>
                        ) : (
                          highlightText(property[header.key], searchQuery)
                        )
                      )
                    )}
                  </TableCell>
                ))}
                {/* Actions cell */}
                {!isMobile && !bulkEditMode && headers.find((h) => h.key === "actions") && (
                  <TableCell sx={{ fontSize: cellFontSize, py: isMobile ? 0.5 : 1 }}>
                    {editingRowId === property.id ? (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInlineSave(property.id);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInlineCancel();
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuClick(e, property.id);
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {!bulkEditMode && (
        <Menu anchorEl={menuAnchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              const row = finalList.find((p) => p.id === menuRowId);
              if (row) handleEdit(row);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(menuRowId, e);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>

        </Menu>
      )}
    </TableContainer>
  );
};

export default PropertiesTable;
