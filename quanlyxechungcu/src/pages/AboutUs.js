import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Giới thiệu về phần mềm quản lý bãi giữ xe
        </h1>

        {/* Nội dung */}
        <p className="mb-4 text-lg">
          Phần mềm quản lý bãi giữ xe của chúng tôi được thiết kế để đáp ứng nhu
          cầu quản lý và theo dõi xe ra vào một cách dễ dàng và hiệu quả. Với
          giao diện thân thiện và tính năng mạnh mẽ, bạn có thể dễ dàng quản lý
          tình trạng bãi đỗ xe của mình.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Tính năng nổi bật</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Quản lý thông tin xe ra vào một cách chi tiết.</li>
          <li>Hỗ trợ nhiều loại phương tiện như ô tô, xe máy.</li>
          <li>Quản lý khách hàng và thông tin liên quan.</li>
          <li>Thống kê và báo cáo hiệu suất bãi giữ xe.</li>
          <li>Giao diện thân thiện và dễ sử dụng.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">Tại sao chọn chúng tôi?</h2>
        <p className="mb-4 text-lg">
          Chúng tôi cam kết cung cấp giải pháp tốt nhất cho khách hàng của mình.
          Với đội ngũ chuyên gia dày dạn kinh nghiệm và sự hỗ trợ khách hàng tận
          tình, bạn có thể hoàn toàn yên tâm khi sử dụng phần mềm của chúng tôi.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Liên hệ với chúng tôi</h2>
        <p className="mb-4 text-lg">
          Nếu bạn có bất kỳ câu hỏi nào hoặc cần thêm thông tin, vui lòng liên
          hệ với chúng tôi qua email:{" "}
          <span className="font-bold">support@vinparking.com</span> hoặc gọi
          điện thoại đến số: <span className="font-bold">+84 123 456 789</span>.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
