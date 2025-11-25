import Styles from '../css/Login.module.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [passwordError, setPasswordError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validatePassword = (senha) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(senha);
        const hasLowerCase = /[a-z]/.test(senha);
        const hasNumber = /[0-9]/.test(senha);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        if (!senha) {
            setPasswordError('');
            setIsPasswordValid(false); return;
        }
        if (senha.length < minLength) {
            setPasswordError('A senha deve ter no mínimo 8 caracteres.');
            setIsPasswordValid(false); return;
        }
        if (!hasLowerCase) {
            setPasswordError('Inclua pelo menos uma letra minúscula (a-z).');
            setIsPasswordValid(false); return;
        }
        if (!hasUpperCase) {
            setPasswordError('Inclua pelo menos uma letra maiúscula (A-Z).');
            setIsPasswordValid(false); return;
        }
        if (!hasNumber) {
            setPasswordError('Inclua pelo menos um número (0-9).');
            setIsPasswordValid(false); return;
        }
        if (!hasSpecialChar) {
            setPasswordError('Inclua pelo menos um caractere especial (ex: !@#$).');
            setIsPasswordValid(false); return;
        }
        setPasswordError('Senha forte!');
        setIsPasswordValid(true);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'password') {
            setPassword(value);
            validatePassword(value); 
        }
        
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }

        if (name === 'confirmPassword' && password !== value) {
            setConfirmPasswordError('As senhas não coincidem.');
        } else if (name === 'password' && confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError('As senhas não coincidem.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');

        if (!isPasswordValid) {
            setMessage('Por favor, use uma senha que atenda aos critérios de segurança.');
            return;
        }
        
        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        setMessage('Redefinindo sua senha...');
        try {
            const response = await axios.post(`http://localhost:8080/api/auth/reset-password/${token}`, {
                senha: password
            });
            setPasswordError(''); 
            setConfirmPasswordError('');
            setMessage(response.data + " Você será redirecionado para o login em 3 segundos.");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Ocorreu um erro. Tente novamente ou solicite um novo link.');
            console.log(error.response?.data);
            setIsLoading(false);
        }
    };

    return (
        <div className={Styles.container}>
            <div className={Styles.form_container}>
                <h2 className={`${Styles.titulo} ${Styles.segundo_titulo}`}>Crie uma nova senha</h2>
                <p className={Styles.form_description}>
                    Sua nova senha deve ser forte e diferente da senha anterior.
                </p>
                <form className={Styles.form} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
                    
                    {/* Input da nova senha com estilo corrigido */}
                    <label className={Styles.input_group} style={{maxWidth: '400px'}}>
                        <i className="fi fi-sr-lock icon-modify"></i>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Digite sua nova senha"
                            value={password}
                            onChange={handleChange}
                            required 
                        />
                    </label>
        
                    {passwordError && (
                        <p style={{ width: '100%', maxWidth: '400px', textAlign: 'left', color: isPasswordValid ? 'green' : '#e74c3c', fontSize: '0.8rem', marginTop: '5px', paddingLeft: '5px' }}>
                            {passwordError}
                        </p>
                    )}

                    <label className={Styles.input_group} style={{maxWidth: '400px', marginTop: '15px'}}>
                        <i className="fi fi-sr-lock icon-modify"></i>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirme a nova senha"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                     
                    {confirmPasswordError && (
                        <p style={{ width: '100%', maxWidth: '400px', textAlign: 'left', color: '#e74c3c', fontSize: '0.8rem', marginTop: '5px', paddingLeft: '5px' }}>
                            {confirmPasswordError}
                        </p>
                    )}

                    <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`} disabled={isLoading} style={{marginTop: '25px'}}>
                        {isLoading ? 'Salvando...' : 'Redefinir Senha'}
                    </button>
                </form>
                {/* Mensagem geral de sucesso ou erro da API */}
                {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#e74c3c' }}>{message}</p>}
                
                <Link to="/login" className={Styles.back_link}>
                    Voltar para o Login
                </Link>
            </div>
        </div>
    );
}

export default ResetPasswordPage;