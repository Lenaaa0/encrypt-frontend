import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Typography, 
  Box, 
  Container,
  Paper,
  CssBaseline,
  AppBar,
  Toolbar,
  Drawer,
  Divider
} from '@mui/material';
import AlgorithmSwitch from './components/AlgorithmSwitch';
import CryptoForm from './components/CryptoForm';
import theme from './theme';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('SM4');
  const drawerWidth = 240;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: 3
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Cryptographic Library
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              background: theme.palette.background.default,
              border: 'none'
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <AlgorithmSwitch
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
            />
          </Box>
        </Drawer>
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            pt: 10,
            background: theme.palette.background.default
          }}
        >
          <Container maxWidth="lg">
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                background: 'linear-gradient(45deg, rgba(44,56,126,0.03) 0%, rgba(245,0,87,0.03) 100%)'
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 3
                }}
              >
                {selectedAlgorithm} 算法
              </Typography>
              <Divider sx={{ mb: 4 }} />
              <CryptoForm algorithm={selectedAlgorithm} />
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
