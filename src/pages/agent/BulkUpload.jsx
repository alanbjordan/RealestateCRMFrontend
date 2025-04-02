// src/pages/agent/BulkUpload.jsx
import React, { useState } from "react";
import useBulkUpload from "../../hooks/useBulkUpload";

const BulkUpload = () => {
  const [bulkInput, setBulkInput] = useState("");
  const [parsedProperties, setParsedProperties] = useState([]);
  const { submitting, submitMessage, submitBulkProperties } = useBulkUpload();

  const handleParse = () => {
    const lines = bulkInput.trim().split("\n");
    // Skip header if exists
    const dataLines =
      lines[0].toLowerCase().includes("code") ? lines.slice(1) : lines;

    const parsed = dataLines
      .map((line) => {
        // Split by tabs and trim each column value.
        const cols = line.split("\t").map((col) => col.trim());
        // Ensure we have 13 columns by padding missing values with an empty string.
        while (cols.length < 13) {
          cols.push("");
        }

        // Extract and format values.
        // For property_code, remove any extra parts after a space.
        const property_code = cols[0].split(" ")[0];
        // For building, remove any "Pdf" prefix (case-insensitive).
        const building = cols[1].replace(/^pdf\s*/i, "");
        const unit = cols[2];
        // Column 3 is unused based on your mapping.
        const floor = cols[4] ? parseInt(cols[4], 10) || null : null;
        const bedrooms = cols[5] ? parseInt(cols[5], 10) || null : null;
        const bathrooms = cols[6] ? parseInt(cols[6], 10) || null : null;
        let sizeStr = cols[7]
          ? cols[7].toLowerCase().replace("sq.m", "").trim()
          : "";
        const size = sizeStr ? parseFloat(sizeStr) || null : null;
        // Sell price (column 8)
        let sellPriceStr = cols[8] ? cols[8].replace(/,/g, "").trim() : "";
        const sell_price = sellPriceStr ? parseFloat(sellPriceStr) || null : null;
        // Rent price (column 9)
        let rentPriceStr = cols[9] ? cols[9].replace(/,/g, "").trim() : "";
        const price = rentPriceStr ? parseFloat(rentPriceStr) || null : null;
        const status = cols[10];
        const owner = cols[11];
        const contact = cols[12];

        return {
          property_code,
          building,
          unit,
          floor,
          bedrooms,
          bathrooms,
          size,
          sell_price,
          price,
          status,
          owner,
          contact,
        };
      })
      .filter((item) => item !== null);

    setParsedProperties(parsed);
  };

  const handleClear = () => {
    setBulkInput("");
    setParsedProperties([]);
  };

  const handleSubmit = async () => {
    if (parsedProperties.length > 0) {
      await submitBulkProperties(parsedProperties);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bulk Properties Upload</h2>
      <textarea
        rows="10"
        style={{ width: "100%" }}
        placeholder="Paste your bulk property data here..."
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleParse}>Parse Data</button>
        <button onClick={handleClear} style={{ marginLeft: "10px" }}>
          Clear Data
        </button>
        {parsedProperties.length > 0 && (
          <button
            onClick={handleSubmit}
            style={{ marginLeft: "10px" }}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Data"}
          </button>
        )}
      </div>
      {submitMessage && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          {submitMessage}
        </p>
      )}
      {parsedProperties.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Parsed Properties</h3>
          <table
            border="1"
            cellPadding="5"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Code</th>
                <th>Building</th>
                <th>Unit</th>
                <th>Floor</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Size (sq.m)</th>
                <th>Sell Price</th>
                <th>Rent Price</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {parsedProperties.map((property, index) => (
                <tr key={index}>
                  <td>{property.property_code}</td>
                  <td>{property.building}</td>
                  <td>{property.unit}</td>
                  <td>{property.floor}</td>
                  <td>{property.bedrooms}</td>
                  <td>{property.bathrooms}</td>
                  <td>{property.size}</td>
                  <td>{property.sell_price}</td>
                  <td>{property.price}</td>
                  <td>{property.status}</td>
                  <td>{property.owner}</td>
                  <td>{property.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
