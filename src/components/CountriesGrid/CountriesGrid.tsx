import Grid from "@mui/material/Grid";
import type { Country } from "../../models/country";
import { CountryCard } from "../CountryCard/CountryCard";

export function CountriesGrid({ countries }: { countries: Country[] }) {
  return (
    <Grid container spacing={2}>
      {countries.map((country) => (
        <Grid key={country.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CountryCard country={country} />
        </Grid>
      ))}
    </Grid>
  );
}
