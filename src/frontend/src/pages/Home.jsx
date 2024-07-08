import { Box, Button } from "@mui/material";
import { useState } from "react";
import CreateAccountDialog from "../components/CreateAccountDialog";
import LoginDialog from "../components/LoginDialog";

function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openCreateAccount, setOpenCreateAccount] = useState(false);

  // const navigate = useNavigate();

  // const handleLogin = () => {
  //   navigate("/user");
  // };

  // const handleCreateAccount = () => {
  //   navigate("/user");
  // };

  return (
    <Box>
      <Button onClick={() => setOpenLogin(true)} variant="contained">
        Login
      </Button>
      <Button onClick={() => setOpenCreateAccount(true)} variant="contained">
        Create Account
      </Button>

      <LoginDialog open={openLogin} handleClose={() => setOpenLogin(false)} />

      <CreateAccountDialog
        open={openCreateAccount}
        handleClose={() => setOpenCreateAccount(false)}
      />
    </Box>
  );
}

export default Home;
