import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import Header from "./components/Header";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);
  return (
    <Container>
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Outlet context={{ socket }} />
      </Box>
    </Container>
  );
}

export default App;
