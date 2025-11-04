import fundoSG from "../assets/img/FundoRodape.png";
import LogoSGbranco from '../assets/img/LogoSGbranco.png';

//import Quickand from '../assets/fontes/Playwrite_IT_Moderna-Quicksand-Sigmar/Quicksand/Quicksand-Regular.ttf';

function Rodape() {

    // function FeedbackFooter() {
    //     const [mensagem, setMensagem] = useState("");
    //     const [status, setStatus] = useState(null);

    //     async function enviarFeedback() {
    //         if (!mensagem.trim()) {
    //             setStatus({ tipo: "erro", texto: "Escreva algo antes de enviar." });
    //             return;
    //         }
    //         setStatus({ tipo: "loading", texto: "Enviando..." });

    //         try {
    //             const res = await fetch("/api/feedback", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ mensagem })
    //             });

    //             if (res.ok) {
    //                 setMensagem("");
    //                 setStatus({ tipo: "sucesso", texto: "Obrigado! Feedback enviado." });
    //             } else {
    //                 const txt = await res.text();
    //                 setStatus({ tipo: "erro", texto: "Falha ao enviar: " + txt });
    //             }
    //         } catch (err) {
    //             setStatus({ tipo: "erro", texto: "Erro de conexão." });
    //         }
    //     }
    // }

        return (
            <footer className="w-full flex flex-col h-[515px] bg-gray-800 backdrop-blur-md "
                style={{
                    backgroundImage: `url(${fundoSG})`,
                    boxShadow: 'inset 0 8px 10px -5px rgba(0, 0, 0, 0.21)',
                }}
            >

                <div className="w-[85%] h-[90%] mt-[15px] flex flex-col m-auto">
                    <div className="w-full h-[30%] flex justify-start border-b-2">
                        <img src={LogoSGbranco} alt="Logo" className="w-[190px] h-[95%] mt-2 object-contain" />
                    </div>

                    <div className="w-full h-[70%] flex flex-row">

                        <div className="w-[20%] h-full">
                            <div className="ml-6 mr-6 mt-10 flex flex-col">
                                <p className="font-bold text-[25px] m-2">Sobre nós</p>
                                <p className="text-[18px] m-4">Política de Privacidade</p>
                                <a
                                    href="https://meninas.sbc.org.br/sobre-nos/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[18px] m-4"
                                >
                                    Quem somos
                                </a>
                                <p className="text-[18px] m-4">Manual do usuário</p>
                            </div>
                        </div>

                        <div className="w-[20%] h-full">
                            <div className="ml-6 mr-6 mt-10 flex flex-col">
                                <p className="font-bold text-[25px] m-2">Redes sociais</p>
                                {/* <p className="text-[18px] m-4">Linkedin</p> */}
                                <a
                                    href="https://www.instagram.com/stemgirls_fatecipiranga?utm_source=ig_web_button_share_sheet&igsh=c2k4cTNqbnkzejVw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[18px] m-4"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://github.com/STEM-Girls-Fatec-Ipiranga"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[18px] m-4"
                                >
                                    Github
                                </a>
                            </div>
                        </div>


                        <div className="w-[60%] h-full flex justify-end">
                            <div className="w-[470px] mt-[180px] flex flex-col justify-center">
                                <p className="text-white text-[19px] mb-2">Está gostando? Nos conte o que achou da plataforma!</p>
                                <div className="w-full flex flex-row justify-between">
                                    <textarea
                                        className="w-[80%] h-12 bg-transparent border-[3px] rounded-[7px] pl-3 pt-2 placeholder:text-white placeholder:text-[18px] focus:outline-none focus:border-purple-200 focus:ring-2 focus:ring-purple-300 resize-none shadow-sm transition-all"
                                        name="mensagem"
                                        id="mensagem"
                                        placeholder="Digite aqui..."
                                        //value={mensagem}
                                        //onChange={(e) => setMensagem(e.target.value)}
                                    />
                                    <button
                                        //onClick={enviarFeedback}
                                        className="w-[17%] rounded-[7px] bg-white text-[#c958d0] font-bold text-[17px]"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                {/* {status && <p className={`mt-2 ${status.tipo === "erro" ? "text-red-400" : "text-green-300"}`}>{status.texto}</p>} */}
                            </div>
                        </div>


                        {/* <div className="w-[60%] h-full flex justify-end">

                        <div className="w-[470px] h-[100px] mt-[180px] flex flex-col justify-center">
                            <p className="text-white text-[19px] mb-2">Está gostando? Nos conte o que achou da plataforma!</p>
                            <div className="w-full flex flex-row justify-between">
                                <input
                                    type="email"
                                    className="w-[80%] h-12 bg-transparent border-[3px] rounded-[7px] pl-3 placeholder:text-white placeholder:text-[18px] focus:outline-none focus:border-purple-200 focus:ring-2 focus:ring-purple-300 resize-none shadow-sm transition-all"
                                    name="email"
                                    id="email"
                                    placeholder="Digite aqui..."
                                />
                                <button className="w-[17%] rounded-[7px] bg-white text-[#c958d0] font-bold text-[17px]">Enviar</button>
                            </div>
                        </div>

                    </div> */}
                    </div>
                </div>
                <div className="w-full h-[10%] flex itens-center" style={{ background: 'linear-gradient(90deg, #5b3eeb 0%, #c958d0 100%)' }}>
                    <p className="m-auto text-white font-bold">© 2025 STEM Girls. Todos os direitos reservados</p>
                </div>

            </footer >
        );
    }


    export default Rodape;