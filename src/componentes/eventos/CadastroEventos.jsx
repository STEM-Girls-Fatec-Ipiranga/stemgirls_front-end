import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function CadastroEventos({
  eventoEditando = null,
  onSalvar,
  onCancelar,
  imagensDisponiveis = [],
}) {
  const fileInputRef = useRef(null);

  const [organizadorTipo, setOrganizadorTipo] = useState("stemgirls");
  const [empresaNome, setEmpresaNome] = useState("");
  const [tituloEvento, setTituloEvento] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horaEvento, setHoraEvento] = useState("");
  const [modelo, setModelo] = useState("presencial");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [linkInscricao, setLinkInscricao] = useState("");
  const [linkPlataforma, setLinkPlataforma] = useState("");
  const [descricaoEvento, setDescricaoEvento] = useState("");
  const [imagem, setImagem] = useState(imagensDisponiveis[0] || "");
  const [imagemPreview, setImagemPreview] = useState(imagensDisponiveis[0] || "");

  useEffect(() => {
    if (eventoEditando) {
      // decide organizador
      const organizadorField = eventoEditando.organizador || eventoEditando.empresa || "";
      const isStem = (organizadorField || "").toString().toLowerCase().includes("stem");
      const tipoNormalized = (eventoEditando.organizadorTipo || (isStem ? "stemgirls" : "empresa")).toString().trim().toLowerCase();
      setOrganizadorTipo(tipoNormalized === "empresa" ? "empresa" : "stemgirls");
      setEmpresaNome(eventoEditando.empresa || eventoEditando.organizador || "");

      setTituloEvento(eventoEditando.titulo || "");
      setDataEvento(eventoEditando.data || eventoEditando.dataEvento || "");
      setHoraEvento(eventoEditando.hora || eventoEditando.horaEvento || "");
      setModelo((eventoEditando.tipo || "presencial").toString().toLowerCase() === "presencial" ? "presencial" : "remoto");

      // PRIORIZA eventoEditando.linkInscricao -> eventoEditando.link
      setLinkInscricao(eventoEditando.linkInscricao || eventoEditando.link || eventoEditando.linkParaInscricao || "");
      setLinkPlataforma(eventoEditando.linkPlataforma || eventoEditando.plataforma || "");

      setDescricaoEvento(eventoEditando.descricao || "");
      setImagem(eventoEditando.imagem || imagensDisponiveis[0] || "");
      setImagemPreview(eventoEditando.imagem || imagensDisponiveis[0] || "");

      if (eventoEditando.enderecoCompleto) {
        const end = eventoEditando.enderecoCompleto;
        const parts = end.split(" - ").map(p => p.trim()).filter(Boolean);
        if (parts.length >= 1) {
          const ruaNum = parts[0].split(",").map(p => p.trim());
          setRua(ruaNum[0] || "");
          setNumero(ruaNum[1] || "");
        }
        if (parts.length === 2) {
          const second = parts[1];
          if (second.includes("/")) {
            const lastParts = second.split("/");
            setCidade((lastParts[0] || "").trim());
            setEstado((lastParts[1] || "").trim());
          } else {
            setBairro(parts[1] || "");
          }
        } else if (parts.length >= 3) {
          setComplemento(parts.length > 2 ? parts[1] : "");
          setBairro(parts[parts.length - 2] || "");
          const cidadeUf = parts[parts.length - 1] || "";
          const [c, u] = (cidadeUf.split("/").map(p => p && p.trim()));
          setCidade(c || "");
          setEstado(u || "");
        }
      } else {
        setCidade(eventoEditando.cidade || eventoEditando.localidade || "");
        setEstado(eventoEditando.estado || eventoEditando.uf || "");
        setBairro(eventoEditando.bairro || "");
        setRua(eventoEditando.rua || eventoEditando.logradouro || "");
        setNumero(eventoEditando.numero || "");
        setComplemento(eventoEditando.complemento || "");
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoEditando]);

  const resetForm = () => {
    setOrganizadorTipo("stemgirls");
    setEmpresaNome("");
    setTituloEvento("");
    setDataEvento("");
    setHoraEvento("");
    setModelo("presencial");
    setCep("");
    setCidade("");
    setEstado("");
    setBairro("");
    setRua("");
    setNumero("");
    setComplemento("");
    setLinkInscricao("");
    setLinkPlataforma("");
    setDescricaoEvento("");
    const fallback = imagensDisponiveis[0] || "";
    setImagem(fallback);
    setImagemPreview(fallback);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const preencherEndereco = async (cepValor) => {
    const cepLimpo = (cepValor || "").replace(/\D/g, "");
    setCep(cepLimpo);
    if (cepLimpo.length !== 8) {
      if (!cepLimpo) {
        setCidade("");
        setEstado("");
        setBairro("");
        setRua("");
      }
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
        setBairro(data.bairro || "");
        setRua(data.logradouro || "");
      } else {
        setCidade("");
        setEstado("");
        setBairro("");
        setRua("");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      setCidade("");
      setEstado("");
      setBairro("");
      setRua("");
    }
  };

  const handleUploadImagem = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const maxSizeMB = 3;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagem(reader.result);
      setImagemPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const salvarEvento = () => {
    // padroniza salvar organizadorTipo em lowercase e valores esperados
    const organizadorTipoNormalized = (organizadorTipo || "").toString().trim().toLowerCase();
    const tipoFinal = organizadorTipoNormalized === "empresa" ? "empresa" : "stemgirls";

    if (tipoFinal === "empresa") {
      if (modelo === "presencial") {
        if (!linkInscricao.trim()) {
          alert("Para eventos presenciais realizados por empresas é necessário informar o link de inscrição.");
          return;
        }
      } else {
        if (!linkPlataforma.trim() || !linkInscricao.trim()) {
          alert("Para eventos remotos realizados por empresas é necessário informar o link da plataforma e o link de inscrição.");
          return;
        }
      }
    }

    const enderecoFormatado = modelo === "presencial"
      ? `${rua || ""}${numero ? ", " + numero : ""}${complemento ? " - " + complemento : ""}${bairro ? " - " + bairro : ""}${cidade ? " - " + cidade : ""}${estado ? "/" + estado : ""}`
      : "";

    const eventoObj = {
      id: eventoEditando ? (eventoEditando.id ?? eventoEditando._id) : Date.now(),
      organizadorTipo: tipoFinal,
      empresa: (empresaNome || "").trim(),
      organizador: (empresaNome || "").trim() || (tipoFinal === "stemgirls" ? "Stem Girls" : ""),
      titulo: tituloEvento.trim(),
      data: dataEvento,
      hora: horaEvento,
      tipo: modelo,
      local: modelo === "presencial" ? cidade || "Local não informado" : "Online",
      descricao: descricaoEvento.trim(),
      imagem,

      // garante compatibilidade com front/back
      link: linkInscricao.trim(),
      linkInscricao: linkInscricao.trim(),
      linkPlataforma: linkPlataforma.trim(),

      enderecoCompleto: enderecoFormatado,
      rua: (rua || "").trim(),
      numero: (numero || "").toString().trim ? (numero || "").toString().trim() : (numero || ""),
      complemento: (complemento || "").trim(),
      bairro: (bairro || "").trim(),
      cidade: (cidade || "").trim(),
      estado: (estado || "").trim(),
      cep: cep,
    };

    const isEdit = Boolean(eventoEditando);
    onSalvar(eventoObj, isEdit);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="cursor-pointer" onClick={() => { resetForm(); onCancelar(); }} />
        <h2 className="text-2xl font-bold">{eventoEditando ? "Editar Evento" : "Cadastrar Evento"}</h2>
      </div>

      <div className="mb-3">
        <label className="block font-semibold mb-2">Organizador</label>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="organizador"
              value="stemgirls"
              checked={organizadorTipo === "stemgirls"}
              onChange={() => setOrganizadorTipo("stemgirls")}
            />
            <span>StemGirls</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="organizador"
              value="empresa"
              checked={organizadorTipo === "empresa"}
              onChange={() => setOrganizadorTipo("empresa")}
            />
            <span>Empresa</span>
          </label>
        </div>
      </div>

      <input type="text" placeholder="Nome da empresa (se aplicável)" className="w-full mb-3 p-2 border rounded-lg" value={empresaNome} onChange={(e) => setEmpresaNome(e.target.value)} />

      <input type="text" placeholder="Nome do evento" className="w-full mb-3 p-2 border rounded-lg" value={tituloEvento} onChange={(e) => setTituloEvento(e.target.value)} />

      <div className="flex gap-2 mb-3">
        <input type="date" className="flex-1 p-2 border rounded-lg" value={dataEvento} onChange={(e) => setDataEvento(e.target.value)} />
        <input type="time" className="flex-1 p-2 border rounded-lg" value={horaEvento} onChange={(e) => setHoraEvento(e.target.value)} />
      </div>

      <div className="flex gap-2 mb-3">
        <button className={modelo === "presencial" ? "px-4 py-2 rounded-lg font-semibold bg-pink-500 text-white" : "px-4 py-2 rounded-lg font-semibold bg-gray-200"} onClick={() => setModelo("presencial")}>Presencial</button>
        <button className={modelo === "remoto" ? "px-4 py-2 rounded-lg font-semibold bg-pink-500 text-white" : "px-4 py-2 rounded-lg font-semibold bg-gray-200"} onClick={() => setModelo("remoto")}>Remoto</button>
      </div>

      {modelo === "presencial" && (
        <div className="flex flex-col gap-2 mb-3">
          <input type="text" placeholder="CEP" className="w-full p-2 border rounded-lg" value={cep} onChange={(e) => preencherEndereco(e.target.value)} />

          <div className="flex gap-2">
            <input type="text" placeholder="Cidade" className="flex-1 p-2 border rounded-lg" value={cidade} readOnly />
            <input type="text" placeholder="Estado" className="flex-1 p-2 border rounded-lg" value={estado} readOnly />
          </div>

          <input type="text" placeholder="Bairro" className="w-full p-2 border rounded-lg" value={bairro} readOnly />
          <input type="text" placeholder="Rua" className="w-full p-2 border rounded-lg" value={rua} readOnly />

          <div className="flex gap-2">
            <input type="text" placeholder="Número" className="flex-1 p-2 border rounded-lg" value={numero} onChange={(e) => setNumero(e.target.value)} />
            <input type="text" placeholder="Complemento" className="flex-1 p-2 border rounded-lg" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
          </div>

          {organizadorTipo === "empresa" && (
            <input type="text" placeholder="Link para formulário de inscrição (empresa)" className="w-full p-2 border rounded-lg mt-2" value={linkInscricao} onChange={(e) => setLinkInscricao(e.target.value)} />
          )}
        </div>
      )}

      {modelo === "remoto" && (
        <div className="flex flex-col gap-2 mb-3">
          {organizadorTipo === "empresa" ? (
            <>
              <input type="text" placeholder="Link da plataforma / sala (empresa)" className="w-full p-2 border rounded-lg" value={linkPlataforma} onChange={(e) => setLinkPlataforma(e.target.value)} />
              <input type="text" placeholder="Link para inscrição (empresa)" className="w-full p-2 border rounded-lg" value={linkInscricao} onChange={(e) => setLinkInscricao(e.target.value)} />
            </>
          ) : (
            <input type="text" placeholder="Link ou plataforma do evento" className="w-full p-2 border rounded-lg" value={linkInscricao} onChange={(e) => setLinkInscricao(e.target.value)} />
          )}
        </div>
      )}

      <textarea placeholder="Descrição do evento" className="w-full mb-3 p-2 border rounded-lg" value={descricaoEvento} onChange={(e) => setDescricaoEvento(e.target.value)} />

      <div className="mb-3">
        <label className="font-semibold block mb-1">Imagem do evento</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadImagem} className="w-full p-2 border rounded-lg" />
        {imagemPreview && <img src={imagemPreview} alt="Prévia da imagem" className="mt-3 w-full h-40 object-cover rounded-lg border" />}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-gray-300 px-4 py-2 rounded-lg" onClick={() => { resetForm(); onCancelar(); }}>Cancelar</button>
        <button className="flex-1 bg-pink-500 text-white px-4 py-2 rounded-lg" onClick={salvarEvento}>{eventoEditando ? "Salvar alterações" : "Cadastrar"}</button>
      </div>
    </div>
  );
}
