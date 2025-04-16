import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography,
  Divider,
  Collapse,
  ListItemIcon
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CodeIcon from '@mui/icons-material/Code';

const AlgorithmSwitch = ({ selectedAlgorithm, onAlgorithmChange }) => {
  const [openSections, setOpenSections] = React.useState({
    symmetric: true,
    asymmetric: true,
    hash: true,
    encode: true
  });

  const handleSectionClick = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  const renderAlgorithmSection = (title, algorithms, icon, section) => {
    return (
      <>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleSectionClick(section)}>
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600}
                >
                  {title}
                </Typography>
              } 
            />
            {openSections[section] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSections[section]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {algorithms.map((algo) => (
              <ListItem key={algo} disablePadding>
                <ListItemButton 
                  selected={selectedAlgorithm === algo}
                  onClick={() => onAlgorithmChange(algo)}
                  sx={{
                    pl: 4,
                    '&.Mui-selected': {
                      backgroundColor: (theme) => 
                        `rgba(${parseInt(theme.palette.primary.main.slice(1, 3), 16)}, 
                         ${parseInt(theme.palette.primary.main.slice(3, 5), 16)}, 
                         ${parseInt(theme.palette.primary.main.slice(5, 7), 16)}, 0.1)`,
                      '&:hover': {
                        backgroundColor: (theme) => 
                          `rgba(${parseInt(theme.palette.primary.main.slice(1, 3), 16)}, 
                           ${parseInt(theme.palette.primary.main.slice(3, 5), 16)}, 
                           ${parseInt(theme.palette.primary.main.slice(5, 7), 16)}, 0.2)`,
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={algo} 
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: selectedAlgorithm === algo ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <Divider sx={{ my: 1 }} />
      </>
    );
  };

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          px: 2, 
          mb: 2, 
          fontWeight: 'bold',
          color: (theme) => theme.palette.primary.main
        }}
      >
        算法选择
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {renderAlgorithmSection(
          "对称加密", 
          ['SM4', 'AES', 'RC6'], 
          <LockIcon color="primary" />,
          'symmetric'
        )}
        {renderAlgorithmSection(
          "非对称加密", 
          ['RSA1024', 'RSASHA1', 'ECC160', 'ECDSA'], 
          <EnhancedEncryptionIcon color="primary" />,
          'asymmetric'
        )}
        {renderAlgorithmSection(
          "哈希算法", 
          ['SHA1', 'SHA256', 'SHA3-512', 'RIPEMD160', 'PBKDF2', 'HMACSHA1', 'HMACSHA256'], 
          <FingerprintIcon color="primary" />,
          'hash'
        )}
        {renderAlgorithmSection(
          "编码算法", 
          ['Base64', 'UTF-8'],
          <CodeIcon color="primary" />,
          'encode'
        )}
      </List>
    </Box>
  );
};

export default AlgorithmSwitch;