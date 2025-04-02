import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import API_URLS from "../../utilities/apiConfig";

const AssignedPropertiesTable = ({
  assignedProperties,
  loadingAssignedProps,
  handleViewPropertyDetails,
  handleRemoveProperty,
  handleCommentUpdate,
  clientId,
  editedActive,       // Active status state from parent
  setEditedActive,    // Setter for active status
}) => {
  const [editedComments, setEditedComments] = useState({});

  useEffect(() => {
    const initialComments = {};
    const initialActive = {};
    assignedProperties.forEach((prop) => {
      initialComments[prop.id] = prop.comment || "";
      // Map the is_active flag to a string ("true" or "false")
      initialActive[prop.id] = prop.is_active ? "true" : "false";
    });
    setEditedComments(initialComments);
    setEditedActive(initialActive);
  }, [assignedProperties, setEditedActive]);

  const onCommentChange = (id, value) => {
    setEditedComments((prev) => ({ ...prev, [id]: value }));
  };

  const onCommentBlur = async (id) => {
    if (handleCommentUpdate) {
      await handleCommentUpdate(id, editedComments[id]);
    }
  };

  // Instead of sending a PUT request immediately, we just update local state.
  const onActiveChange = (propId, newValue) => {
    setEditedActive((prev) => ({ ...prev, [propId]: newValue }));
  };

  if (loadingAssignedProps) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Assigned Properties
      </Typography>
      {assignedProperties.length === 0 ? (
        <Typography>No properties assigned yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell>Building</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Bedrooms</TableCell>
                <TableCell>Bathrooms</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Preferred Tenant</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>View</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedProperties.map((prop) => (
                <TableRow key={prop.id} hover>
                  <TableCell>{prop.building}</TableCell>
                  <TableCell>{prop.unit}</TableCell>
                  <TableCell>{prop.owner}</TableCell>
                  <TableCell>{prop.contact}</TableCell>
                  <TableCell>{prop.size}</TableCell>
                  <TableCell>{prop.bedrooms}</TableCell>
                  <TableCell>{prop.bathrooms}</TableCell>
                  <TableCell>{prop.status}</TableCell>
                  <TableCell>{prop.price}</TableCell>
                  <TableCell>{prop.preferred_tenant}</TableCell>
                  <TableCell>
                    <TextField
                      value={editedComments[prop.id] || ""}
                      onChange={(e) => onCommentChange(prop.id, e.target.value)}
                      onBlur={() => onCommentBlur(prop.id)}
                      variant="standard"
                      fullWidth
                      placeholder="Add comment..."
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl variant="standard">
                      <Select
                        value={
                          editedActive[prop.id] !== undefined
                            ? editedActive[prop.id]
                            : "false"
                        }
                        onChange={(e) => onActiveChange(prop.id, e.target.value)}
                      >
                        <MenuItem value="false">Inactive</MenuItem>
                        <MenuItem value="true">Active</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewPropertyDetails(prop.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveProperty(prop.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default AssignedPropertiesTable;
