
import type { Section } from './types';

export const SECTIONS_CONFIG: Section[] = [
  {
    id: 'step2',
    title: 'Bước 2: Chọn Phong Cách & Tùy Chỉnh',
    groups: [
      {
        id: 'lighting',
        title: 'Chất ảnh & Ánh sáng',
        type: 'card',
        allowMultiple: false,
        options: [
          { 
            id: 'vibrantRed', 
            title: 'Tông Đỏ Rực Rỡ', 
            description: 'sử dụng tông màu đỏ làm chủ đạo, màu sắc rực rỡ, tương phản cao, ánh sáng studio làm nổi bật khối và chi tiết, tạo cảm giác sang trọng, lễ hội',
            default: true
          },
          { 
            id: 'dramatic', 
            title: 'Ánh Sáng Kịch Tính', 
            description: 'sử dụng ánh sáng mạnh và bóng đổ sâu để tạo kịch tính, làm nổi bật đường nét cơ thể và trang phục phong cách high-fashion' 
          },
          {
            id: 'gentle',
            title: 'Dịu Dàng & Thơ Mộng',
            description: 'phong cách ảnh thơ mộng, ánh sáng mềm mại, khuếch tán, có thể có hiệu ứng sương khói nhẹ hoặc bokeh, tông màu ấm áp, lãng mạn'
          }
        ]
      },
      {
        id: 'layout',
        title: 'Bố cục (Khung hình)',
        type: 'pill',
        allowMultiple: false,
        options: [
          { id: 'portrait', title: 'Chân dung', default: true },
          { id: 'halfBody', title: 'Nửa người' },
          { id: 'fullBody', title: 'Toàn thân' }
        ]
      },
      {
        id: 'costume',
        title: 'Trang phục',
        type: 'pill',
        allowMultiple: false,
        options: [
          { id: 'originalCostume', title: 'Giữ Nguyên Gốc', default: true },
          { id: 'yemDoVayDen', title: 'Yếm Đỏ & Váy Đen' },
          { id: 'yemVayDupTheu', title: 'Yếm & Váy Đụp Thêu' },
          { id: 'aoDaiCachTan', title: 'Áo Dài Cách Tân' },
          { id: 'yemLucVayDo', title: 'Yếm Lục & Váy Đỏ' },
        ]
      },
      {
        id: 'background',
        title: 'Phông nền',
        type: 'pill',
        allowMultiple: false,
        options: [
          { id: 'originalBackground', title: 'Phông Nền Đỏ Studio', default: true },
          { id: 'coTruyen', title: 'Bối Cảnh Cổ Truyền' },
          { id: 'denLong', title: 'Không Gian Đèn Lồng' },
          { id: 'toiGian', title: 'Nền Tối Giản' },
        ]
      },
      {
        id: 'emotion',
        title: 'Biểu cảm',
        type: 'pill',
        allowMultiple: false,
        options: [
          { id: 'originalEmotion', title: 'Giữ Nguyên Gốc', default: true },
          { id: 'kyBi', title: 'Kiêu Kỳ, Cuốn Hút' },
          { id: 'tramTu', title: 'Trầm Tư, E Ấp' },
          { id: 'cuoiMim', title: 'Cười Mỉm Dịu Dàng' },
        ]
      }
    ]
  },
  {
    id: 'step3',
    title: 'Bước 3: Chọn Kiểu Dáng',
    description: 'Chọn một hoặc nhiều phong cách bạn muốn thử nghiệm.',
    groups: [
      {
        id: 'posesWithProps',
        title: 'Duyên Dáng Cùng Đạo Cụ',
        type: 'pose',
        allowMultiple: true,
        showSelectAll: true,
        options: [
          { id: 'nangCanhLuuDo', title: 'Nâng Cành Lựu Đỏ', description: 'chủ thể ngồi, một tay nâng nhẹ cành lựu đỏ, tay còn lại đặt duyên dáng, ánh mắt nhìn vào ống kính' },
          { id: 'tuaBenDauLan', title: 'Tựa Bên Đầu Lân', description: 'chủ thể đứng hoặc ngồi, nghiêng mình duyên dáng bên cạnh một chiếc đầu lân sặc sỡ, một tay chạm nhẹ vào đầu lân' },
          { id: 'anNhienVoiLongChim', title: 'An Nhiên Với Lồng Chim', description: 'chủ thể ngồi, một tay cầm chiếc lồng chim cổ, ánh mắt nhìn xa xăm, tạo vẻ bình yên' },
        ]
      },
      {
        id: 'bodyPoses',
        title: 'Nét Đẹp Hình Thể',
        type: 'pose',
        allowMultiple: true,
        showSelectAll: true,
        options: [
          { id: 'khoeTamLungTran', title: 'Khoe Tấm Lưng Trần', description: 'chủ thể quay lưng về phía máy ảnh, khoe tấm lưng trần gợi cảm của áo yếm, đầu ngoảnh lại nhìn qua vai' },
          { id: 'tayThoOTrenCo', title: 'Tay Thơ Ơ Trên Cổ', description: 'chủ thể đưa một tay lên chạm hờ vào gáy hoặc xương quai xanh, ánh mắt kiêu kỳ, cuốn hút' },
          { id: 'dangNgoiThanhTu', title: 'Dáng Ngồi Thanh Tú', description: 'chủ thể ngồi trên sàn hoặc ghế thấp, hai tay đặt mềm mại lên đùi hoặc bên cạnh, dáng người thẳng, toát lên vẻ thanh lịch' }
        ]
      }
    ]
  }
];
