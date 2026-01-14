import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';
import './ManageLayout.css';
import type { Product } from '../../types';
import GiftModal from './GiftModal';

type FilterType = 'all' | 'available' | 'sold';

const ManageGifts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = useCallback(async (filter: FilterType) => {
    setLoading(true);
    setError(null);

    let url = '/Gift/products';
    const params = new URLSearchParams();
    if (filter === 'available') {
      params.append('OnlyAvailable', 'true');
    } else if (filter === 'sold') {
      params.append('OnlySold', 'true');
    }

    const fullUrl = `${url}?${params.toString()}`;

    try {
      const response = await api.get(fullUrl);
      setProducts(response.data.data);
    } catch (err) {
      setError('Não foi possível carregar os produtos.');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeFilter);
  }, [activeFilter, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);


  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'isSold'>, id?: string) => {
    try {
      if (id) {
        await api.put(`/Gift/products/${id}`, productData);
      } else {
        await api.post('/Gift/products', productData);
      }
      setIsModalOpen(false);
      fetchProducts(activeFilter);
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert('Não foi possível salvar o presente. Tente novamente.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este presente?')) {
      try {
        await api.delete(`/Gift/products/${id}`);
        fetchProducts(activeFilter);
      } catch (err) {
        console.error('Erro ao remover produto:', err);
        alert('Não foi possível remover o presente. Tente novamente.');
      }
    }
  };

  const handleMarkAsSold = async (id: string) => {
    if (window.confirm('Deseja marcar este presente como comprado manualmente?')) {
      try {
        await api.put(`/Gift/products/${id}/mark-as-sold`);
        fetchProducts(activeFilter);
      } catch (err) {
        console.error('Erro ao marcar como comprado:', err);
        alert('Não foi possível marcar o presente como comprado. Tente novamente.');
      }
    }
  };

  return (
    <>
      <div className="main-content-header">
        <h1>Gerenciar Presentes</h1>
        <button className="button primary" onClick={handleOpenCreateModal}>
          <i className="fas fa-plus"></i>
          Adicionar Presente
        </button>
      </div>

      <div className="filters-and-search">
        <div className="filters">
            <button
            className={`button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}>
            Todos
            </button>
            <button
            className={`button ${activeFilter === 'available' ? 'active' : ''}`}
            onClick={() => handleFilterClick('available')}>
            Disponíveis
            </button>
            <button
            className={`button ${activeFilter === 'sold' ? 'active' : ''}`}
            onClick={() => handleFilterClick('sold')}>
            Comprados
            </button>
        </div>
        <div className="search-container">
            <input
                type="text"
                placeholder="Buscar por presente..."
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="table-container">
        {loading && <p>Carregando presentes...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td data-label="Foto"><img src={product.photo} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                    <td data-label="Nome">{product.name}</td>
                    <td data-label="Valor">{formatCurrency(product.value)}</td>
                    <td data-label="Status">
                      {product.isSold ? (
                        <span className="status responded">Comprado</span>
                      ) : (
                        <span className="status pending">Disponível</span>
                      )}
                    </td>
                    <td data-label="Ações">
                      <div className="actions">
                        {!product.isSold && (
                          <button className="action-button sold" title="Marcar como Comprado" onClick={() => handleMarkAsSold(product.id)}>
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button className="action-button edit" title="Editar" onClick={() => handleOpenEditModal(product)} >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button className="action-button delete" title="Remover" onClick={() => handleDeleteProduct(product.id)} >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhum presente encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <GiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </>
  );
};

export default ManageGifts;