import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    InputAdornment,
    Tooltip,
    IconButton,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { sha256Hash } from '../../api/sha256';

const SHA256Crypto = () => {
    const [input, setInput] = useState('');
    const [hashResult, setHashResult] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const calculateHash = async () => {
        if (!input) {
            setError('请输入要哈希的内容');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setSuccess('');
            setDebugInfo('');
            
            setDebugInfo(`正在计算SHA256哈希: 输入长度=${input.length}, 编码=${encoding}`);
            const response = await sha256Hash(input, encoding);
            
            setDebugInfo(`哈希响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                if (response.data.status === 0) {
                    setHashResult(response.data.result);
                    setSuccess('SHA256哈希计算成功');
                } else {
                    setError(response.data.message || '哈希计算失败');
                }
            } else {
                setError('无法获取哈希结果');
            }
        } catch (error) {
            console.error("哈希计算错误:", error);
            setError(`哈希计算失败: ${error.response?.data?.message || error.message}`);
            setDebugInfo(`计算失败: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('已复制到剪贴板');
    };

    const clearFields = () => {
        setInput('');
        setHashResult('');
        setError('');
        setSuccess('');
        setDebugInfo('');
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {debugInfo && <Alert severity="info" sx={{ mb: 3 }}>{debugInfo}</Alert>}
            
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VerifiedUserIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">SHA256 哈希计算</Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            输入内容
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="输入要计算哈希的文本..."
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TextSnippetIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControl component="fieldset">
                                <Typography variant="body2" fontWeight={500} gutterBottom>
                                    输出格式
                                </Typography>
                                <RadioGroup
                                    row
                                    value={encoding}
                                    onChange={(e) => setEncoding(e.target.value)}
                                >
                                    <FormControlLabel value="hex" control={<Radio />} label="十六进制" />
                                    <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                                </RadioGroup>
                            </FormControl>
                            
                            <Box>
                                <Tooltip title="清空所有字段">
                                    <IconButton onClick={clearFields} color="error" sx={{ ml: 1 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            SHA256 哈希结果
                        </Typography>
                        
                        <Card variant="outlined" sx={{ 
                            backgroundColor: 'background.default',
                            mb: 2,
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {!hashResult ? (
                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }}>
                                        哈希结果将显示在这里
                                    </Box>
                                ) : (
                                    <Box sx={{ 
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all',
                                        fontSize: '0.875rem',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        {hashResult}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={calculateHash}
                                disabled={isLoading || !input}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                            >
                                计算 SHA256 哈希
                            </Button>
                            
                            <Button
                                variant="outlined"
                                onClick={() => copyToClipboard(hashResult)}
                                disabled={!hashResult}
                                startIcon={<ContentCopyIcon />}
                            >
                                复制结果
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                    SHA256 哈希算法说明
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    SHA256(安全哈希算法256)是SHA-2家族的一员，输出长度为256位(32字节)的哈希值。较SHA1提供更高的安全性，
                    被广泛应用于加密货币、数字证书、安全通信协议和数据完整性验证等场景。SHA256具有抗碰撞性，即难以找到
                    两个不同的输入产生相同的哈希输出。
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    安全等级：SHA256目前被认为是安全的，广泛用于需要高安全性的场景，是比特币等加密货币的核心算法之一。
                </Typography>
            </Paper>
        </Box>
    );
};

export default SHA256Crypto;