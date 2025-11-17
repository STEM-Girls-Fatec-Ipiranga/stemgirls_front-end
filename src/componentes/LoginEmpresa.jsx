import Styles from '../css/LoginEmpresa.module.css';
import LogoSG from '../assets/img/LogoSGbranco.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

function LoginEmpresa() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nomeEmpresa: '',
        cnpj: '',
        telefone: '',
        email: '',
        senha: ''
    });

    const [loginForm, setLoginForm] = useState({
        email: '',
        senha: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [statusMessage, setStatusMessage] = useState('');

    const validatePassword = (senha) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(senha);
        const hasLowerCase = /[a-z]/.test(senha);
        const hasNumber = /[0-9]/.test(senha);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        if (!senha) {
            setPasswordError('');
            setIsPasswordValid(false);
            return;
        }
        if (senha.length < minLength) {
            setPasswordError('A senha deve ter no mínimo 8 caracteres.');
            setIsPasswordValid(false);
            return;
        }
        if (!hasLowerCase) {
            setPasswordError('Inclua pelo menos uma letra minúscula (a-z).');
            setIsPasswordValid(false);
            return;
        }
        if (!hasUpperCase) {
            setPasswordError('Inclua pelo menos uma letra maiúscula (A-Z).');
            setIsPasswordValid(false);
            return;
        }
        if (!hasNumber) {
            setPasswordError('Inclua pelo menos um número (0-9).');
            setIsPasswordValid(false);
            return;
        }
        if (!hasSpecialChar) {
            setPasswordError('Inclua pelo menos um caractere especial (ex: !@#$).');
            setIsPasswordValid(false);
            return;
        }

        setPasswordError('Senha forte!');
        setIsPasswordValid(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === 'senha') validatePassword(value);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    };

    // CADASTRO DE EMPRESA
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            alert('Por favor, crie uma senha que atenda a todos os critérios de segurança.');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/empresa/criar", {
                nomeEmpresa: form.nomeEmpresa,
                cnpj: form.cnpj,
                email: form.email,
                senha: form.senha,
                telefone: form.telefone,
                status: "PENDENTE"
            });

            if (response.status === 200) {
                alert("Cadastro realizado! Nossa equipe está analisando seus dados. Você será notificado por e-mail quando for aprovado.");
                setModo("signup");
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error.response?.data || error.message);
            alert("Erro ao cadastrar: " + (error.response?.data || error.message));
        }
    };

    // LOGIN DE EMPRESA
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');

        try {
            const response = await axios.post("http://localhost:8080/empresa/login", {
                email: loginForm.email,
                senha: loginForm.senha
            });

            if (typeof response.data === "string" && response.data.includes("análise")) {
                setStatusMessage("Nossa equipe está analisando seus dados, você será notificado quando acabarmos.");
                return;
            }

            const { token, empresa } = response.data;
            localStorage.setItem("empresaToken", token);
            localStorage.setItem("empresaNome", empresa);
            navigate("/");
        } catch (error) {
            const errorMsg = error.response?.data || "Verifique suas credenciais.";
            setStatusMessage(errorMsg);
        }
    };

    const [modo, setModo] = useState("");
    const [classeAtual, setClasseAtual] = useState("");
    useEffect(() => {
        if (modo === "signin") setClasseAtual(Styles.cadastra);
        if (modo === "signup") setClasseAtual(Styles.loga);
    }, [modo]);

    return (
        <div className={`${Styles.container} ${classeAtual}`}>
            <Link to="/">
                <button className="absolute top-4 left-0 w-24 flex flex-row justify-around"><ArrowLeft /> Voltar</button>
            </Link>

            {/* CADASTRO */}
            <div className={`${Styles.content} ${Styles.primeiro_content}`}>
                <div className={Styles.primeira_coluna}>
                    <figure className={Styles.logo_login}>
                        <img src={LogoSG} alt="Logo STEM Grils" />
                    </figure>
                    <h2 className={`${Styles.primeiro_titulo} ${Styles.titulo}`}>Prazer em conhecê-lo!</h2>
                    <p className={`${Styles.descricao} ${Styles.meio}`}>Crie seu perfil para participar de comunidades conosco</p>
                    <div className={Styles.botao_texto}>
                        <p className={Styles.descricao}>Já tem uma conta?</p>
                        <button className={`${Styles.primeiro_botao} ${Styles.botao}`} onClick={() => setModo("signup")}>Entrar</button>
                    </div>
                </div>
                <div className={Styles.segunda_coluna}>
                    <h2 className={`${Styles.segundo_titulo} ${Styles.titulo}`}>Crie sua conta empresarial</h2>
                    <form className={Styles.form} onSubmit={handleRegisterSubmit}>
                        <label className={Styles.input_group}>
                            <i className="far fa-user icon-modify"></i>
                            <input type="text" name="nomeEmpresa" placeholder="Digite o nome da empresa" value={form.nomeEmpresa} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-br-at icon-modify"></i>
                            <input type="text" name="cnpj" placeholder="Digite o CNPJ da empresa" value={form.cnpj} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-br-at icon-modify"></i>
                            <input type="text" name="telefone" placeholder="Digite o telefone da empresa" value={form.telefone} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-rr-envelope icon-modify"></i>
                            <input type="email" name="email" placeholder="Digite o email da empresa" value={form.email} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-sr-lock icon-modify"></i>
                            <input type="password" name="senha" placeholder="Digite sua senha" value={form.senha} onChange={handleChange} required />
                        </label>

                        {passwordError && (
                            <p style={{
                                width: '100%',
                                textAlign: 'left',
                                color: isPasswordValid ? 'green' : '#e74c3c',
                                fontSize: '0.8rem',
                                marginTop: '5px',
                                paddingLeft: '5px'
                            }}>
                                {passwordError}
                            </p>
                        )}

                        <div className={Styles.terms_container}>
                            <input className={Styles.input_terms} type="checkbox" name="terms" id="terms" required />
                            <label className={Styles.label_terms} htmlFor="terms">
                                Li e aceito os <a href="#" target="_blank"> Termos de Uso</a>
                            </label>
                        </div>

                        <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`}>Cadastrar-se</button>

                        <Link className={Styles.sou_usuario} to="/login">
                            <a href="/login-empresa">Sou um usuário padrão</a>
                        </Link>
                    </form>
                </div>
            </div>

            {/* LOGIN */}
            <div className={`${Styles.content} ${Styles.segundo_content}`}>
                <div className={Styles.primeira_coluna}>
                    <figure className={Styles.logo_login}>
                        <img src={LogoSG} alt="Logo STEM Grils" />
                    </figure>
                    <h2 className={`${Styles.primeiro_titulo} ${Styles.titulo}`}>Bem-vindo de volta!</h2>
                    <p className={`${Styles.descricao} ${Styles.meio}`}>Conecte-se para continuar explorando</p>
                    <div className={Styles.botao_texto}>
                        <p className={Styles.descricao}>Ainda não tem uma conta?</p>
                        <button className={`${Styles.primeiro_botao} ${Styles.botao}`} onClick={() => setModo("signin")}>Cadastrar</button>
                    </div>
                </div>
                <div className={Styles.segunda_coluna}>
                    <h2 className={`${Styles.segundo_titulo} ${Styles.titulo}`}>Entrar na sua conta</h2>
                    <div className={Styles.social_media}>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                console.log("Login com o Google bem-sucedido!");
                                console.log(credentialResponse);
                            }}
                            onError={() => {
                                console.log('Erro no login com o Google');
                            }}
                        />
                    </div>
                    <form className={Styles.form} onSubmit={handleLoginSubmit}>
                        <label className={Styles.input_group}>
                            <i className="fi fi-rr-envelope icon-modify"></i>
                            <input type="email" name="email" placeholder="Digite seu email" value={loginForm.email} onChange={handleLoginChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-sr-lock icon-modify"></i>
                            <input type="password" name="senha" placeholder="Digite sua senha" value={loginForm.senha} onChange={handleLoginChange} required />
                        </label>

                        <Link to="/esqueci-a-senha" className={`${Styles.password} ${Styles.back_link}`}>Esqueceu a senha?</Link>

                        <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`}>Entrar</button>

                        {statusMessage && (
                            <p style={{
                                color: '#e74c3c',
                                fontSize: '0.9rem',
                                marginTop: '8px',
                                textAlign: 'center'
                            }}>
                                {statusMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginEmpresa;
