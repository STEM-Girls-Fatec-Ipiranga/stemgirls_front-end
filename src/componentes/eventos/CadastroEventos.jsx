// src/components/CadastroEventos.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function CadastroEventos({
  eventoEditando = null,
  onSalvar,
  onCancelar,
  imagensDisponiveis = [],
}) {
  // Estados do formulário
  const [empresa, setEmpresa] = useState("");
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
  const [link, setLink] = useState("");
  const [descricaoEvento, setDescricaoEvento] = useState("");
  const [imagem, setImagem] = useState(imagensDisponiveis[0] || "");
  const [imagemPreview, setImagemPreview] = useState(imagensDisponiveis[0] || "");

  useEffect(() => {
    if (eventoEditando) {
      setEmpresa(eventoEditando.empresa || "");
      setTituloEvento(eventoEditando.titulo || "");
      setDataEvento(eventoEditando.data || "");
      setHoraEvento(eventoEditando.hora || "");
      setModelo(eventoEditando.tipo === "presencial" ? "presencial" : "remoto");
      setLink(eventoEditando.link || "");
      setDescricaoEvento(eventoEditando.descricao || "");
      setImagem(eventoEditando.imagem || (imagensDisponiveis[0] || ""));
      setImagemPreview(eventoEditando.imagem || (imagensDisponiveis[0] || ""));

      if (eventoEditando.enderecoCompleto) {
        const end = eventoEditando.enderecoCompleto;
        const parts = end.split(" - ");
        if (parts.length >= 3) {
          setRua(parts[0].split(",")[0] || "");
          setNumero(parts[0].split(",")[1]?.trim() || "");
          setComplemento(parts.length > 3 ? parts[1] : "");
          setBairro(parts[parts.length - 2] || "");
          const cidadeUf = parts[parts.length - 1] || "";
          const [c, u] = cidadeUf.split("/");
          setCidade((c || "").trim());
          setEstado((u || "").trim());
        }
      }
    } else {
      resetForm();
    }
  }, [eventoEditando]);

  const resetForm = () => {
    setEmpresa("");
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
    setLink("");
    setDescricaoEvento("");
    setImagem(imagensDisponiveis[0] || "");
    setImagemPreview(imagensDisponiveis[0] || "");
  };

  const preencherEndereco = async (cepValor) => {
    const cepLimpo = cepValor.replace(/\D/g, "");
    setCep(cepValor);
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
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagem(base64);
      setImagemPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // 🔥🔥🔥 FUNÇÃO CORRIGIDA 🔥🔥🔥
  const salvarEvento = () => {
    const eventoObj = {
      id: eventoEditando ? eventoEditando.id : Date.now(),
      empresa: empresa.trim(),
      titulo: tituloEvento.trim(),
      data: dataEvento,
      hora: horaEvento,
      tipo: modelo,
      local: modelo === "presencial" ? cidade : "Online",
      descricao: descricaoEvento.trim(),
      imagem,
      link: link.trim(),
      enderecoCompleto:
        modelo === "presencial"
          ? `${rua || ""}, ${numero || ""}${complemento ? " - " + complemento : ""} - ${bairro || ""} - ${cidade || ""}/${estado || ""}`
          : "",
    };

    const isEdit = Boolean(eventoEditando);

    onSalvar(eventoObj, isEdit);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="cursor-pointer" onClick={onCancelar} />
        <h2 className="text-2xl font-bold">{eventoEditando ? "Editar Evento" : "Cadastrar Evento"}</h2>
      </div>

      <input
        type="text"
        placeholder="Nome da empresa"
        className="w-full mb-3 p-2 border rounded-lg"
        value={empresa}
        onChange={(e) => setEmpresa(e.target.value)}
      />

      <input
        type="text"
        placeholder="Nome do evento"
        className="w-full mb-3 p-2 border rounded-lg"
        value={tituloEvento}
        onChange={(e) => setTituloEvento(e.target.value)}
      />

      <div className="flex gap-2 mb-3">
        <input
          type="date"
          className="flex-1 p-2 border rounded-lg"
          value={dataEvento}
          onChange={(e) => setDataEvento(e.target.value)}
        />

        <input
          type="time"
          className="flex-1 p-2 border rounded-lg"
          value={horaEvento}
          onChange={(e) => setHoraEvento(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-3">
        <button
          className={modelo === "presencial" ? "px-4 py-2 rounded-lg font-semibold bg-pink-500 text-white" : "px-4 py-2 rounded-lg font-semibold bg-gray-200"}
          onClick={() => setModelo("presencial")}
        >
          Presencial
        </button>

        <button
          className={modelo === "remoto" ? "px-4 py-2 rounded-lg font-semibold bg-pink-500 text-white" : "px-4 py-2 rounded-lg font-semibold bg-gray-200"}
          onClick={() => setModelo("remoto")}
        >
          Remoto
        </button>
      </div>

      {modelo === "presencial" && (
        <div className="flex flex-col gap-2 mb-3">
          <input
            type="text"
            placeholder="CEP"
            className="w-full p-2 border rounded-lg"
            value={cep}
            onChange={(e) => preencherEndereco(e.target.value)}
          />

          <div className="flex gap-2">
            <input type="text" placeholder="Cidade" className="flex-1 p-2 border rounded-lg" value={cidade} readOnly />
            <input type="text" placeholder="Estado" className="flex-1 p-2 border rounded-lg" value={estado} readOnly />
          </div>

          <input type="text" placeholder="Bairro" className="w-full p-2 border rounded-lg" value={bairro} readOnly />
          <input type="text" placeholder="Rua" className="w-full p-2 border rounded-lg" value={rua} readOnly />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Número"
              className="flex-1 p-2 border rounded-lg"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <input
              type="text"
              placeholder="Complemento"
              className="flex-1 p-2 border rounded-lg"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Link para formulário de inscrição"
            className="w-full p-2 border rounded-lg mt-2"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      )}

      {modelo === "remoto" && (
        <div className="flex flex-col gap-2 mb-3">
          <input
            type="text"
            placeholder="Link ou plataforma do evento"
            className="w-full p-2 border rounded-lg"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      )}

      <textarea
        placeholder="Descrição do evento"
        className="w-full mb-3 p-2 border rounded-lg"
        value={descricaoEvento}
        onChange={(e) => setDescricaoEvento(e.target.value)}
      />

      <div className="mb-3">
        <label className="font-semibold block mb-1">Imagem do evento</label>
        <input type="file" accept="image/*" onChange={handleUploadImagem} className="w-full p-2 border rounded-lg" />

        {imagemPreview && (
          <img src={imagemPreview} alt="Prévia da imagem" className="mt-3 w-full h-40 object-cover rounded-lg border" />
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 bg-gray-300 px-4 py-2 rounded-lg"
          onClick={() => {
            resetForm();
            onCancelar();
          }}
        >
          Cancelar
        </button>

        {/* 🔥 BOTÃO CORRIGIDO */}
        <button
          className="flex-1 bg-pink-500 text-white px-4 py-2 rounded-lg"
          onClick={salvarEvento}
        >
          {eventoEditando ? "Salvar alterações" : "Cadastrar"}
        </button>
      </div>
    </div>
  );
}
