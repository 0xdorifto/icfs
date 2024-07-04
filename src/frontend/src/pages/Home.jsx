import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/user");
  };

  return (
    <Box>
      <Button onClick={handleLogin} variant="contained">
        Login
      </Button>
    </Box>
  );
}

export default Home;
