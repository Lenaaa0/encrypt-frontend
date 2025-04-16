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
    Divider,
    Card,
    CardContent,
    Tabs,
    Tab,
    Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EncodingIcon from '@mui/icons-material/EnhancedEncryption';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { encode, decode } from '../../api/base64';

const Base64Crypto = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState(0); // 0 = 编码, 1 = 解码
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const handleTabChange = (event, newValue) => {
        setMode(newValue);
        setInput('');
        setOutput('');
        setError('');
        setSuccess('');
    };

    const handleProcess = async () => {
        if (!input) {
            setError('请输入要处理的内容');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setSuccess('');
            setDebugInfo('');
            
            if (mode === 0) {
                // 编码模式
                setDebugInfo(`正在进行Base64编码: 输入长度=${input.length}`);
                const response = await encode(input);
                setDebugInfo(`编码响应: ${JSON.stringify(response.data)}`);
                
                if (response.data && response.data.status === 0) {
                    setOutput(response.data.result);
                    setSuccess('Base64编码成功');
                } else {
                    setError(response.data?.message || 'Base64编码失败');
                }
            } else {
                // 解码模式
                setDebugInfo(`正在进行Base64解码: 输入长度=${input.length}`);
                const response = await decode(input);
                setDebugInfo(`解码响应: ${JSON.stringify(response.data)}`);
                
                if (response.data && response.data.status === 0) {
                    setOutput(response.data.result);
                    setSuccess('Base64解码成功');
                } else {
                    setError(response.data?.message || 'Base64解码失败');
                }
            }
        } catch (error) {
            console.error("处理错误:", error);
            setError(`操作失败: ${error.response?.data?.message || error.message}`);
            setDebugInfo(`失败: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
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
        setOutput('');
        setError('');
        setSuccess('');
        setDebugInfo('');
    };

    const exchangeValues = () => {
        setInput(output);
        setOutput('');
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {debugInfo && <Alert severity="info" sx={{ mb: 3 }}>{debugInfo}</Alert>}
            
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EncodingIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Base64 编解码</Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ width: '100%', mb: 3 }}>
                    <Tabs 
                        value={mode} 
                        onChange={handleTabChange} 
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab 
                            icon={<ArrowUpwardIcon />} 
                            iconPosition="start" 
                            label="编码" 
                        />
                        <Tab 
                            icon={<ArrowDownwardIcon />} 
                            iconPosition="start" 
                            label="解码" 
                        />
                    </Tabs>
                </Box>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            {mode === 0 ? '原始数据' : 'Base64编码'}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 0 ? "输入要编码的文本..." : "输入要解码的Base64..."}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {mode === 0 ? <TextSnippetIcon color="action" /> : <CodeIcon color="action" />}
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title="清空所有字段">
                                <IconButton onClick={clearFields} color="error" sx={{ ml: 1 }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            {mode === 0 ? 'Base64编码' : '解码结果'}
                        </Typography>
                        
                        <Card variant="outlined" sx={{ 
                            backgroundColor: 'background.default',
                            mb: 2,
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {!output ? (
                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }}>
                                        {mode === 0 ? 'Base64编码结果将显示在这里' : '解码结果将显示在这里'}
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
                                        lineHeight: 1.5,
                                        overflowY: 'auto',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {output}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleProcess}
                                    disabled={isLoading || !input}
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : mode === 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                >
                                    {mode === 0 ? '编码' : '解码'}
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    onClick={exchangeValues}
                                    disabled={!output}
                                    startIcon={<ArrowDownwardIcon />}
                                >
                                    用结果继续
                                </Button>
                            </Stack>
                            
                            <Button
                                variant="outlined"
                                onClick={() => copyToClipboard(output)}
                                disabled={!output}
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
                    Base64 编码说明
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Base64是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在通常处理文本数据的场合，
                    表示、传输、存储一些二进制数据，包括MIME的电子邮件及XML的一些复杂数据。
                </Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px dashed' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        主要应用场景:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • 电子邮件附件编码<br/>
                                • URL参数传递二进制数据<br/>
                                • XML/JSON中嵌入二进制数据<br/>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • 数据URI(Data URI scheme)<br/>
                                • 证书和密钥的文本表示<br/>
                                • HTTP基本认证协议<br/>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Base64编码会将输入数据扩展为原始大小的约4/3，因为每3个字节(24位)的二进制数据被转换为4个可打印字符(32位)。
                    当输入数据长度不是3的倍数时，编码器会添加填充字符"="来使输出长度为4的倍数。
                </Typography>
            </Paper>
        </Box>
    );
};

export default Base64Crypto;

