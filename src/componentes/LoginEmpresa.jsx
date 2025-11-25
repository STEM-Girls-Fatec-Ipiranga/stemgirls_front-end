import Styles from '../css/LoginEmpresa.module.css';
import LogoSG from '../assets/img/LogoSGbranco.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

function LoginEmpresa() {
    const navigate = useNavigate();

    const [registerForm, setRegisterForm] = useState({
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
        setRegisterForm((prev) => ({ ...prev, [name]: value }));
        if (name === 'senha') validatePassword(value);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    };

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState('');

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            setTermsError('Você precisa aceitar os Termos de Uso para concluir o cadastro.');
            return;
        }

        if (!isPasswordValid) {
            alert('Por favor, crie uma senha que atenda a todos os critérios de segurança.');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/empresa/criar", {
                nomeEmpresa: registerForm.nomeEmpresa,
                cnpj: registerForm.cnpj,
                email: registerForm.email,
                senha: registerForm.senha,
                telefone: registerForm.telefone,
                role: "EMPRESA",
                status: "PENDENTE"
            });

            const empresa = response.data;

            const empresaData = {
                nomeEmpresa: empresa.nomeEmpresa,
                cnpj: empresa.cnpj,
                email: empresa.email,
                senha: empresa.senha,
                telefone: empresa.telefone,
                role: empresa.role,
                status: empresa.status
            };

            localStorage.setItem("empresa", JSON.stringify(empresaData));
            
            alert("Cadastro realizado! Nossa equipe está analisando seus dados. Você será notificado por e-mail quando for aprovado.");
            setModo("sgnup");
        } catch (error) {
            const errorMsg = error.response?.data.mensagem || "Erro ao cadastrar";
            setStatusMessage(errorMsg);
        }
    };

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showSuccessLoginPopup, setShowSuccessLoginPopup] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');

        try {
            const response = await axios.post("http://localhost:8080/empresa/login", {
                email: loginForm.email,
                senha: loginForm.senha
            });

            const empresa = response.data;

            const empresaData = {
                nomeEmpresa: empresa.nomeEmpresa,
                cnpj: empresa.cnpj,
                email: empresa.email,
                senha: empresa.senha,
                telefone: empresa.telefone,
                role: empresa.role,
                status: empresa.status
            };

            console.log(empresaData);

            if(empresa.status == "PENDENTE"){
                setStatusMessage("Nossa equipe está analisando seus dados, você será notificado quando acabarmos.");
                return;
            }else if(empresa.status == "REPROVADO"){
                setStatusMessage("Infelizmente, seu cadastro foi reprovado. Entre em contato conosco para mais informações.");
            }else{
                localStorage.setItem("empresa", JSON.stringify(empresaData));
            }

            setShowSuccessLoginPopup(true);
            
            setTimeout(() => {
                navigate("/");
            }, 900);
        } catch (error) {
            const errorMsg = error.response?.data.mensagem || "Verifique suas credenciais.";
            setStatusMessage(errorMsg);
        }
    };

    const [modo, setModo] = useState("");
    const [classeAtual, setClasseAtual] = useState("");
    useEffect(() => {
        if (modo === "signin") setClasseAtual(Styles.cadastra);
        if (modo === "signup") setClasseAtual(Styles.loga);
    }, [modo]);

    const SuccessPopup = () => (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4caf50',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontSize: '1rem',
            fontWeight: 'bold'
        }}>
            Cadastro efetuado com sucesso! 🎉
        </div>
    );

    const SuccessLoginPopup = () => (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4caf50',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontSize: '1rem',
            fontWeight: 'bold'
        }}>
            Login efetuado com sucesso! 🎉
        </div>
    );

    return (
        <div className={`${Styles.container} ${classeAtual}`}>
            {showSuccessPopup && <SuccessPopup />}
            {showSuccessLoginPopup && <SuccessLoginPopup />}

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
                            <input type="text" name="nomeEmpresa" placeholder="Digite o nome da empresa" value={registerForm.nomeEmpresa} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-br-at icon-modify"></i>
                            <input type="text" name="cnpj" placeholder="Digite o CNPJ da empresa" value={registerForm.cnpj} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-br-at icon-modify"></i>
                            <input type="text" name="telefone" placeholder="Digite o telefone da empresa" value={registerForm.telefone} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-rr-envelope icon-modify"></i>
                            <input type="email" name="email" placeholder="Digite o email da empresa" value={registerForm.email} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-sr-lock icon-modify"></i>
                            <input type="password" name="senha" placeholder="Digite sua senha" value={registerForm.senha} onChange={handleChange} required />
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
                            <input className={Styles.input_terms} type="checkbox" name="terms" id="terms" checked={termsAccepted}
                                onChange={(e) => {
                                    setTermsAccepted(e.target.checked);
                                }} />
                            <label className={Styles.label_terms} htmlFor="terms">
                                Li e aceito os <a href="#" target="_blank"> Termos de Uso</a>
                            </label>
                        </div>
                        {termsError && (
                            <p style={{
                                width: '100%',
                                textAlign: 'left',
                                color: '#e74c3c',
                                fontSize: '0.8rem',
                                marginTop: '5px',
                                paddingLeft: '5px'
                            }}>
                                {termsError}
                            </p>
                        )}

                        <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`}>Cadastrar-se</button>

                        {statusMessage && (
                            <p style={{
                                width: '100%',
                                color: '#e74c3c',
                                fontSize: '0.8rem',
                                marginTop: '5px',
                                paddingLeft: '5px'
                            }}>
                                {statusMessage}
                            </p>
                        )}

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
                                width: '100%',
                                color: '#e74c3c',
                                fontSize: '0.8rem',
                                marginTop: '5px',
                                paddingLeft: '5px',
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
