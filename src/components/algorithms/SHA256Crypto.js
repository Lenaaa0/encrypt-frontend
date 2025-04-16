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
import { sha256Hash } from '../../api/sha256';

const SHA256Crypto = () => {
    const [sha256Input, setSha256Input] = useState('');
    const [sha256Result, setSha256Result] = useState('');
    const [sha256Encoding, setSha256Encoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleSha256 = async () => {
        try {
            setIsLoading(true);
            const response = await sha256Hash(sha256Input, sha256Encoding);
            setSha256Result(response.data.result);
        } catch (error) {
            alert(`哈希计算失败: ${error.response?.data?.message || error.message}`);
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
                SHA256 哈希计算
            </Typography>

            <Grid container spacing={4} sx={{ maxWidth: 1400, margin: '0 auto', justifyContent: 'center' }}>
                {/* 输入区域 */}
                <Grid item xs={12} sm={6} md={4}>
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
                            📥 输入内容
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={sha256Input}
                            onChange={(e) => setSha256Input(e.target.value)}
                            placeholder="输入要计算哈希的内容..."
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
                <Grid item xs={12} sm={6} md={4}>
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
                            🔒 哈希结果
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={sha256Result}
                            InputProps={{ readOnly: true }}
                            placeholder="哈希结果将显示在这里..."
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
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                flexWrap: 'wrap'
            }}>
                <Button
                    variant="contained"
                    onClick={handleSha256}
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
                    计算哈希
                </Button>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    p: 1.5
                }}>
                    <RadioGroup row value={sha256Encoding} onChange={(e) => setSha256Encoding(e.target.value)}>
                        <FormControlLabel
                            value="hex"
                            control={<Radio sx={{ color: '#00ffff!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Hex</Typography>}
                        />
                        <FormControlLabel
                            value="base64"
                            control={<Radio sx={{ color: '#ff00ff!important' }} />}
                            label={<Typography sx={{ color: '#fff' }}>Base64</Typography>}
                        />
                    </RadioGroup>
                    <Typography variant="body1" sx={{
                        color: '#00ff9d',
                        fontSize: '0.9rem'
                    }}>
                        输出格式
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SHA256Crypto;