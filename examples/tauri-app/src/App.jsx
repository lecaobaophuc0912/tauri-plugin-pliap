import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import List from './components/List';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import { env } from './lib/env';
import { ping } from '../../../dist-js';

function App() {
    const [activeTab, setActiveTab] = useState('home');
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
    useEffect(() => {
        console.log('App mounted', env.TAURI_DEV_HOST);
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleBuy = async () => {
        console.log('ping');
        const result = await ping("Hello from React");
        console.log('result', result);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home />;
            case 'list':
                return <List />;
            case 'product':
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
            case 'profile':
                return <Profile />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="app-wrapper">
            {renderContent()}
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App; 