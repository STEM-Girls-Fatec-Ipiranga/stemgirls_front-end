import React, { useState, useEffect } from 'react'
import axios from 'axios'



const CadastroEvento = () => {
  const [form, setForm] = useState({
    nomeEmpresa: '',
    nomeEvento: '',
    dataEvento: '',
    horaEvento: '',
    modelo: 'presencial',
    localidade: {
      cidade: '',
      estado: '',
      bairro: '',
      rua: '',
      cep: '',
      numero: '',
      complemento: ''
    },
    linkEvento: '',
    descricao: '',
    fotoDivulgacao: ''
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const fotosPreSelecionadas = [
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3b50659a-3720-4969-b5dd-193a9270e31f.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/91a541f3-5c3f-41a2-84e6-103dbfa4af98.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9c5227f4-0304-4395-a035-d1b4e9a0e051.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e5f6a58d-829d-422b-9c5e-d2bd6bcc2c63.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3d251e24-4801-4944-ae89-05eb49be0897.png'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith('localidade.')) {
      const field = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        localidade: {
          ...prev.localidade,
          [field]: value
        }
      }))
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const buscarEnderecoPorCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            localidade: {
              ...prev.localidade,
              cidade: data.localidade || '',
              estado: data.uf || '',
              bairro: data.bairro || '',
              rua: data.logradouro || ''
            }
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  useEffect(() => {
    if (form.localidade.cep.length === 8) {
      const timer = setTimeout(() => {
        buscarEnderecoPorCEP(form.localidade.cep)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [form.localidade.cep])

  const validateForm = () => {
    const newErrors = {}

    if (!form.nomeEmpresa) newErrors.nomeEmpresa = 'Nome da empresa é obrigatório'
    if (!form.nomeEvento) newErrors.nomeEvento = 'Nome do evento é obrigatório'
    if (!form.dataEvento) newErrors.dataEvento = 'Data do evento é obrigatória'
    if (!form.horaEvento) newErrors.horaEvento = 'Hora do evento é obrigatória'
    if (!form.descricao) newErrors.descricao = 'Descrição é obrigatória'
    if (!form.fotoDivulgacao) newErrors.fotoDivulgacao = 'Foto de divulgação é obrigatória'

    if (form.modelo === 'presencial') {
      if (!form.localidade.cep) newErrors['localidade.cep'] = 'CEP é obrigatório'
      if (!form.localidade.numero) newErrors['localidade.numero'] = 'Número é obrigatório'
    } else if (form.modelo === 'remoto') {
      if (!form.linkEvento) newErrors.linkEvento = 'Link do evento é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await axios.post('http://localhost:8080/api/eventos', form)
      setSuccess(true)
      setForm({
        nomeEmpresa: '',
        nomeEvento: '',
        dataEvento: '',
        horaEvento: '',
        modelo: 'presencial',
        localidade: {
          cidade: '',
          estado: '',
          bairro: '',
          rua: '',
          cep: '',
          numero: '',
          complemento: ''
        },
        linkEvento: '',
        descricao: '',
        fotoDivulgacao: ''
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao cadastrar evento:', error)
      alert('Erro ao cadastrar evento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="card-title">Cadastro de Evento</h1>
      
      {success && (
        <div style={{
          backgroundColor: '#059669',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          Evento cadastrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2">
          {/* Nome da Empresa */}
          <div className="form-group">
            <label className="form-label">Nome da Empresa *</label>
            <input
              type="text"
              name="nomeEmpresa"
              value={form.nomeEmpresa}
              onChange={handleChange}
              className="form-input"
              placeholder="Digite o nome da empresa"
            />
            {errors.nomeEmpresa && <div className="error">{errors.nomeEmpresa}</div>}
          </div>

          {/* Nome do Evento */}
          <div className="form-group">
            <label className="form-label">Nome do Evento *</label>
            <input
              type="text"
              name="nomeEvento"
              value={form.nomeEvento}
              onChange={handleChange}
              className="form-input"
              placeholder="Digite o nome do evento"
            />
            {errors.nomeEvento && <div className="error">{errors.nomeEvento}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2">
          {/* Data do Evento */}
          <div className="form-group">
            <label className="form-label">Data do Evento *</label>
            <input
              type="date"
              name="dataEvento"
              value={form.dataEvento}
              onChange={handleChange}
              className="form-input"
            />
            {errors.dataEvento && <div className="error">{errors.dataEvento}</div>}
          </div>

          {/* Hora do Evento */}
          <div className="form-group">
            <label className="form-label">Hora do Evento *</label>
            <input
              type="time"
              name="horaEvento"
              value={form.horaEvento}
              onChange={handleChange}
              className="form-input"
            />
            {errors.horaEvento && <div className="error">{errors.horaEvento}</div>}
          </div>
        </div>

        {/* Modelo do Evento */}
        <div className="form-group">
          <label className="form-label">Modelo do Evento *</label>
          <select
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            className="form-select"
          >
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
          </select>
        </div>

        {/* Campos condicionais baseados no modelo */}
        {form.modelo === 'presencial' ? (
          <div className="grid grid-cols-2">
            {/* CEP */}
            <div className="form-group">
              <label className="form-label">CEP *</label>
              <input
                type="text"
                name="localidade.cep"
                value={form.localidade.cep}
                onChange={handleChange}
                className="form-input"
                placeholder="00000-000"
                maxLength="9"
              />
              {errors['localidade.cep'] && <div className="error">{errors['localidade.cep']}</div>}
            </div>

            {/* Número */}
            <div className="form-group">
              <label className="form-label">Número *</label>
              <input
                type="text"
                name="localidade.numero"
                value={form.localidade.numero}
                onChange={handleChange}
                className="form-input"
                placeholder="Número"
              />
              {errors['localidade.numero'] && <div className="error">{errors['localidade.numero']}</div>}
            </div>

            {/* Rua */}
            <div className="form-group">
              <label className="form-label">Rua</label>
              <input
                type="text"
                name="localidade.rua"
                value={form.localidade.rua}
                onChange={handleChange}
                className="form-input"
                placeholder="Rua"
                readOnly
              />
            </div>

            {/* Bairro */}
            <div className="form-group">
              <label className="form-label">Bairro</label>
              <input
                type="text"
                name="localidade.bairro"
                value={form.localidade.bairro}
                onChange={handleChange}
                className="form-input"
                placeholder="Bairro"
                readOnly
              />
            </div>

            {/* Cidade */}
            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                name="localidade.cidade"
                value={form.localidade.cidade}
                onChange={handleChange}
                className="form-input"
                placeholder="Cidade"
                readOnly
              />
            </div>

            {/* Estado */}
            <div className="form-group">
              <label className="form-label">Estado</label>
              <input
                type="text"
                name="localidade.estado"
                value={form.localidade.estado}
                onChange={handleChange}
                className="form-input"
                placeholder="Estado"
                readOnly
              />
            </div>

            {/* Complemento */}
            <div className="form-group">
              <label className="form-label">Complemento</label>
              <input
                type="text"
                name="localidade.complemento"
                value={form.localidade.complemento}
                onChange={handleChange}
                className="form-input"
                placeholder="Complemento"
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Link do Evento *</label>
            <input
              type="url"
              name="linkEvento"
              value={form.linkEvento}
              onChange={handleChange}
              className="form-input"
              placeholder="https://exemplo.com/evento"
            />
            {errors.linkEvento && <div className="error">{errors.linkEvento}</div>}
          </div>
        )}

        {/* Descrição */}
        <div className="form-group">
          <label className="form-label">Descrição do Evento *</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Descreva o evento..."
          />
          {errors.descricao && <div className="error">{errors.descricao}</div>}
        </div>

        {/* Foto de Divulgação */}
        <div className="form-group">
          <label className="form-label">Foto de Divulgação *</label>
          <select
            name="fotoDivulgacao"
            value={form.fotoDivulgacao}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione uma foto</option>
            {fotosPreSelecionadas.map((foto, index) => (
              <option key={index} value={foto}>
                Imagem {index + 1}
              </option>
            ))}
          </select>
          {errors.fotoDivulgacao && <div className="error">{errors.fotoDivulgacao}</div>}
          
          {form.fotoDivulgacao && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={form.fotoDivulgacao} 
                alt="Preview da foto selecionada" 
                style={{ 
                  width: '100%', 
                  maxWidth: '300px', 
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb'
                }}
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Evento'}
        </button>
      </form>
    </div>
  )
}

export default CadastroEvento