import { Alert, Box } from "@mui/material";

export function ErrorState({ message }: { message: string }) {
  return (
    <Box py={4}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}
