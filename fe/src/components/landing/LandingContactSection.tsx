import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Truck,
} from "lucide-react";

export const LandingContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    type: "can_cho",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        type: "can_cho",
        notes: "",
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background soft shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Kết Nối Cùng MatGreen
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Cần Hỗ Trợ Giải Phóng Mặt Bằng Hoặc Tìm Vật Tư?
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Dù bạn là gia chủ chuẩn bị xây nhà, đội thợ phá dỡ chuyên nghiệp hay đơn vị vận chuyển xe ba gác, đội ngũ MatGreen luôn sẵn sàng đồng hành cùng bạn 24/7.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Hotline hỗ trợ toàn quốc</span>
                  <strong className="text-sm sm:text-base text-white">1900 8899 - 0988 776 655</strong>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Email tiếp nhận hợp tác</span>
                  <span className="text-sm text-white">lienhe@matgreen.vn / hotro@matgreen.vn</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Trụ sở điều phối</span>
                  <span className="text-sm text-white">
                    Tòa nhà Sông Đà, Đường Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Thời gian hỗ trợ</span>
                  <span className="text-sm text-white">Thứ 2 - Chủ Nhật: 7:30 - 20:00 (Kể cả ngày lễ)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
              <h3 className="text-xl font-bold text-white mb-2">
                Gửi Yêu Cầu Hỗ Trợ Nhanh
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Để lại thông tin, đội ngũ kỹ thuật viên của MatGreen sẽ liên hệ lại trong vòng 15 phút.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Gửi Yêu Cầu Thành Công!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Cảm ơn bạn. Chuyên viên MatGreen khu vực gần bạn sẽ liên hệ qua số điện thoại để hỗ trợ ngay lập tức.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0988xxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Địa chỉ / Khu vực công trình
                      </label>
                      <input
                        type="text"
                        placeholder="Quận Cầu Giấy, Hà Nội..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Nhu cầu của bạn
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                      >
                        <option value="can_cho">Nhà A: Đập nhà, cần cho xà bần / vật tư</option>
                        <option value="can_ban">Nhà A: Cần thanh lý cửa, sắt thép cũ</option>
                        <option value="can_nhan">Nhà B: Cần tìm nguồn tôn nền / vật tư giá rẻ</option>
                        <option value="doi_xe">Đội xe vận tải / Đội thợ tháo dỡ hợp tác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Ghi chú thêm về công trình
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả sơ lược về công trình: diện tích, số lượng vật liệu ước tính, thời gian muốn tháo dỡ..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" /> Gửi Yêu Cầu Hỗ Trợ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
