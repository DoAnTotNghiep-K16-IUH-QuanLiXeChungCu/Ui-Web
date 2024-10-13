import React from "react";
import image from "../assets/image.png";
import rfidImage from "../assets/rfid.png"; // Hình ảnh thẻ RFID, hãy thêm vào assets
import rfidCardImage from "../assets/rfid_card.png";
const Home = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-auto mt-5">
        <img
          src={image}
          alt="ảnh chính"
          className="w-auto h-auto mb-4" // Giữ nguyên các lớp của bạn
        />
      </div>
      <div className="h-10"></div>
      {/* Hero Section */}
      <section className="bg-[#eb9334] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Giải Pháp Quản Lý Bãi Đỗ Xe Thông Minh
          </h1>
          <p className="text-lg mb-8">
            Chúng tôi cung cấp các giải pháp tối ưu cho việc quản lý bãi đỗ xe.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">Dịch Vụ Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Quản Lý Xe Ra Vào</h3>
              <p>Hệ thống giúp theo dõi và quản lý lịch sử ra vào của xe.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Kiểm Soát Bãi Đỗ Xe
              </h3>
              <p>
                Giúp bạn dễ dàng theo dõi tình trạng bãi đỗ xe và quản lý khách
                hàng.
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Thống Kê Thông Minh
              </h3>
              <p>Cung cấp thống kê chi tiết và báo cáo theo thời gian thực.</p>
            </div>
          </div>
        </div>
      </section>
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
      <section className="bg-[#eb9334] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Giới thiệu về thẻ RFID</h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Thẻ RFID là gì?
        </h1>
        <div className="flex justify-center items-center h-auto">
          <img
            src={rfidCardImage}
            alt="Thẻ RFID"
            className="w-[700px] h-auto mb-4 rounded-lg" // Giữ nguyên các lớp của bạn
          />
        </div>
        <p className="mb-4 text-lg">
          Thẻ RFID (Radio-Frequency Identification) là một công nghệ nhận dạng
          tự động sử dụng sóng vô tuyến để đọc và ghi dữ liệu từ thẻ. Thẻ RFID
          có thể được gắn vào các đối tượng khác nhau như thẻ tín dụng, thẻ kiểm
          soát ra vào, và nhiều ứng dụng khác trong cuộc sống hàng ngày.
        </p>

        <div className="flex justify-center items-center h-auto">
          {" "}
          <img
            src={rfidImage}
            alt="Thẻ RFID"
            className="w-[700px] h-auto mb-4 rounded-lg" // Giữ nguyên các lớp của bạn
          />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Cách thức hoạt động của thẻ RFID
        </h2>
        <p className="mb-4 text-lg">Thẻ RFID bao gồm ba thành phần chính:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <strong>Chip RFID:</strong> Lưu trữ thông tin và nhận tín hiệu từ
            đầu đọc.
          </li>
          <li>
            <strong>Ăng-ten:</strong> Giúp giao tiếp với đầu đọc RFID thông qua
            sóng vô tuyến.
          </li>
          <li>
            <strong>Đầu đọc RFID:</strong> Thiết bị gửi tín hiệu vô tuyến đến
            thẻ và nhận dữ liệu từ thẻ.
          </li>
        </ul>

        <p className="mb-4 text-lg">
          Khi thẻ RFID được đặt gần đầu đọc RFID, đầu đọc sẽ phát ra sóng vô
          tuyến. Thẻ RFID nhận được sóng và phản hồi lại bằng cách truyền dữ
          liệu được lưu trữ trong chip đến đầu đọc. Dữ liệu này sau đó có thể
          được sử dụng cho nhiều mục đích khác nhau, như quản lý tồn kho, kiểm
          soát ra vào, và theo dõi tài sản.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Các loại thẻ RFID</h2>
        <p className="mb-4 text-lg">
          Có 3 loại thẻ RFID chính đó là: <strong>thẻ RFID thụ động</strong>,{" "}
          <strong>thẻ RFID bán chủ động</strong> và{" "}
          <strong>thẻ RFID chủ động</strong>.
        </p>

        <h3 className="text-lg font-semibold mb-2">1. Thẻ RFID thụ động</h3>
        <p className="mb-4 text-lg">
          Thẻ RFID thụ động được cung cấp bởi một đầu đọc RFID cố định hoặc di
          động phát ra trường điện từ. Ăng-ten của thẻ thu năng lượng từ trường
          này để phát tín hiệu đến đầu đọc. Tần suất của trình đọc phải phù hợp
          với tần suất của thẻ. Đối với các thẻ thụ động, có các tần số thấp,
          cao và siêu cao được tiêu chuẩn hóa (LF, HF, UHF).
        </p>

        <h3 className="text-lg font-semibold mb-2">2. Thẻ RFID bán chủ động</h3>
        <p className="mb-4 text-lg">
          Thẻ RFID bán chủ động có nét tương đồng với thẻ thụ động, nhưng nó có
          thêm một pin nhỏ. Pin này cho phép IC của thẻ được cấp nguồn liên tục,
          giúp nó tối giản thiết kế của anten trong việc thu năng lượng từ tín
          hiệu quay lại. Các thẻ bán tự động không chủ động truyền tín hiệu về
          đầu đọc, mà nằm im nhằm bảo tồn năng lượng cho tới khi nó nhận được
          tín hiệu vô tuyến từ đầu đọc sẽ kích hoạt hệ thống. Thẻ RFID bán chủ
          động phản ứng nhanh hơn trong việc phản hồi vì vậy nó mạnh hơn trong
          việc đọc và truyền tín hiệu so với thẻ RFID thụ động.
        </p>

        <h3 className="text-lg font-semibold mb-2">3. Thẻ RFID chủ động</h3>
        <p className="mb-4 text-lg">
          Thẻ RFID chủ động là loại thẻ RFID mà bản thân nó tự tạo ra nguồn năng
          lượng riêng để truyền tín hiệu. Khả năng này sẽ làm cho khoảng cách
          đọc và bộ nhớ của nó lớn hơn so với thẻ RFID thụ động. Tuy nhiên, để
          đạt được khoảng cách đọc và tối ưu bộ nhớ thẻ chủ động cần một nguồn
          điện. (thẻ RFID chủ động được trang bị pin có tuổi thọ cao hoạt động
          được trong vài năm).
        </p>
        <h2 className="text-2xl font-semibold mb-2">Lợi ích của thẻ RFID</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Dễ dàng và nhanh chóng trong việc xác định và theo dõi đối tượng.
          </li>
          <li>Giảm thiểu sai sót do nhập liệu thủ công.</li>
          <li>Tăng cường bảo mật cho các hệ thống kiểm soát ra vào.</li>
          <li>
            Tiết kiệm thời gian và chi phí trong quá trình quản lý và kiểm tra.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
