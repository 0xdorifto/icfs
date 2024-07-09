import { Box, Button } from "@mui/material";
import { connectToPlug } from "../providers/plugProvider";

function Home({ saveActors, setAccountId }) {
  const handlePlugButton = async () => {
    if (!window.ic || !window.ic.plug) {
      window.open("https://plugwallet.ooo/", "_blank");
    } else {
      await connectToPlug(saveActors, setAccountId);
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
