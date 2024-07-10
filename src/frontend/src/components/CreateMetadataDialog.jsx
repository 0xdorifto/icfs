import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function CreateMetadataDialog({ collectionActor }) {
  const [open, setOpen] = React.useState(false);
  const [attributes, setAttributes] = React.useState([
    { trait_type: "", value: "" },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAttributes([{ trait_type: "", value: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Process attributes
    formJson.attributes = attributes.filter(
      (attr) => attr.trait_type && attr.value
    );

    formJson["image"] = "";

    console.log(formJson);
    console.log("collectionActor", collectionActor);
    console.log(await collectionActor.create_metadata(formJson));

    handleClose();
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Metadata
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create Metadata</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={3}
            />
            <h4>Attributes</h4>
            {attributes.map((attr, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <TextField
                  margin="dense"
                  label="Trait Type"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={attr.trait_type}
                  onChange={(e) =>
                    handleAttributeChange(index, "trait_type", e.target.value)
                  }
                />
                <TextField
                  margin="dense"
                  label="Value"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={attr.value}
                  onChange={(e) =>
                    handleAttributeChange(index, "value", e.target.value)
                  }
                />
                <IconButton
                  onClick={() => handleRemoveAttribute(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddAttribute}>
              Add Attribute
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
