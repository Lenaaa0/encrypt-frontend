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
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import EuroIcon from '@mui/icons-material/Euro';
import { ripemd160Hash } from '../../api/ripemd160';

const RIPEMD160Crypto = () => {
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
            
            setDebugInfo(`正在计算RIPEMD160哈希: 输入长度=${input.length}, 编码=${encoding}`);
            const response = await ripemd160Hash(input, encoding);
            
            setDebugInfo(`哈希响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                if (response.data.status === 0) {
                    setHashResult(response.data.result);
                    setSuccess('RIPEMD160哈希计算成功');
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
                    <EnhancedEncryptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">RIPEMD160 哈希计算</Typography>
                    <Chip 
                        label="区块链技术" 
                        color="primary" 
                        size="small" 
                        icon={<EuroIcon />} 
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
                            RIPEMD160 哈希结果 <Typography component="span" variant="caption" color="text.secondary">(20字节)</Typography>
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
                                        fontSize: '1rem',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        lineHeight: 1.4
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
                                计算 RIPEMD160 哈希
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
                        RIPEMD160 哈希算法说明
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    RIPEMD160(RACE Integrity Primitives Evaluation Message Digest)是由欧洲密码学研究项目开发的哈希函数，
                    输出长度为160位(20字节)。它采用双轨并行结构设计，比MD系列更抗碰撞。RIPEMD160在比特币等加密货币中被广泛应用，
                    通常与SHA256配合使用，形成"SHA256+RIPEMD160"的双重哈希机制。
                </Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px dashed' }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                        应用场景：比特币地址生成流程
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        1. 生成ECDSA公钥<br/>
                        2. 计算公钥的SHA256哈希<br/>
                        3. 对SHA256结果再计算RIPEMD160哈希<br/>
                        4. 添加版本前缀、校验和后进行Base58编码<br/>
                        5. 最终生成比特币地址
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default RIPEMD160Crypto;
