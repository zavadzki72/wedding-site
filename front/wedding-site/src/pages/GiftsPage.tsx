import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import GiftFilters from '../components/gifts/GiftFilters';
import GiftCard from '../components/gifts/GiftCard';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import BackToTopButton from '../components/BackToTopButton';
import type { Category, Product } from '../types';

const GiftsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/Gift/products/avaliable');
        setAllProducts(response.data.data);
      } catch (err) {
        setError('Não foi possível carregar a lista de presentes. Tente novamente mais tarde.');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        const categoryAsNumber = selectedCategory === 'all' ? 'all' : Number(selectedCategory);

        if (categoryAsNumber !== 'all' && product.category !== categoryAsNumber) {
          return false;
        }
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [allProducts, searchTerm, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const giftSection = document.getElementById('gift-list-section');
      if (giftSection) {
        giftSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination-container">{pages}</div>;
  };

  const SectionSeparator: React.FC = () => (
    <div className="section_separator">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,5 C20,-5 40,15 60,5 C80,-5 100,5 100,5" stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    </div>
  );

  return (
    <>
      <Header />
      <Banner />
      <main>
        <SectionSeparator />
        <section id="gift-list-section" className="gift-section">
          <div className="gift_title">
            <h2>Lista de Presentes</h2>
            <p>Sua presença é nosso maior presente, mas se desejar nos presentear, aqui estão algumas sugestões com muito carinho.</p>
          </div>
          
          <GiftFilters
            onSearchChange={(search) => { setSearchTerm(search); setCurrentPage(1); }}
            onCategoryChange={(category) => { setSelectedCategory(category); setCurrentPage(1); }}
          />

          {loading && <p style={{ textAlign: 'center' }}>A carregar presentes...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          {!loading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                <div className="gifts-grid">
                  {paginatedProducts.map(product => (
                    <GiftCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center' }}>Nenhum presente encontrado com os filtros selecionados.</p>
              )}
              {renderPagination()}
            </>
          )}
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default GiftsPage;