import { Box } from "@mui/material";
import { Sidebar, DRAWER_WIDTH } from "./Sidebar";
import { Header } from "./Header";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", direction: "rtl" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginTop: "64px", // Height of the header
          marginLeft: 0,
          overflowX: "hidden", // Prevent horizontal scrolling
          position: "relative", // Add this
          right: 0, // Add this
        }}
      >
        <Box sx={{ maxWidth: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
};
