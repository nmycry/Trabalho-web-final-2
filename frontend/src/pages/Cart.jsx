/**
 * ============================================
 * ARQUIVO: Cart.jsx
 * DESCRICAO: Pagina do carrinho de compras
 * ============================================
 *
 * Exibe os itens do carrinho e permite:
 * - Visualizar produtos adicionados
 * - Alterar quantidade de itens
 * - Remover itens do carrinho
 * - Adicionar observacoes ao pedido
 * - Finalizar o pedido
 *
 * O carrinho e gerenciado pelo CartContext que
 * sincroniza com o backend automaticamente.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { orderService, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  // ==========================================
  // HOOKS E ESTADOS
  // ==========================================

  // Funcoes e dados do contexto do carrinho
  const { cart, updateItem, removeItem, clearCart, loading } = useCart();

  // Observacoes do pedido (ex: "sem cebola")
  const [notes, setNotes] = useState('');

  // Estado de loading ao finalizar pedido
  const [submitting, setSubmitting] = useState(false);

  // Hook de navegacao
  const navigate = useNavigate();

  // ==========================================
  // HANDLERS
  // ==========================================

  /**
   * Altera quantidade de um item
   *
   * Se nova quantidade < 1, remove o item.
   * Caso contrario, atualiza a quantidade.
   *
   * @param {string} itemId - ID do item no carrinho
   * @param {number} currentQuantity - Quantidade atual
   * @param {number} delta - Variacao (+1 ou -1)
   */
  const handleQuantityChange = async (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;

    if (newQuantity < 1) {
      // Remove item se quantidade chegar a 0
      await removeItem(itemId);
    } else {
      // Atualiza quantidade
      await updateItem(itemId, newQuantity);
    }
  };

  /**
   * Finaliza o pedido
   *
   * 1. Valida se carrinho tem itens
   * 2. Chama API para criar pedido
   * 3. Redireciona para pagina de pedidos
   */
  const handleSubmitOrder = async () => {
    // Valida carrinho
    if (cart.items.length === 0) {
      toast.error('Adicione produtos ao carrinho');
      return;
    }

    try {
      setSubmitting(true);

      // Cria pedido na API (carrinho e limpo automaticamente)
      await orderService.create(notes);

      toast.success('Pedido realizado com sucesso!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar pedido');
    } finally {
      setSubmitting(false);
    }
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
  // RENDERIZACAO
  // ==========================================

  // Mostra loader enquanto carrega carrinho
  if (loading) {
    return (
      <div className="page-loader">
        <span className="loader loader-lg"></span>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Meu Carrinho</h1>

      {cart.items.length === 0 ? (
        /* ==========================================
           ESTADO VAZIO
           Mostra mensagem quando carrinho esta vazio
           ========================================== */
        <div className="cart-empty">
          <ShoppingBag size={64} strokeWidth={1} />
          <h2>Carrinho vazio</h2>
          <p>Adicione produtos do cardapio para comecar</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Ver Cardapio
          </button>
        </div>
      ) : (
        /* ==========================================
           CONTEUDO DO CARRINHO
           Lista de itens + resumo
           ========================================== */
        <div className="cart-content">
          {/* Lista de itens */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                {/* Imagem do produto */}
                <div className="cart-item-image">
                  {item.product.imageUrl ? (
                    <img src={getImageUrl(item.product.imageUrl)} alt={item.product.name} />
                  ) : (
                    <div className="cart-item-placeholder">🍔</div>
                  )}
                </div>

                {/* Informacoes do produto */}
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-price">
                    {formatPrice(item.product.price)}
                  </p>
                  {item.notes && (
                    <p className="cart-item-notes">Obs: {item.notes}</p>
                  )}
                </div>

                {/* Controles de quantidade */}
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    {/* Botao diminuir */}
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity, -1)
                      }
                    >
                      <Minus size={16} />
                    </button>

                    {/* Quantidade atual */}
                    <span className="qty-value">{item.quantity}</span>

                    {/* Botao aumentar */}
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity, 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Botao remover item */}
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Subtotal do item */}
                <div className="cart-item-total">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do pedido (sidebar) */}
          <div className="cart-summary">
            <h2>Resumo do Pedido</h2>

            {/* Subtotal */}
            <div className="summary-row">
              <span>Subtotal ({cart.itemCount} itens)</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            {/* Total */}
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            {/* Campo de observacoes */}
            <div className="order-notes">
              <label>Observacoes do pedido</label>
              <textarea
                placeholder="Ex: Sem cebola, ponto da carne, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Botao finalizar */}
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleSubmitOrder}
              disabled={submitting}
            >
              {submitting ? (
                <span className="loader loader-sm"></span>
              ) : (
                'Finalizar Pedido'
              )}
            </button>

            {/* Botao limpar carrinho */}
            <button
              className="btn btn-ghost btn-full"
              onClick={clearCart}
              disabled={submitting}
            >
              Limpar Carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
