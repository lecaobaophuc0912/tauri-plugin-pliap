import React, { useState } from 'react';
import './App.css';

function App() {
    const [quantity, setQuantity] = useState(1);

    const product = {
        name: "iPhone 15 Pro Max",
        price: 11990000,
        originalPrice: 12990000,
        discount: 8,
        description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.7 inch Super Retina XDR OLED, và thiết kế titanium cao cấp.",
        features: [
            "Chip A17 Pro 6 nhân",
            "Camera 48MP + 12MP + 12MP",
            "Màn hình 6.7 inch OLED",
            "Pin 4441mAh",
            "iOS 17"
        ],
        images: [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
        ],
        rating: 4.8,
        reviews: 1247,
        inStock: true
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleBuy = () => {
        alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    };

    return (
        <div className="app">
            <div className="product-container">
                {/* Header */}
                <div className="header">
                    <button className="back-btn">←</button>
                    <h1>Sản phẩm</h1>
                    <button className="share-btn">⋮</button>
                </div>

                {/* Product Images */}
                <div className="image-gallery">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="main-image"
                    />
                    <div className="image-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="product-header">
                        <h2 className="product-name">{product.name}</h2>
                        <div className="rating">
                            <span className="stars">★★★★★</span>
                            <span className="rating-text">{product.rating} ({product.reviews} đánh giá)</span>
                        </div>
                    </div>

                    <div className="price-section">
                        <div className="current-price">{formatPrice(product.price)}</div>
                        <div className="original-price">{formatPrice(product.originalPrice)}</div>
                        <div className="discount-badge">-{product.discount}%</div>
                    </div>

                    <div className="stock-status">
                        {product.inStock ? (
                            <span className="in-stock">✓ Còn hàng</span>
                        ) : (
                            <span className="out-of-stock">✗ Hết hàng</span>
                        )}
                    </div>

                    <div className="description">
                        <h3>Mô tả sản phẩm</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="features">
                        <h3>Tính năng nổi bật</h3>
                        <ul>
                            {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="quantity-section">
                    <h3>Số lượng</h3>
                    <div className="quantity-controls">
                        <button
                            className="qty-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            -
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bottom-bar">
                    <div className="total-price">
                        <span>Tổng cộng:</span>
                        <span className="total-amount">{formatPrice(product.price * quantity)}</span>
                    </div>
                    <button
                        className="buy-btn"
                        onClick={handleBuy}
                        disabled={!product.inStock}
                    >
                        {product.inStock ? 'Mua ngay' : 'Hết hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App; 