import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { connectToPlug } from "../providers/plugProvider";

function Home({ saveActors, setAccountId, setCollectionPrincipal }) {
  const [loading, setLoading] = useState(false);

  const handlePlugButton = async () => {
    if (!window.ic || !window.ic.plug) {
      window.open("https://plugwallet.ooo/", "_blank");
    } else {
      setLoading(true);
      await connectToPlug(saveActors, setAccountId, setCollectionPrincipal);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        onClick={async () => await handlePlugButton()}
        variant="contained"
      >
        Login
        {loading && <CircularProgress color="inherit" className="ml-4" />}
      </Button>
    </Box>
  );
}

export default Home;
