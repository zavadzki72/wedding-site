import React, { useState, useEffect } from 'react';
import './InviteModal.css';
import type { Invite } from '../../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inviteData: { familyName: string; celNumber: string; names: string[]; isSent: boolean }, id?: string) => void;
  inviteToEdit: Invite | null;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onSave, inviteToEdit }) => {
  const [familyName, setFamilyName] = useState('');
  const [celNumber, setCelNumber] = useState('');
  const [names, setNames] = useState(['']);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (inviteToEdit) {
      setFamilyName(inviteToEdit.familyName);
      setCelNumber(inviteToEdit.celNumber || '');
      setNames(inviteToEdit.persons);
      setIsSent(inviteToEdit.isSent);
    } else {
      setFamilyName('');
      setCelNumber('');
      setNames(['']);
      setIsSent(false);
    }
  }, [inviteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addNameField = () => {
    setNames([...names, '']);
  };

  const removeNameField = (index: number) => {
    if (names.length > 1) {
      setNames(names.filter((_, i) => i !== index));
    }
  };

  const celNumberMask = (value: string) => {
    let maskedValue = value.replace(/[^\d+()-\s]/g, '');

    if (maskedValue.lastIndexOf('+') > 0) {
      maskedValue = '+' + maskedValue.replace(/\+/g, '');
    }
    
    return maskedValue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validNames = names.filter(name => name.trim() !== '');
    if (familyName.trim() && validNames.length > 0) {
      onSave({ familyName, celNumber: celNumber.replace(/\D/g, ''), names: validNames, isSent }, inviteToEdit?.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{inviteToEdit ? 'Editar Convite' : 'Criar Novo Convite'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Família</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Ex: Família Silva"
              required
            />
          </div>
          <div className="form-group">
            <label>Celular (com código do país + DDD)</label>
            <input
              type="tel"
              value={celNumber}
              onChange={(e) => setCelNumber(celNumberMask(e.target.value))}
              placeholder="+55 (41) 99999-9999"
              required
            />
          </div>
          {inviteToEdit && (
            <div className="form-group form-group-checkbox">
              <input
                type="checkbox"
                id="isSentCheckbox"
                checked={isSent}
                onChange={(e) => setIsSent(e.target.checked)}
              />
              <label htmlFor="isSentCheckbox">Convite Enviado</label>
            </div>
          )}
          <div className="form-group">
            <label>Nomes dos Convidados</label>
            {names.map((name, index) => (
              <div key={index} className="name-input-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Convidado ${index + 1}`}
                  required
                />
                <button type="button" onClick={() => removeNameField(index)} className="remove-name-btn">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            <button type="button" onClick={addNameField} className="add-name-btn">
              <i className="fas fa-plus"></i> Adicionar Convidado
            </button>
          </div>
          <div className="modal-actions">
            <button type="button" className="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="button primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;