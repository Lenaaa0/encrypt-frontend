import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { ecc160Encrypt, ecc160Decrypt, ecc160GenerateKey } from '../../api/ecc160';

const ECC160Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [encryptPublicKey, setEncryptPublicKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [decryptPrivateKey, setDecryptPrivateKey] = useState('');
    const [ciphertextInput, setCiphertextInput] = useState('');
    const [decryptedText, setDecryptedText] = useState('');
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
            const response = await ecc160GenerateKey();
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEncrypt = async () => {
        try {
            setIsLoading(true);
            const response = await ecc160Encrypt(
                encryptPublicKey || publicKey,
                plaintext
            );
            setCiphertext(response.data.data);
        } catch (error) {
            alert(`加密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrypt = async () => {
        try {
            setIsLoading(true);
            const response = await ecc160Decrypt(
                decryptPrivateKey || privateKey,
                ciphertextInput
            );
            setDecryptedText(response.data.data);
        } catch (error) {
            alert(`解密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            color: '#fff',
            p: 4,
            position: 'relative',
            backgroundSize: 'cover',
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
                ECC-160 加密/解密
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
                    rows={3}
                    value={publicKey}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />

                <TextField
                    label="私钥"
                    fullWidth
                    multiline
                    rows={3}
                    value={privateKey}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>

            {/* 公钥加密区域 */}
            <Box sx={sectionStyle}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    🔒 公钥加密
                </Typography>

                <TextField
                    label="公钥（如果不输入则默认使用上方生成的公钥）"
                    fullWidth
                    multiline
                    rows={3}
                    value={encryptPublicKey}
                    onChange={(e) => setEncryptPublicKey(e.target.value)}
                    placeholder={publicKey || "输入或自动使用生成的公钥"}
                    sx={inputStyle}
                />

                <TextField
                    label="明文（要求必须是Base64格式）"
                    fullWidth
                    multiline
                    rows={3}
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="输入要加密的明文..."
                    sx={inputStyle}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleEncrypt}
                    disabled={isLoading}
                    sx={buttonStyle({
                        start: '#00ffff',
                        end: '#0080ff',
                        text: '#000',
                        shadow: 'rgba(0,255,255,0.6)'
                    })}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#000' }} />}
                >
                    加密
                </Button>

                <TextField
                    label="加密结果（Base64格式）"
                    fullWidth
                    multiline
                    rows={3}
                    value={ciphertext}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>

            {/* 私钥解密区域 */}
            <Box sx={sectionStyle}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    🔓 私钥解密
                </Typography>

                <TextField
                    label="私钥（如果不输入则默认使用上方生成的私钥）"
                    fullWidth
                    multiline
                    rows={3}
                    value={decryptPrivateKey}
                    onChange={(e) => setDecryptPrivateKey(e.target.value)}
                    placeholder={privateKey || "输入或自动使用生成的私钥"}
                    sx={inputStyle}
                />

                <TextField
                    label="密文（要求必须是Base64格式）"
                    fullWidth
                    multiline
                    rows={3}
                    value={ciphertextInput}
                    onChange={(e) => setCiphertextInput(e.target.value)}
                    placeholder="输入要解密的密文..."
                    sx={inputStyle}
                />


                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleDecrypt}
                    disabled={isLoading}
                    sx={buttonStyle({
                        start: '#ff00ff',
                        end: '#8000ff',
                        text: '#fff',
                        shadow: 'rgba(255,0,255,0.6)'
                    })}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#fff' }} />}
                >
                    解密
                </Button>

                <TextField
                    label="解密结果（Base64格式）"
                    fullWidth
                    multiline
                    rows={3}
                    value={decryptedText}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>
        </Box>
    );
};

export default ECC160Crypto;