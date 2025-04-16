import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Grid
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { base64Encode, base64Decode } from '../../api/base64';

const Base64Crypto = () => {
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async (operation) => {
        try {
            setIsLoading(true);
            const response = operation === 'encode'
                ? await base64Encode(plaintext)
                : await base64Decode(ciphertext);

            if (response.data.status !== 0) {
                alert(response.data.message);
                return;
            }

            operation === 'encode'
                ? setCiphertext(response.data.result)
                : setPlaintext(response.data.result);
        } catch (error) {
            alert(`操作失败: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            color: '#fff',
            minHeight: '100vh',
            p: 4,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                opacity: 0.2
            }
        }}>
            {/* 标题 */}
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
                Base64 编码/解码
            </Typography>

            <Grid container spacing={4} sx={{
                maxWidth: 1400,
                margin: '0 auto',
                justifyContent: 'center',
                mb: 4,
                '@media (max-width: 600px)': {
                    '& > .MuiGrid-item': {
                        width: '100%',
                        maxWidth: 'none',
                        marginBottom: 2
                    }
                }
            }}>
                {/* 输入区域 */}
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        height: 270,
                        width: 450,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        p: 3,
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                        }
                    }}>
                        <Typography variant="h5" sx={{
                            color: '#00ff9d',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            📜 原始内容
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
                            placeholder="输入要编码的内容..."
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
                                }
                            }}
                        />
                    </Box>
                </Grid>

                {/* 结果区域 */}
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        height: 270,
                        width: 450,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        p: 3,
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,255,255,0.2)'
                        }
                    }}>
                        <Typography variant="h5" sx={{
                            color: '#00ff9d',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            🔒 编码结果
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={ciphertext}
                            onChange={(e) => setCiphertext(e.target.value)}
                            placeholder="编码结果将显示在这里..."
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
                                }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* 操作控制区域 */}
            <Box sx={{
                mt: 6,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                flexWrap: 'wrap',
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                <Button
                    variant="contained"
                    onClick={() => handleOperation('encode')}
                    disabled={isLoading}
                    sx={{
                        background: 'linear-gradient(45deg, #00ffff 30%, #0080ff 90%)',
                        color: '#000',
                        px: 6,
                        minWidth: 180,
                        borderRadius: 25,
                        fontSize: '1.1rem',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 25px rgba(0,255,255,0.6)'
                        },
                        transition: 'all 0.3s'
                    }}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#000' }} />}
                >
                    编码
                </Button>

                <Button
                    variant="contained"
                    onClick={() => handleOperation('decode')}
                    disabled={isLoading}
                    sx={{
                        background: 'linear-gradient(45deg, #ff00ff 30%, #8000ff 90%)',
                        color: '#fff',
                        px: 6,
                        minWidth: 180,
                        borderRadius: 25,
                        fontSize: '1.1rem',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 25px rgba(255,0,255,0.6)'
                        },
                        transition: 'all 0.3s'
                    }}
                    endIcon={isLoading && <CircularProgress size={24} sx={{ color: '#fff' }} />}
                >
                    解码
                </Button>
            </Box>
        </Box>
    );
};

export default Base64Crypto;

