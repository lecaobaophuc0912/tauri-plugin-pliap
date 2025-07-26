import React, { useState } from 'react';
import './Profile.css';

function Profile() {
    const [activeTab, setActiveTab] = useState('profile');

    const user = {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        memberSince: '2023',
        totalOrders: 15,
        totalSpent: 45000000
    };

    const orders = [
        {
            id: 'ORD001',
            date: '2024-01-15',
            status: 'delivered',
            total: 11990000,
            items: ['iPhone 15 Pro Max']
        },
        {
            id: 'ORD002',
            date: '2024-01-10',
            status: 'shipping',
            total: 5990000,
            items: ['AirPods Pro']
        },
        {
            id: 'ORD003',
            date: '2024-01-05',
            status: 'processing',
            total: 8990000,
            items: ['Apple Watch Series 9']
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'delivered': return 'Đã giao';
            case 'shipping': return 'Đang giao';
            case 'processing': return 'Đang xử lý';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return '#27ae60';
            case 'shipping': return '#f39c12';
            case 'processing': return '#3498db';
            default: return '#666';
        }
    };

    return (
        <div className="profile">
            {/* Header */}
            <div className="profile-header">
                <h1>Tài khoản</h1>
            </div>

            {/* User Info Card */}
            <div className="user-card">
                <div className="user-avatar">
                    <img src={user.avatar} alt={user.name} />
                    <button className="edit-avatar-btn">📷</button>
                </div>
                <div className="user-info">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                </div>
                <div className="user-stats">
                    <div className="stat">
                        <span className="stat-number">{user.totalOrders}</span>
                        <span className="stat-label">Đơn hàng</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{formatPrice(user.totalSpent)}</span>
                        <span className="stat-label">Đã chi</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Thông tin cá nhân
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Đơn hàng
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Cài đặt
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'profile' && (
                    <div className="profile-tab">
                        <div className="form-section">
                            <h3>Thông tin cá nhân</h3>
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" defaultValue={user.name} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" defaultValue={user.email} />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="tel" defaultValue={user.phone} />
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <input type="date" defaultValue="1990-01-01" />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <textarea defaultValue="123 Đường ABC, Quận 1, TP.HCM"></textarea>
                            </div>
                            <button className="save-btn">Lưu thay đổi</button>
                        </div>

                        <div className="form-section">
                            <h3>Đổi mật khẩu</h3>
                            <div className="form-group">
                                <label>Mật khẩu hiện tại</label>
                                <input type="password" placeholder="Nhập mật khẩu hiện tại" />
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu mới</label>
                                <input type="password" placeholder="Nhập mật khẩu mới" />
                            </div>
                            <div className="form-group">
                                <label>Xác nhận mật khẩu mới</label>
                                <input type="password" placeholder="Nhập lại mật khẩu mới" />
                            </div>
                            <button className="save-btn">Đổi mật khẩu</button>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="orders-tab">
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h4>Đơn hàng #{order.id}</h4>
                                            <p className="order-date">{order.date}</p>
                                        </div>
                                        <div className="order-status">
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(order.status) }}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        {order.items.map((item, index) => (
                                            <p key={index} className="order-item-name">{item}</p>
                                        ))}
                                    </div>
                                    <div className="order-footer">
                                        <span className="order-total">{formatPrice(order.total)}</span>
                                        <button className="order-detail-btn">Chi tiết</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-tab">
                        <div className="settings-section">
                            <h3>Thông báo</h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Thông báo đơn hàng</span>
                                    <p>Nhận thông báo khi đơn hàng có cập nhật</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Khuyến mãi</span>
                                    <p>Nhận thông báo về các chương trình khuyến mãi</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Sản phẩm mới</span>
                                    <p>Thông báo khi có sản phẩm mới</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3>Bảo mật</h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Xác thực 2 yếu tố</span>
                                    <p>Bảo vệ tài khoản bằng mã xác thực</p>
                                </div>
                                <button className="enable-btn">Bật</button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Đăng nhập từ thiết bị mới</span>
                                    <p>Yêu cầu xác thực khi đăng nhập từ thiết bị mới</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3>Tài khoản</h3>
                            <button className="danger-btn">Xóa tài khoản</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile; 