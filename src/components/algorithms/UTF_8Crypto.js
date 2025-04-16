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
import TranslateIcon from '@mui/icons-material/Translate';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { encode, decode } from '../../api/utf8';

const UTF_8Crypto = () => {
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
                // 编码模式 (文本 -> 十六进制)
                setDebugInfo(`正在进行UTF-8编码: 输入长度=${input.length}`);
                const response = await encode(input);
                setDebugInfo(`编码响应: ${JSON.stringify(response.data)}`);
                
                if (response.data && response.data.status === 0) {
                    setOutput(response.data.result);
                    setSuccess('UTF-8编码成功');
                } else {
                    setError(response.data?.message || 'UTF-8编码失败');
                }
            } else {
                // 解码模式 (十六进制 -> 文本)
                setDebugInfo(`正在进行UTF-8解码: 输入长度=${input.length}`);
                const response = await decode(input);
                setDebugInfo(`解码响应: ${JSON.stringify(response.data)}`);
                
                if (response.data && response.data.status === 0) {
                    setOutput(response.data.result);
                    setSuccess('UTF-8解码成功');
                } else {
                    setError(response.data?.message || 'UTF-8解码失败');
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
                    <TranslateIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">UTF-8 编解码</Typography>
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
                            label="编码（文本 → 十六进制）" 
                        />
                        <Tab 
                            icon={<ArrowDownwardIcon />} 
                            iconPosition="start" 
                            label="解码（十六进制 → 文本）" 
                        />
                    </Tabs>
                </Box>
                
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            {mode === 0 ? '文本输入' : '十六进制输入'}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 0 ? "输入要编码的文本..." : "输入要解码的十六进制字符串..."}
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
                            {mode === 0 ? '十六进制输出' : '文本输出'}
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
                                        {mode === 0 ? '十六进制编码结果将显示在这里' : '文本解码结果将显示在这里'}
                    </Box>
                                ) : (
            <Box sx={{
                                        fontFamily: mode === 0 ? 'monospace' : 'inherit',
                                        wordBreak: 'break-all',
                                        fontSize: mode === 0 ? '0.875rem' : '1rem',
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
                    UTF-8 编码说明
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    UTF-8是一种针对Unicode的可变长度字符编码，能够兼容ASCII编码，在全球互联网中被广泛使用。
                    它使用1-4个字节表示一个Unicode字符，根据字符的不同而变化编码长度。
                </Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px dashed' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        UTF-8编码规则:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • 对于1字节的字符，首位设为0，后面7位为这个字符的Unicode编码<br/>
                                • 对于n字节的字符(n>1)，第一个字节的前n位设为1，第n+1位设为0<br/>
                                • 后面字节的前两位一律设为10，剩余的二进制位则为Unicode编码
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                1字节: 0xxxxxxx (ASCII兼容)<br/>
                                2字节: 110xxxxx 10xxxxxx<br/>
                                3字节: 1110xxxx 10xxxxxx 10xxxxxx<br/>
                                4字节: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    UTF-8的主要优点是向后兼容ASCII，英文字符只需一个字节，节省空间，此外它可以对任何Unicode字符进行编码，
                    且具有自同步性（可以从任何字节开始解码）。这使得它成为网页、电子邮件、数据库等众多应用程序的标准编码。
                </Typography>
                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                    本工具可将UTF-8文本转换为其对应的十六进制表示，或将十六进制表示解码回原始文本，对于处理国际化文本
                    和多语言支持非常有用。
                </Typography>
            </Paper>
        </Box>
    );
};

export default UTF_8Crypto;