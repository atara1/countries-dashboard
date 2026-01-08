import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import type { Country } from "../../models/country";

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export function CountryCard({ country }: { country: Country }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        avatar={
          <Avatar
            src={country.flagUrl || undefined}
            alt={country.flagAlt}
            variant="rounded"
            sx={{ width: 44, height: 32 }}
          />
        }
        title={country.name}
        subheader={
          country.capital !== "—" ? `Capital: ${country.capital}` : "Capital: —"
        }
      />
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Population
          </Typography>
          <Typography variant="h6">
            {formatNumber(country.population)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
