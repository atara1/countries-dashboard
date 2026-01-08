import Grid from "@mui/material/Grid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { SortKey, SortDirection } from "../../models/country";

type SearchAndSortBarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortKeyChange: (v: SortKey) => void;
  onSortDirectionChange: (v: SortDirection) => void;
  resultCount: number;
  totalCount: number;
};

export function SearchAndSortBar({
  query,
  onQueryChange,
  sortKey,
  sortDirection,
  onSortKeyChange,
  onSortDirectionChange,
  resultCount,
  totalCount,
}: SearchAndSortBarProps) {
  return (
    <Grid container spacing={2} alignItems="flex-start">
      <Grid size={{ xs: 12, md: 8 }}>
        <TextField
          fullWidth
          label="Search by country name"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          helperText={`Showing ${resultCount} of ${totalCount}`}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="sort-key">Sort by</InputLabel>
          <Select
            labelId="sort-key"
            label="Sort by"
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="population">Population</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="sort-dir">Direction</InputLabel>
          <Select
            labelId="sort-dir"
            label="Direction"
            value={sortDirection}
            onChange={(e) =>
              onSortDirectionChange(e.target.value as SortDirection)
            }
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
