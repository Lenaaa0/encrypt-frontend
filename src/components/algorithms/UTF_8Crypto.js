import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Grid
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { UTF_8Encode, UTF_8Decode } from '../../api/utf_8';

const UTF_8Crypto = () => {
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async (operation) => {
        try {
            setIsLoading(true);
            const response = operation === 'encode'
                ? await UTF_8Encode(plaintext, encoding)
                : await UTF_8Decode(ciphertext, encoding);

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
                UTF-8 编码/解码
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
                            📜 原始文本
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
                            placeholder="输入要编码的文本..."
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

            {/* 控制区域 */}
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

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    p: 2,
                    backdropFilter: 'blur(10px)'
                }}>
                    <RadioGroup row value={encoding} onChange={(e) => setEncoding(e.target.value)}>
                        <FormControlLabel
                            value="hex"
                            control={<Radio sx={{ color: '#00ffff!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Hex</Typography>}
                        />
                        <FormControlLabel
                            value="binary"
                            control={<Radio sx={{ color: '#ff00ff!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Binary</Typography>}
                        />
                        <FormControlLabel
                            value="octal"
                            control={<Radio sx={{ color: '#00ff00!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Octal</Typography>}
                        />
                        <FormControlLabel
                            value="decimal"
                            control={<Radio sx={{ color: '#ffff00!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Decimal</Typography>}
                        />
                    </RadioGroup>
                    <Typography variant="body1" sx={{
                        color: '#00ff9d',
                        fontSize: '0.9rem'
                    }}>
                        编码格式
                    </Typography>
                </Box>

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

export default UTF_8Crypto;