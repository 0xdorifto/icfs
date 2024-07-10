import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import * as React from "react";

export default function CreateCollectionDialog({
  managementActor,
  user,
  collections,
  onCollectionCreated,
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    formJson["owner"] = user;
    formJson["collection_size"] = BigInt(formJson["collection_size"]);
    console.log(formJson);

    if (collections.length === 0) await managementActor.add_user(user);

    await managementActor.add_collection(user, formJson);

    onCollectionCreated();

    setLoading(false);
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Collection
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Collection</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
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
              id="collection_size"
              name="collection_size"
              label="Collection Size"
              type="number"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="chain_name"
              name="chain_name"
              label="Chain Name"
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
            <TextField
              margin="dense"
              id="standard"
              name="standard"
              label="Standard"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">
              Create
              {loading && <CircularProgress color="inherit" className="ml-4" />}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
