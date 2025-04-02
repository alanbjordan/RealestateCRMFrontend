// src/components/Clients/ClientsTable.jsx
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
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

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

const ClientsTable = ({
  clients,
  isLoading,
  searchQuery,
  headers,
  sortColumn,
  sortOrder,
  handleSort,
  onDeleteClient,
  onRowClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // On mobile, only show "client" and "contact" columns
  const displayedHeaders = isMobile
    ? headers.filter((header) => header.key === "client" || header.key === "contact")
    : headers;

  // Render skeleton rows when loading
  const renderSkeleton = () => (
    <TableBody>
      {[...Array(5)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(displayedHeaders.length)].map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "auto",
      }}
    >
      <Table
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            {displayedHeaders.map((header) => (
              <TableCell
                key={header.key}
                sx={{
                  fontWeight: "bold",
                  cursor: header.key !== "actions" ? "pointer" : "default",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
                onClick={() => header.key !== "actions" && handleSort(header.key)}
              >
                {header.label}
                {header.key !== "actions" && sortColumn === header.key && (
                  sortOrder === "asc" ? (
                    <ArrowUpward fontSize="small" />
                  ) : (
                    <ArrowDownward fontSize="small" />
                  )
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {isLoading ? (
          renderSkeleton()
        ) : clients.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={displayedHeaders.length} align="center">
                No clients available.
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                hover
                sx={{
                  cursor: "pointer",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
                onClick={() => onRowClick(client.id)}
              >
                {displayedHeaders.map((header) => {
                  if (header.key === "client") {
                    // Merge title, first and last name for client display
                    return (
                      <TableCell key={header.key}>
                        {highlightText(
                          `${client.title} ${client.first_name} ${client.last_name}`,
                          searchQuery
                        )}
                      </TableCell>
                    );
                  } else if (header.key === "actions") {
                    return (
                      <TableCell key={header.key} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => onDeleteClient(client.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={header.key}>
                        {highlightText(client[header.key], searchQuery)}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default ClientsTable;
