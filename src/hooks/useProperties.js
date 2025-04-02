import { useState, useEffect } from "react";
import API_URLS from "../utilities/apiConfig";

const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Global search input
  const [searchQuery, setSearchQuery] = useState("");

  // Text filters for non-numeric columns (update building filter to search the building name)
  const defaultTextFilters = { building: "", owner: "", status: "" };
  const [filters, setFilters] = useState(defaultTextFilters);

  // Numeric filters as range (min and max)
  const defaultNumericFilters = {
    size: { min: "", max: "" },
    bedrooms: { min: "", max: "" },
    bathrooms: { min: "", max: "" },
    price: { min: "", max: "" },
  };
  const [numericFilters, setNumericFilters] = useState(defaultNumericFilters);

  // Sorting state
  const [sortColumn, setSortColumn] = useState("property_code");
  const [sortOrder, setSortOrder] = useState("asc");

  // Bulk edit mode and related state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEdits, setBulkEdits] = useState({});
  const [originalBulkEdits, setOriginalBulkEdits] = useState({});

  // -----------------------------
  // API Call: Fetch properties
  // -----------------------------
  const fetchProperties = (showSkeleton = false) => {
    if (showSkeleton) setIsLoading(true);
      fetch(API_URLS.PROPERTIES)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched properties data:", data);
      setProperties(data);
      localStorage.setItem("properties", JSON.stringify(data));
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching properties:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch properties.",
        severity: "error",
      });
      setIsLoading(false);
    });

  };

  useEffect(() => {
    const storedProperties = localStorage.getItem("properties");
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    } else {
      fetchProperties(true);
    }
  }, []);

  const handleRefresh = () => {
    fetchProperties(true);
  };

  // -----------------------------
  // API Call: Delete property
  // -----------------------------
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this property?")) {
      fetch(`${API_URLS.PROPERTIES}/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete property.");
          const updatedProperties = properties.filter((p) => p.id !== id);
          setProperties(updatedProperties);
          localStorage.setItem("properties", JSON.stringify(updatedProperties));
          setSnackbar({
            open: true,
            message: "Property deleted successfully.",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error deleting property:", error);
          setSnackbar({
            open: true,
            message: "Error deleting property.",
            severity: "error",
          });
        });
    }
  };

  // -----------------------------
  // Sorting
  // -----------------------------
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // -----------------------------
  // Filtering logic
  // -----------------------------
  const applyTextFilters = (list) => {
    return list.filter((property) => {
      // Updated: use property.building as a plain string.
      if (
        filters.building &&
        !String(property.building || "").toLowerCase().includes(filters.building.toLowerCase())
      )
        return false;
      if (
        filters.owner &&
        !String(property.owner).toLowerCase().includes(filters.owner.toLowerCase())
      )
        return false;
      if (
        filters.status &&
        !String(property.status).toLowerCase().includes(filters.status.toLowerCase())
      )
        return false;
      return true;
    });
  };

  const applyNumericFilters = (list) => {
    return list.filter((property) => {
      const numericFields = ["size", "bedrooms", "bathrooms", "price"];
      for (const field of numericFields) {
        const { min, max } = numericFilters[field];
        const propertyValue = parseFloat(property[field]);
        if (min !== "") {
          const minValue = parseFloat(min);
          if (!isNaN(propertyValue) && !isNaN(minValue) && propertyValue < minValue) {
            return false;
          }
        }
        if (max !== "") {
          const maxValue = parseFloat(max);
          if (!isNaN(propertyValue) && !isNaN(maxValue) && propertyValue > maxValue) {
            return false;
          }
        }
      }
      return true;
    });
  };

  const applyGlobalSearch = (list) => {
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter((property) => {
      return Object.values(property)
        .filter((val) => typeof val === "string" || typeof val === "number")
        .some((val) => String(val).toLowerCase().includes(query));
    });
  };

  const sortData = (list) => {
    return list.sort((a, b) => {
      let fieldA = a[sortColumn] || "";
      let fieldB = b[sortColumn] || "";
      if (sortColumn === "building") {
        // Updated: use building string directly.
        fieldA = a.building || "";
        fieldB = b.building || "";
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return sortOrder === "asc"
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });
  };

  const finalList = sortData(
    applyGlobalSearch(applyNumericFilters(applyTextFilters(properties)))
  );

  const handleResetFilters = () => {
    setFilters(defaultTextFilters);
    setNumericFilters(defaultNumericFilters);
    setSearchQuery("");
  };

  // -----------------------------
  // Bulk update logic
  // -----------------------------
  const handleBulkSave = async () => {
    try {
      const updates = Object.entries(bulkEdits).filter(([id, newVals]) => {
        const orig = originalBulkEdits[id];
        if (!orig) return false;
        return (
          orig.area !== newVals.area ||
          orig.status !== newVals.status ||
          orig.price !== newVals.price
        );
      });

      await Promise.all(
        updates.map(async ([id, values]) => {
          const updateData = {
            area: values.area,
            status: values.status,
            price: parseFloat(values.price),
          };
          const response = await fetch(`${API_URLS.PROPERTIES}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          });
          if (!response.ok) {
            throw new Error(`Update failed for property ${id}`);
          }
        })
      );
      setBulkEditMode(false);
      handleRefresh();
    } catch (error) {
      console.error("Bulk update error", error);
      setSnackbar({
        open: true,
        message: "Bulk update failed.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    properties,
    isLoading,
    snackbar,
    handleSnackbarClose,
    fetchProperties,
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
    handleBulkSave,
    setOriginalBulkEdits,
    setSnackbar,
  };
};

export default useProperties;
