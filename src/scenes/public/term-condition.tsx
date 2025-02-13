import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface TermConditionProps extends RouteComponentProps {}

export default class TermCondition extends React.Component<TermConditionProps> {
  constructor(props: TermConditionProps) {
    super(props);
    this.state = {
      img: null,
    };
  }
  async componentDidMount() {}

  render() {
    return (
      <div style={{ height: "100vh", width: "100vw", overflow: "auto" }}>
        <div className="news-d-container container container-new content-rule">
          <h3>CHÍNH SÁCH BẢO MẬT</h3>
          <p>
            Được xây dựng dựa trên nền tảng công nghệ hiện đại, PMH đóng vai trò
            là một nhà cung cấp dịch vụ chuyên nghiệp và đáp ứng nhu cầu giao
            dịch bất động sản cho các bên liên quan. Chính sách bảo mật này sẽ
            trình bày cách chúng tôi sử dụng thông tin cá nhân của bạn, cách
            thức các bạn thông báo cho chúng tôi trong trường hợp bạn muốn hạn
            chế sử dụng thông tin đó và quy trình chúng tôi áp dụng để bảo mật
            thông tin của các bạn. Chúng tôi cam kết rằng những thông tin cá
            nhân của các bạn đều được bảo mật.
          </p>
          <p>
            Chính sách bảo mật có thể thay đổi theo thời gian, nhưng chúng tôi
            cam kết sẽ luôn tuân thủ mọi điều khoản của chính sách bảo mật này
            khi thực hiện việc thu thập thông tin của các bạn. Nếu có bất kì
            thay đổi gì về chính sách bảo mật, chúng tôi sẽ thông báo chi tiết
            trên trang này hoặc gửi thông báo bằng những phương thức thích hợp
            khác đến các bạn trong thời gian sớm nhất.
          </p>
          <h3>THÔNG TIN CHÚNG TÔI THU THẬP</h3>
          <p>
            Chúng tôi thu thập thông tin nhằm cung cấp dịch vụ tốt hơn cho quý
            khách hàng. Các loại thông tin chúng tôi thu thập gồm:
          </p>
          <p>
            THÔNG TIN CÁ NHÂN: Khi các bạn có nhu cầu mua/bán hoặc thuê/cho thuê
            bất động sản trên trang PMH, chúng tôi sẽ yêu cầu bạn cung cấp một
            số thông tin cá nhân như như: tên, số điện thoại liên lạc, địa chỉ
            email …
          </p>
          <p>
            THÔNG TIN 'TỔNG HỢP': là những dữ liệu chúng tôi thu thập được thông
            qua việc sử dụng trang PMH hoặc các dịch vụ của PMH trong trường hợp
            thông tin cá nhân bị gỡ bỏ.
          </p>
          <h3>MỤC ĐÍCH SỬ DỤNG THÔNG TIN</h3>
          <p>
            PMH sẽ sử dụng thông tin cá nhân của bạn chỉ duy nhất với mục đích
            cung cấp thêm cho bạn các thông tin hữu ích liên quan đến bất động
            sản, những báo cáo về tình hình bất động sản mà chúng tôi nghĩ có
            thể bạn sẽ quan tâm.
          </p>
          <p>
            Chúng tôi cũng có thể chuyển các thông tin của bạn tới bộ phận dịch
            vụ khách hàng để nghiên cứu và phân tích với mục đích quản lý và cải
            tiến những dịch vụ chúng tôi cung cấp. Chúng tôi, các nhân viên hoặc
            cộng sự của chúng tôi có thể liên lạc với các bạn qua thư, email,
            hoặc điện thoại để xin ý kiến phản hồi hoặc nhận xét của các bạn về
            dịch vụ của chúng tôi.
          </p>
          <h3>CHÚNG TÔI BẢO MẬT THÔNG TIN CỦA BẠN NHƯ THẾ NÀO ?</h3>
          <p>
            PMH coi việc bảo mật các thông tin cá nhân của khách hàng là một
            nhiệm vụ quạn trọng. Chúng tôi có những quy định nội bộ nghiêm ngặt
            bao gồm việc lưu giữ, truy cập hay thông báo các thông tin của khách
            hàng.
          </p>
          <p>
            PMH không bán, sử dụng thông tin cá nhân của bạn với mục đích thương
            mại đối với các cá nhân hay tổ chức khác. Chúng tôi sẽ không chia sẻ
            bất kì thông tin cá nhân nào mà chúng tôi thu thập được từ các bạn
            với bên thứ 3.
          </p>
          <p>
            Nếu các bạn đồng ý thực hiện giao dịch bán hoặc cho thuê tài sản với
            những cá nhân khác thông qua trang PMH, chúng tôi có thể cung cấp
            thông tin cá nhân của bạn tới bên còn lại để tạo điều kiện cho việc
            mua/bán hoặc thuê/cho thuê diễn ra thuận lợi.
          </p>
          <h3>AN NINH</h3>
          <p>
            PMH đưa ra các giải pháp an ninh hợp lí để bảo vệ thông tin cá nhân
            của khách hàng. Chúng tôi không chịu trách nhiệm cho bất kỳ sự tiết
            lộ trái phép của cá nhân hoặc các thông tin khác gây ra bởi bên thứ
            ba. Thông tin tài khoản của các bạn có thể truy cập trực tuyến thông
            qua sử dụng một mật khẩu. Để giữ bảo mật thông tin cá nhân, các bạn
            cần giữ kín mật khẩu của mình và không tiết lộ mật khẩu cho người
            khác. Hãy thông báo cho chúng tôi ngay lập tức nếu các bạn tin rằng
            mật khẩu của mình bị lạm dụng.
          </p>
          <p>
            Khi các bạn không muốn nhận những thông tin này nữa, xin vui lòng
            gửi email thông báo tới địa chỉ &nbsp;
            <a className="mailto" href="mailto:cskh@pmh.com">
              cskh@pmh.com
            </a>
            .
          </p>
          <h3>TRƯỜNG HỢP MUA LẠI &amp; SÁP NHẬP CÔNG TY</h3>
          <p>
            Trong trường hợp PMH được mua lại và sáp nhập với công ty khác,
            những thông tin của các bạn có thể sẽ được chia sẻ với đơn vị tư vấn
            và bất cứ người mua lại tiềm năng nào cùng đơn vị tư vấn của họ. Sau
            cùng, các thông tin đó sẽ được chuyển lại cho chủ doanh nghiệp mới.
          </p>
          <h3>CHẤP THUẬN</h3>
          <p>
            Bằng cách gửi các thông tin của mình, các bạn đã chấp thuận với
            chúng tôi về cách sử dụng những thông tin đó như quy định trong
            chính sách bảo mật. Nếu chúng tôi thay đổi các chính sách bảo mật,
            chúng tôi sẽ thông báo những thay đổi đó trên trang này, và có thể
            có những thông báo trên các trang khác của website, để bất kể lúc
            nào cũng có thể giúp cho các bạn nắm rõ về thông tin chúng tôi thu
            thập và cách chúng tôi sử dụng chúng. Chúng tôi cũng sẽ gửi email
            tham khảo đến bạn để bạn có thể nắm rõ những thay đổi có khả năng
            xảy ra, nhờ đó các bạn có thể sửa đổi hoặc cập nhật việc cho phép sử
            dụng các thông tin của bạn. Việc tiếp tục sử dụng dịch vụ có nghĩa
            là bạn đồng ý với những thay đổi đó.
          </p>
          <p>
            Với tốc độ lan truyền của Internet, thông tin bạn cung cấp cho chúng
            tôi sẽ có thể được lan truyền mà không có sự bảo vệ bởi pháp luật.
            Tuy nhiên, chúng tôi luôn cố gắng thực hiện để đảm bảo sự an toàn
            thông tin của bạn.
          </p>
          <p>
            Chúng tôi sẵn sàng đón nhận ý kiến đóng góp của các bạn về website
            cũng như chính sách bảo mật của chúng tôi. Nếu các bạn có nhu cầu
            liên hệ, đặt câu hỏi hoặc góp ý, xin vui lòng gửi email về địa chỉ
            &nbsp;
            <a className="mailto" href="mailto:cskh@pmh.com">
              cskh@pmh.com
            </a>
          </p>
          <h3>LIÊN HỆ</h3>
          <p></p> <p>CÔNG TY PMH</p>
          <p>
            Tầng 5, Tòa Nhà Flemington, Số 182, Lê Đại Hành, Phường 15, Quận 11,
            Thành phố Hồ Chí Minh.
          </p>
          <p>SĐT: *4663</p>
          <p>
            Email:
            <a className="mailto" href="mailto:cskh@pmh.com">
              cskh@pmh.com
            </a>
          </p>
        </div>
      </div>
    );
  }
}
