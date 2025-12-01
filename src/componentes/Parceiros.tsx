import { useState } from 'react';
import { X, Sparkles, Target, Eye, Users, GraduationCap, Building2, School, User, Heart } from 'lucide-react';
import emailjs from '@emailjs/browser';
import fundoSG from "../assets/img/FundoSGcolorido.jpg";
import PopupLoginAviso from "../componentes/PopupLoginAviso";


interface PartnershipType {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    detailedInfo: string;
    link: string;
}

interface Partner {
    id: string;
    name: string;
    logo: string;
    description: string;
    fullDescription: string;
    website: string;
}

function Parceiros() {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPartnershipModal, setShowPartnershipModal] = useState(false);
    const [showPartnerModal, setShowPartnerModal] = useState(false);
    const [selectedPartnership, setSelectedPartnership] = useState<PartnershipType | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [formData, setFormData] = useState({ companyName: '', email: '' });

    const [popupOpen, setPopupOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const empresa = localStorage.getItem("empresa");
    const moderador = localStorage.getItem("moderador");


    const benefits = [
        {
            icon: <Sparkles className="w-8 h-8 text-[#AF5FE4]" />,
            title: 'Impacto social',
            description: 'Promova a inclusão e diversidade na tecnologia.'
        },
        {
            icon: <Eye className="w-8 h-8 text-[#AF5FE4]" />,
            title: 'Visibilidade',
            description: 'Sua marca ganha destaque em eventos, redes e no nosso site.'
        },
        {
            icon: <Users className="w-8 h-8 text-[#AF5FE4]" />,
            title: 'Conexão',
            description: 'Acesso direto a talentos femininos em formação.'
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-[#AF5FE4]" />,
            title: 'Educação',
            description: 'Apoie projetos que capacitam meninas e mulheres em tecnologia.'
        }
    ];

    const partnershipTypes: PartnershipType[] = [
        {
            id: 'empresas',
            title: 'Empresas apoiadoras',
            icon: <Building2 className="w-12 h-12 text-[#F36EC0]" />,
            description: 'Empresas que investem no futuro da tecnologia',
            detailedInfo: 'Empresas apoiadoras são organizações que acreditam no poder da diversidade e investem em iniciativas que promovem a inclusão de meninas e mulheres nas áreas STEM. Através de patrocínios, mentorias e oportunidades de estágio, essas empresas contribuem diretamente para a formação de novas profissionais.',
            link: 'stemgirls.com/parcerias/empresas'
        },
        {
            id: 'instituicoes',
            title: 'Instituições de ensino',
            icon: <School className="w-12 h-12 text-[#F36EC0]" />,
            description: 'Escolas e universidades parceiras',
            detailedInfo: 'Instituições de ensino parceiras abrem suas portas para workshops, palestras e eventos da STEMGirls. Juntas, criamos um ambiente educacional mais inclusivo e inspirador, onde meninas são encorajadas a explorar carreiras em tecnologia desde cedo.',
            link: 'stemgirls.com/parcerias/instituicoes'
        },
        {
            id: 'embaixadoras',
            title: 'Embaixadoras',
            icon: <User className="w-12 h-12 text-[#F36EC0]" />,
            description: 'Mulheres que inspiram e multiplicam',
            detailedInfo: 'Nossas embaixadoras são mulheres inspiradoras que atuam em diferentes áreas da tecnologia. Elas compartilham suas histórias, mentoram meninas e ajudam a expandir o alcance da STEMGirls em suas comunidades e redes profissionais.',
            link: 'stemgirls.com/parcerias/embaixadoras'
        },
        {
            id: 'ongs',
            title: 'ONGs e projetos sociais',
            icon: <Heart className="w-12 h-12 text-[#F36EC0]" />,
            description: 'Organizações com propósito compartilhado',
            detailedInfo: 'Parcerias com ONGs e projetos sociais ampliam nosso impacto e nos permitem alcançar comunidades diversas. Juntas, trabalhamos para democratizar o acesso à educação em tecnologia e criar oportunidades para meninas de diferentes realidades.',
            link: 'stemgirls.com/parcerias/ongs'
        }
    ];

    const featuredPartners: Partner[] = [
        {
            id: '1',
            name: 'Meninas Digitais',
            logo: 'M',
            description: 'Para que mais mulheres revolucionem a tecnologia!',
            fullDescription: 'O Programa Meninas Digitais, iniciativa da Sociedade Brasileira de Computação (SBC), busca inspirar e incentivar meninas e mulheres jovens a se interessarem pelas áreas de Computação e Tecnologia da Informação. Por meio de oficinas, palestras, mentorias e eventos, o programa promove a inclusão feminina no mundo tech, mostrando que a tecnologia também é um espaço de criatividade, colaboração e impacto social.',
            website: 'https://meninas.sbc.org.br/'
        },
        {
            id: '2',
            name: 'Fatec Ipiranga',
            logo: 'F',
            description: 'Instituição de ensino técnico e superior',
            fullDescription: 'A STEMGirls nasceu dentro da FATEC Ipiranga, uma instituição de ensino superior reconhecida por sua formação tecnológica de excelência e por incentivar o desenvolvimento de projetos inovadores com impacto social. A faculdade oferece cursos que unem teoria e prática, formando profissionais preparados para o mercado e comprometidos com a transformação da sociedade através da tecnologia.',
            website: 'https://fatecipiranga.cps.sp.gov.br/'
        },
        {
            id: '3',
            name: 'Tals',
            logo: 'T',
            description: 'pipipi popopo',
            fullDescription: 'nhenhenhe',
            website: 'https://meta.com'
        },
        {
            id: '4',
            name: 'Tals',
            logo: 'T',
            description: 'pipipi popopo',
            fullDescription: 'nhanhanha',
            website: 'https://airbnb.com'
        }
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const templateParams = {
            CompanyName: formData.companyName,
            CompanyEmail: formData.email,
        };

        emailjs
            .send(
                'service_47hybdq',
                'template_w41kuo7',
                templateParams,
                'bpF5OstB3DmjZqEow'
            )
            .then(
                () => {
                    alert('✅ Solicitação enviada com sucesso!');
                    setShowContactModal(false);
                    setFormData({ companyName: '', email: '' });
                },
                (error) => {
                    console.error('Erro ao enviar:', error);
                    alert('❌ Ocorreu um erro ao enviar o e-mail. Tente novamente.');
                }
            );
    };

    const openPartnershipModal = (partnership: PartnershipType) => {
        setSelectedPartnership(partnership);
        setShowPartnershipModal(true);
    };

    const openPartnerModal = (partner: Partner) => {
        setSelectedPartner(partner);
        setShowPartnerModal(true);
    };



    return (
        <div className="min-h-screen bg-[#FFF6FF]">
            <section className="relative py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#F36EC0] via-pink-500 to-[#AF5FE4] text-transparent bg-clip-text inline-block">
                        Juntas, transformamos o futuro da tecnologia
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-purple-600">
                        Acreditamos no poder da colaboração entre empresas, escolas e pessoas que apoiam a presença feminina nas áreas STEM.
                    </p>
                    <button
                        onClick={() => {
                            if (user || empresa || moderador) {
                                setShowContactModal(true);
                            } else {
                                setPopupOpen(true);
                            }
                        }}
                        className="bg-[#AF5FE4] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Quero ser parceira da STEMGirls
                    </button>



                </div>
            </section >

            <section className="py-20 max-w-full">

                <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
                    Parceiras em destaque
                </h2>

                <div className="max-w-full h-[600px] bg-cover bg-center flex items-center justify-center shadow-[inset_0_0_27px_4px_rgba(0,0,0,0.6)]"
                    style={{ backgroundImage: `url(${fundoSG})` }}
                >
                    <div className="m-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredPartners.map((partner) => (
                            <div
                                key={partner.id}
                                onClick={() => openPartnerModal(partner)}
                                className="bg-[#FFF6FF] border border-[#F36EC0] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-[#AF5FE4] to-[#F36EC0] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl font-bold text-white">{partner.logo}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                                    {partner.name}
                                </h3>
                                <p className="text-gray-700 text-[17px] text-center">{partner.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Por que ser parceira da STEMGirls?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-[#FFF6FF] border border-[#AF5FE4] rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow"
                            >
                                <div className="mb-4">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 text-lg">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Nossos tipos de parceria
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {partnershipTypes.map((type) => (
                            <div
                                key={type.id}
                                onClick={() => openPartnershipModal(type)}
                                className="bg-[#FFF6FF] border border-[#F36EC0] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                            >
                                <div className="mb-4 flex justify-center">{type.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                                    {type.title}
                                </h3>
                                <p className="text-gray-600 text-center">{type.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {
                showContactModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-fadeIn">
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">
                                Torne-se uma parceira da STEMGirls
                            </h3>
                            <p className="text-black">Digite o nome da sua empresa e seu email para contato que vamos analisar sua solicitação!</p>
                            <br />
                            <form onSubmit={handleContactSubmit}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Nome da empresa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        E-mail empresarial
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                                >
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showPartnershipModal && selectedPartnership && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
                        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative animate-fadeIn">
                            <button
                                onClick={() => setShowPartnershipModal(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex justify-center mb-6">{selectedPartnership.icon}</div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                                {selectedPartnership.title}
                            </h3>
                            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                                {selectedPartnership.detailedInfo}
                            </p>
                        </div>
                    </div>
                )
            }

            {
                showPartnerModal && selectedPartner && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
                        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative animate-fadeIn">
                            <button
                                onClick={() => setShowPartnerModal(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="w-24 h-24 bg-gradient-to-br from-[#AF5FE4] to-[#F36EC0] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl font-bold text-white">{selectedPartner.logo}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                                {selectedPartner.name}
                            </h3>
                            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                                {selectedPartner.fullDescription}
                            </p>
                            <a
                                href={selectedPartner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-center"
                            >
                                Visitar site da parceira
                            </a>
                        </div>
                    </div>
                )
            }

            <PopupLoginAviso
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
            />

        </div >
    );
}

export default Parceiros;
