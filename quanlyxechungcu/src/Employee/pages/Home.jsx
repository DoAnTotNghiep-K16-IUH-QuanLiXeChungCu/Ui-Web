import React from "react";
import image from "../../assets/image.png";
import rate1 from "../../assets/rate1.jpg";
import rate2 from "../../assets/rate2.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="flex justify-center items-center h-auto mt-5">
        <img
          src={image}
          alt="ảnh chính"
          className="w-auto h-auto mb-4" // Giữ nguyên các lớp của bạn
        />
      </div>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Tính Năng Nổi Bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quản Lý Thẻ",
                description: "Đăng ký và quản lý thẻ dễ dàng.",
                icon: "📇",
              },
              {
                title: "Nhận Diện Biển Số",
                description: "Công nghệ ANPR hiện đại.",
                icon: "📸",
              },
              {
                title: "Thống Kê Doanh Thu",
                description: "Theo dõi doanh thu chi tiết.",
                icon: "📊",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="min-h-screen max-w-7xl bg-gray-100 p-6 flex flex-col items-center justify-center space-y-6 ml-10">
        <img
          src={rate2}
          alt="ảnh chính"
          className="w-[675px] h-auto rounded-lg shadow-lg"
        />
        <img
          src={rate1}
          alt="ảnh chính"
          className="w-[675px] h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Home;
