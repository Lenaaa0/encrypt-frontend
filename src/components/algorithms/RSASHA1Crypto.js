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
import VerifiedIcon from '@mui/icons-material/Verified';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { rsasha1Sign, rsasha1Verify, rsasha1GenerateKey } from '../../api/rsasha1';

const RSASHA1Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [modulus, setModulus] = useState('');
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [verificationResult, setVerificationResult] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError('');
        setSuccess('');
        setVerificationResult(null);
    };

    const generateKeyPair = async () => {
        try {
            setError('');
            setSuccess('');
            setDebugInfo(''); // 清除调试信息
            setIsGeneratingKeys(true);
            
            setDebugInfo('正在调用API...');
            const response = await rsasha1GenerateKey();
            
            setDebugInfo('API调用完成，响应: ' + JSON.stringify(response.data));
            
            if (response.data) {
                setPublicKey(response.data.publicKey || '');
                setPrivateKey(response.data.privateKey || '');
                setModulus(response.data.modulus || '');
                setSuccess('密钥对生成成功');
            } else {
                setError('无法获取密钥对数据');
            }
        } catch (error) {
            console.error("生成密钥对错误:", error);
            setDebugInfo('生成密钥对错误: ' + (error.toString()) + (error.response ? ', 响应: ' + JSON.stringify(error.response.data) : ''));
            setError(`生成密钥对失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsGeneratingKeys(false);
        }
    };

    const handleSign = async () => {
        try {
            setError('');
            setSuccess('');
            setIsLoading(true);
            
            const response = await rsasha1Sign(message, privateKey, modulus);
            
            if (response.data && response.data.status === 0) {
                setSignature(response.data.signature || response.data.result);
                setSuccess('数字签名生成成功');
            } else {
                setError(response.data?.message || '签名失败，无错误信息');
            }
        } catch (error) {
            console.error("签名错误:", error);
            setError(`签名失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setError('');
            setSuccess('');
            setVerificationResult(null);
            setIsLoading(true);
            
            const response = await rsasha1Verify(message, signature, publicKey, modulus);
            
            if (response.data && response.data.status === 0) {
                setVerificationResult(response.data.valid || response.data.result);
                setSuccess(response.data.valid || response.data.result ? '签名验证通过' : '签名验证失败');
            } else {
                setError(response.data?.message || '验证失败，无错误信息');
            }
        } catch (error) {
            console.error("验证错误:", error);
            setError(`验证失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('已复制到剪贴板');
    };

    const clearFields = () => {
        setMessage('');
        setSignature('');
        setError('');
        setSuccess('');
        setVerificationResult(null);
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
                        <KeyIcon sx={{ mr: 1 }} /> RSA-SHA1 密钥管理
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
                            公钥 (用于验证签名)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)}
                            placeholder="RSA公钥..."
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
                            私钥 (用于生成签名，请妥善保管)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            placeholder="RSA私钥..."
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
                
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                        模数 (modulus)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={modulus}
                        onChange={(e) => setModulus(e.target.value)}
                        placeholder="RSA模数..."
                        variant="outlined"
                        sx={{ mb: 1 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="复制模数">
                                        <IconButton onClick={() => copyToClipboard(modulus)} disabled={!modulus} edge="end">
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="签名验证选项卡">
                        <Tab icon={<DriveFileRenameOutlineIcon />} label="签名" />
                        <Tab icon={<VerifiedIcon />} label="验证" />
                    </Tabs>
                </Box>
                
                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                消息
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="输入要签名的消息..."
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSign}
                                    disabled={isLoading || !privateKey || !modulus || !message}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <DriveFileRenameOutlineIcon />}
                                >
                                    使用私钥签名
                                </Button>
                                <Box>
                                    <Tooltip title="清空所有字段">
                                        <IconButton onClick={clearFields} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                数字签名
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                placeholder="签名结果将显示在这里..."
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Tooltip title="复制签名">
                                    <IconButton onClick={() => copyToClipboard(signature)} disabled={!signature}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                )}
                
                {tabValue === 1 && (
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    消息
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="输入需要验证的原始消息..."
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    数字签名
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="输入需要验证的签名..."
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleVerify}
                                disabled={isLoading || !publicKey || !modulus || !message || !signature}
                                startIcon={isLoading ? <CircularProgress size={20} /> : <VerifiedIcon />}
                            >
                                验证签名
                            </Button>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {verificationResult !== null && (
                                    <Alert 
                                        severity={verificationResult ? "success" : "error"}
                                        icon={verificationResult ? <VerifiedIcon /> : false}
                                        sx={{ mr: 2 }}
                                    >
                                        {verificationResult ? "签名有效" : "签名无效"}
                                    </Alert>
                                )}
                                <Tooltip title="清空所有字段">
                                    <IconButton onClick={clearFields} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
                    注意：RSA-SHA1将消息使用SHA1哈希后，再使用RSA私钥签名。这是一种广泛应用于数字证书、代码签名等场景的数字签名算法。
                </Typography>
            </Paper>
        </Box>
    );
};

export default RSASHA1Crypto;


