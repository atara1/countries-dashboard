import { Box, Container, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { CountriesGrid } from "../../components/CountriesGrid/CountriesGrid";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { SearchAndSortBar } from "../../components/SearchAndSortBar/SearchAndSortBar";
import type { SortState } from "../../models/country";
import { useDebouncedValue } from "../../hooks/useDebouncedValue/useDebouncedValue";
import { useCountries } from "../../hooks/useCountries/useCountries";

export function CountriesDashboardPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 150);

  const [sort, setSort] = useState<SortState>({
    key: "name",
    direction: "asc",
  });

  const { countries, total, loading, error } = useCountries({
    query: debouncedQuery,
    sort,
  });

  const resultCount = useMemo(() => countries.length, [countries.length]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper
        variant="outlined"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Countries Dashboard
        </Typography>

        <SearchAndSortBar
          query={query}
          onQueryChange={setQuery}
          sortKey={sort.key}
          sortDirection={sort.direction}
          onSortKeyChange={(key) => setSort((s) => ({ ...s, key }))}
          onSortDirectionChange={(direction) =>
            setSort((s) => ({ ...s, direction }))
          }
          resultCount={loading ? 0 : resultCount}
          totalCount={total}
        />
      </Paper>

      <Box mt={2} sx={{ minHeight: 520 }}>
        {error && <ErrorState message={error} />}
        {!error && loading && <LoadingState />}
        {!error && !loading && <CountriesGrid countries={countries} />}
      </Box>
    </Container>
  );
}
