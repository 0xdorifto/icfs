import { Box, Button } from "@mui/material";
import { connectToPlug } from "../providers/plugProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home({ saveActors }) {
  const [accountId, setAccountId] = useState("");

  const navigate = useNavigate();

  const handlePlugButton = async () => {
    if (!window.ic || !window.ic.plug) {
      window.open("https://plugwallet.ooo/", "_blank");
    } else {
      await connectToPlug(saveActors, setAccountId);
      navigate(`/${accountId}`);
    }
  };

  return (
    <Box>
      <Button
        onClick={async () => await handlePlugButton()}
        variant="contained"
      >
        Login
      </Button>
    </Box>
  );
}

export default Home;
