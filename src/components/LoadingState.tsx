import { Box, CircularProgress } from "@mui/material";

export function LoadingState() {
  return (
    <Box
      sx={{
        minHeight: 520,
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
