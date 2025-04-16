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
    CardContent,
    Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SecurityIcon from '@mui/icons-material/Security';
import GppGoodIcon from '@mui/icons-material/GppGood';
import { sha3_512Hash } from '../../api/sha3_512';

const SHA3_512Crypto = () => {
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
            
            setDebugInfo(`正在计算SHA3-512哈希: 输入长度=${input.length}, 编码=${encoding}`);
            const response = await sha3_512Hash(input, encoding);
            
            setDebugInfo(`哈希响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                if (response.data.status === 0) {
                    setHashResult(response.data.result);
                    setSuccess('SHA3-512哈希计算成功');
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
                    <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">SHA3-512 哈希计算</Typography>
                    <Chip 
                        label="量子抗性" 
                        color="secondary" 
                        size="small" 
                        icon={<GppGoodIcon />} 
                        sx={{ ml: 2, fontWeight: 500 }}
                    />
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
                            SHA3-512 哈希结果 <Typography component="span" variant="caption" color="text.secondary">(64字节)</Typography>
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
                                        fontSize: '0.75rem',
                                        flex: 1,
                display: 'flex',
                                        flexDirection: 'column',
                justifyContent: 'center',
                                        lineHeight: 1.5
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
                                计算 SHA3-512 哈希
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                        SHA3-512 哈希算法说明
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    SHA3-512是SHA-3家族中最强的哈希算法之一，输出长度为512位(64字节)的哈希值。SHA3基于Keccak海绵函数构造，
                    采用全新的设计理念，与SHA-1、SHA-2系列结构完全不同。SHA3-512提供极高的安全性，被NIST认证为目前最安全的
                    哈希算法之一，具有抵抗量子计算攻击的潜力。
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: 'secondary.main', fontWeight: 500 }}>
                    安全特性：SHA3-512是唯一具有量子计算抗性的官方标准哈希算法，适用于长期数据保护、政府级安全需求、金融系统和
                    关键基础设施等高安全场景。其512位输出长度使得暴力破解和碰撞攻击在可预见的未来几乎不可能实现。
                </Typography>
            </Paper>
        </Box>
    );
};

export default SHA3_512Crypto;

