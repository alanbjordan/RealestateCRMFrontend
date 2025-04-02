import React, { useState } from "react";
import { Paper, Typography, Divider, Box, Grid, Button, Skeleton } from "@mui/material";
import PropertyCard from "./PropertyCard";

const AssignedPropertiesList = ({ clientCode, properties }) => {
  // Filter to only show active properties
  const activeProperties = (properties || []).filter(
    (property) => property.is_active
  );

  // State to control how many properties are visible and if more are loading
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);

  // Properties currently displayed
  const displayedProperties = activeProperties.slice(0, visibleCount);

  const handleShowMore = () => {
    setLoadingMore(true);
    // Simulate a network request delay (e.g., 1.5 seconds)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingMore(false);
    }, 1500);
  };

  // Determine how many skeletons to show (always 4 for a full batch)
  const skeletonCount = 4;

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: "#1976d2",
          textAlign: "center",
        }}
      >
        Assigned Properties
      </Typography>
      <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />
      {activeProperties.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedProperties.map((property) => (
              <Grid item xs={12} sm={6} key={property.id}>
                <PropertyCard property={property} clientCode={clientCode} />
              </Grid>
            ))}
            {loadingMore &&
              [...Array(skeletonCount)].map((_, index) => (
                <Grid item xs={12} sm={6} key={`skeleton-${index}`}>
                  <Skeleton variant="rectangular" height={300} />
                </Grid>
              ))}
          </Grid>
          {visibleCount < activeProperties.length && !loadingMore && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button variant="contained" onClick={handleShowMore}>
                Show More
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            No active properties assigned yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AssignedPropertiesList;
