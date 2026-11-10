import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="70vh"
    >
      <Typography variant="h2" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" color="gray" mt={2}>
        Page Not Found
      </Typography>
    </Box>
  );
};

export default NotFound;
