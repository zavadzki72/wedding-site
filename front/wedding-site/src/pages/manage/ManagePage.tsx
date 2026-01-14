import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';

import './ManageLayout.css';
import type { Invite, GuestResponse } from '../../types';
import QrCodeModal from './QrCodeModal';
import InviteModal from '../../components/manage/InviteModal';

type FilterType = 'all' | 'pending' | 'responded';

const ManagePage: React.FC = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [guestResponses, setGuestResponses] = useState<GuestResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openInviteId, setOpenInviteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchInvitesAndGuests = useCallback(async (filter: FilterType) => {
    setLoading(true);
    setError(null);

    const endpointMap = {
      all: '/Guest/invite/get-all',
      pending: '/Guest/invite/get-pending',
      responded: '/Guest/invite/get-responded',
    };

    try {
      const [invitesResponse, guestsResponse] = await Promise.all([
        api.get(endpointMap[filter]),
        api.get('/Guest')
      ]);

      const invitesWithId = invitesResponse.data.data.map((invite: any) => {
        const urlParts = invite.inviteUrl.split('/');
        const id = urlParts[urlParts.length - 1];

        return {
          ...invite,
          id: id,
        };
      });

      setInvites(invitesWithId);
      setGuestResponses(guestsResponse.data.data);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitesAndGuests(activeFilter);
  }, [activeFilter, fetchInvitesAndGuests]);
  
  const filteredInvites = useMemo(() => {
    if (!searchTerm) {
      return invites;
    }
    return invites.filter(invite =>
      invite.familyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, invites]);

  const stats = useMemo(() => {
    const totalGuests = invites.reduce((acc, invite) => acc + invite.persons.length, 0);
    const acceptedGuests = guestResponses.flatMap(g => g.persons).filter(p => p.isAccepted).length;
    const refusedGuests = guestResponses.flatMap(g => g.persons).filter(p => !p.isAccepted).length;
    const pendingGuests = totalGuests - acceptedGuests - refusedGuests;

    return {
      families: invites.length,
      totalGuests,
      acceptedGuests,
      refusedGuests,
      pendingGuests
    };
  }, [invites, guestResponses]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleOpenCreateModal = () => {
    setEditingInvite(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (invite: Invite) => {
    setEditingInvite(invite);
    setIsModalOpen(true);
  };

  const handleSaveInvite = async (inviteData: { familyName: string; celNumber: string; names: string[]; isSent: boolean }, id?: string) => {
    try {
      if (id) {
        await api.put(`/Manager/update-invite/${id}`, inviteData);
      } else {
        await api.post('/Manager/generate-invite', inviteData);
      }
      setIsModalOpen(false);
      fetchInvitesAndGuests(activeFilter);
    } catch (err) {
      console.error('Erro ao salvar convite:', err);
    }
  };

  const handleResetReply = async (id: string) => {
    if (window.confirm('Tem certeza que deseja resetar a resposta deste convite?')) {
      try {
        await api.put(`/Manager/reset-reply-invite/${id}`);
        fetchInvitesAndGuests(activeFilter);
      } catch (err) {
        console.error('Erro ao resetar resposta:', err);
      }
    }
  };

  const handleDeleteInvite = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este convite? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/Manager/remove-invite/${id}`);
        fetchInvitesAndGuests(activeFilter);
      } catch (err) {
        console.error('Erro ao remover convite:', err);
        alert('Não foi possível remover o convite. Tente novamente.');
      }
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleOpenQrModal = (invite: Invite) => {
    setSelectedInvite(invite);
    setIsQrModalOpen(true);
  };

  const handleSendWhatsApp = (invite: Invite) => {
    const fullNumber = invite.celNumber.replace(/\D/g, '');
    const message = `Olá, ${invite.familyName}! Ficaríamos honrados com a sua presença em nosso casamento. Para confirmar e ver mais detalhes, acesse o nosso convite online: ${invite.inviteUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleInvite = (id: string) => {
    setOpenInviteId(openInviteId === id ? null : id);
  };

  const handleMarkAsSent = async (id: string) => {
    try {
        await api.post(`/Guest/invite/${id}/sent`);

        setToastMessage('Convite marcado como enviado!');
        setTimeout(() => setToastMessage(null), 3000);

        fetchInvitesAndGuests(activeFilter);
      } catch (err) {
        console.error('Erro ao marcar como enviado:', err);
        alert('Não foi possível marcar o convite como enviado. Tente novamente.');

        setToastMessage('Erro ao marcar como enviado.');
        setTimeout(() => setToastMessage(null), 3000);
      }
  };

  return (
    <>
      <div className="main-content-header">
        <h1>Gerenciar Convites</h1>
        <button className="button primary" onClick={handleOpenCreateModal}>
          <i className="fas fa-plus"></i>
          Criar Convite
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h4>Famílias</h4>
          <p>{stats.families}</p>
        </div>
        <div className="stat-card">
          <h4>Convidados</h4>
          <p>{stats.totalGuests}</p>
        </div>
        <div className="stat-card">
          <h4>Pendentes</h4>
          <p>{stats.pendingGuests}</p>
        </div>
        <div className="stat-card">
          <h4>Aceitos</h4>
          <p>{stats.acceptedGuests}</p>
        </div>
        <div className="stat-card">
          <h4>Recusados</h4>
          <p>{stats.refusedGuests}</p>
        </div>
      </div>

      <div className="filters-and-search">
        <div className="filters">
          <button
            className={`button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}>
            Todos
          </button>
          <button
            className={`button ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterClick('pending')}>
            Pendentes
          </button>
          <button
            className={`button ${activeFilter === 'responded' ? 'active' : ''}`}
            onClick={() => handleFilterClick('responded')}>
            Respondidos
          </button>
        </div>
        <div className="search-container">
            <input
                type="text"
                placeholder="Buscar por família..."
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="table-container">
        {loading && <p>Carregando convites...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Família</th>
                <th>Celular</th>
                <th>Convidados</th>
                <th>Status</th>
                <th>Ja foi enviado?</th>
                <th>Link</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvites.length > 0 ? (
                filteredInvites.map((invite) => (
                  <React.Fragment key={invite.id}>
                    <tr onClick={() => toggleInvite(invite.id)} style={{ cursor: 'pointer' }}>
                      <td data-label="Família">{invite.familyName}</td>
                      <td data-label="Celular">{invite.celNumber}</td>
                      <td data-label="Convidados">{invite.persons.length}</td>
                      <td data-label="Status">
                        {invite.isResponded ? (
                          <span className="status responded">Respondido</span>
                        ) : (
                          <span className="status pending">Pendente</span>
                        )}
                      </td>
                      <td data-label="Ja foi enviado?">
                        {invite.isSent ? (
                          <span className="status sent">Enviado</span>
                        ) : (
                          <span className="status pending-send">Pendente</span>
                        )}
                      </td>
                      <td data-label="Link">
                        <button className="button copy-link-btn" onClick={(e) => { e.stopPropagation(); handleCopyLink(invite.inviteUrl); }}>
                          {copiedUrl === invite.inviteUrl ? (
                            <>
                              <i className="fas fa-check"></i>
                              Copiado!
                            </>
                          ) : (
                            <>
                              <i className="fas fa-copy"></i>
                              Copiar Link
                            </>
                          )}
                        </button>
                      </td>
                      <td data-label="Ações">
                        <div className="actions" onClick={(e) => e.stopPropagation()}>
                          <button className="action-button whatsapp" title="Enviar via WhatsApp" onClick={() => handleSendWhatsApp(invite)}>
                            <i className="fab fa-whatsapp"></i>
                          </button>
                          {invite.isSent ? (
                            <span className="action-icon sent" title="Convite já enviado">
                              <i className="fas fa-check-circle"></i>
                            </span>
                          ) : (
                            <button className="action-button send" title="Marcar como Enviado" onClick={() => handleMarkAsSent(invite.id)}>
                              <i className="fas fa-check-circle"></i>
                            </button>
                          )}
                          <button className="action-button qr" title="Gerar QR Code" onClick={() => handleOpenQrModal(invite)}>
                            <i className="fas fa-qrcode"></i>
                          </button>
                          <button className="action-button edit" title="Editar" onClick={() => handleOpenEditModal(invite)}>
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button className="action-button reset" title="Resetar Resposta" onClick={() => handleResetReply(invite.id)}>
                            <i className="fas fa-undo"></i>
                          </button>
                          <button className="action-button delete" title="Remover Convite" onClick={() => handleDeleteInvite(invite.id)}>
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {openInviteId === invite.id && (
                      <tr className="guest-list-row">
                        <td colSpan={7}>
                          <div className="guest-list">
                            <strong>Convidados:</strong>
                            <ul>
                              {invite.persons.map((person, index) => (
                                <li key={index}>{person}</li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Nenhum convite encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvite}
        inviteToEdit={editingInvite}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={selectedInvite?.inviteUrl || null}
        familyName={selectedInvite?.familyName || null}
      />

      {toastMessage && (
        <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default ManagePage;