import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import {
    ecdsaSign,
    ecdsaVerify,
    ecdsaGenerateKey
} from '../../api/ecdsa';

const ECDSACrypto = () => {
    const [publicKeyX, setPublicKeyX] = useState('');
    const [publicKeyY, setPublicKeyY] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    const [signMessage, setSignMessage] = useState('');
    const [signPrivateKey, setSignPrivateKey] = useState('');
    const [signatureR, setSignatureR] = useState('');
    const [signatureS, setSignatureS] = useState('');

    const [verifyPublicKeyX, setVerifyPublicKeyX] = useState('');
    const [verifyPublicKeyY, setVerifyPublicKeyY] = useState('');
    const [verifyMessage, setVerifyMessage] = useState('');
    const [verifySignatureR, setVerifySignatureR] = useState('');
    const [verifySignatureS, setVerifySignatureS] = useState('');
    const [verificationResult, setVerificationResult] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            color: '#fff',
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0.3)',
            '& fieldset': {
                borderColor: '#4a4a4a',
                transition: 'all 0.3s'
            },
            '&:hover fieldset': { borderColor: '#00ffff' },
            '&.Mui-focused fieldset': {
                borderColor: '#00ffff',
                boxShadow: '0 0 15px rgba(0,255,255,0.3)'
            }
        },
        '& .MuiInputLabel-root': {
            color: '#00ffff!important'
        },
        mb: 2
    };

    const sectionStyle = {
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        p: 3,
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        transition: 'all 0.3s',
        mb: 4,
        mx: 'auto',
        width: 600,
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
        }
    };

    const buttonStyle = (color) => ({
        background: `linear-gradient(45deg, ${color.start} 30%, ${color.end} 90%)`,
        color: color.text,
        px: 6,
        py: 1.5,
        borderRadius: 25,
        fontSize: '1rem',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 0 25px ${color.shadow}`
        },
        transition: 'all 0.3s',
        mb: 2
    });

    const handleGenerateKey = async () => {
        try {
            setIsLoading(true);
            const response = await ecdsaGenerateKey();
            setPublicKeyX(response.data.publicKeyX);
            setPublicKeyY(response.data.publicKeyY);
            setPrivateKey(response.data.privateKey);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSign = async () => {
        try {
            setIsLoading(true);
            const response = await ecdsaSign(
                signPrivateKey || privateKey,
                signMessage
            );
            setSignatureR(response.data.r);
            setSignatureS(response.data.s);
        } catch (error) {
            alert(`签名失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setIsLoading(true);
            const response = await ecdsaVerify(
                verifyPublicKeyX || publicKeyX,
                verifyPublicKeyY || publicKeyY,
                verifyMessage,
                verifySignatureR,
                verifySignatureS
            );
            setVerificationResult(response.data.valid ? '验证通过 ✅' : '验证失败 ❌');
        } catch (error) {
            alert(`验证失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            color: '#fff',
            p: 4,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 800,
            mx: 'auto',
        }}>
            <Typography variant="h3" sx={{
                textAlign: 'center',
                mb: 4,
                textShadow: '0 0 5px #00ffff',
                animation: 'glow 2s ease-in-out infinite',
                '@keyframes glow': {
                    '0%': { textShadow: '0 0 10px #00ffff' },
                    '50%': { textShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
                    '100%': { textShadow: '0 0 10px #00ffff' }
                }
            }}>
                ECDSA 签名/验证
            </Typography>

            {/* 密钥生成区域 */}
            <Box sx={sectionStyle}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    ⚙️ 密钥生成
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleGenerateKey}
                    disabled={isLoading}
                    sx={buttonStyle({
                        start: '#00ff9d',
                        end: '#00b34d',
                        text: '#000',
                        shadow: 'rgba(0,255,157,0.6)'
                    })}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#000' }} />}
                >
                    生成密钥对
                </Button>

                <TextField
                    label="公钥X坐标"
                    fullWidth
                    multiline
                    rows={2}
                    value={publicKeyX}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />

                <TextField
                    label="公钥Y坐标"
                    fullWidth
                    multiline
                    rows={2}
                    value={publicKeyY}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />

                <TextField
                    label="私钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={privateKey}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>

            {/* 签名区域 */}
            <Box sx={sectionStyle}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    🔒 消息签名
                </Typography>

                <TextField
                    label="私钥（如果不输入则默认使用上方生成的私钥）"
                    fullWidth
                    multiline
                    rows={4}
                    value={signPrivateKey}
                    onChange={(e) => setSignPrivateKey(e.target.value)}
                    placeholder={privateKey || "输入或自动使用生成的私钥"}
                    sx={inputStyle}
                />

                <TextField
                    label="待签名消息"
                    fullWidth
                    multiline
                    rows={4}
                    value={signMessage}
                    onChange={(e) => setSignMessage(e.target.value)}
                    placeholder="输入要签名的消息..."
                    sx={inputStyle}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSign}
                    disabled={isLoading}
                    sx={buttonStyle({
                        start: '#00ffff',
                        end: '#0080ff',
                        text: '#000',
                        shadow: 'rgba(0,255,255,0.6)'
                    })}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#000' }} />}
                >
                    生成签名
                </Button>

                <TextField
                    label="签名R值"
                    fullWidth
                    multiline
                    rows={2}
                    value={signatureR}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />

                <TextField
                    label="签名S值"
                    fullWidth
                    multiline
                    rows={2}
                    value={signatureS}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>

            {/* 验证区域 */}
            <Box sx={sectionStyle}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    🔓 签名验证
                </Typography>

                <TextField
                    label="公钥X坐标（如果不输入则默认使用上方生成的公钥X坐标）"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifyPublicKeyX}
                    onChange={(e) => setVerifyPublicKeyX(e.target.value)}
                    placeholder={publicKeyX || "输入或自动使用生成的公钥X坐标"}
                    sx={inputStyle}
                />

                <TextField
                    label="公钥Y坐标（如果不输入则默认使用上方生成的公钥Y坐标）"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifyPublicKeyY}
                    onChange={(e) => setVerifyPublicKeyY(e.target.value)}
                    placeholder={publicKeyY || "输入或自动使用生成的公钥Y坐标"}
                    sx={inputStyle}
                />

                <TextField
                    label="原始消息"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyMessage}
                    onChange={(e) => setVerifyMessage(e.target.value)}
                    placeholder="输入要验证的原始消息..."
                    sx={inputStyle}
                />

                <TextField
                    label="签名R值"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifySignatureR}
                    onChange={(e) => setVerifySignatureR(e.target.value)}
                    placeholder="输入待验证的签名R值..."
                    sx={inputStyle}
                />

                <TextField
                    label="签名S值"
                    fullWidth
                    multiline
                    rows={2}
                    value={verifySignatureS}
                    onChange={(e) => setVerifySignatureS(e.target.value)}
                    placeholder="输入待验证的签名S值..."
                    sx={inputStyle}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerify}
                    disabled={isLoading}
                    sx={buttonStyle({
                        start: '#ff00ff',
                        end: '#8000ff',
                        text: '#fff',
                        shadow: 'rgba(255,0,255,0.6)'
                    })}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#fff' }} />}
                >
                    验证签名
                </Button>

                <TextField
                    label="验证结果"
                    fullWidth
                    multiline
                    rows={2}
                    value={verificationResult}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>
        </Box>
    );
};

export default ECDSACrypto;