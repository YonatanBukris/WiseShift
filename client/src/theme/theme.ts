import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#38717d", // Main teal color for primary buttons/actions
      light: "#38717d", // Light turquoise for hover states
      dark: "#0b1628", // Dark navy for text/headers
    },
    secondary: {
      main: "#76e4e9", // Turquoise for secondary elements
      dark: "#38717d", // Teal for hover states
      light: "#a8edf0", // Lighter turquoise for backgrounds
    },
    text: {
      primary: "#0b1628", // Dark navy for main text
      secondary: "#38717d", // Teal for secondary text
    },
    background: {
      default: "#ffffff",
      paper: "#f8feff", // Very light turquoise tint
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0b1628", // Dark navy for app bar
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#76e4e9", // Light turquoise on hover
          },
        },
      },
    },
  },
  direction: "rtl", // For RTL support
});
