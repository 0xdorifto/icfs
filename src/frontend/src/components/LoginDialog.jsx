import { Alert } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { management } from "../../../declarations/management";

function LoginDialog({ open, handleClose }) {
  const navigate = useNavigate();

  async function login(user) {
    const userExists = await management.user_exists(user);
    console.log("user_exists", user_exists);
    if (userExists) navigate("/user");
    else <Alert severity="error">Unvalid user.</Alert>;
  }

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          login(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Login</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginDialog;
