// src/components/AssignedProperty/PropertyNotes.jsx
import React from "react";
import { Typography, Paper, TextField, Button } from "@mui/material";

const PropertyNotes = ({ notes, newNote, setNewNote, handleAddNote }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Notes
      </Typography>
      {notes.length === 0 ? (
        <Typography>No notes yet.</Typography>
      ) : (
        notes.map((note, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: "#f5f5f5",
              fontStyle: "italic",
            }}
          >
            {note}
          </Paper>
        ))
      )}
      <TextField
        label="Add a note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        fullWidth
        multiline
        rows={2}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleAddNote}>
        Add Note
      </Button>
    </Paper>
  );
};

export default PropertyNotes;
