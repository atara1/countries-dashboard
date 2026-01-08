# Countries Dashboard
React + TypeScript application that displays country data from the REST Countries API.
The app allows searching and sorting countries.

## Features
- Fetch countries from REST Countries API
- Search countries by name (debounced)
- Sort by name or population (ascending / descending)
- Loading and error states
- Unit and integration tests
- Dockerized production build served via Nginx

## Tech Stack
- React
- TypeScript
- Vite
- Vitest + Testing Library
- Material UI (MUI)
- Docker + Nginx

## Components Overview

### CountriesDashboardPage
Main page of the application.  
Responsible for:

- Managing search and sort state
- Connecting UI components with data hooks
- Handling loading and error states

### SearchAndSortBar
Reusable and fully controlled component for:

- Searching countries by name
- Selecting sort key and direction

### CountriesGrid
Displays a grid of country cards.

### CountryCard
Pure presentational component that displays:

- Country name
- Capital
- Population
- Flag

## Hooks

### useCountries
Encapsulates all country data logic:

- Fetching countries from the API
- Handling loading and error states
- Filtering by search query
- Sorting via a pure utility function

### useDebouncedValue
Reusable hook that debounces any value.  
Used to avoid excessive filtering while typing.

## Utilities

### sortCountries
Pure function that sorts countries by name or population and supports both ascending and descending order.

## Testing Strategy
The project includes both unit and integration tests.

### Unit Tests
- Utility functions (`sortCountries`)
- Custom hooks (`useDebouncedValue`, `useCountries`)
- Pure UI components

### Integration Tests
- Page-level tests (`CountriesDashboardPage`)
- Validate interaction between components, hooks, and state
- API and hooks are mocked to keep tests fast and deterministic

Tests are written using Vitest and React Testing Library.

## Running Locally
npm install
npm run dev

### Build image
docker build -t countries-dashboard .

### Run container
docker run -p 8080:80 countries-dashboard

### Open in browser
http://localhost:8080
