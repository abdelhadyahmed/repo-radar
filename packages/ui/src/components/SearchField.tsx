import ClearIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  busy?: boolean;
  autoFocus?: boolean;
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
  busy,
  autoFocus,
}: SearchFieldProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      autoComplete="off"
      slotProps={{
        htmlInput: { 'aria-label': 'Search GitHub repositories' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {busy && <CircularProgress size={16} />}
              {value && !busy && (
                <IconButton size="small" aria-label="Clear search" onClick={() => onChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
