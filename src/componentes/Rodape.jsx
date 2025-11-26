import fundoSG from "../assets/img/FundoRodape.png";
import LogoSGbranco from '../assets/img/LogoSGbranco.png';

import emailjs from "@emailjs/browser";
import { useState } from "react";

function Rodape() {
    const [feedbackData, setFeedbackData] = useState({
        FeedbackEmail: "",
        FeedbackMessage: ""
    });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            "service_47hybdq", // <-- substitua aqui
            "template_kczbeqz", // <-- substitua aqui
            {
                FeedbackEmail: feedbackData.FeedbackEmail,
                FeedbackMessage: feedbackData.FeedbackMessage,
            },
            "bpF5OstB3DmjZqEow" // <-- substitua aqui
        )
        .then(() => {
            alert("Feedback enviado com sucesso! 💜");
            setFeedbackData({ FeedbackEmail: "", FeedbackMessage: "" }); // limpa o form
        })
        .catch(() => {
            alert("Erro ao enviar feedback. Tente novamente.");
        });
    };

    return (
        <footer
            className="w-full flex flex-col h-[515px] bg-gray-800 backdrop-blur-md"
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
                        <form
                            onSubmit={handleFeedbackSubmit} // ✅ ADICIONADO O FORM
                            className="w-[470px] h-[270px] mt-[100px] flex flex-col justify-center"
                        >
                            <p className="text-white text-[19px] mb-2">
                                Está gostando? Nos conte o que achou da plataforma!
                            </p>

                            {/* CAMPO DE EMAIL */}
                            <input
                                type="email"
                                value={feedbackData.FeedbackEmail}
                                onChange={(e) =>
                                    setFeedbackData({ ...feedbackData, FeedbackEmail: e.target.value })
                                }
                                className="w-[80%] h-12 mb-2 bg-transparent border-[3px] rounded-[7px] pl-3 pt-2 placeholder:text-white placeholder:text-[18px] focus:outline-none focus:border-purple-200 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all"
                                name="FeedbackEmail"
                                placeholder="Digite seu email..."
                                required
                            />

                            <div className="w-full flex flex-row justify-between">
                                <textarea
                                    value={feedbackData.FeedbackMessage}
                                    onChange={(e) =>
                                        setFeedbackData({ ...feedbackData, FeedbackMessage: e.target.value })
                                    }
                                    className="w-[80%] h-12 bg-transparent border-[3px] rounded-[7px] pl-3 pt-2 placeholder:text-white placeholder:text-[18px] focus:outline-none focus:border-purple-200 focus:ring-2 focus:ring-purple-300 shadow-sm transition-all"
                                    name="FeedbackMessage"
                                    placeholder="Digite sua mensagem..."
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-[17%] rounded-[7px] bg-white text-[#c958d0] font-bold text-[17px] hover:opacity-90 transition"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div
                className="w-full h-[10%] flex items-center"
                style={{ background: 'linear-gradient(90deg, #5b3eeb 0%, #c958d0 100%)' }}
            >
                <p className="m-auto text-white font-bold">
                    © 2025 STEM Girls. Todos os direitos reservados
                </p>
            </div>
        </footer>
    );
}

export default Rodape;
