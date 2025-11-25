import Styles from '../css/Login.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('Processando sua solicitação...');
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response?.data.mensagem || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={Styles.container}>
            
            <div className={Styles.form_container}>
                <h2 className={`${Styles.titulo} ${Styles.segundo_titulo}`}>Esqueceu a senha?</h2>
                <p className={Styles.form_description}>
                    Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
                </p>
                <form className={Styles.form} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
                    
                    <label className={Styles.input_group} style={{maxWidth: '400px'}}>
                        <i className="fi fi-rr-envelope"></i>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Digite seu e-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`} disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                    </button>
                </form>
                {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}
                <Link to="/login" className={Styles.back_link}>
                    Voltar para o Login
                </Link>
            </div>
        </div>
    );
}

export default ForgotPasswordPage