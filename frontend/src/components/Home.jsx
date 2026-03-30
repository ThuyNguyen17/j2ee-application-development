import React from "react";
import { useNavigate } from "react-router-dom";
import { LoremIpsum } from "lorem-ipsum";
import { GraduationCap, BookOpen, Users, Calendar, Award, ArrowRight } from "lucide-react";
import "./Home.css";
import bg from "../assets/bg.png";

const lorem = new LoremIpsum();

const Home = () => {
    const navigate = useNavigate();
    const loremText = lorem.generateParagraphs(1);

    const handleLoginClick = () => {
        navigate('/student/login');
    };

    const features = [
        {
            icon: GraduationCap,
            title: "Quản lý Học sinh",
            description: "Theo dõi thông tin, điểm số và lịch học của học sinh"
        },
        {
            icon: BookOpen,
            title: "Quản lý Lớp học",
            description: "Tổ chức và quản lý các lớp học hiệu quả"
        },
        {
            icon: Users,
            title: "Điểm danh Thông minh",
            description: "Hệ thống điểm danh tự động bằng mã QR"
        },
        {
            icon: Calendar,
            title: "Lịch trình & Thi cử",
            description: "Quản lý lịch học và lịch thi một cách khoa học"
        },
        {
            icon: Award,
            title: "Báo cáo Hiệu suất",
            description: "Phân tích và báo cáo kết quả học tập chi tiết"
        }
    ];

    return (
        <div className="home-container">
            {/* Navigation */}
            <nav className="home-navbar">
                <div className="navbar-brand">
                    <GraduationCap size={32} className="brand-icon" />
                    <span className="brand-text">S-Attendance</span>
                </div>
                <div className="navbar-links">
                    <a href="#features" className="nav-link">Tính năng</a>
                    <a href="#about" className="nav-link">Về chúng tôi</a>
                    <a href="#contact" className="nav-link">Liên hệ</a>
                </div>
                <div className="navbar-actions">
                    <button onClick={handleLoginClick} className="btn btn-primary">
                        Đăng nhập
                        <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Hệ thống Quản lý
                            <span className="text-primary"> Trường học</span>
                        </h1>
                        <p className="hero-description">
                            {loremText}
                        </p>
                        <div className="hero-actions">
                            <button onClick={handleLoginClick} className="btn btn-primary btn-large">
                                Bắt đầu ngay
                                <ArrowRight size={18} />
                            </button>
                            <button className="btn btn-secondary btn-large">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={bg} alt="School Management System" className="hero-img" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Tính năng Nổi bật</h2>
                        <p className="section-description">
                            Giải pháp toàn diện cho việc quản lý giáo dục hiện đại
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">10,000+</div>
                            <div className="stat-label">Học sinh</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Giáo viên</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100+</div>
                            <div className="stat-label">Trường học</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">99.9%</div>
                            <div className="stat-label">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Về chúng tôi</h2>
                        <p className="section-description">
                            S-Attendance là giải pháp quản lý trường học hàng đầu
                        </p>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <p>
                                Với nhiều năm kinh nghiệm trong lĩnh vực giáo dục, chúng tôi cam kết mang đến 
                                những giải pháp công nghệ tiên tiến giúp tối ưu hóa việc quản lý trường học, 
                                nâng cao chất lượng giáo dục và tạo ra môi trường học tập hiệu quả.
                            </p>
                            <p>
                                S-Attendance được phát triển bởi đội ngũ chuyên gia giàu kinh nghiệm, 
                                luôn lắng nghe và đáp ứng nhu cầu của các trường học hiện đại.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Liên hệ</h2>
                        <p className="section-description">
                            Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ
                        </p>
                    </div>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-item">
                                <h4>Địa chỉ</h4>
                                <p>123 Đường Giáo dục, Quận 1, TP.HCM</p>
                            </div>
                            <div className="contact-item">
                                <h4>Email</h4>
                                <p>info@s-attendance.edu.vn</p>
                            </div>
                            <div className="contact-item">
                                <h4>Điện thoại</h4>
                                <p>(028) 1234 5678</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="brand">
                                <GraduationCap size={24} />
                                <span>S-Attendance</span>
                            </div>
                            <p>Hệ thống quản lý trường học thông minh</p>
                        </div>
                        <div className="footer-links">
                            <div className="link-group">
                                <h4>Sản phẩm</h4>
                                <a href="#">Tính năng</a>
                                <a href="#">Bảng giá</a>
                                <a href="#">Demo</a>
                            </div>
                            <div className="link-group">
                                <h4>Hỗ trợ</h4>
                                <a href="#">Tài liệu</a>
                                <a href="#">Hướng dẫn</a>
                                <a href="#">Liên hệ</a>
                            </div>
                            <div className="link-group">
                                <h4>Pháp lý</h4>
                                <a href="#">Điều khoản</a>
                                <a href="#">Chính sách</a>
                                <a href="#">Bảo mật</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 S-Attendance. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;