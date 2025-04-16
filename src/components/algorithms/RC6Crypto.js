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
import { rc6Encrypt, rc6Decrypt } from '../../api/rc6';

const RC6Crypto = () => {
    const [key, setKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [encoding, setEncoding] = useState('hex');
    const [isLoading, setIsLoading] = useState(false);

    const handleOperation = async (operation) => {
        try {
            setIsLoading(true);
            const response = operation === 'encrypt'
                ? await rc6Encrypt(key, plaintext, encoding)
                : await rc6Decrypt(key, ciphertext, encoding);

            if (response.data.status !== 0) {
                alert(response.data.message);
                return;
            }

            operation === 'encrypt'
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
                RC6 加密/解密
            </Typography>

            <Grid container spacing={4} sx={{ maxWidth: 1400, margin: '0 auto', justifyContent: 'center' }}>
                {/* 密钥输入 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{
                        height: 270,
                        width: 360,
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ color: '#00ff9d' }}>
                                🔑 加密密钥（4-16字节）
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="输入加密密钥..."
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

                {/* 明文输入 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{
                        height: 270,
                        width: 360,
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ color: '#00ff9d' }}>
                                📜 明文
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
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
                                }
                            }}
                        />
                    </Box>
                </Grid>

                {/* 密文输出 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{
                        height: 270,
                        width: 360,
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ color: '#00ff9d' }}>
                                🔒 密文
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={ciphertext}
                            onChange={(e) => setCiphertext(e.target.value)}
                            placeholder="加密结果将显示在这里..."
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
                mt: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                flexWrap: 'wrap'
            }}>
                {/* 操作按钮 */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                    gap: 3
                }}>
                    {/* 左侧加密按钮 */}
                    <Button
                        variant="contained"
                        onClick={() => handleOperation('encrypt')}
                        disabled={isLoading}
                        sx={{
                            background: 'linear-gradient(45deg, #00ffff 30%, #0080ff 90%)',
                            color: '#000',
                            px: 8,
                            minWidth: 200,
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
                        加密
                    </Button>

                    {/* 中间编码选择 */}
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
                                value="base64"
                                control={<Radio sx={{ color: '#ff00ff!important' }} />}
                                label={<Typography sx={{ color: '#fff' }}>Base64</Typography>}
                            />
                        </RadioGroup>
                        <Typography variant="body1" sx={{
                            color: '#00ff9d',
                            ml: 1,
                            fontSize: '0.9rem'
                        }}>
                            密文格式
                        </Typography>
                    </Box>

                    {/* 右侧解密按钮 */}
                    <Button
                        variant="contained"
                        onClick={() => handleOperation('decrypt')}
                        disabled={isLoading}
                        sx={{
                            background: 'linear-gradient(45deg, #ff00ff 30%, #8000ff 90%)',
                            color: '#fff',
                            px: 8,
                            minWidth: 200,
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
                        解密
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default RC6Crypto;

