/**
 * ============================================
 * ARQUIVO: ProductCard.jsx
 * DESCRICAO: Componente de card de produto
 * ============================================
 *
 * Exibe informacoes de um produto no cardapio.
 * Usado na pagina Home para mostrar o grid de produtos.
 *
 * Funcionalidades:
 * - Imagem do produto com placeholder emoji se nao houver
 * - Badge de categoria
 * - Nome, descricao e preco
 * - Botao de adicionar ao carrinho
 * - Estilo diferente para produtos indisponiveis
 */

import { Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../services/api';
import './ProductCard.css';

// ============================================
// CONFIGURACAO DE PLACEHOLDERS
// ============================================

/**
 * Mapeamento de emojis por categoria
 * Usado quando produto nao tem imagem
 */
const CATEGORY_EMOJIS = {
  Lanches: '🍔',
  Bebidas: '🥤',
  Doces: '🍰',
  Refeicoes: '🍽️',
  default: '🍴',
};

/**
 * Card de exibicao de produto
 *
 * @param {Object} props
 * @param {Object} props.product - Dados do produto
 * @param {string} props.product.id - ID do produto
 * @param {string} props.product.name - Nome do produto
 * @param {string} props.product.description - Descricao
 * @param {number} props.product.price - Preco em reais
 * @param {string} props.product.imageUrl - URL da imagem (opcional)
 * @param {boolean} props.product.isAvailable - Se esta disponivel
 * @param {Object} props.product.category - Categoria do produto
 */
export default function ProductCard({ product }) {
  // ==========================================
  // HOOKS
  // ==========================================

  // Funcao para adicionar item ao carrinho
  const { addItem } = useCart();

  // ==========================================
  // HANDLERS
  // ==========================================

  /**
   * Adiciona produto ao carrinho
   * Chama funcao do CartContext que sincroniza com backend
   */
  const handleAddToCart = () => {
    addItem(product.id);
  };

  // ==========================================
  // HELPERS
  // ==========================================

  /**
   * Formata valor para moeda brasileira
   * @param {number} price - Valor a formatar
   * @returns {string} Valor formatado (ex: "R$ 10,00")
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // ==========================================
  // DADOS DERIVADOS
  // ==========================================

  // Obtem nome da categoria para buscar emoji
  const categoryName = product.category?.name || 'default';

  // Seleciona emoji baseado na categoria ou usa padrao
  const placeholderEmoji = CATEGORY_EMOJIS[categoryName] || CATEGORY_EMOJIS.default;

  // ==========================================
  // RENDERIZACAO
  // ==========================================

  return (
    <article className={`product-card ${!product.isAvailable ? 'unavailable' : ''}`}>
      {/* ==========================================
          IMAGEM DO PRODUTO
          Mostra imagem real ou emoji placeholder
          ========================================== */}
      <div className="product-image">
        {product.imageUrl ? (
          // Imagem real do produto
          <img src={getImageUrl(product.imageUrl)} alt={product.name} loading="lazy" />
        ) : (
          // Placeholder com emoji da categoria
          <div className="product-placeholder">
            <span className="placeholder-emoji">{placeholderEmoji}</span>
          </div>
        )}

        {/* Badge de indisponivel */}
        {!product.isAvailable && (
          <span className="product-badge unavailable">Indisponivel</span>
        )}
      </div>

      {/* ==========================================
          CONTEUDO DO CARD
          Nome, descricao, preco e botao
          ========================================== */}
      <div className="product-content">
        {/* Badge da categoria */}
        {product.category && (
          <span className="product-category">{product.category.name}</span>
        )}

        {/* Nome do produto */}
        <h3 className="product-name">{product.name}</h3>

        {/* Descricao (truncada via CSS) */}
        <p className="product-description">{product.description}</p>

        {/* Rodape: preco e botao */}
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>

          {/* Botao adicionar - desabilitado se indisponivel */}
          <button
            className="product-btn"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
