import React from 'react';
import './Home.css';
import { createPurchaseSubscription } from '../../../../dist-js/index';

function Home() {
    const products = [
        {
            id: 1,
            name: 'iPhone 15 Pro Max',
            price: 11990000,
            originalPrice: 12990000,
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
            rating: 4.8,
            reviews: 1247,
            inStock: true
        },
        {
            id: 2,
            name: 'MacBook Pro M3',
            price: 45990000,
            originalPrice: 49990000,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
            rating: 4.9,
            reviews: 892,
            inStock: true
        },
        {
            id: 3,
            name: 'AirPods Pro',
            price: 5990000,
            originalPrice: 6990000,
            image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
            rating: 4.7,
            reviews: 2156,
            inStock: true
        },
        {
            id: 4,
            name: 'iPad Air',
            price: 15990000,
            originalPrice: 17990000,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
            rating: 4.6,
            reviews: 743,
            inStock: false
        },
        {
            id: 5,
            name: 'Apple Watch Series 9',
            price: 8990000,
            originalPrice: 9990000,
            image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop',
            rating: 4.5,
            reviews: 567,
            inStock: true
        },
        {
            id: 6,
            name: 'Samsung Galaxy S24',
            price: 18990000,
            originalPrice: 19990000,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
            rating: 4.4,
            reviews: 432,
            inStock: true
        },
        {
            id: 7,
            name: 'Dell XPS 13',
            price: 29990000,
            originalPrice: 32990000,
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
            rating: 4.3,
            reviews: 234,
            inStock: true
        },
        {
            id: 8,
            name: 'Sony WH-1000XM5',
            price: 7990000,
            originalPrice: 8990000,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            rating: 4.8,
            reviews: 1890,
            inStock: true
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleBuyNow = async (product) => {
        console.log('Mua sản phẩm:', product.name + 1);
        // Thêm logic mua hàng ở đây
        try {
            const data = await createPurchaseSubscription('easy');
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="home">
            {/* Header */}
            <div className="home-header">
                <div className="header-content">
                    <h1>Chào mừng!</h1>
                    <p>Khám phá sản phẩm công nghệ mới nhất</p>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                    <button className="search-btn">🔍</button>
                </div>
            </div>

            {/* Products List */}
            <div className="products-section">
                <div className="section-header">
                    <h2>Sản phẩm nổi bật</h2>
                    <div className="filter-buttons">
                        <button className="filter-btn active">Tất cả</button>
                        <button className="filter-btn">Điện thoại</button>
                        <button className="filter-btn">Laptop</button>
                        <button className="filter-btn">Tai nghe</button>
                    </div>
                </div>
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                <img src={product.image} alt={product.name} />
                                {!product.inStock && (
                                    <div className="out-of-stock-overlay">
                                        <span>Hết hàng</span>
                                    </div>
                                )}
                                <div className="discount-badge">
                                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="rating">
                                    <span className="stars">★★★★★</span>
                                    <span className="rating-text">{product.rating} ({product.reviews})</span>
                                </div>
                                <div className="price-section">
                                    <span className="current-price">{formatPrice(product.price)}</span>
                                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                                </div>
                                <div className="stock-status">
                                    {product.inStock ? (
                                        <span className="in-stock">✓ Còn hàng</span>
                                    ) : (
                                        <span className="out-of-stock">✗ Hết hàng</span>
                                    )}
                                </div>
                                <button
                                    className={`buy-now-btn ${!product.inStock ? 'disabled' : ''}`}
                                    onClick={() => handleBuyNow(product)}
                                    disabled={!product.inStock}
                                >
                                    {product.inStock ? 'Mua ngay' : 'Hết hàng'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Promotions */}
            <div className="promotions-section">
                <h2>Khuyến mãi</h2>
                <div className="promotion-card">
                    <div className="promotion-content">
                        <h3>Giảm giá lên đến 50%</h3>
                        <p>Cho tất cả sản phẩm Apple</p>
                        <button className="promotion-btn">Mua ngay</button>
                    </div>
                    <div className="promotion-image">
                        <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop" alt="Promotion" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home; 