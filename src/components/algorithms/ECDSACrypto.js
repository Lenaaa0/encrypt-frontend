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
import { ecdsaSign, ecdsaVerify, ecdsaGenerateKey } from '../../api/ecdsa';

const ECDSACrypto = () => {
    const [publicKeyX, setPublicKeyX] = useState('');
    const [publicKeyY, setPublicKeyY] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [message, setMessage] = useState('');
    const [signatureR, setSignatureR] = useState('');
    const [signatureS, setSignatureS] = useState('');
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
            setDebugInfo('');
            setIsGeneratingKeys(true);
            
            setDebugInfo('正在调用API生成ECDSA密钥对...');
            const response = await ecdsaGenerateKey();
            
            setDebugInfo(`API调用完成，数据: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                setPublicKeyX(response.data.publicKeyX || '');
                setPublicKeyY(response.data.publicKeyY || '');
                setPrivateKey(response.data.privateKey || '');
                setSuccess('ECDSA密钥对生成成功');
                console.log("设置公钥 X:", response.data.publicKeyX);
                console.log("设置公钥 Y:", response.data.publicKeyY);
                setDebugInfo(`公钥X: ${response.data.publicKeyX}, 公钥Y: ${response.data.publicKeyY}`);
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

    const handleSign = async () => {
        try {
            setError('');
            setSuccess('');
            setDebugInfo('');
            setIsLoading(true);
            
            // 对消息进行Base64编码
            const encodedMessage = encodeBase64(message);
            if (!encodedMessage) return; // 编码错误已在encodeBase64中设置
            
            setDebugInfo(`发送签名请求: message=${encodedMessage}, privateKey=${privateKey}`);
            const response = await ecdsaSign(encodedMessage, privateKey);
            
            setDebugInfo(`签名响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                // 检查响应中的r和s字段
                if (response.data.r !== undefined && response.data.s !== undefined) {
                    setSignatureR(response.data.r);
                    setSignatureS(response.data.s);
                    setSuccess('数字签名生成成功');
                } else if (response.data.signature) {
                    // 备选格式：如果返回单个signature字段
                    setSignatureR(response.data.signature);
                    setSignatureS('');
                    setSuccess('数字签名生成成功');
                } else {
                    setError('无法解析签名结果: ' + JSON.stringify(response.data));
                }
            } else {
                setError('无法获取签名结果');
            }
        } catch (error) {
            console.error("签名错误:", error);
            setError(`签名失败: ${error.response?.data?.message || error.message}`);
            setDebugInfo(`签名失败: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setError('');
            setSuccess('');
            setVerificationResult(null);
            setDebugInfo('');
            setIsLoading(true);
            
            // 对消息进行Base64编码
            const encodedMessage = encodeBase64(message);
            if (!encodedMessage) return; // 编码错误已在encodeBase64中设置
            
            // 组合公钥和签名
            const publicKey = `${publicKeyX},${publicKeyY}`;
            const signature = `${signatureR},${signatureS}`;
            
            setDebugInfo(`发送验证请求: message=${encodedMessage}, signature=${signature}, publicKey=${publicKey}`);
            const response = await ecdsaVerify(encodedMessage, signature, publicKey);
            
            setDebugInfo(`验证响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                // 检查验证结果字段
                const isValid = 
                    response.data.valid !== undefined ? response.data.valid : 
                    response.data.isValid !== undefined ? response.data.isValid : 
                    response.data.result !== undefined ? response.data.result : null;
                
                if (isValid !== null) {
                    setVerificationResult(isValid);
                    setSuccess(isValid ? '签名验证通过' : '签名验证失败');
                } else {
                    setError('无法确定验证结果: ' + JSON.stringify(response.data));
                }
            } else {
                setError('无法获取验证结果');
            }
        } catch (error) {
            console.error("验证错误:", error);
            setError(`验证失败: ${error.response?.data?.message || error.message}`);
            setDebugInfo(`验证失败: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
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
        setSignatureR('');
        setSignatureS('');
        setError('');
        setSuccess('');
        setVerificationResult(null);
        setDebugInfo('');
    };

    const getFullPublicKey = () => {
        if (publicKeyX && publicKeyY) {
            return `${publicKeyX},${publicKeyY}`;
        } else if (publicKeyX) {
            return publicKeyX;
        } else if (publicKeyY) {
            return publicKeyY;
        }
        return '';
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {debugInfo && <Alert severity="info" sx={{ mb: 3 }}>{debugInfo}</Alert>}
            
            <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                        <KeyIcon sx={{ mr: 1 }} /> ECDSA 密钥管理
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
                            value={getFullPublicKey()}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="复制公钥">
                                            <IconButton onClick={() => copyToClipboard(getFullPublicKey())} disabled={!getFullPublicKey()} edge="end">
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                            placeholder="ECDSA公钥..."
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="X坐标"
                                size="small"
                                fullWidth
                    value={publicKeyX}
                                onChange={(e) => setPublicKeyX(e.target.value)}
                />
                <TextField
                                label="Y坐标"
                                size="small"
                    fullWidth
                    value={publicKeyY}
                                onChange={(e) => setPublicKeyY(e.target.value)}
                />
                        </Box>
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
                            placeholder="ECDSA私钥..."
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
                                    disabled={isLoading || !privateKey || !message}
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
                    value={signatureR}
                                onChange={(e) => setSignatureR(e.target.value)}
                                placeholder="签名结果将显示在这里..."
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Tooltip title="复制签名">
                                    <IconButton onClick={() => copyToClipboard(signatureR)} disabled={!signatureR}>
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
                                    value={signatureR}
                                    onChange={(e) => setSignatureR(e.target.value)}
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
                                disabled={isLoading || !publicKeyX || !publicKeyY || !message || !signatureR}
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
                    注意：ECDSA (椭圆曲线数字签名算法) 提供比传统RSA签名更高效的数字签名功能，广泛应用于区块链、TLS等安全系统。
                </Typography>
            </Paper>
        </Box>
    );
};

export default ECDSACrypto;