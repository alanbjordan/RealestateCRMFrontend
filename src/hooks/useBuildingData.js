import { useState, useEffect } from "react";
import API_URLS from "../utilities/apiConfig";

const defaultBuildingData = {
  name: "",
  year_built: "",
  nearest_bts: "",
  nearest_mrt: "",
  distance_to_bts: "",
  distance_to_mrt: "",
  facilities: "",
  photo_urls: {},
};

const useBuildingData = (buildingId) => {
  const [buildingData, setBuildingData] = useState(defaultBuildingData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (buildingId && buildingId !== "new") {
      fetch(`${API_URLS.BUILDINGS}/${buildingId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch building data");
          }
          return response.json();
        })
        .then((data) => {
          data.photo_urls = data.photo_urls || {};
          setBuildingData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching building:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [buildingId]);

  const saveBuildingData = async (showNotification, navigate) => {
    if (!String(buildingData.name).trim()) {
      showNotification("Building name is required!", "error");
      return;
    }
    setSaving(true);
    const formattedData = {
      ...buildingData,
      year_built: buildingData.year_built ? parseInt(buildingData.year_built, 10) : null,
      distance_to_bts: buildingData.distance_to_bts ? parseFloat(buildingData.distance_to_bts) : null,
      distance_to_mrt: buildingData.distance_to_mrt ? parseFloat(buildingData.distance_to_mrt) : null,
    };

    try {
      const method = buildingId === "new" ? "POST" : "PUT";
      const endpoint =
        buildingId === "new" ? `${API_URLS.BUILDINGS}` : `${API_URLS.BUILDINGS}/${buildingId}`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(method === "POST" ? "Failed to create building" : "Failed to update building");
      }

      showNotification(
        method === "POST" ? "Building created successfully!" : "Building updated successfully!",
        "success"
      );
      setTimeout(() => {
        navigate("/buildings");
      }, 1500);
    } catch (error) {
      console.error("Error saving building:", error);
      showNotification("Error saving building. Check console for details.", "error");
      setSaving(false);
    }
  };

  return { buildingData, setBuildingData, loading, saving, saveBuildingData };
};

export default useBuildingData;
