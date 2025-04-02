import { useState, useEffect } from "react";
import API_URLS from "../utilities/apiConfig";

const useBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBuildings = (showSkeleton = false) => {
    if (showSkeleton) setIsLoading(true);
    fetch(API_URLS.BUILDINGS)
      .then((response) => response.json())
      .then((data) => {
        setBuildings(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching buildings:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch buildings.",
          severity: "error",
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBuildings(true);
  }, []);

  const handleRefresh = () => {
    fetchBuildings(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this building?")) {
      fetch(`${API_URLS.BUILDINGS}/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete building.");
          setBuildings((prev) => prev.filter((b) => b.id !== id));
          setSnackbar({
            open: true,
            message: "Building deleted successfully.",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error deleting building:", error);
          setSnackbar({
            open: true,
            message: "Error deleting building.",
            severity: "error",
          });
        });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    buildings,
    isLoading,
    snackbar,
    handleSnackbarClose,
    fetchBuildings,
    handleRefresh,
    handleDelete,
    searchQuery,
    setSearchQuery,
  };
};

export default useBuildings;
