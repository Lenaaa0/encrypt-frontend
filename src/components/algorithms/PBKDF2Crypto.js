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
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Card,
    CardContent,
    Chip,
    Slider,
    Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { pbkdf2Derive } from '../../api/pbkdf2';

const PBKDF2Crypto = () => {
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [iterations, setIterations] = useState(10000);
    const [keyLength, setKeyLength] = useState(32);
    const [encoding, setEncoding] = useState('hex');
    const [derivedKey, setDerivedKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleDerive = async () => {
        if (!password) {
            setError('请输入密码');
            return;
        }
        if (!salt) {
            setError('请输入盐值');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setSuccess('');
            setDebugInfo('');
            
            setDebugInfo(`正在派生密钥: 迭代次数=${iterations}, 密钥长度=${keyLength}, 编码=${encoding}`);
            const response = await pbkdf2Derive(password, salt, iterations, keyLength, encoding);
            
            setDebugInfo(`密钥派生响应: ${JSON.stringify(response.data)}`);
            
            if (response.data) {
                if (response.data.status === 0) {
                    setDerivedKey(response.data.result);
                    setSuccess('密钥派生成功');
                } else {
                    setError(response.data.message || '密钥派生失败');
                }
            } else {
                setError('无法获取派生密钥结果');
            }
        } catch (error) {
            console.error("密钥派生错误:", error);
            setError(`密钥派生失败: ${error.response?.data?.message || error.message}`);
            setDebugInfo(`派生失败: ${error.toString()}, 响应: ${error.response ? JSON.stringify(error.response.data) : '无响应数据'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const generateRandomSalt = () => {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        const salt = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        setSalt(salt);
        setSuccess('已生成随机盐值');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('已复制到剪贴板');
    };

    const clearFields = () => {
        setPassword('');
        setSalt('');
        setIterations(10000);
        setKeyLength(32);
        setDerivedKey('');
        setError('');
        setSuccess('');
        setDebugInfo('');
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {debugInfo && <Alert severity="info" sx={{ mb: 3 }}>{debugInfo}</Alert>}
            
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EnhancedEncryptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">PBKDF2 密钥派生</Typography>
                    <Chip 
                        label="防暴力破解" 
                        color="warning" 
                        size="small" 
                        icon={<PendingActionsIcon />} 
                        sx={{ ml: 2, fontWeight: 500 }}
                    />
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            输入参数
                        </Typography>

                                <TextField
                                    fullWidth
                                    label="密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="切换密码可见性"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="盐值"
                                    value={salt}
                                    onChange={(e) => setSalt(e.target.value)}
                                margin="normal"
                                required
                                placeholder="输入盐值或生成随机盐值"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button 
                                variant="outlined" 
                                onClick={generateRandomSalt} 
                                sx={{ ml: 1, mt: 1, height: 56 }}
                            >
                                生成盐值
                            </Button>
                        </Box>
                        
                        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                            迭代次数: {iterations}
                        </Typography>
                        <Slider
                                    value={iterations}
                            onChange={(e, value) => setIterations(value)}
                            min={1000}
                            max={100000}
                            step={1000}
                            valueLabelDisplay="auto"
                            aria-labelledby="iteration-slider"
                            sx={{ mb: 2 }}
                        />
                        
                        <Typography variant="body2" gutterBottom>
                            密钥长度 (字节): {keyLength}
                        </Typography>
                        <Slider
                                    value={keyLength}
                            onChange={(e, value) => setKeyLength(value)}
                            min={16}
                            max={64}
                            step={4}
                            valueLabelDisplay="auto"
                            aria-labelledby="key-size-slider"
                            sx={{ mb: 2 }}
                        />
                        
                        <Box sx={{ mt: 2 }}>
                            <FormControl component="fieldset">
                                <Typography variant="body2" fontWeight={500} gutterBottom>
                                    输出格式
                                </Typography>
                                <RadioGroup
                                    row
                                    value={encoding}
                                    onChange={(e) => setEncoding(e.target.value)}
                                >
                                    <FormControlLabel value="hex" control={<Radio />} label="十六进制" />
                                    <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                                </RadioGroup>
                            </FormControl>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                            派生的密钥
                        </Typography>

                        <Card variant="outlined" sx={{ 
                            backgroundColor: 'background.default',
                            mb: 2,
                            minHeight: '200px',
                display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {!derivedKey ? (
                <Box sx={{
                                        flex: 1, 
                    display: 'flex',
                    alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }}>
                                        派生的密钥将显示在这里
                                    </Box>
                                ) : (
                                    <Box sx={{ 
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all',
                                        fontSize: '0.875rem',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        lineHeight: 1.5
                                    }}>
                                        {derivedKey}
                </Box>
                                )}
                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                                    color="primary"
                                    onClick={handleDerive}
                                    disabled={isLoading || !password || !salt}
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EnhancedEncryptionIcon />}
                                >
                                    派生密钥
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={clearFields}
                                    startIcon={<DeleteIcon />}
                                >
                                    清空
                                </Button>
                            </Stack>
                            
                            <Button
                                variant="outlined"
                                onClick={() => copyToClipboard(derivedKey)}
                                disabled={!derivedKey}
                                startIcon={<ContentCopyIcon />}
                            >
                                复制结果
                </Button>
            </Box>
                    </Grid>
                </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                        PBKDF2 算法说明
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    PBKDF2(基于密码的密钥派生函数2)是一种广泛使用的密钥派生函数，设计用于将密码转换为加密密钥。
                    它采用迭代哈希技术来增强安全性，通过重复哈希过程数千次，大幅增加暴力破解的计算成本。
                    PBKDF2需要以下参数:
                </Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px dashed' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        关键参数说明:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • <b>密码</b>: 用户提供的原始密码<br/>
                                • <b>盐值</b>: 防止预计算/彩虹表攻击的随机数据<br/>
                                • <b>迭代次数</b>: 算法重复计算的次数，提升安全性<br/>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                • <b>密钥长度</b>: 生成密钥的字节数<br/>
                                • <b>哈希函数</b>: 底层使用的哈希算法(默认HMAC-SHA1)<br/>
                                • <b>应用场景</b>: 密码存储、加密密钥生成、OAuth等<br/>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                    安全建议: 现代应用推荐使用10,000次以上的迭代，对于高安全性要求可使用100,000次以上。
                    盐值应随机生成并与哈希一起存储。
                </Typography>
            </Paper>
        </Box>
    );
};

export default PBKDF2Crypto;
