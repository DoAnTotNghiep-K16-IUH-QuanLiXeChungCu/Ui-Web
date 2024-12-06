import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Về Chúng Tôi
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Chào mừng bạn đến với{" "}
          <span className="font-semibold">[Tên Phần Mềm Quản Lý Xe]</span>, giải
          pháp tối ưu cho quản lý bãi đỗ xe và kiểm soát phương tiện tại chung
          cư, khu dân cư, và các địa điểm công cộng.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Tầm Nhìn</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Chúng tôi hướng đến việc trở thành đối tác công nghệ hàng đầu trong
          lĩnh vực quản lý phương tiện, mang lại sự thuận tiện và hiệu quả cho
          mọi khách hàng.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Sứ Mệnh</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6">
          <li>
            <span className="font-medium">Tăng cường an ninh:</span> Đảm bảo mỗi
            xe ra vào đều được kiểm soát chặt chẽ.
          </li>
          <li>
            <span className="font-medium">Tối ưu hóa quản lý:</span> Giúp bạn dễ
            dàng quản lý thông tin phương tiện, vị trí đỗ xe, và lịch sử ra vào
            chỉ trong vài cú click.
          </li>
          <li>
            <span className="font-medium">Cá nhân hóa trải nghiệm:</span> Phù
            hợp với nhu cầu của từng loại hình bãi xe, từ chung cư đến trung tâm
            thương mại.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Giá Trị Cốt Lõi
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6">
          <li>
            <span className="font-medium">Tin cậy:</span> Dữ liệu của bạn được
            bảo mật tuyệt đối.
          </li>
          <li>
            <span className="font-medium">Tiện lợi:</span> Giao diện trực quan,
            dễ sử dụng ngay cả với người mới bắt đầu.
          </li>
          <li>
            <span className="font-medium">Đồng hành:</span> Luôn sẵn sàng hỗ trợ
            bạn 24/7 trong suốt quá trình sử dụng.
          </li>
        </ul>
        <p className="text-center text-gray-700 text-lg">
          <span className="font-medium">Hãy để [Tên Phần Mềm Quản Lý Xe]</span>{" "}
          trở thành giải pháp đáng tin cậy giúp bạn quản lý bãi đỗ xe dễ dàng
          hơn bao giờ hết!
        </p>
        <div className="text-center mt-6">
          <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700">
            Liên Hệ Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
