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
    Tab,
    Tabs,
    Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import KeyIcon from '@mui/icons-material/Key';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { ecc160Encrypt, ecc160Decrypt, ecc160GenerateKey } from '../../api/ecc160';

const ECC160Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [debugInfo, setDebugInfo] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const generateKeyPair = async () => {
        try {
            setError('');
            setSuccess('');
            setDebugInfo('');
            setIsGeneratingKeys(true);
            
            setDebugInfo('正在调用API生成ECC160密钥对...');
            const response = await ecc160GenerateKey();
            
            setDebugInfo(`API调用完成，数据: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                setPublicKey(response.data.publicKey || '');
                setPrivateKey(response.data.privateKey || '');
                setSuccess('ECC160密钥对生成成功');
            } else {
                setError('无法获取密钥对数据');
            }
        } catch (error) {
            console.error("生成密钥对错误:", error);
            setDebugInfo(`生成密钥对错误: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
            setError(`生成密钥对失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsGeneratingKeys(false);
        }
    };

    // 用于Base64编码输入文本
    const encodeBase64 = (text) => {
        try {
            return btoa(text);
        } catch (e) {
            console.error("Base64编码错误:", e);
            setError("文本包含非ASCII字符，无法直接进行Base64编码");
            return null;
        }
    };

    const handleOperation = async (operation) => {
        try {
            setError('');
            setSuccess('');
            setDebugInfo('');
            setIsLoading(true);
            
            // 对输入进行Base64编码
            let response;
            if (operation === 'encrypt') {
                const encodedPlaintext = encodeBase64(plaintext);
                if (!encodedPlaintext) return; // 编码错误已在encodeBase64中设置
                
                setDebugInfo(`发送加密请求: plaintext=${encodedPlaintext}, publicKey=${publicKey}`);
                response = await ecc160Encrypt(encodedPlaintext, publicKey);
            } else {
                setDebugInfo(`发送解密请求: ciphertext=${ciphertext}, privateKey=${privateKey}`);
                response = await ecc160Decrypt(ciphertext, privateKey);
            }
            
            setDebugInfo(`操作响应: ${JSON.stringify(response.data)}`);

            if (operation === 'encrypt') {
            setCiphertext(response.data.data);
                setSuccess('加密成功');
            } else {
                try {
                    // 尝试Base64解码结果
                    const decodedText = atob(response.data.data);
                    setPlaintext(decodedText);
                } catch (e) {
                    // 如果解码失败，直接显示原始结果
                    setPlaintext(response.data.data);
                }
                setSuccess('解密成功');
            }
        } catch (error) {
            console.error("操作错误:", error);
            setError(`操作失败: ${error.response?.data?.message || error.message}`);
            setDebugInfo(`操作失败: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('已复制到剪贴板');
    };

    const clearFields = () => {
        setPlaintext('');
        setCiphertext('');
        setError('');
        setSuccess('');
        setDebugInfo('');
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {debugInfo && <Alert severity="info" sx={{ mb: 3 }}>{debugInfo}</Alert>}
            
            <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                        <KeyIcon sx={{ mr: 1 }} /> ECC-160 密钥管理
                </Typography>
                <Button
                        variant="outlined"
                        color="primary"
                        onClick={generateKeyPair}
                        disabled={isGeneratingKeys}
                        startIcon={isGeneratingKeys ? <CircularProgress size={20} /> : <RefreshIcon />}
                    >
                        生成新密钥对
                </Button>
                </Box>
                
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                            公钥 (用于加密)
                        </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)}
                            placeholder="ECC公钥..."
                            variant="outlined"
                            sx={{ mb: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="复制公钥">
                                            <IconButton onClick={() => copyToClipboard(publicKey)} disabled={!publicKey} edge="end">
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom fontWeight={500} color="warning.main">
                            私钥 (用于解密，请妥善保管)
                        </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            placeholder="ECC私钥..."
                            variant="outlined"
                            sx={{ mb: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="复制私钥">
                                            <IconButton onClick={() => copyToClipboard(privateKey)} disabled={!privateKey} edge="end">
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="加密解密选项卡">
                        <Tab icon={<LockIcon />} label="加密" />
                        <Tab icon={<LockOpenIcon />} label="解密" />
                    </Tabs>
            </Box>

                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
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
                                    disabled={isLoading || !publicKey || !plaintext}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                                >
                                    使用公钥加密
                </Button>
                                <Box>
                                    <Tooltip title="清空所有输入/输出">
                                        <IconButton onClick={clearFields} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                密文
                            </Typography>
                <TextField
                    fullWidth
                    multiline
                                rows={6}
                    value={ciphertext}
                                onChange={(e) => setCiphertext(e.target.value)}
                                placeholder="加密结果将显示在这里..."
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Tooltip title="复制密文">
                                    <IconButton onClick={() => copyToClipboard(ciphertext)} disabled={!ciphertext}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
            </Box>
                        </Grid>
                    </Grid>
                )}
                
                {tabValue === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                密文
                </Typography>
                <TextField
                    fullWidth
                    multiline
                                rows={6}
                                value={ciphertext}
                                onChange={(e) => setCiphertext(e.target.value)}
                    placeholder="输入要解密的密文..."
                                variant="outlined"
                                sx={{ mb: 2 }}
                />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleOperation('decrypt')}
                                    disabled={isLoading || !privateKey || !ciphertext}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                                >
                                    使用私钥解密
                </Button>
                                <Box>
                                    <Tooltip title="清空所有输入/输出">
                                        <IconButton onClick={clearFields} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                明文
                            </Typography>
                <TextField
                    fullWidth
                    multiline
                                rows={6}
                                value={plaintext}
                                onChange={(e) => setPlaintext(e.target.value)}
                                placeholder="解密结果将显示在这里..."
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Tooltip title="复制明文">
                                    <IconButton onClick={() => copyToClipboard(plaintext)} disabled={!plaintext}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
            </Box>
                        </Grid>
                    </Grid>
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
                    注意：ECC-160是基于椭圆曲线密码的非对称加密算法，相比RSA，使用更短的密钥实现同等安全级别。适用于资源受限的环境。
                </Typography>
            </Paper>
        </Box>
    );
};

export default ECC160Crypto;