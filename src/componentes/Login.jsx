import Styles from '../css/Login.module.css';
//import Styles from '../css/Global.module.css';
import LogoSG from '../assets/img/LogoSG.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();

    // Estado para o formulário de CADASTRO
    const [form, setForm] = useState({
        nomeCompleto: '',
        nomeUsuario: '',
        email: '',
        senha: ''
    });

    // Estado SEPARADO para o formulário de LOGIN
    const [loginForm, setLoginForm] = useState({
        email: '',
        senha: ''
    });

    // --- NOVOS ESTADOS PARA VALIDAÇÃO DA SENHA ---
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    // --- NOVA FUNÇÃO PARA VALIDAR A SENHA ---
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

    // Handler para atualizar o estado do formulário de LOGIN 
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handler para atualizar o estado do formulário de CADASTRO (MODIFICADO)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'senha') {
            validatePassword(value);
        }
    };

    // Handler para atualizar o estado do formulário de CADASTRO
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            setTermsError('Você precisa aceitar os Termos de Uso para concluir o cadastro.');
            return;
        } else {
            setTermsError('');
        }

        if (!isPasswordValid) {
            alert('Por favor, crie uma senha que atenda a todos os critérios de segurança.');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/usuario/criar", {
                nomeCompleto: form.nomeCompleto,
                nomeUsuario: form.nomeUsuario,
                email: form.email,
                senha: form.senha,
                joinDate: new Date(),
                role: "USUARIO"
            });

            const user = response.data;

            if (response.status === 200 || response.status === 201) {

                const userDataFormatado = {
                    nomeCompleto: user.nomeCompleto || user.nome || "",
                    nomeUsuario: user.nomeUsuario || user.username || "",
                    email: user.email || "",
                    joinDate: user.joinDate || new Date(),
                    profileImage: user.profileImage || null
                };

                localStorage.setItem("userData", JSON.stringify(userDataFormatado));

                setShowSuccessPopup(true);

                setTimeout(() => {
                    navigate("/");
                }, 900);
            }
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            console.error("Erro no cadastro:", errorMessage);
            alert("Erro ao cadastrar: " + errorMessage);
        }
    };

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showSuccessLoginPopup, setShowSuccessLoginPopup] = useState(false);

    // --- FUNÇÃO DE SUBMISSÃO DO LOGIN ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email: loginForm.email,
                senha: loginForm.senha
            });

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem("userToken", token);

                const userDataFormatado = {
                    nomeCompleto: user.nomeCompleto || user.nome || "",
                    nomeUsuario: user.nomeUsuario || user.username || "",
                    email: user.email || "",
                    joinDate: user.joinDate || user.dataCriacao || new Date(),
                    profileImage: user.profileImage || null,
                    role: user.role || "USUARIO"
                };

                localStorage.setItem("userData", JSON.stringify(userDataFormatado));

                setShowSuccessLoginPopup(true);
                setTimeout(() => {
                    navigate("/");  
                }, 1500);
            }
        } catch (error) {
            const errorMessage = error.response?.data || "Verifique suas credenciais.";
            console.error("Erro no login:", errorMessage);
            alert("Erro no login: " + errorMessage);
        }
    };

    //-------------- LÓGICA DA ANIMAÇÃO --------------
    const [modo, setModo] = useState("");
    const [classeAtual, setClasseAtual] = useState("");
    useEffect(() => {
        if (modo === "signin") {
            setClasseAtual(Styles.cadastra);
        }
        if (modo === "signup") {
            setClasseAtual(Styles.loga);
        }
    }, [modo]);

    // FUNÇÃO PARA TERMOS DE USO
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState('');

    // POP-UP de sucesso
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
            {/*-------------------------- PRIMEIRO ESTADO (CADASTRO) --------------------------*/}
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
                    <h2 className={`${Styles.segundo_titulo} ${Styles.titulo}`}>Crie sua conta</h2>
                    <form className={Styles.form} onSubmit={handleRegisterSubmit}>
                        <label className={Styles.input_group}>
                            <i className="far fa-user icon-modify"></i>
                            <input type="text" name="nomeCompleto" placeholder="Digite seu nome completo" value={form.nomeCompleto} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-br-at icon-modify"></i>
                            <input type="text" name="nomeUsuario" placeholder="Digite o nome de usuário" value={form.nomeUsuario} onChange={handleChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-rr-envelope icon-modify"></i>
                            <input type="email" name="email" placeholder="Digite seu Email" value={form.email} onChange={handleChange} required />
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
                            <input
                                className={Styles.input_terms}
                                type="checkbox"
                                name="terms"
                                id="terms"
                                checked={termsAccepted}
                                onChange={(e) => {
                                    setTermsAccepted(e.target.checked);
                                    if (e.target.checked) setTermsError('');
                                }}
                            />
                            <label className={Styles.label_terms} htmlFor="terms">
                                Li e aceito os{" "}
                                <Link to="/termos-de-uso" target="_blank">
                                    Termos de Uso
                                </Link>
                            </label>
                        </div>
                        {termsError && (
                            <p style={{
                                color: '#e74c3c',
                                fontSize: '0.8rem',
                                marginTop: '4px',
                                paddingLeft: '4px',
                                fontWeight: '600',
                            }}>
                                {termsError}
                            </p>
                        )}

                        <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`}>Cadastrar-se</button>
                        <br />

                        <Link to="/login-empresa">Sou uma empresa</Link>

                    </form>
                </div>
            </div>

            {/*-------------------------- SEGUNDO ESTADO (LOGIN) --------------------------*/}
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
                            <i className="far fi-rr-envelope icon-modify"></i>
                            <input type="email" name="email" placeholder="Digite seu email" value={loginForm.email} onChange={handleLoginChange} required />
                        </label>
                        <label className={Styles.input_group}>
                            <i className="fi fi-sr-lock icon-modify"></i>
                            <input type="password" name="senha" placeholder="Digite sua senha" value={loginForm.senha} onChange={handleLoginChange} required />
                        </label>
                        <Link to="/esqueci-a-senha" className={`${Styles.password} ${Styles.back_link}`}>Esqueceu a senha?</Link>

                        <button type="submit" className={`${Styles.segundo_botao} ${Styles.botao}`}>Entrar</button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;