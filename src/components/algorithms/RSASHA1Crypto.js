import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { rsasha1Sign, rsasha1Verify, rsasha1GenerateKey } from '../../api/rsasha1';

const RSASHA1Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [modulus, setModulus] = useState('');

    const [signData, setSignData] = useState('');
    const [signPrivateKey, setSignPrivateKey] = useState('');
    const [signModulus, setSignModulus] = useState('');
    const [signature, setSignature] = useState('');

    const [verifyData, setVerifyData] = useState('');
    const [verifySignature, setVerifySignature] = useState('');
    const [verifyPublicKey, setVerifyPublicKey] = useState('');
    const [verifyModulus, setVerifyModulus] = useState('');
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
            const response = await rsasha1GenerateKey();
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);
            setModulus(response.data.modulus);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSign = async () => {
        try {
            setIsLoading(true);
            const response = await rsasha1Sign(
                signData,
                signPrivateKey || privateKey,
                signModulus || modulus
            );
            setSignature(response.data.result);
        } catch (error) {
            alert(`签名失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setIsLoading(true);
            const response = await rsasha1Verify(
                verifyData,
                verifySignature,
                verifyPublicKey || publicKey,
                verifyModulus || modulus
            );
            setVerificationResult(response.data.result ? '验证通过 ✅' : '验证失败 ❌');
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
                RSA-SHA1 签名/验证
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
                    label="公钥"
                    fullWidth
                    multiline
                    rows={4}
                    value={publicKey}
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

                <TextField
                    label="模数"
                    fullWidth
                    multiline
                    rows={4}
                    value={modulus}
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
                    label="模数（如果不输入则默认使用上方生成的模数）"
                    fullWidth
                    multiline
                    rows={4}
                    value={signModulus}
                    onChange={(e) => setSignModulus(e.target.value)}
                    placeholder={modulus || "输入或自动使用生成的模数"}
                    sx={inputStyle}
                />

                <TextField
                    label="原始数据"
                    fullWidth
                    multiline
                    rows={4}
                    value={signData}
                    onChange={(e) => setSignData(e.target.value)}
                    placeholder="输入要签名的数据..."
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
                    label="签名结果"
                    fullWidth
                    multiline
                    rows={4}
                    value={signature}
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
                    label="公钥（如果不输入则默认使用上方生成的公钥）"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyPublicKey}
                    onChange={(e) => setVerifyPublicKey(e.target.value)}
                    placeholder={publicKey || "输入或自动使用生成的公钥"}
                    sx={inputStyle}
                />

                <TextField
                    label="模数（如果不输入则默认使用上方生成的模数）"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyModulus}
                    onChange={(e) => setVerifyModulus(e.target.value)}
                    placeholder={modulus || "输入或自动使用生成的模数"}
                    sx={inputStyle}
                />

                <TextField
                    label="原始数据"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifyData}
                    onChange={(e) => setVerifyData(e.target.value)}
                    placeholder="输入要验证的原始数据..."
                    sx={inputStyle}
                />

                <TextField
                    label="待验证签名"
                    fullWidth
                    multiline
                    rows={4}
                    value={verifySignature}
                    onChange={(e) => setVerifySignature(e.target.value)}
                    placeholder="输入待验证的签名..."
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

export default RSASHA1Crypto;


