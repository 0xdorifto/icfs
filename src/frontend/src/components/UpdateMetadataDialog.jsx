import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import * as React from "react";

function base64ToBlob(base64String, contentType = "image/png") {
  const base64Data = base64String.split(",")[1] || base64String;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
}

export default function UpdateMetadataDialog({ collectionActor }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [attributes, setAttributes] = React.useState([
    { trait_type: "", value: "" },
  ]);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAttributes([{ trait_type: "", value: "" }]);
    setSelectedImage(null);
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Process attributes
    formJson.attributes = attributes.filter(
      (attr) => attr.trait_type && attr.value
    );

    const tokenId = BigInt(formJson.tokenId);
    delete formJson.tokenId;

    // Handle image upload
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        formJson["image"] = "";
        console.log(formJson);
        console.log("collectionActor", collectionActor);

        // Convert base64 to Blob
        const imageBlob = base64ToBlob(reader.result);

        // Convert Blob to ArrayBuffer
        const arrayBuffer = await imageBlob.arrayBuffer();

        // Convert ArrayBuffer to Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);

        console.log("image", uint8Array);
        console.log(await collectionActor.update_image(tokenId, uint8Array));
        console.log(await collectionActor.update_metadata(tokenId, formJson));
        handleClose();
      };
      reader.readAsDataURL(selectedImage);
    } else {
      formJson["image"] = "";
      console.log(formJson);
      console.log("collectionActor", collectionActor);
      console.log(await collectionActor.update_metadata(tokenId, formJson));
      handleClose();
    }
    setLoading(false);
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
        Edit Metadata
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Metadata</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="tokenId"
              name="tokenId"
              label="Token ID"
              type="text"
              fullWidth
              variant="standard"
            />
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
            <Button
              variant="contained"
              component="label"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {selectedImage && <p>{selectedImage.name}</p>}
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
            <Button type="submit">
              Edit {loading && <CircularProgress />}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
