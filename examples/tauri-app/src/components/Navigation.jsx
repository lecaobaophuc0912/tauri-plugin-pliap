import React from 'react';
import './Navigation.css';

function Navigation({ activeTab, onTabChange }) {
    return (
        <div className="navigation">
            <div className="nav-item" onClick={() => onTabChange('home')}>
                <div className={`nav-icon ${activeTab === 'home' ? 'active' : ''}`}>🏠</div>
                <span className={`nav-label ${activeTab === 'home' ? 'active' : ''}`}>Trang chủ</span>
            </div>
            <div className="nav-item" onClick={() => onTabChange('list')}>
                <div className={`nav-icon ${activeTab === 'list' ? 'active' : ''}`}>📱</div>
                <span className={`nav-label ${activeTab === 'list' ? 'active' : ''}`}>Sản phẩm</span>
            </div>
            <div className="nav-item" onClick={() => onTabChange('product')}>
                <div className={`nav-icon ${activeTab === 'product' ? 'active' : ''}`}>🛒</div>
                <span className={`nav-label ${activeTab === 'product' ? 'active' : ''}`}>Giỏ hàng</span>
            </div>
            <div className="nav-item" onClick={() => onTabChange('profile')}>
                <div className={`nav-icon ${activeTab === 'profile' ? 'active' : ''}`}>👤</div>
                <span className={`nav-label ${activeTab === 'profile' ? 'active' : ''}`}>Tài khoản</span>
            </div>
        </div>
    );
}

export default Navigation; 