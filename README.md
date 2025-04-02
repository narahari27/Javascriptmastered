import './App.css';
import { NodeProvider } from './NodeContext';
import { ThemeProvider, createTheme, CssBaseline, Box, Grid } from '@mui/material';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import RetryButton from './components/auth/Retry';
import LoginButton from './components/auth/Login';
import { AllowedContent, NotAllowedContent, RoleLayout } from './components/auth/RoleLayout';import Dashboard from './components/Dashboard';
import Header from './components/Header';const theme = createTheme({
  palette: {
    primary: {
      light: '#757CE8',
      main: '#D6006E',
      dark: '#800042',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FF7961',
      main: '#D6006E',
      dark: '#BA000D',
      contrastText: '#000',
    },
  },
});function App() {
  return (
<ThemeProvider theme={theme}>
<CssBaseline />
<NodeProvider>
<Header />
<Dashboard />
</NodeProvider>
</ThemeProvider>
  );
}export default App;
