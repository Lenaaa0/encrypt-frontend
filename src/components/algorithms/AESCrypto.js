import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Grid,
    Paper,
    FormControl,
    FormLabel,
    CircularProgress,
    Alert,
    InputAdornment,
    Tooltip,
    IconButton,
    MenuItem,
    Select
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import { aesEncrypt, aesDecrypt } from '../../api/aes';

const AESCrypto = () => {
    const [key, setKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [mode, setMode] = useState('CBC');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleOperation = async (operation) => {
        try {
            setError('');
            setSuccess('');
            setIsLoading(true);
            
            const response = operation === 'encrypt'
                ? await aesEncrypt(key, plaintext, encoding, mode)
                : await aesDecrypt(key, ciphertext, encoding, mode);

            if (response.data.status !== 0) {
                setError(response.data.message);
                return;
            }

            if (operation === 'encrypt') {
                setCiphertext(response.data.result);
                setSuccess('加密成功');
            } else {
                setPlaintext(response.data.result);
                setSuccess('解密成功');
            }
        } catch (error) {
            setError(`操作失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('已复制到剪贴板');
    };

    const clearFields = () => {
        setKey('');
        setPlaintext('');
        setCiphertext('');
        setError('');
        setSuccess('');
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <SettingsIcon sx={{ mr: 1 }} /> 加密设置
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <FormLabel component="legend">输出编码</FormLabel>
                            <RadioGroup
                                row
                                value={encoding}
                                onChange={(e) => setEncoding(e.target.value)}
                            >
                                <FormControlLabel value="hex" control={<Radio />} label="Hex" />
                                <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel component="legend">加密模式</FormLabel>
                            <Select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                <MenuItem value="ECB">ECB 模式</MenuItem>
                                <MenuItem value="CBC">CBC 模式</MenuItem>
                                <MenuItem value="CFB">CFB 模式</MenuItem>
                                <MenuItem value="OFB">OFB 模式</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                
                <TextField
                    fullWidth
                    label="AES密钥（16/24/32字节）"
                    variant="outlined"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    sx={{ mb: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyIcon color="primary" />
                            </InputAdornment>
                        )
                    }}
                />
                <Typography variant="caption" color="text.secondary">
                    密钥长度必须为16字节(AES-128)、24字节(AES-192)或32字节(AES-256)
                </Typography>
            </Paper>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            明文
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
                            placeholder="输入要加密的明文..."
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOperation('encrypt')}
                                disabled={isLoading || !key || !plaintext}
                                startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                            >
                                加密
                            </Button>
                            <Box>
                                <Tooltip title="复制明文">
                                    <IconButton onClick={() => copyToClipboard(plaintext)} disabled={!plaintext}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="清空所有字段">
                                    <IconButton onClick={clearFields} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            密文
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={ciphertext}
                            onChange={(e) => setCiphertext(e.target.value)}
                            placeholder="加密结果或待解密的密文..."
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleOperation('decrypt')}
                                disabled={isLoading || !key || !ciphertext}
                                startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                            >
                                解密
                            </Button>
                            <Tooltip title="复制密文">
                                <IconButton onClick={() => copyToClipboard(ciphertext)} disabled={!ciphertext}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AESCrypto;