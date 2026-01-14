import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Person } from '../types';
import './GuestReplyPage.css';

interface InviteDetails {
  familyName: string;
  persons: string[];
  isResponded: boolean;
}

const GuestReplyPage: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [responses, setResponses] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cpfMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const dateMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  };

  const isValidBirthDate = (dateStr: string) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    const age = new Date().getFullYear() - year;
    return age >= 0 && age <= 120;
  };

  const fetchInviteDetails = useCallback(async () => {
    try {
      const response = await api.get(`/Guest/invite/${inviteId}`);
      const inviteData = response.data.data;
      if (inviteData.isResponded) {
        setAlreadyResponded(true);
      } else {
        setInvite(inviteData);
        setResponses(inviteData.persons.map((name: string) => ({ name, isAccepted: null, cpf: '', birthDate: '' })));
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError('Convite inválido ou não encontrado.');
      } else {
        setError('Ocorreu um erro ao carregar o convite. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  }, [inviteId]);

  useEffect(() => {
    fetchInviteDetails();
  }, [fetchInviteDetails]);

  const handleResponseChange = (personName: string, field: keyof Person, value: any) => {
    if (validationError) {
      setValidationError(null);
    }
    setResponses(prev =>
      prev.map(p => (p.name === personName ? { ...p, [field]: value } : p))
    );
  };

  const validateCurrentStep = () => {
    const currentResponse = responses[currentStep];
    if (currentResponse.isAccepted === null) {
      setValidationError('Por favor, selecione uma das opções para continuar.');
      return false;
    }
    if (currentResponse.isAccepted === true) {
      if (!isValidCPF(currentResponse.cpf)) {
        setValidationError('O CPF informado não é válido.');
        return false;
      }
      if (!isValidBirthDate(currentResponse.birthDate)) {
        setValidationError('A data de nascimento informada não é válida.');
        return false;
      }
    }
    return true;
  }
  
  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setValidationError(null);
    if (currentStep < responses.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);

    const allPersonsPayload = responses.map(p => {
        if (p.isAccepted) {
            const [day, month, year] = p.birthDate.split('/');
            const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
            return { name: p.name, isAccepted: true, cpf: p.cpf.replace(/\D/g, ''), birthDate: isoDate };
        } else {
            return { name: p.name, isAccepted: false, cpf: null, birthDate: null };
        }
    });
    const payload = { inviteId, persons: allPersonsPayload };
    try {
      await api.post('/Guest/invite/reply', payload);
      setSubmitted(true);
    } catch (err) {
      setError('Ocorreu um erro ao enviar a sua resposta.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) { return <div className="reply-container"><div className="reply-card"><p>A carregar detalhes do convite...</p></div></div>; }
  
  if (error) {
    return (
      <div className="reply-container">
        <div className="reply-card status-card">
          <img src="/assets/images/logo.png" alt="Monograma E&M" className="status-logo" />
          <h2 className="status-title">Oops!</h2>
          <p className="status-message">{error}</p>
          <Link to="/" className="button status-button">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  if (alreadyResponded) { return <div className="reply-container"><div className="reply-card status-card"><img src="/assets/images/logo.png" alt="Monograma E&M" className="status-logo" /><h2 className="status-title">Resposta Recebida!</h2><p className="status-message">Já recebemos a vossa resposta para o nosso casamento. Obrigado!</p><Link to="/gifts" className="button status-button">Ver a nossa lista de presentes</Link></div></div>; }
  if (submitted) { return <div className="reply-container"><div className="reply-card status-card"><img src="/assets/images/logo.png" alt="Monograma E&M" className="status-logo" /><h2 className="status-title">Obrigado!</h2><p className="status-message">A sua presença foi registada com sucesso. Mal podemos esperar para celebrar consigo!</p><Link to="/gifts" className="button status-button">Ver a nossa lista de presentes</Link></div></div>; }
  if (responses.length === 0) { return <div className="reply-container"><div className="reply-card"><p>Carregando convite...</p></div></div>; }

  const radioStateClass = responses[currentStep].isAccepted === true 
    ? 'is-yes' 
    : responses[currentStep].isAccepted === false 
    ? 'is-no' 
    : '';

  return (
    <div className="reply-container">
      <div className="reply-card">
          <>
            <img src="/assets/images/logo.png" alt="Monograma E&M" className="reply-logo" />
            <h1>Confirmação de Presença</h1>
            <p className="welcome-message"><strong>{invite?.familyName}</strong>!</p>
            <div className="step-indicator">
              {responses.map((person, index) => {
                const response = responses[index];
                const isCompleted = response.isAccepted !== null;
                const isAccepted = response.isAccepted === true;
                const isRefused = response.isAccepted === false;

                const stepClass = `step ${index === currentStep ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isRefused ? 'refused' : ''}`;

                return (
                  <React.Fragment key={index}>
                    <div className={stepClass}>
                      <div className="step-number">
                        {isAccepted && <i className="fas fa-check"></i>}
                        {isRefused && <i className="fas fa-times"></i>}
                        {!isCompleted && index + 1}
                      </div>
                      <div className="step-name">{person.name.split(' ')[0]}</div>
                    </div>
                    {index < responses.length - 1 && <div className="step-line"></div>}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="step-content">
              <h2>{responses[currentStep].name}</h2>
              <p className="instruction-message">Por favor, confirme sua presença.</p>
              <form>
                <div className="person-block">
                  <div className="person-row">
                    <div className={`radio-toggle ${radioStateClass}`}>
                      <span className="radio-toggle-pill"></span>
                      <label>
                        <input type="radio" name={`${responses[currentStep].name}-rsvp`} checked={responses[currentStep].isAccepted === true} onChange={() => handleResponseChange(responses[currentStep].name, 'isAccepted', true)} />
                        <i className="fas fa-check"></i>
                        Sim, irei!
                      </label>
                      <label>
                        <input type="radio" name={`${responses[currentStep].name}-rsvp`} checked={responses[currentStep].isAccepted === false} onChange={() => handleResponseChange(responses[currentStep].name, 'isAccepted', false)} />
                        <i className="fas fa-times"></i>
                        Não poderei ir
                      </label>
                    </div>
                  </div>
                  {responses[currentStep].isAccepted === true && (
                    <div className="person-details">
                      <p className="details-instruction">Preencha as informações abaixo (precisamos delas para que sua entrada seja liberada)</p>
                      <input type="text" placeholder="CPF" value={responses[currentStep].cpf} onChange={(e) => handleResponseChange(responses[currentStep].name, 'cpf', cpfMask(e.target.value))} />
                      <input type="text" placeholder="Data de Nascimento (DD/MM/AAAA)" value={responses[currentStep].birthDate} onChange={(e) => handleResponseChange(responses[currentStep].name, 'birthDate', dateMask(e.target.value))} />
                    </div>
                  )}
                </div>
                <div className="step-navigation">
                  {currentStep > 0 && (
                    <button type="button" onClick={handlePrevious} className="button secondary-reply">Voltar</button>
                  )}
                  <div className="navigation-primary-action">
                    {validationError && <p className="validation-error">{validationError}</p>}
                    {currentStep < responses.length - 1 ? (
                      <button type="button" onClick={handleNext} className="button primary-reply">Próximo</button>
                    ) : (
                      <button type="button" onClick={handleSubmit} className="button primary-reply" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="loader"></span>
                            Enviando...
                          </>
                        ) : (
                          'Confirmar Presença'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </>
      </div>
    </div>
  );
};

export default GuestReplyPage;