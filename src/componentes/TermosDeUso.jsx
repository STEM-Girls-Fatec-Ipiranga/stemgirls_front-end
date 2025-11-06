import fundoSG from "../assets/img/FundoSGcolorido.jpg";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Styles from '../css/Login.module.css';

function TermosDeUso() {
    return (
        <>
            <div className="w-full h-auto bg-cover bg-center flex itens-center justify-center backdrop-blur-md"
                style={{ backgroundImage: `url(${fundoSG})` }}
            >
                <Link to="/login">
                    <button
                        className="absolute top-2 left-2 w-auto px-4 py-3 bg-[#FFF6FF] hover:bg-purple-600 hover:text-purple-200 rounded-xl text-purple-500 font-bold transition-colors duration-200 shadow-lg flex items-center gap-2 mt-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar
                    </button>
                </Link>

                <div className="w-80% h-auto bg-[#FFF6FF] mt-20 mb-20 border rounded-[30px] p-10 overflow-y-auto text-black scrollbar-hidden overflow-auto">

                    <div className="w-[800px] h-full">
                        <div>
                            <h1 className="text-[30px] text-center m-10 font-bold">Termos e Condições Gerais de Uso do Site da STEMGirls</h1>
                            <p className="text-[17px]">Os serviços do FeemCode são fornecidos pela pessoa jurídica OU física com a seguinte Razão Social FeemCode Sistemas de Inovação LTDA, com nome fantasia FeemCode, titular da propriedade intelectual sobre website, conteúdos e demais ativos relacionados à plataforma STEMGirls.</p>
                        </div>


                        <br />

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Do Objeto</h1>
                            <p className="text-[17px]">A plataforma FeemCode visa licenciar o uso de seu website e demais ativos de propriedade intelectual, fornecendo ferramentas para auxiliar e dinamizar o dia a dia dos seus usuários. A plataforma caracteriza-se pela prestação do seguinte serviço: Nosso site é um espaço dedicado ao empoderamento feminino, oferecendo recursos que promovem o aprendizado e o crescimento pessoal e profissional. Aqui, você encontrará vídeos educativos sobre temas essenciais, uma rede de networking para trocar experiências e expandir suas conexões, além de mentorias para orientações personalizadas.Nosso objetivo é fortalecer uma comunidade  de comunicação, onde mulheres se apoiam mutuamente, compartilham conhecimentos e se inspiram para alcançar novos patamares. Junte-se a nós e faça parte dessa jornada de transformação e empoderamento!.</p>
                        </div>

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Do Acesso dos Usuários</h1>
                            <p className="text-[17px]">Serão empregadas todas as soluções técnicas disponíveis para garantir o acesso ao serviço 24 (vinte e quatro) horas por dia, 7 (sete) dias por semana. Contudo, a navegação na plataforma poderá ser interrompida, limitada ou suspensa para atualizações, modificações ou qualquer ação necessária ao seu bom funcionamento.</p>
                        </div>

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Do Cadastro</h1>
                            <p className="text-[17px]">Ao se cadastrar, o usuário deverá informar dados completos, recentes e válidos, sendo de sua exclusiva responsabilidade mantê-los atualizados e garantir a veracidade das informações. O usuário compromete-se a não compartilhar seus dados cadastrais e/ou de acesso à plataforma com terceiros, responsabilizando-se integralmente pelo uso que deles seja feito. Menores de 18 anos e aqueles que não possuírem plena capacidade civil devem obter consentimento expresso de seus responsáveis legais para utilização da plataforma e dos serviços ou produtos, sendo de responsabilidade exclusiva destes a supervisão de eventuais acessos indevidos.</p>
                            <br />
                            <p className="text-[17px]">O usuário deverá fornecer um endereço de e-mail válido, através do qual a plataforma realizará todas as comunicações necessárias. Após a confirmação do cadastro, o usuário receberá um login e uma senha pessoal, cuja manutenção em caráter confidencial e seguro será de responsabilidade exclusiva do usuário. O usuário deverá notificar imediatamente a plataforma em caso de uso indevido de sua senha. É vedada a cessão, venda, aluguel ou transferência da conta, que é pessoal e intransferível.</p>
                            <br />
                            <p className="text-[17px]">O usuário poderá, a qualquer tempo, solicitar o cancelamento de seu cadastro junto ao site, sendo realizado a suspenção do seu cadastro o mais rapidamente possível, desde que não haja débitos em aberto. Ao aceitar os Termos e a Política de Privacidade, o usuário autoriza expressamente a plataforma a coletar, usar, armazenar, tratar, ceder ou utilizar as informações derivadas do uso dos serviços, do site e de quaisquer plataformas, conforme descrito na Política de Privacidade.</p>
                        </div>

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Do Suporte</h1>
                            <p className="text-[17px]">Em caso de qualquer dúvida, sugestão ou problema com a utilização da plataforma, o usuário poderá entrar em contato com o suporte através do e-mail Feemcode2024@gmail.com ou telefone (11)973949643. Estes serviços de atendimento ao usuário estarão disponíveis nos seguintes dias e horários: Segunda a sexta das 8h ás 17h..</p>
                        </div>

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Das Responsabilidades do usuáro</h1>
                            <p className="text-[17px]">É de responsabilidade do usuário:
                                a- Corrigir defeitos ou vícios técnicos em seu próprio sistema;
                                b- Utilizar a plataforma de forma adequada, respeitando a boa convivência entre os usuários;
                                c- Cumprir as regras estabelecidas neste Termo, na Política de Privacidade e na legislação aplicável;
                                d- Proteger os dados de acesso à sua conta/perfil (login e senha).</p>
                        </div>

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Das Responsabilidades da plataforma:</h1>
                            <p className="text-[17px]">É de responsabilidade da plataforma:
                                a- Indicar as características do serviço;
                                b- Responder por defeitos e vícios encontrados no serviço ou produto oferecido, desde que tenham dado causa;
                                c- Assegurar a veracidade das informações divulgadas, sendo que comentários ou informações publicadas por usuários são de responsabilidade destes;
                                d- Remover conteúdos ou atividades ilícitas praticadas através da plataforma.</p>
                        </div>

                        <div className="mt-10 mb-10">
                            <h1 className="text-[20px] text-left font-bold">Dos Direitos Autorais</h1>
                            <p className="text-[17px]">O presente Termo concede aos usuários uma licença não exclusiva, não transferível e não sublicenciável para acessar e fazer uso da plataforma e dos serviços e produtos disponibilizados. A estrutura do site, marcas, logotipos, nomes comerciais, layouts, gráficos, design de interface, imagens, ilustrações, vídeos e conteúdos, assim como todos os direitos de propriedade intelectual da razão social [NOME], estão reservados e protegidos pela Lei de Propriedade Industrial (Lei nº 9.279/96), Lei de Direitos Autorais (Lei nº 9.610/98) e Lei do Software (Lei nº 9.609/98). O uso da plataforma pelo usuário é pessoal e intransferível, sendo vedado qualquer uso não autorizado, comercial ou não-comercial.</p>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}

export default TermosDeUso;