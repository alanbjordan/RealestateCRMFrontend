import { useState, useEffect } from "react";
import API_URLS from "../utilities/apiConfig";

const defaultPropertyData = {
  property_code: "",
  building_id: "", // updated field name
  unit: "",
  owner: "",
  contact: "",
  size: "",
  bedrooms: "",
  bathrooms: "",
  year_built: "",
  floor: "",
  area: "",
  status: "",
  price: "",
  sell_price: "",
  sent: "",
  preferred_tenant: "",
  photo_urls: {},
};

const usePropertyData = (propertyId) => {
  const [propertyData, setPropertyData] = useState(defaultPropertyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (propertyId && propertyId !== "new") {
      fetch(`${API_URLS.PROPERTIES}/${propertyId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch property data");
          }
          return response.json();
        })
        .then((data) => {
          data.photo_urls = data.photo_urls || {};
          setPropertyData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching property:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  const savePropertyData = async (showNotification, navigate) => {
    // Basic validation
    if (!String(propertyData.property_code).trim()) {
      showNotification("Property Code is required!", "error");
      return;
    }
    if (!String(propertyData.building_id).trim()) { // updated validation
      showNotification("Building is required!", "error");
      return;
    }
    if (!String(propertyData.unit).trim()) {
      showNotification("Unit is required!", "error");
      return;
    }
    setSaving(true);

    // Format data for saving
    const formattedData = {
      ...propertyData,
      size: propertyData.size ? parseFloat(propertyData.size) : null,
      bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms, 10) : null,
      bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms, 10) : null,
      price: propertyData.price
        ? parseFloat(String(propertyData.price).replace(/[^0-9.]/g, ""))
        : null,
      sell_price: propertyData.sell_price
        ? parseFloat(String(propertyData.sell_price).replace(/[^0-9.]/g, ""))
        : null,
      year_built: propertyData.year_built ? parseInt(propertyData.year_built, 10) : null,
      floor: propertyData.floor ? parseInt(propertyData.floor, 10) : null,
    };

    try {
      const method = propertyId === "new" ? "POST" : "PUT";
      const endpoint =
        propertyId === "new"
          ? `${API_URLS.PROPERTIES}`
          : `${API_URLS.PROPERTIES}/${propertyId}`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(
          method === "POST" ? "Failed to create property" : "Failed to update property"
        );
      }

      localStorage.removeItem("properties");
      showNotification(
        method === "POST"
          ? "Property created successfully!"
          : "Property updated successfully!",
        "success"
      );
      setTimeout(() => {
        navigate("/property");
      }, 1500);
    } catch (error) {
      console.error("Error saving property:", error);
      showNotification("Error saving property. Check console for details.", "error");
      setSaving(false);
    }
  };

  return { propertyData, setPropertyData, loading, saving, savePropertyData };
};

export default usePropertyData;
