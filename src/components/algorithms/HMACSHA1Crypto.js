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
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { HMACSHA1 } from '../../api/hmacsha1';

const HMACSHA1Crypto = () => {
    const [key, setKey] = useState('');
    const [message, setMessage] = useState('');
    const [hmacResult, setHmacResult] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const generateRandomKey = () => {
        const array = new Uint8Array(20);
        window.crypto.getRandomValues(array);
        const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        setKey(key);
        setSuccess('已生成随机密钥');
    };

    const computeHMAC = async () => {
        if (!key) {
            setError('请输入密钥');
            return;
        }
        if (!message) {
            setError('请输入消息');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setSuccess('');
            setDebugInfo('');
            
            setDebugInfo(`正在计算HMAC-SHA1: 消息长度=${message.length}, 密钥长度=${key.length}, 编码=${encoding}`);
            const response = await HMACSHA1(key, message, encoding);
            
            setDebugInfo(`HMAC响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                if (response.data.status === 0) {
                    setHmacResult(response.data.result);
                    setSuccess('HMAC-SHA1计算成功');
                } else {
                    setError(response.data.message || 'HMAC计算失败');
                }
            } else {
                setError('无法获取HMAC结果');
            }
        } catch (error) {
            console.error("HMAC计算错误:", error);
            setError(`HMAC计算失败: ${error.response?.data?.message || error.message}`);
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
        setKey('');
        setMessage('');
        setHmacResult('');
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
                    <ShieldIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">HMAC-SHA1 消息认证</Typography>
                    <Chip 
                        label="数据完整性" 
                        color="secondary" 
                        size="small" 
                        icon={<VerifiedUserIcon />} 
                        sx={{ ml: 2, fontWeight: 500 }}
                    />
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            输入参数
            </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                            fullWidth
                                label="密钥"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                                margin="normal"
                                required
                                placeholder="输入密钥或生成随机密钥"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button 
                                variant="outlined" 
                                onClick={generateRandomKey} 
                                sx={{ ml: 1, mt: 1, height: 56 }}
                            >
                                生成密钥
                            </Button>
                    </Box>
                        
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="消息"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="输入要计算HMAC的消息..."
                            variant="outlined"
                            required
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
                            HMAC-SHA1 结果 <Typography component="span" variant="caption" color="text.secondary">(20字节)</Typography>
                        </Typography>
                        
                        <Card variant="outlined" sx={{ 
                            backgroundColor: 'background.default',
                            mb: 2,
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {!hmacResult ? (
                    <Box sx={{
                                        flex: 1, 
                            display: 'flex',
                            alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }}>
                                        HMAC结果将显示在这里
                    </Box>
                                ) : (
            <Box sx={{
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all',
                                        fontSize: '0.875rem',
                                        flex: 1,
                display: 'flex',
                                        flexDirection: 'column',
                justifyContent: 'center',
                                        lineHeight: 1.5
                                    }}>
                                        {hmacResult}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                                color="primary"
                                onClick={computeHMAC}
                                disabled={isLoading || !key || !message}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                            >
                                计算 HMAC-SHA1
                </Button>

                            <Button
                                variant="outlined"
                                onClick={() => copyToClipboard(hmacResult)}
                                disabled={!hmacResult}
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
                        HMAC-SHA1 算法说明
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    HMAC-SHA1(基于哈希的消息认证码)是一种使用SHA1哈希函数和密钥进行消息认证的机制，
                    广泛应用于数据完整性校验和消息认证。它能够验证消息在传输过程中是否被篡改，
                    同时也能验证消息的来源是否可信。
                </Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px dashed' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        主要应用场景:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • API认证与授权<br/>
                                • 数字签名<br/>
                                • Web会话令牌验证<br/>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • 文件完整性校验<br/>
                                • 安全通信协议<br/>
                                • 数据篡改检测<br/>
                            </Typography>
                        </Grid>
                    </Grid>
            </Box>
                
                <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                    安全提示: 虽然HMAC-SHA1仍被广泛应用，但出于前瞻性安全考虑，对于新系统设计建议使用HMAC-SHA256或HMAC-SHA3等
                    基于更强哈希函数的HMAC变体。密钥长度应至少为与哈希输出相同长度(SHA1为20字节)。
                </Typography>
            </Paper>
        </Box>
    );
};

export default HMACSHA1Crypto;

