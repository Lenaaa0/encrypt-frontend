import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    CircularProgress
} from '@mui/material';
import { rsa1024Encrypt, rsa1024Decrypt, rsa1024GenerateKey } from '../../api/rsa1024';

const RSA1024Crypto = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [modulus, setModulus] = useState('');

    const [encryptData, setEncryptData] = useState('');
    const [encryptPublicKey, setEncryptPublicKey] = useState('');
    const [encryptModulus, setEncryptModulus] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encryptEncoding, setEncryptEncoding] = useState('base64');

    const [decryptData, setDecryptData] = useState('');
    const [decryptPrivateKey, setDecryptPrivateKey] = useState('');
    const [decryptModulus, setDecryptModulus] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [decryptEncoding, setDecryptEncoding] = useState('base64');

    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateKey = async () => {
        try {
            setIsLoading(true);
            const response = await rsa1024GenerateKey();
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);
            setModulus(response.data.modulus);
        } catch (error) {
            alert(`生成失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEncrypt = async () => {
        try {
            setIsLoading(true);
            const response = await rsa1024Encrypt(
                encryptData,
                encryptPublicKey || publicKey,
                encryptModulus || modulus,
                encryptEncoding
            );
            setCiphertext(response.data.result);
        } catch (error) {
            alert(`加密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrypt = async () => {
        try {
            setIsLoading(true);
            const response = await rsa1024Decrypt(
                decryptData,
                decryptPrivateKey || privateKey,
                decryptModulus || modulus,
                decryptEncoding
            );
            setPlaintext(response.data.result);
        } catch (error) {
            alert(`解密失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

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
            color: '#00ffff'
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
            maxwidth: 800,
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
                RSA-1024 加密/解密
            </Typography>

            {/* 密钥生成区域 */}
            <Box sx={{
                width: 600,
                height: 520,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 4,
                p: 3,
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
                mb: 4,
                mx: 'auto',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                }
            }}>
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

            {/* 公钥加密区域 */}
            <Box sx={{
                width: 600,
                height: 720,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 4,
                p: 3,
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
                mb: 4,
                mx: 'auto',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                }
            }}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    🔒 公钥加密
                </Typography>

                <TextField
                    label="公钥（如果不输入则默认使用上方生成的公钥）"
                    fullWidth
                    multiline
                    rows={4}
                    value={encryptPublicKey}
                    onChange={(e) => setEncryptPublicKey(e.target.value)}
                    placeholder={publicKey || "输入或自动使用生成的公钥"}
                    sx={inputStyle}
                />

                <TextField
                    label="模数（如果不输入则默认使用上方生成的模数）"
                    fullWidth
                    multiline
                    rows={4}
                    value={encryptModulus}
                    onChange={(e) => setEncryptModulus(e.target.value)}
                    placeholder={modulus || "输入或自动使用生成的模数"}
                    sx={inputStyle}
                />

                <TextField
                    label="明文"
                    fullWidth
                    multiline
                    rows={4}
                    value={encryptData}
                    onChange={(e) => setEncryptData(e.target.value)}
                    placeholder="输入要加密的明文..."
                    sx={{
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
                            color: '#00ffff'
                        },
                        mb: 0
                    }}
                />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                    p: 1.5,
                }}>
                    <Typography variant="body2" sx={{ color: '#00ff9d', mr: 2 }}>
                        密文格式:
                    </Typography>
                    <RadioGroup row value={encryptEncoding} onChange={(e) => setEncryptEncoding(e.target.value)}>
                        <FormControlLabel
                            value="hex"
                            control={<Radio sx={{ color: '#00ffff!important' }} />}
                            label={<Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>Hex</Typography>}
                        />
                        <FormControlLabel
                            value="base64"
                            control={<Radio sx={{ color: '#ff00ff!important' }} />}
                            label={<Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>Base64</Typography>}
                        />
                    </RadioGroup>
                </Box>

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
                    label="加密结果"
                    fullWidth
                    multiline
                    rows={4}
                    value={ciphertext}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>

            {/* 私钥解密区域 */}
            <Box sx={{
                width: 600,
                height: 710,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 4,
                p: 3,
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
                mb: 4,
                mx: 'auto',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                }
            }}>
                <Typography variant="h5" sx={{ color: '#00ff9d', mb: 2 }}>
                    🔓 私钥解密
                </Typography>

                <TextField
                    label="私钥（如果不输入则默认使用上方生成的私钥）"
                    fullWidth
                    multiline
                    rows={4}
                    value={decryptPrivateKey}
                    onChange={(e) => setDecryptPrivateKey(e.target.value)}
                    placeholder={privateKey || "输入或自动使用生成的私钥"}
                    sx={inputStyle}
                />

                <TextField
                    label="模数（如果不输入则默认使用上方生成的模数）"
                    fullWidth
                    multiline
                    rows={4}
                    value={decryptModulus}
                    onChange={(e) => setDecryptModulus(e.target.value)}
                    placeholder={modulus || "输入或自动使用生成的模数"}
                    sx={inputStyle}
                />

                <TextField
                    label="密文"
                    fullWidth
                    multiline
                    rows={4}
                    value={decryptData}
                    onChange={(e) => setDecryptData(e.target.value)}
                    placeholder="输入要解密的密文..."
                    sx={{
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
                            color: '#00ffff'
                        },
                        mb: 0
                    }}
                />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                    p: 1.5,
                }}>
                    <Typography variant="body2" sx={{ color: '#00ff9d', mr: 2 }}>
                        密文格式:
                    </Typography>
                    <RadioGroup row value={decryptEncoding} onChange={(e) => setDecryptEncoding(e.target.value)}>
                        <FormControlLabel
                            value="hex"
                            control={<Radio sx={{ color: '#00ffff!important' }} />}
                            label={<Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>Hex</Typography>}
                        />
                        <FormControlLabel
                            value="base64"
                            control={<Radio sx={{ color: '#ff00ff!important' }} />}
                            label={<Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>Base64</Typography>}
                        />
                    </RadioGroup>
                </Box>

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
                    label="解密结果"
                    fullWidth
                    multiline
                    rows={4}
                    value={plaintext}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                />
            </Box>
        </Box>
    );
};

export default RSA1024Crypto;