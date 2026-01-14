import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';
import './ManageLayout.css';
import type { GuestResponse } from '../../types';

type GuestFilterType = 'all' | 'accepted' | 'refused';

const GuestsPage: React.FC = () => {
    const [guestGroups, setGuestGroups] = useState<GuestResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<GuestFilterType>('all');
    const [openFamily, setOpenFamily] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchGuests = useCallback(async (filter: GuestFilterType) => {
        setLoading(true);
        setError(null);

        const endpointMap = {
            all: '/Guest',
            accepted: '/Guest/accepted',
            refused: '/Guest/refused',
        };

        try {
            const response = await api.get(endpointMap[filter]);
            setGuestGroups(response.data.data);
        } catch (err) {
            setError('Não foi possível carregar a lista de convidados.');
            console.error('Erro ao buscar convidados:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGuests(activeFilter);
    }, [activeFilter, fetchGuests]);

    const filteredGuestGroups = useMemo(() => {
        if (!searchTerm) {
            return guestGroups;
        }
        return guestGroups.filter(group => {
            const searchTermLower = searchTerm.toLowerCase();
            const familyNameMatch = group.familyName.toLowerCase().includes(searchTermLower);
            const personNameMatch = group.persons.some(person =>
                person.name.toLowerCase().includes(searchTermLower)
            );
            return familyNameMatch || personNameMatch;
        });
    }, [searchTerm, guestGroups]);

    const handleFilterClick = (filter: GuestFilterType) => {
        setActiveFilter(filter);
    };

    const toggleFamily = (familyName: string) => {
        setOpenFamily(prev => (prev === familyName ? null : familyName));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    return (
        <>
            <div className="main-content-header">
                <h1>Lista de Convidados</h1>
            </div>

            <div className="filters-and-search">
                <div className="filters">
                    <button className={`button ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>Todos</button>
                    <button className={`button ${activeFilter === 'accepted' ? 'active' : ''}`} onClick={() => handleFilterClick('accepted')}>Aceites</button>
                    <button className={`button ${activeFilter === 'refused' ? 'active' : ''}`} onClick={() => handleFilterClick('refused')}>Recusados</button>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar por família ou convidado..."
                        className="search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="accordion">
                {loading && <p>A carregar convidados...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && filteredGuestGroups.map(group => (
                    <div key={group.familyName} className="accordion-item">
                        <button className="accordion-header" onClick={() => toggleFamily(group.familyName)}>
                            <span>{group.familyName}</span>
                            <i className={`fas fa-chevron-down ${openFamily === group.familyName ? 'open' : ''}`}></i>
                        </button>
                        {openFamily === group.familyName && (
                            <div className="accordion-content">
                                {group.persons.map(person => (
                                    <div key={person.name} className="person-detail-row">
                                        <span className="person-name">{person.name}</span>
                                        <div className="person-info">
                                            <span>CPF: {person.cpf || 'N/A'}</span>
                                            <span>Nascimento: {formatDate(person.birthDate)}</span>
                                        </div>
                                        {person.isAccepted ? (
                                            <span className="status responded">Confirmado</span>
                                        ) : (
                                            <span className="status refused">Recusado</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {!loading && filteredGuestGroups.length === 0 && <p>Nenhum convidado encontrado para este filtro ou busca.</p>}
            </div>
        </>
    );
};

export default GuestsPage;