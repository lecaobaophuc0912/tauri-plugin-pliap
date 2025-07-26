import React, { useState } from 'react';
import './List.css';

function List() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'phone', name: 'Điện thoại' },
        { id: 'laptop', name: 'Laptop' },
        { id: 'tablet', name: 'Máy tính bảng' },
        { id: 'headphone', name: 'Tai nghe' },
        { id: 'watch', name: 'Đồng hồ' },
        { id: 'accessory', name: 'Phụ kiện' }
    ];

    const sortOptions = [
        { id: 'popular', name: 'Phổ biến' },
        { id: 'price-low', name: 'Giá thấp → cao' },
        { id: 'price-high', name: 'Giá cao → thấp' },
        { id: 'rating', name: 'Đánh giá cao' },
        { id: 'newest', name: 'Mới nhất' }
    ];

    const products = [
        {
            id: 1,
            name: 'iPhone 15 Pro Max',
            category: 'phone',
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
            category: 'laptop',
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
            category: 'headphone',
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
            category: 'tablet',
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
            category: 'watch',
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
            category: 'phone',
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
            category: 'laptop',
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
            category: 'headphone',
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

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return b.id - a.id;
            default:
                return b.reviews - a.reviews; // popular
        }
    });

    return (
        <div className="list">
            {/* Header */}
            <div className="list-header">
                <h1>Danh sách sản phẩm</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button className="search-btn">🔍</button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="category-filters">
                    <h3>Danh mục</h3>
                    <div className="category-buttons">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sort-section">
                    <h3>Sắp xếp</h3>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        {sortOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Info */}
            <div className="results-info">
                <p>Tìm thấy {sortedProducts.length} sản phẩm</p>
            </div>

            {/* Products Grid */}
            <div className="products-container">
                {sortedProducts.map(product => (
                    <div key={product.id} className="product-item">
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
                        <div className="product-details">
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
                                className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            {sortedProducts.length > 0 && (
                <div className="load-more-section">
                    <button className="load-more-btn">Tải thêm sản phẩm</button>
                </div>
            )}

            {/* No Results */}
            {sortedProducts.length === 0 && (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            )}
        </div>
    );
}

export default List; 