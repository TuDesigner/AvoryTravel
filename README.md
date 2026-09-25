# AVORY — Landing page dịch vụ visa

Bản đóng gói **độc lập** của landing page visa. Không phụ thuộc gì vào thư mục
`Avory Trang chu/` — copy nguyên thư mục này là chạy được.

```
index.html          toàn bộ markup, 11 mục trong <main> + nav + footer
chau-au.html        landing page tour Châu Âu – New Zealand – Úc (xem mục cuối)
base.css            token màu, reset, kiểu chung, nav, footer, responsive
visa.css            kiểu riêng của landing page
chau-au.css         chỉ phần riêng của chau-au.html, nạp SAU base.css + visa.css
assets/             ảnh/icon của cả hai trang
preview-visa.mjs    server tĩnh để xem thử (cổng 4327)
```

Tổng dung lượng **~2,8 MB**.

## Chạy thử

Mở thẳng `index.html` bằng trình duyệt là xem được (không cần server —
mọi đường dẫn đều tương đối). Nếu muốn chạy qua HTTP:

```bash
"C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe" avory-visa-landing/preview-visa.mjs
```

rồi mở <http://localhost:4327>. Cấu hình `avory-visa-landing` trong
`../.claude/launch.json` cũng chạy đúng lệnh này.

## Phụ thuộc bên ngoài

Chỉ **một** thứ: font Inter tải từ Google Fonts (`fonts.googleapis.com` +
`fonts.gstatic.com`) khai báo ở `<head>`. Không CDN nào khác, không thư viện,
không gọi API. Nếu cần chạy hoàn toàn offline thì tải font về `assets/fonts/`
và đổi thẻ `<link>` thành `@font-face`.

JavaScript: đúng **một** đoạn nội tuyến ~60 dòng ở cuối `<body>`, không phụ
thuộc thư viện nào — xem mục *Gạch chân mục nav theo mục đang xem* bên dưới.

## Khác gì so với bản trong `Avory Trang chu/`

| Trong `Avory Trang chu/` | Ở đây | Vì sao |
|---|---|---|
| `visa.html` | `index.html` | Để mở thư mục là ra trang, đúng kiểu một gói deploy |
| `about.css` (30,3 KB) | `base.css` (13,2 KB) | Đã lược bỏ CSS chỉ trang Về Avory dùng — xem dưới |
| logo trỏ `index.html` | logo trỏ `./` | Trang chủ không nằm trong gói này |
| `assets/intl-1.png` 4,36 MB | *(đã bỏ)* | Ảnh nền hero cũ, nay thay bằng `hero-brussels.jpg` |
| `assets/intl-2.png` 857 KB | `assets/intl-2.jpg` 312 KB | Nén ảnh nền CTA cuối, giảm 64% |
| icon `.pcard` nét mảnh trong đĩa tròn xanh | icon đặc màu cam, không đĩa nền | Xem mục dưới |

### base.css đã lược những gì

`about.css` gốc phục vụ trang Về Avory nên mang theo nhiều thành phần landing
page này không có. Đã bỏ **5 mục trọn vẹn** — Hero trang trong (`.page-hero`),
Câu chuyện thương hiệu (`.story`), Hành trình phát triển (`.journey`,
`.milestone`), Tầm nhìn/Sứ mệnh (`.pillar`), Thư viện ảnh (`.gallery`, `.slide`,
`.gnav`) — cùng các rule lẻ còn sót trong mục dùng chung, thanh nav và khối
responsive (`.h2--acronym`, `.lead--sm`, `.icon-btn`, `.eyebrow` — nhãn nhỏ
phía trên tiêu đề, bỏ khi hero không còn dùng).

Tổng cộng **144/242 rule bị bỏ, còn 98**; file từ 30,3 KB xuống 13,2 KB.

Giữ nguyên: `:root` (36 biến màu/nhịp), reset, kiểu chữ, nút, nav, footer,
`:focus-visible`, `prefers-reduced-motion` và `@media print`.

**Đã kiểm chứng không mất gì:** so sánh 826 phần tử × 30 thuộc tính computed
style trước/sau khi lược — **0 khác biệt**, 36 biến `:root` khớp hết. So thêm
vân tay hình học (x/y/w/h của cả 826 phần tử) giữa bản gốc và bản này ở
1200 / 1024 / 375px — **hash trùng khít cả ba mốc**.

## Gạch chân mục nav theo mục đang xem

Thanh nav dính (`.nav--lp`, cao 75px) gạch chân mục ứng với phần trang đang xem,
và gạch chân ngay khi bấm vào mục đó.

**Đây là ngoại lệ JavaScript duy nhất của trang.** Tab hồ sơ và FAQ vẫn thuần CSS.
Riêng "đang cuộn tới mục nào" thì CSS không biểu diễn được: `:target` chỉ đổi khi
bấm chứ không đổi khi cuộn, còn `animation-timeline: view()` thì nhiều mục cùng
sáng một lúc lúc giao nhau chứ không chọn ra được đúng một mục. Nếu tắt JS, mục
đầu vẫn gạch chân sẵn nhờ `aria-current` viết thẳng trong markup — trang không hỏng.

Cách hoạt động:

- Mục đang xem = **mục cuối cùng có mép trên đã đi qua vạch mốc**
  (chiều cao nav + 24px). Nhờ vậy các mục không nằm trong nav — điểm đến, hồ sơ,
  FAQ… — vẫn giữ sáng mục nav gần nhất phía trên chúng.
- Chạm đáy trang thì luôn sáng mục cuối, vì mục cuối có thể không bao giờ vượt
  qua vạch nếu nó thấp hơn khung nhìn.
- JS gắn `aria-current="location"`; CSS bắt `[aria-current]` chung nên khớp cả
  `"page"` tĩnh trong markup lẫn `"location"` do JS gắn.
- Nghe `scroll` ở chế độ `passive` và gộp về một lần tính trong `requestAnimationFrame`.

Hai chỗ dễ sai nếu sửa tiếp:

1. **`scroll-margin-top: 80px` phải NHỎ hơn vạch mốc (nav + 24 ≈ 99px).** Bằng
   hoặc lớn hơn thì bấm vào tab sẽ dừng ngay trên vạch, và mục *trước đó* mới là
   mục sáng — bấm một đằng sáng một nẻo.
2. **Bấm xong thì khoá mục sáng cho tới khi cuộn tới nơi.** Cuộn mượt mất ~1,5
   giây cho cú nhảy dài; không khoá thì các mục nằm giữa đường đi lần lượt sáng
   rồi tắt, nhìn như nhấp nháy. Khoá tự nhả đúng lúc tới nơi (không phải theo hẹn
   giờ — hẹn giờ hết hạn trước khi cuộn xong sẽ loé một nhịp ở cuối), và nhả ngay
   nếu người dùng tự cuộn bằng chuột/chạm/phím.

Đã kiểm chứng: cuộn tới cả 5 mục và 4 mục xen giữa (điểm đến, vì sao chọn, hồ sơ,
FAQ) đều sáng đúng **một** mục; bấm "Liên hệ" từ đầu trang — suốt 1,5 giây cuộn
chỉ có một giá trị duy nhất, không loé. Ở 375px `.nav__menu` bị ẩn nên không thấy
gì, script vẫn chạy không lỗi.

## Hover 5 thẻ "mục đích chuyến đi"

Rê chuột vào thẻ thì **nền đổ xanh thương hiệu `--green`, ba dòng chữ chuyển
trắng, icon giữ nguyên màu cam**, mờ dần trong `.3s` cả lúc vào lẫn lúc ra.

```css
.pcard { transition: transform .4s, box-shadow .4s, border-color .3s,
                     background-color .3s ease; }
.pcard h3, .pcard > p, .pcard__more { transition: color .3s ease; }

.pcard:hover { background: var(--green); border-color: var(--green); }
.pcard:hover h3,
.pcard:hover > p,
.pcard:hover .pcard__more { color: var(--white); }
```

Ba điểm phải để ý:

- **`background-color` phải có mặt trong danh sách `transition`.** Rule cũ chỉ
  liệt kê `transform`, `box-shadow`, `border-color` — thiếu nó thì nền đổi phựt
  một cái trong khi chữ vẫn mờ dần, trông lệch nhịp.
- **Viền phải đổi sang xanh.** Rule dùng chung ở đầu khối hover đặt
  `border-color: rgba(243,120,87,.55)` cho cả 4 loại thẻ; không ghi đè thì thành
  viền cam viền quanh nền xanh.
- **Icon không đổi màu nữa.** Trước đây hover đổi `fill` sang `--orange-dark`;
  nay bỏ, chỉ giữ `scale(1.08)`. Cam trên nền xanh đạt 3,34:1, vẫn đủ cho hình
  đồ hoạ.

Thẻ thứ 5 (`.pcard--accent`, nền hồng nhạt `#fff7f4`) cũng đổ xanh như 4 thẻ kia:
`.pcard:hover` (0,2,0) thắng `.pcard--accent` (0,1,0). Đã kiểm chứng.

Đo khi hover: nền `rgb(13,81,72)`, cả h3/p/link đều `rgb(255,255,255)` — tương
phản chữ 9,18:1. Đo lúc chuyển: nền đi từ trắng sang xanh và chữ từ xanh sang
trắng cùng về đích ở mốc ~297ms.

## Chạy đèn 5 bước quy trình

Năm số bước sáng lần lượt 01 → 05, **mỗi số 2 giây**, hết vòng 10 giây rồi lặp.
Số đang sáng trông đúng như 01 trước đây (nền `--orange`), số chưa tới lượt giữ
nền `--green-deep` viền `--white-20`. Thuần CSS, không thêm JavaScript.

```css
@keyframes stepGlow {
  0%, 18%  { background: var(--orange);     border-color: var(--orange); }
  24%, 94% { background: var(--green-deep); border-color: var(--white-20); }
  100%     { background: var(--orange);     border-color: var(--orange); }
}
.step__num { animation: stepGlow 10s linear infinite; }
.step:nth-child(2) .step__num { animation-delay: 2s; }   /* 3→4s, 4→6s, 5→8s */
```

Một vòng 10s chia 5 số nên mỗi số chiếm 20%. Sáng hẳn từ 0–18% (1,8s), mờ dần
tới 24%, nằm im tới 94% rồi sáng dần trở lại đúng lúc vòng sau bắt đầu — nhờ vậy
lúc số 05 tắt thì số 01 đã sáng lên, không có quãng nào cả dãy cùng tối.

**Chỗ dễ sai:** phải dùng `animation-delay` **dương** và **không** đặt
`animation-fill-mode: backwards`. Có `backwards` thì trước khi tới lượt, số 02–05
đã hiện khung hình 0% (đang sáng) — tức là vừa vào trang cả 5 số cùng sáng cam.
Để mặc định (`fill-mode: none`) thì trước giờ chạy mỗi số vẫn giữ kiểu tĩnh tối.

Rule `.step:first-child, .step:last-child { background: var(--orange) }` cũ đã bỏ
— nó tô cứng số 01 và 05, chồng lên vòng chạy đèn.

`prefers-reduced-motion: reduce`: tắt hẳn `animation` (base.css chỉ ép
`transition-duration`, không đụng tới animation) và tô tĩnh số 01 để dãy số
không trông như hỏng.

Đo được (mô phỏng theo mốc thời gian): `0–1s` số 1, `2–3s` số 2, `4–5s` số 3,
`6–7s` số 4, `8–9s` số 5 — mỗi thời điểm chỉ đúng một số sáng.

## Nút CTA và hover khối tiêu đề ở thẻ điểm đến

**Cả 6 thẻ đều dùng nút viên thuốc.** Trước đây chỉ thẻ Schengen có nút
`.btn--accent`, 5 thẻ nhỏ chỉ là link chữ "Xem chi tiết →" (`.dcard__cta`, đã bỏ
hẳn khỏi cả markup lẫn CSS). Nút mặc định cao 48px đặt trong thẻ rộng 397px thì
quá nặng, nên 5 thẻ nhỏ dùng thêm `.btn--sm`:

```css
.btn--sm { gap: 8px; padding: 7px 7px 7px 16px; font-size: 13.2px; }
.btn--sm .btn__dot { width: 24px; height: 24px; }
```

Đo được: thẻ chủ lực **153×48px**, 5 thẻ nhỏ **130×38px**. Thẻ nhỏ cao thêm
547 → 563px, thẻ chủ lực 420 → 436px (nút cao hơn link chữ), vẫn đều nhau.

**Hover: dải tiêu đề chuyển cam, chữ trắng.** Nhãn và tiêu đề trước đây là hai
thẻ rời nhau, không tô nền chung được, nên gộp vào `<div class="dcard__head">`.

```css
.dcard__head {
  margin: -24px -24px 0;     /* kéo ra sát mép thẻ */
  padding: 24px 24px 16px;   /* bù lại đúng ngần ấy, chữ không xê dịch */
  transition: background-color .3s ease;
}
.dcard__head + * { margin-top: 0; }
```

Margin âm để dải màu chạy hết bề ngang thẻ chứ không thụt vào theo padding của
thân thẻ; padding bù lại nên vị trí chữ y như cũ, chỉ khi hover mới thấy khác.
`.dcard__head + *` xoá margin-top của phần kế tiếp vì padding-bottom của khối đã
lo khoảng cách đó rồi.

**Cạm bẫy khi sửa responsive:** margin âm phải khớp đúng padding của
`.dcard__body` ở *từng mốc*. Thân thẻ chủ lực là `34px` ở desktop nhưng
`26px 22px 24px` từ 760px xuống — nếu để nguyên `-34px` thì dải cam tràn lố 12px
mỗi bên, chữ trong dải thụt lệch hẳn so với phần còn lại của thẻ. Đã thêm
override tương ứng. Kiểm tra ở 1345 / 1024 / 375px: mép trái và bề rộng của
`.dcard__head` trùng khít `.dcard__body` ở cả thẻ chủ lực lẫn thẻ nhỏ.

Đo khi hover: nền `rgb(243,120,87)`, nhãn và tiêu đề đều `rgb(255,255,255)`.

### Hiệu ứng quét trái → phải

Dải cam quét từ trái sang phải trong **`.3s ease-in-out`**, và **chữ đổi sang
trắng đúng khoảnh khắc mép cam chạm tới nó** — không phải cả dòng đổi cùng lúc.

Không làm được bằng `transition: color`: màu chữ đổi cho *cả phần tử* một lượt,
trong khi ta cần từng đoạn chữ đổi theo vị trí mép quét. Cách duy nhất là **hai
bản chữ chồng khít nhau**, bản trên bị cắt dần:

```html
<div class="dcard__head">
  <div class="dcard__headIn">…chữ xanh…</div>
  <div class="dcard__headIn dcard__headIn--fill" aria-hidden="true">…chữ trắng…</div>
</div>
```

```css
.dcard__head  { position: relative; margin: -24px -24px 0; }
.dcard__headIn { padding: 24px 24px 16px; }        /* padding ở lớp trong, để hai bản trùng khít */
.dcard__headIn--fill {
  position: absolute; inset: 0;
  background: var(--orange);
  clip-path: inset(0 100% 0 0);
  transition: clip-path .3s ease-in-out;
}
.dcard:hover .dcard__headIn--fill { clip-path: inset(0 0 0 0); }
```

Mép `clip-path` chạy sang phải để lộ **đồng thời** nền cam và chữ trắng, nên hai
thứ luôn khớp nhau tuyệt đối — không phải canh thời gian, mà là cùng một mép cắt.

Đo được: `100% → 99,4 → 96,1 → 89,9 → 80,5 → 68,5 → 54,8 → 40,5 → 27,2 → 16,0 →
7,7 → 2,4 → 0,15 → 0` trong 300ms — chậm hai đầu, nhanh ở giữa, đúng `ease-in-out`.

Hai điểm phải nhớ:

- **`padding` đặt ở `.dcard__headIn`, không phải ở `.dcard__head`.** Margin âm
  vẫn ở lớp ngoài. Nếu để padding ở lớp ngoài thì bản chữ trắng (`position:
  absolute; inset: 0`) sẽ không trùng khít bản dưới, chữ bị lệch khi quét qua.
  Đã kiểm tra ở 1345 / 1024 / 375px: khung và chữ của hai bản trùng nhau dưới 0,5px.
- **Bộ chọn phải có thêm một lớp `.dcard`** (`.dcard .dcard__headIn--fill h3`).
  `.dcard h3 { color: var(--green) }` nằm sau trong file và cùng độ ưu tiên
  (0,1,1), nên nếu chỉ viết `.dcard__headIn--fill h3` thì chữ vẫn xanh.

Bản chữ trắng mang `aria-hidden="true"` để trình đọc màn hình không đọc lặp.


## Màu icon: cam thương hiệu toàn trang

Mọi icon nằm trên nền sáng đều dùng `var(--orange)` (#f37857):

| Nhóm | Trước | Sau |
|---|---|---|
| `.nav__hotline svg` | cam | cam (không đổi) |
| `.trust__list svg` | cam | cam (không đổi) |
| `.pcard__ico svg` | cam đặc | cam đặc (không đổi) |
| `.clarity svg` | cam | cam (không đổi) |
| `.merit__ico svg` | **xanh** | **cam** |
| `.docs__panel li svg` | **xanh** | **cam** |
| dấu tick `.dcard__incl li::before` | **xanh** | **cam** |

**Hai nhóm vẫn giữ màu trắng, cố ý:** `.finale__hotline svg` (trên dải CTA xanh
đậm) và `.float svg` (trong nút nổi cam/xanh dương/xanh lá). Đổi hai nhóm này
sang cam sẽ mất tương phản — cam trên nền cam là không đọc được.

Hover thẻ "Vì sao chọn AVORY" vẫn như cũ: đĩa tròn chuyển sang cam, icon chuyển
sang trắng — đã kiểm chứng nền `rgb(243,120,87)` + nét `rgb(255,255,255)`.

**Ghi chú tương phản:** cam #f37857 trên nền bạc hà #eef3f0 đạt ~2,5:1, dưới mức
3:1 của WCAG 1.4.11. Chấp nhận được vì các icon này thuần trang trí, luôn đi kèm
nhãn chữ nói rõ nội dung — icon không phải phương tiện duy nhất truyền đạt thông
tin. Nếu cần đạt chuẩn thì đổi sang `var(--orange-dark)` (#e05f3d, ~3,35:1),
đánh đổi là lệch màu so với các icon cam khác trên trang.

## Ảnh 6 thẻ bài viết

Lấy từ **Unsplash** (Unsplash License: dùng thương mại tự do, không bắt buộc ghi
nguồn). Tải ngày 2026-09-14, cỡ 1100px, q80 — tổng **631 KB**.

| Bài | File | Ảnh | Nguồn |
|---|---|---|---|
| EES 2026 | `assets/post-ees.jpg` | Biển "Passkontrolle / Passport control" | [e1RI3wRelqM](https://unsplash.com/photos/passkontrolle-passport-control-signage-e1RI3wRelqM) |
| Checklist Schengen | `assets/post-checklist.jpg` | Người điền tờ khai | [OQMZwNd3ThU](https://unsplash.com/photos/OQMZwNd3ThU) |
| 5 lỗi bị từ chối | `assets/post-rejected.jpg` | Con dấu gỗ trên văn bản pháp lý | [7PMGUqYQpYc](https://unsplash.com/photos/7PMGUqYQpYc) |
| Chi tiết khoản phí | `assets/post-cost.jpg` | Máy tính và tiền euro | [QgXJUf6-cv8](https://unsplash.com/photos/QgXJUf6-cv8) |
| Visa Mỹ B1/B2 | `assets/post-us.jpg` | Hộ chiếu Mỹ trên bản đồ | [Cg3fyYZMQ58](https://unsplash.com/photos/Cg3fyYZMQ58) |
| Bảng so sánh | `assets/post-compare.jpg` | Biểu đồ số liệu trên laptop | [JKUTrJ4vK00](https://unsplash.com/photos/JKUTrJ4vK00) |

Nền gradient + icon chủ đề đã bỏ hẳn (kể cả 6 biến thể `.post__thumb--1..6`).
Ảnh dùng `object-fit: cover` trong khung 16/9 sẵn có nên chiều cao thẻ không đổi
(407px), rê chuột thì phóng nhẹ `scale(1.05)` như thẻ điểm đến.

**Hai lưu ý khi thay ảnh khác:**

- Endpoint `unsplash.com/photos/<id>/download` bị chặn bởi lớp kiểm tra bot —
  trả về một trang HTML "Making sure you're not a bot!" chứ không phải ảnh (dễ
  tưởng nhầm là tải xong vì file vẫn có đuôi .jpg). Phải lấy URL CDN trực tiếp
  `https://images.unsplash.com/photo-<id>?w=1100&q=80&fm=jpg&fit=max` từ thẻ
  `og:image` của trang ảnh.
- Ảnh "Bảng so sánh" là dashboard phân tích web (page load, bounce rate) — hợp về
  mặt "biểu đồ số liệu" nhưng không đúng chủ đề chi phí/thời gian visa. Ở cỡ
  thumbnail thì không đọc được chữ nên vẫn dùng được, song đây là tấm yếu nhất
  trong sáu tấm, nên thay khi có ảnh hợp hơn.

## Ảnh 6 thẻ điểm đến

| Thẻ | File | Ảnh |
|---|---|---|
| Schengen | `assets/dest-schengen.jpg` | Cinque Terre, Ý |
| Visa Anh | `assets/dest-uk.jpg` | Big Ben và xe buýt hai tầng, London |
| Visa Ireland | `assets/dest-ie.jpg` | Vách đá Moher |
| Visa Mỹ | `assets/dest-us.jpg` | Tượng Nữ thần Tự do, New York |
| Visa Canada | `assets/dest-ca.jpg` | Hồ Moraine |
| Visa Úc | `assets/dest-au.jpg` | Nhà hát Opera Sydney |

Nguồn: 6 file khách đặt thẳng vào `assets/` (tên gốc `Visa-Anh.jpg`,
`Visa-My.jpg`, `Visa-Schengen-—-khám-phá-…`.jpg…). Đã **đổi sang tên ASCII**
`dest-*.jpg` khớp với tên biến thể sẵn có trong CSS — tên gốc có dấu tiếng Việt
và dấu gạch dài, phải mã hoá phần trăm trong URL và dễ hỏng khi đưa lên server.
Đã hạ xuống tối đa 1100px và nén q0.82: **3,06 MB còn 824 KB**.

Ảnh đặt `position: absolute; inset: 0` với `object-fit: cover` trong
`.dcard__media`, nên tỉ lệ khung (16/9, hoặc cao hơn ở thẻ chủ lực) vẫn do CSS
quyết định — thay ảnh khác tỉ lệ cũng không xô bố cục. Nền gradient xanh vẫn giữ
làm lớp lót lúc ảnh chưa tải xong; sáu biến thể màu riêng
(`.dcard__media--uk`…) đã bỏ vì không còn nhìn thấy.

**Ký hiệu chữ UK / IE / US / CA / AU đã bỏ** — chúng chỉ là chỗ giữ tạm khi chưa
có ảnh, nay ảnh và tiêu đề thẻ đã nói rõ là nước nào.

**Con số "17 quốc gia" chuyển thành huy hiệu nền đặc** ở góc dưới trái ảnh
Schengen (`.dcard__badge`, nền `rgba(6,48,42,.86)`). Trước đó là chữ trắng cỡ
82px đặt giữa khung gradient. Trên ảnh thật thì chữ trắng chìm mất; muốn dòng
"quốc gia" cỡ 13px đạt tương phản 4.5:1 trên vùng trời sáng thì lớp phủ phải tối
tới ~70% — tối đến vậy thì thêm ảnh cũng bằng thừa. Huy hiệu nền đặc cho tương
phản chắc chắn mà vẫn để ảnh nguyên vẹn; cỡ chữ hạ còn 44px cho vừa.

Rê chuột lên thẻ thì ảnh phóng nhẹ `scale(1.05)`, tắt khi
`prefers-reduced-motion: reduce`.

Ở ≤760px dải ảnh thẻ chủ lực đổi từ `21/8` sang `16/9`: tỉ lệ cũ kế thừa từ mốc
1024 chỉ còn **130px** ở màn 375px — quá dẹt cho một tấm ảnh, lại còn phải chứa
huy hiệu cao 76px. Nay là 192px.

## Ảnh nền hero

Ba cỡ, khai báo bằng `srcset` + `sizes="100vw"` để trình duyệt tự chọn theo
bề ngang thật **nhân mật độ điểm ảnh** — màn Retina vì thế cũng lấy đúng bản
đủ nét:

| Tệp | Cỡ | Nặng |
|---|---|---|
| `hero-collage.jpg` | 2000x1125 | 685 KB |
| `hero-collage-md.jpg` | 1400x788 | 271 KB |
| `hero-collage-sm.jpg` | 1000x563 | 128 KB |

Ảnh mang `fetchpriority="high"` vì đây là phần tử LCP. Ảnh nguồn nằm ở
`_src/Hero-banner-HD.jpg` — **để ngoài `assets/` cho khỏi lọt vào gói giao**.

### Trần độ phân giải

`Hero-banner-HD.jpg` trùng khít `Hero-banner-2.jpg` gửi trước đó — cùng
2000x1125, cùng 2.185.945 byte, cùng dấu thời gian. Vậy **2000px là trần**,
không có bản nét hơn. Ở màn 2560px hero rộng 2545px nên vẫn phải phóng 1,27
lần; không có cách nào tránh ngoài việc thôi cho ảnh tràn hết bề ngang.

### Lỗi đã sửa: bản 1920px trước đây bị hạ cấp oan

Hàm xuất ảnh dùng lại từ đợt ảnh Bruxelles có một bước "hạ nửa cho mượt":
nguồn 5032px hạ xuống 2516px rồi mới về 1760px — đúng với ảnh lớn. Nhưng ảnh
ghép chỉ có 2000px, nên bước đó hạ xuống **1000x563 rồi kéo ngược lên
1920x1080**. Tấm 1920px giao lần trước thực chất là ảnh 1000px phóng to — đó
mới là nguyên nhân vỡ hạt, không phải do độ phân giải nguồn. Nay xuất thẳng
từ ảnh gốc, không qua bước trung gian nào.

### Vì sao ảnh này khó cắt

Đo bằng lưới toạ độ trên ảnh gốc: dải chủ thể chạy từ **y=60** (chóp Eiffel)
tới **y=1000** (bánh vali) — **84% chiều cao** — và trải gần hết bề ngang, từ
Nữ thần Tự do ở x=60 tới vé máy bay ở x=1700. Gần như không còn lề an toàn.

Khung hero thì đổi tỉ lệ rất mạnh theo bề ngang, vì chiều cao do nội dung
quyết định còn bề rộng co giãn: **3,03 ở 1920px** xuống **0,31 ở 375px** —
chênh 7,3 lần. Một tấm ảnh `object-fit: cover` không sống sót qua khoảng đó:
ở 0,31 thì ảnh 16:9 chỉ còn giữ 14% bề ngang.

### Màn rộng: khoá tỉ lệ khung

`.vhero { min-height: min(47vw, 880px) }` khoá ở 1/2,12 nên tỉ lệ khung đứng
yên thay vì dẹt dần. Cộng `object-position: 50% 33%`, cửa sổ nhìn rơi đúng
y=60..1005 — vừa khít dải chủ thể. Trên khoảng 2100px (khi chạm trần 880px)
mới bắt đầu xén lại hai đầu.

### Màn hẹp: ảnh thành dải, thôi phủ kín

Từ 1024px xuống, `.vhero__bg` bỏ `inset: 0` thành `inset: 0 0 auto` +
`aspect-ratio: 16/9`: một dải ngang sát mép trên, phần hero còn lại là nền
xanh. **Không cắt một pixel nào** — 985x554 ở 1000px, 375x211 ở 375px.

Mép dưới tan dần bằng `mask-image` đặt trên chính tấm ảnh chứ không phải
gradient của lớp phủ: mốc % ăn theo chiều cao thật của dải nên luôn khớp, còn
tính bằng `vw` thì lệch đúng bề rộng thanh cuộn (đo được 8px ở 1000px). Chỉ
mờ 12% cuối — vùng cỏ — nên bánh vali ở 89% vẫn nguyên.

### Tương phản

Ảnh ghép sáng hơn ảnh chụp cũ nhiều nên lớp phủ cũ không còn đủ: giữ nguyên
`.76/.69/.50` thì dòng phụ chỉ còn **4,31:1**, tụt dưới AA. Bộ số mới
`.80/.77/.42/.26` vừa kéo nửa trái đậm lên vừa mở hẳn nửa phải ra, nhờ vậy
vali, mũ và tháp Eiffel còn ra màu.

| Bề ngang | Dòng phụ | Tiêu đề |
|---|---|---|
| 375 | 4,82 | 6,11 |
| 768 | 4,63 | 6,10 |
| 1000 | 4,63 | 6,10 |
| 1100 | **4,87** | 7,49 |
| 1440 | 5,35 | 6,06 |
| 1500 | 4,73 | 6,02 |
| 1800 | 4,78 | 6,09 |
| 2560 | 4,94 | 6,65 |

### Hai điểm còn lại

**Vali nằm sau thẻ form.** Ở màn rộng form chiếm 480px bên phải — đúng chỗ
vali, mũ và vé máy bay. Lật ngang ảnh không cứu được: khi đó vali lại chui vào
sau tiêu đề, còn tệ hơn.

**Dòng `.brand` màu cam vẫn chỉ 2,1:1**, dưới mức 3:1 cho chữ lớn — có từ
trước, không do đổi ảnh. Ở alpha 0,7–0,8 thì nền dưới chữ gần như hoàn toàn do
lớp phủ quyết định nên đổi ảnh không dịch chuyển con số.

## Nhịp hero ở màn rộng

**`.vhero` phải tự căn giữa theo chiều dọc.** `min-height` thôi thì chưa đủ:
nó là khối thường nên nội dung dính mép trên, phần cao dôi ra dồn hết xuống
đáy — ở 2560px đo được **336px trống dưới form mà chỉ 76px trên**. Cho nó
thành `display: grid` + `align-content: center` thì chỗ dôi chia đều (nay
139/147). Ảnh nền và lớp phủ đặt tuyệt đối nên không bị tính là ô lưới.

**Từ 1500px trở lên nới nhịp bên trong.** Hero cao tới 880px mà ruột vẫn giữ
nhịp của khổ 1280px thì hai khối trông bé tẹo, trôi giữa vùng trống lớn. Khối
`@media (min-width: 1500px)` giãn khoảng cách chứ không đổi cỡ khung:

| | Trước | Sau |
|---|---|---|
| Form hero | 468px cao | **595px** |
| Khối tiêu đề | 288px cao | **322px** |

Cụ thể: `.vform` đệm 30/28/32 lên 40/36/42, `.vform__grid` gap 14 lên 22 và
margin-top 20 lên 30, ô nhập đệm 11/13 lên 14/15, `.field--check` margin-top
16 lên 24, `.vform__submit` 20 lên 28. Bên trái: `.vhero__sub` margin-top 20
lên 28 và cỡ chữ 17 lên 18,5; `.vhero__cta` margin-top 32 lên 44.

Cả hai form (hero và cuối trang) cùng giãn, để hai chỗ không lệch mật độ.

`.vhero__title` chỉ lên **56px, không phải 60px**: cột chữ rộng 712px, mà
dòng "MINH BẠCH & TRỌN GÓI" viết hoa cần 682px ở 56px và **730px ở 60px** —
quá là rơi chữ "GÓI" xuống dòng thứ ba.

## Ảnh đổi theo tab hồ sơ

Mỗi tab của mục *"Hồ sơ cần chuẩn bị"* có một ảnh riêng ở cột phải, đổi kèm
hiệu ứng mờ chéo:

| Tab | File | Ảnh |
|---|---|---|
| Du lịch | `assets/docs-tour.jpg` | Đôi bạn trẻ đeo ba lô xem bản đồ trên phố |
| Công tác | `assets/docs-biz.jpg` | Hai đồng nghiệp mặc vest đi trong khu văn phòng |
| Thăm thân | `assets/docs-family.jpg` | Gia đình ba người cầm hộ chiếu ở sân bay |
| Du học | `assets/docs-study.jpg` | Nhóm sinh viên chụm tay trước sân trường |

Nguồn: 4 file JPEG **1500×1000** khách gửi (`Du lich.jpg`, `Cong tac.jpg`,
`Tham than.jpg`, `Du hoc.jpg` trong `Tu Hoang - Vmedia/Avory Travel/`). Bộ tranh
nét vẽ dùng trước đó đã thay hẳn.

**Cắt vuông quanh chủ thể, không cắt giữa máy móc.** Ảnh gốc 3:2, khung hiển thị
gần vuông — cắt đúng giữa sẽ lệch vì chủ thể hiếm khi nằm chính tâm. Mỗi ảnh cắt
1000×1000 với độ lệch ngang riêng, chọn theo vị trí người trong từng tấm:

| Ảnh | Cắt | Ghi chú |
|---|---|---|
| tour | x = 430, cạnh 1001 | đôi bạn lệch phải |
| biz | x = 285, y = 225, cạnh **720** | cắt sâu hơn: để nguyên cả khung thì hai người quá nhỏ, thừa lối đi phía dưới |
| family | x = 340, cạnh 1001 | gia đình hơi lệch phải |
| study | x = 295, cạnh 1001 | bốn bạn trải ngang |

Xuất 900×900 q0.84, tổng **432 KB**.

**Khung đổi từ `contain` sang `cover`.** `contain` hợp với tranh nét (nền trắng
hoà vào khung), nhưng với ảnh chụp sẽ chừa dải trắng hai đầu. Nay ảnh tràn kín
khung, `object-position: 50% 40%` kéo lên một chút để ưu tiên giữ khuôn mặt.
Ảnh cũng bỏ luôn `inset: 18px` — tràn sát mép, góc bo do khung cắt.

**Từ 1024px xuống khung thành hình VUÔNG chặn bề ngang** (420px, rồi 340px từ
760px) và căn giữa. Trước đây là dải ngang chiếm hết 977px; với `cover` thì dải
ngang đó xén ảnh vuông chỉ còn ~25% chiều cao, tức là cắt mất đầu người. Khung
vuông khớp đúng tỉ lệ ảnh nên không xén thêm tí nào.

> **Bẫy:** khung vuông đó **bắt buộc phải có `width: 100%`**. `margin-inline: auto`
> huỷ mặc định `stretch` của grid item, mà cả 4 ảnh bên trong đều
> `position: absolute` nên fit-content bằng 0 — thiếu `width` thì khung co lại
> còn đúng **2×2px** (2px viền) và ảnh biến mất hoàn toàn.

Khung dùng đúng công thức thẻ của cột trái: nền trắng, bo `var(--radius-lg)`,
`var(--shadow-card)`. Ảnh tràn kín khung nên chỉ còn thấy góc bo — viền xám đã
bỏ cùng đợt bỏ viền toàn bộ thẻ (xem *Viền thẻ*). Tranh SVG hộ chiếu vẽ tay ban đầu, rồi bộ tranh nét thay
sau đó, đều đã bỏ.

Cách dựng — **không thêm dòng JavaScript nào** (đoạn JS duy nhất của trang vẫn
chỉ là gạch chân nav):

- Cả 4 `<img>` nằm chung trong `.docs__art`, đặt tuyệt đối chồng lên nhau,
  `object-fit: contain`, mặc định `opacity: 0`.
- Ảnh của tab đang chọn được `opacity: 1`, chuyển trong `.45s`. Vì bốn ảnh chồng
  nhau nên đây là **mờ chéo thật** — ảnh cũ nhạt dần đúng lúc ảnh mới hiện lên,
  không có khoảng trắng ở giữa. Đo được: `tour 1.00→0.49→0.20→0.08→0.00` trong
  khi `biz 0.00→0.51→0.80→0.92→1.00`.
- `loading="lazy"` cho 3 ảnh chưa hiện. Cả bốn cùng nằm trong một khung nên đều
  tải xong khi mục này vào tầm nhìn, tức là **trước** khi người dùng kịp bấm tab
  — không bao giờ thấy khung trống.
- `prefers-reduced-motion: reduce` thì bỏ hiệu ứng, đổi thẳng.

**Bốn radio đã chuyển ra làm con trực tiếp của `.docs__layout`**, không còn nằm
trong `.docs__tabs`. Bắt buộc phải vậy: bộ chọn `~` chỉ với tới *anh em* của
radio, mà `.docs__art` là anh em của `.docs__tabs` — để radio ở trong
`.docs__tabs` thì không cách nào chạm tới khung minh hoạ bằng CSS thuần. Vì thế
mọi bộ chọn `:checked` nay có thêm một chặng:
`~ .docs__tabs .docs__nav label[…]` thay cho `~ .docs__nav label[…]`. Sửa tab về
sau phải nhớ chặng này.

Chiều cao mục vẫn cố định theo tab Du lịch (793px ở desktop), đổi tab không xê
dịch gì.

## Icon 5 thẻ "mục đích chuyến đi"

Bộ icon của `.pcard` là **hình đặc màu cam, không có đĩa tròn nền**.

Trước đây mỗi icon là một hình nét mảnh (`stroke`) đặt giữa một đĩa tròn 54px
nền xanh `var(--green)`. Nay bỏ hẳn đĩa tròn, khung icon còn 42px và hình được
tô đặc bằng `fill: var(--orange)`.

Lưu ý khi sửa tiếp: **không thể chuyển kiểu này bằng CSS**. Đổi `stroke` thành
`fill` trên một hình vẽ theo nét sẽ ra vệt loang chứ không thành icon đặc — cả 5
hình trong `index.html` đã được **vẽ lại** theo kiểu đặc (máy bay, cặp tài liệu, hai
người, mũ tốt nghiệp, khiên). Riêng khiên dùng `fill-rule="evenodd"` để khoét
rỗng dấu "!" bên trong.

Icon thẻ "Visa Du lịch" ban đầu là hình ngôi nhà — không ăn nhập với du lịch —
nay đổi thành máy bay.

Hover: icon **giữ nguyên màu cam**, chỉ phóng nhẹ `scale(1.08)` — nền thẻ đổ
xanh nên icon cam nổi lên sẵn, không cần đổi màu (xem mục *Hover 5 thẻ "mục
đích chuyến đi"*).

## Viền thẻ: trong suốt lúc thường, hiện màu lúc hover

Chín thành phần dạng thẻ đổi `border: 1px solid var(--card-border)` thành
`border: 1px solid transparent`: `.vform`, `.pcard`, `.dcard`,
`.pricing__card`, `.merit`, `.docs__tabs`, `.docs__art`, `.post`, `.qa`.

**Để trong suốt chứ không xoá hẳn `border`.** Xoá đi thì thẻ hụt 2px mỗi
chiều, mà bốn thẻ có hover (`.pcard .dcard .merit .post`) lại tô viền lúc rê
chuột — thẻ sẽ nảy 1px đúng lúc con trỏ chạm vào. Giữ viền trong suốt thì kích
thước tính sẵn, hover chỉ đổi màu.

Ba viền cam vẫn giữ, vì đây là **nhấn mạnh có chủ ý chứ không phải đường viền
mặc định**: `.dcard--hero` (thẻ Schengen chủ lực), `.pcard--accent` (thẻ
"Trường hợp đặc biệt") và `.qa[open]` (câu hỏi đang mở).

Không đụng tới các đường **kẻ phân cách**, vốn không phải viền thẻ: `.trust`,
`.trust__list li + li`, `.ptable td`, `.docs__nav`. Chip `.docs__panel li`
cũng giữ nguyên — nền `--mint` với vạch xanh 3px bên trái là một thành phần
khác hẳn, không phải thẻ trắng.

## Thẻ điểm đến: thứ tự và bề ngang hàng cuối

Thứ tự 5 thẻ nhỏ: **Anh · Ireland · Úc** rồi **Canada · Mỹ**.

Hàng cuối chỉ có 2 thẻ. Trước đây chúng giữ bề ngang 1/3 rồi để
`justify-content: center` dồn vào giữa, trông hụt so với hàng trên. Nay mỗi
thẻ chiếm đúng nửa hàng:

```css
@media (min-width: 1025px) {
  .dcard:nth-last-child(-n + 2) { flex-basis: calc((100% - 28px) / 2); }
}
```

**Phải bọc trong `min-width` chứ không để trần.** Các mốc nhỏ hơn hạ bề ngang
bằng `.dcard { flex-basis }` — chọn lọc (0,1,0), thấp hơn
`.dcard:nth-last-child()` (0,2,0). Để trần thì dù nằm sau trong file, media
query vẫn không đè lại được, và hàng cuối sẽ kẹt ở nửa hàng cả khi lưới đã
chuyển sang 2 cột hoặc 1 cột.

Từ 1024px xuống lưới là 2 cột nên thành 2 + 2 + 1, thẻ lẻ cuối tự căn giữa;
từ 760px xuống là 1 cột.

## Thẻ điểm đến: bỏ vạch kẻ, nút canh đáy

`.dcard__meta div` bỏ `border-top`. Khoảng cách cũ là 10px `gap` cộng 10px
`padding-top` của vạch, nên gộp thành `gap: 20px` và nâng `margin-top` lên
26px — nhịp dọc giữ y hệt, chỉ mất đường kẻ.

`.dcard__foot` đổi `align-items` từ `center` sang `flex-end`. Khối giá cao
hai dòng ("Từ" + số tiền) nên canh giữa làm nút treo lơ lửng giữa hai dòng;
canh đáy thì đáy nút trùng đúng đáy dòng số tiền (đo được lệch **0px**).

## Còn phải xử lý trước khi lên production

Ba điểm này chuyển nguyên từ bản gốc sang, chưa giải quyết được:

1. **Ảnh bài viết đang là ảnh kho.** Cả ba khối ảnh giờ đều có ảnh thật, nhưng 6
   thumbnail bài viết lấy từ Unsplash chứ không phải ảnh của AVORY. Giấy phép cho
   phép dùng thương mại tự do, song nếu muốn khác biệt thì nên thay bằng ảnh riêng.
   Xem thêm ghi chú về tấm "Bảng so sánh" ở mục trên.
2. **Hai form chỉ là markup**, chưa nối backend/CRM. Thông báo thành công theo
   file nội dung: *"AVORY đã nhận được thông tin của bạn. Chuyên viên sẽ liên hệ
   trong vòng 30 phút làm việc."*
3. **FAQ về hoàn phí khi bị từ chối** còn ô cảnh báo `.qa__todo` — nội dung gốc
   ghi rõ `[CẦN AVORY XÁC NHẬN CHÍNH SÁCH THẬT]`, không tự bịa.

Ngoài ra: dưới 760px thanh nav chưa có nút hamburger (menu bị ẩn, chỉ còn logo +
hotline + nút CTA), và trang chưa khai báo `favicon.ico`.

## Tài liệu chi tiết

Phần giải thích đầy đủ về bố cục từng mục, cách dựng tab thuần CSS, lưới điểm
đến, v.v. nằm ở `../Avory Trang chu/README.md`, mục *"Landing page dịch vụ visa"*.


---

# Landing page tour Châu Âu – New Zealand – Úc (`chau-au.html`)

Dựng ngày 2026-09-24 từ `Avory Travel/AVORY_LandingPage Visa - Chau Au.xlsx`
(3 sheet: cấu trúc + nội dung, bảng giá, FAQ) và ảnh tham khảo
`Avory Travel/Avory EU Visa Servc.png`. Xem tại <http://localhost:4327/chau-au.html>.

> File nội dung tên là "Visa - Chau Au" nhưng thực chất là landing page **bán
> tour quốc tế** (tiêu đề sheet: "LANDING PAGE BÁN TOUR QUỐC TẾ") — 7 hành trình,
> dịch vụ visa là phần bán chéo. Trang dựng đúng theo file nội dung.

## Dùng chung CSS với `index.html`

`<head>` nạp `base.css` → `visa.css` → `chau-au.css`. **Hai file đầu dùng
nguyên, không sửa một dòng** (đã đối chiếu dấu thời gian: vẫn là bản 15/09 và
16/09). Mọi thành phần có sẵn dùng lại y nguyên: `.btn` (+ `--sm/--lg/--outline/
--ghost`), `.field` + `.vform__grid` + `.vform__submit`, `.merit`, `.dcard` (cả
cú quét cam ở dải tiêu đề), `.pricing` + `.ptable`, `.steps` (chạy đèn 5 số),
`.pcard`, `.qa`, `.finale`, footer, nút nổi, script gạch chân nav.

Hệ quả: **sửa `base.css`/`visa.css` là sửa cả hai trang.** Trước khi đổi một
rule dùng chung, mở cả `chau-au.html` ra kiểm tra.

Màu của ảnh tham khảo (xanh navy, hồng cá hồi, tiêu đề chữ có chân) **không
dùng** — theo yêu cầu, chỉ lấy bố cục. Toàn trang là token của `:root`.

## Bố cục (theo thứ tự trong file nội dung)

| # | Mục | Ghi chú |
|---|---|---|
| 1 | Hero `.ehero` | Mới hoàn toàn — xem dưới |
| 2 | Form `.booking#dang-ky` | Thẻ trắng chồng lên mép dưới hero 112px |
| 3 | Vì sao chọn AVORY | 4 thẻ `.merit`, lưới `.merits__grid--4` |
| 4 | Tour Châu Âu `#chau-au` | 5 thẻ: 3 hàng trên + 2 hàng dưới, nút "Xem thêm lịch trình Châu Âu" cuối mục |
| 5 | Tour New Zealand & Úc `#dai-duong` | 2 thẻ nửa hàng, nút "Xem thêm lịch trình New Zealand & Úc" cuối mục |
| 6 | Bảng giá `#bang-gia` | `.ptable--tours`, 6 cột, khu vực gộp dòng |
| 7 | Quy trình `#quy-trinh` | `.steps` nguyên bản |
| 8 | Cam kết `.pledge` | Khối bạc hà, lời dẫn trái + 4 cam kết phải |
| 9 | Visa & dịch vụ tự túc `#visa-dich-vu` | 4 `.pcard`; thẻ visa trỏ `index.html` |
| 10 | FAQ `#cam-nang` | 10 câu `.qa`, menu gọi là "Cẩm nang" |
| 11 | CTA cuối `#lien-he` | `.finale--center`, 2 nút, không kèm form |

### Hero

Bố cục theo ảnh tham khảo (sửa lần 2, 2026-09-24 — bản đầu dùng khung ảnh
vòm ở cột phải và 3 polaroid xếp hàng ngang, khách yêu cầu làm lại):

- **Banner `.eintro__bg` chạy từ đỉnh hero tới đúng GIỮA thẻ form** (lần sửa
  4). Hero và khối form nằm chung lưới `.eintro` năm hàng:
  `auto | --lap | 1fr | 1fr | --lap` (--lap = 112px, ≤1024: 96, ≤760: 84).
  Hero chiếm hàng 1–2, thẻ form chiếm hàng 2–5, ảnh + lớp phủ chiếm hàng 1–3.
  Vì hàng 2 = hàng 5 và hai hàng 1fr bằng nhau, mép dưới hàng 3 luôn rơi
  đúng giữa thẻ — không cần JS, thẻ cao bao nhiêu cũng khớp. Đã đo ở 1100 /
  1280 / 1440 / 1920 / 2560px: đáy ảnh trùng tâm thẻ tới từng pixel. Đáy ảnh
  là một mép gọn, chỉ lộ ở lề phải (lề trái đã phủ đặc). Phần chồng 112px lên
  hero giờ do hàng 2 lo, không còn `margin-top` âm trên `.booking`.
- Lớp phủ `.eintro::before`: trái → phải đặc `--page-bg` tới `50% − 150px`,
  còn .85 ở giữa, trong hẳn ở `50% + 230px` (mốc tính theo tâm để cột chữ luôn
  nằm trên phần ≥ 85% đặc ở mọi màn rộng).
- Mép trái ảnh bắt đầu ở **22%**, mép phải sát mép trang: toà thị chính + tháp
  nằm ở 0–58% ảnh gốc, để từ 0 thì cả toà nhà chui dưới phần phủ đặc. Phần
  0–22% vốn nằm dưới lớp phủ đặc nên nhìn vẫn như banner tràn hết bề ngang.
- **Bẫy — `<img>` đặt tuyệt đối phải ghi rõ `width`/`height`.** Phần tử thay
  thế với `width: auto` KHÔNG giãn theo `left`/`right` mà lấy theo tỉ lệ ảnh
  (1,43:1). Bản trước vì vậy rộng ≈ 1,43 × chiều cao hero: ở 1440px tràn quá mép
  phải (bị `overflow: hidden` che), ở 1920px hụt, chừa dải trống bên phải —
  đúng lỗi khách báo. Nay `width: 78%; height: 100%` + `object-fit: cover`.
- ≤1024px ảnh chỉ chiếm vùng hero (không kéo xuống giữa thẻ): thẻ form ở đây
  rộng gần hết màn, kéo ảnh xuống sau thẻ chỉ lộ hai dải mảnh hai bên mép.
- **Cụm 3 polaroid** đo theo ảnh tham khảo: New Zealand (sau, trái-trên, 4:3,
  −4°), Úc (giữa, phải, to nhất, gần vuông, +4°), Iceland (trước, dưới-trái,
  16:10, +3°, đè đáy ảnh NZ và mép ảnh Úc). Toạ độ tuyệt đối trong khung
  420 × 340px, bắt đầu ở ~52% bề ngang hero; màn nhỏ thu cả khung bằng `scale()`.
- Đã bỏ theo yêu cầu khách: mảng xanh cong góc dưới phải + dòng "Lịch khởi
  hành" (lần sửa 3); huy hiệu giá "Chỉ từ 67,9 triệu" và nhãn "Đã mở bán…"
  phía trên tiêu đề (lần sửa 4). Nội dung nhãn gộp vào dòng mô tả, nay đúng
  câu subheadline của file nội dung: "Châu Âu – New Zealand – Úc mùa lễ hội
  2026 – 2027 • Đã mở bán tour Noel & Tết Nguyên Đán 2027" — vế sau `nowrap`
  để không bẻ giữa chừng (trừ màn ≤360px).
- ≤1024px: ảnh lui về dải 640px (≤760: 500px) ở đáy hero sau cụm polaroid,
  lớp phủ đổi sang trên → dưới.

**Parallax cụm polaroid** (lần sửa 3). Đoạn script thứ hai cuối trang chỉ ghi
một biến `--plx` lên `.ehero__snaps`: tiến độ cuộn qua hero, 0 ở đầu trang → 1
khi mép dưới hero chạm đỉnh màn hình (qua rồi thì thôi ghi). Mỗi ảnh tự tính
`translate: 0 calc(var(--plx) * var(--depth))` — Úc −130px, New Zealand −80px,
Iceland −45px. Hai điểm cố ý:

- Dùng thuộc tính **`translate` riêng**, không phải `transform`: `transform`
  đang giữ góc nghiêng và hiệu ứng xoè khi rê chuột — viết đè vào đó thì mất cả
  hai. Hai thuộc tính cộng dồn tự nhiên.
- **Iceland trôi chậm nhất** dù đứng trước: nó đè lên đáy ảnh NZ, nếu trôi nhanh
  hơn NZ thì phủ kín nhãn "New Zealand". Chậm hơn thì cụm xoè ra, lộ thêm.

`translate .3s` tạo độ trễ nhẹ cho cảm giác bồng bềnh. Ở đầu trang `--plx = 0`
nên bố cục đúng như bản tĩnh. `prefers-reduced-motion: reduce` → script không
chạy và CSS đặt `translate: none`. Đã kiểm ở 1440px: y = 200 / 450 / 700 / 905
cho `--plx` 0,22 / 0,50 / 0,78 / 1; cuộn ngược về 0 thì cả ba về 0px.

Chữ vẫn nằm trên nền sáng nên không cần lớp phủ tối như hero `index.html`.
Tiêu đề giữ đúng công thức `.vhero__title` (52px, 800, viết hoa bằng CSS).

**Nhịp dọc hero** (lần sửa 6 — khách thấy chật): lề trên 64 → 96px, khoảng hở
trên thẻ form 64 → 96px (đệm đáy 208 − phần chồng 112), cột ảnh 560 → 600px;
hero cao 800 → 904px ở 1440, mép trên thẻ form vẫn ló khỏi màn đầu ~33px để
gợi cuộn. Cột chữ: tiêu đề → mô tả 28, → ưu đãi 36, → cam kết 38, → nút 48
(tăng dần để tách ba cụm). Ba mục cam kết đo được 522px, cột chữ 592px → hở
32px + `nowrap`; dải 1025–1290px cột hẹp hơn (tới 498px) nên về 2 cột.

**Tiêu đề đúng 2 dòng** (lần sửa 7): "CHẠM TRỜI ÂU," / "SỐNG TRỌN TỪNG KHOẢNH
KHẮC". Dòng 2 rộng 17,17 × cỡ chữ (909px ở 52px) nên cỡ chữ tính theo bề
ngang cột chữ bằng container query: `.ehero__copy { container-type:
inline-size }`, `font-size: clamp(28px, 100cqi / 17.6, 48px)`, dòng 2 `nowrap`.
Cột ảnh thu 600 → 440px (cụm polaroid 420px) cho cột chữ rộng 760px → tiêu đề
~43px ở 1280–1920px, 41px ở tablet. Kéo theo: lớp phủ đặc tới `50% + 20px`
(trước `50% − 150px`), ảnh dời mép trái 22% → 30% để tháp khỏi bạc màu, 3 mục
cam kết chỉ về 2 cột trong dải 1025–1120px. Điện thoại (≤760px) dòng 2 được
xuống dòng — muốn một dòng ở 375px thì chữ phải ~20px.

**Hai cụm chữ bám cụm polaroid** (lần sửa 8, desktop ≥1025px): cột chữ
`align-self: stretch` + flex dọc, kéo đáy xuống `--snap-drop` (40px — đúng
bằng phần cụm polaroid thò xuống dưới cột ảnh, hai nơi dùng chung một biến),
cụm 2 (ưu đãi → cam kết → nút) `margin-top: auto`. Kết quả: mép dưới hai nút
trùng mép dưới cụm polaroid (đo: 736 = 736 ở 1201–1920px, lệch ảnh Iceland
nghiêng ≤2px). Cụm 1 giữ nguyên chỗ nhờ 72px đệm trên (= độ lệch khi còn canh
giữa); khoảng trống dồn vào giữa hai cụm (130px ở 1440, tối thiểu 36px). Dải
1025–1120px đệm trên còn 40px vì cột chữ hẹp, chữ cao hơn. Parallax chỉ làm
cụm ảnh trôi khi cuộn — ở đầu trang hai mép thẳng hàng.

**Dải ưu đãi + hàng cam kết bám đường ranh thẻ form** (lần sửa 10, ≥1025px):
bề ngang = `100% + --art-col + --hero-gap − --form-col` (= container − cột
form), nên mép phải trùng đường ranh "ảnh | form" của thẻ đặt tour bên dưới —
628px ở 1440 (trước 560px / theo nội dung). Ba biến khai báo trên `.eintro`,
dùng chung cho lưới hero lẫn lưới thẻ form (≤1200px `--form-col: 540px`), đổi
một chỗ là cả hai theo. Hàng cam kết đổi sang flex `space-between` + wrap:
khoảng hở giữa ba mục tự giãn (53px ở 1440, trước 32px) để mục cuối chạm đường
ranh; màn hẹp không đủ chỗ (1121–1252px, ≤1120px) thì mục thứ ba tự xuống hàng.
Đã đo ở 1025 → 1920px: mép phải cả hai trùng đường ranh tới từng pixel, hai
nút vẫn bám đáy cụm polaroid.

**Chú thích polaroid viết tay** (lần sửa 11): Dancing Script 700, 21px, nghiêng
−2°, nạp cùng request Google Fonts với Inter (chỉ ở `chau-au.html`; font có bộ
ký tự tiếng Việt). Thẻ NZ dời lên 40px (top 0 → −40) vì ảnh Iceland đè đúng
dải chú thích "New Zealand"; Úc dời theo (30 → 0) giữ bậc thang như ảnh tham
khảo. Kiểm bằng hit-test 15 điểm trên mỗi dòng chú thích: cả ba hiện 15/15.

**Nhãn trên ảnh thẻ tour** (lần sửa 13, cả 7 thẻ): chữ 10,5px / 300, nền đen
`opacity: .3` (lần sửa 14; bản .8 khách thấy tối quá) + `mix-blend-mode:
darken`, bỏ biến thể cam. Ở 30% nhãn hơi khó đọc trên ảnh Munich và Cinque
Terre (nền sáng) — nếu cần thì nâng lên .4–.5 hoặc thêm bóng chữ. Hoà trộn chỉ đặt
trên `::before` (nền) — đặt lên cả nhãn thì chữ trắng cũng bị darken và biến
mất vào ảnh; chữ nằm trong `<span>` con `position: relative` để vẽ trên nền.
Nhãn không có z-index (tạo stacking context = nhóm cô lập, nền sẽ không hoà
với ảnh); khung ảnh `.tcard .dcard__media` có `isolation: isolate`.

**Thẻ cam kết = thẻ .merit** (lần sửa 15): 4 cam kết đổi sang đúng markup
`<li class="merit">` + `.merit__ico` / `h3` / `p` của mục "Vì sao chọn AVORY",
bỏ hẳn CSS riêng `.pledge__list li` / `.pledge__ico`. Kiểu desktop, kiểu mobile
(icon + tiêu đề chung dòng) và hover đều lấy từ `.merit` trong `visa.css`. Đã
đối chiếu computed style ở 1440 / 1024 / 375px: trùng hết, chỉ khác bề ngang
(thẻ nằm trong khối bạc hà có đệm).

**Bảng giá — nhãn khu vực & giá khoảng** (lần sửa 16): nhãn "Châu Âu" / "Châu
Đại Dương" bỏ viên thuốc, `font-size: 1.5em` (= 21,6px, gấp rưỡi chữ bảng —
lần sửa 17; bản 2em khách thấy to quá),
`vertical-align: middle` giữa cụm dòng (đo lệch tâm 0px); "Châu<br>Đại Dương"
ngắt tay để không tách cụm "Đại Dương". Ba giá khoảng thành hai dòng
`<span class="rng">từ</span> #<br><span class="rng">đến</span> #` — chỉ số đậm
(.rng 400), canh phải. Cột giá thu 21% → 15%, cột khu vực 11% → 15%. Iceland
"Từ 169.900.000" dùng cùng kiểu "từ". Giá khoảng trên THẺ tour chưa đổi.

**Vòng icon cam kết trong hero** (lần sửa 18): `.ehero__perkIco` bỏ nền, thay
bằng viền cam 1,5px (`border: 1.5px solid var(--orange)`), icon giữ màu cam.
Trên màn DPR 1 viền 1,5px được làm tròn thành 1px; muốn đậm hơn thì dùng 2px.

**Icon cho nút "Nhận lịch trình & báo giá"** (lần sửa 19): thêm
`<span class="btn__dot">` + icon lịch (khung lịch có ô ngày) bên phải chữ, cùng
bố cục với nút hotline. Màu đảo như nút hotline: nút cam → chấm trắng icon cam;
nút trắng chữ xanh → chấm xanh `--green`, icon trắng. Đệm ghi đè
`12px 12px 12px 26px` (thay cho `13px 30px` của `.btn--lg.btn--outline`): nút
viền có viền 1px mỗi phía nên bớt 1px đệm, hai nút cao đúng 58px, chấm cách mép
phải 13px như nhau. Chỉ ghi đè trong `.ehero__cta`, các nút viền khác của
`visa.css` không đổi. Đã đo ở 1440 / 1025 / 768 / 375 / 320px: cao 58 = 58,
chấm 32px canh giữa dọc, desktop hai nút vẫn bám đáy cụm polaroid, không tràn
ngang.

**Đổi ảnh banner hero** (lần sửa 20): Grand-Place (ban ngày, sáng) → Dinan lúc
chạng vạng (`hero-dinan*.jpg`, ảnh khách gửi). Chỉ đổi `src`/`srcset`/
`width`/`height` trong HTML; khung ảnh, lớp phủ và các mốc `object-position`
(desktop `34% 0`, ≤1024px `55% 30%`) giữ nguyên vì cho khung hợp lý ở mọi màn:
1440px thấy bến thuyền phía trên cụm polaroid và con phố đèn vàng ở dải phải;
1920px thấy thêm dãy nhà ven sông; 1025px lộ lan can cầu ở góc phải dưới;
tablet/điện thoại dải ảnh đáy có dãy quán sáng đèn hai bên cụm polaroid. Cầu
đá (điểm nhấn của ảnh) nằm sau cụm polaroid ở mọi màn: muốn thấy cầu thì phải
dời cụm hoặc cắt ảnh khác. Ảnh tối nên phần lớp phủ kem mờ dần trông như sương
chiều, không bị xám bẩn; khung trắng polaroid nổi hẳn so với nền cũ.

**Hero tông tối, bỏ lớp phủ kem** (lần sửa 21): xoá hẳn `.eintro::before` (cả
gradient trái → phải ở desktop lẫn trên → dưới ở ≤1024px). Ảnh phủ trọn bề
ngang (`inset: 0; width: 100%`, trước bắt đầu ở 30%); ở ≤1024px ảnh phủ trọn
hero thay vì một dải ở đáy. Cột chữ theo công thức hero tối `.vhero` của
index.html:
- Tiêu đề trắng (dòng 2 vẫn cam `.brand`), dòng phụ `--white-80`, vế đậm trắng
  đặc. Bóng chữ rất nhẹ `0 1px 14px` chỉ để tách mép chữ khỏi đốm đèn.
- Dải ưu đãi: nền kem → kính mờ tối (`rgba(6,20,26,.5)` + `blur(10px)`), giữ
  viền đứt cam (vẫn là chỗ chờ AVORY chốt), nhãn `--orange` thay `--orange-dark`.
- Hàng cam kết: lên cùng nền kính mờ tối (viền trắng 20%), sát dải ưu đãi
  (38 → 12px) thành một khối. Lý do: hàng này nằm đúng dải quán đèn vàng ven
  sông; trên ảnh trần mục 1–2 chỉ còn 2,5–3:1, lên kính thì ≥ 5,8:1.
- Nút "Nhận lịch trình & báo giá": `.btn--outline` → `.btn--ghost` có sẵn của
  visa.css (nút phụ hero tối index.html) + kính mờ tối 30%; chấm trắng icon xanh.
- Đường bay nét đứt: xanh → trắng mờ.

Ở ≤1024px thêm `<picture>` với bản cắt `hero-dinan-m.jpg` (bỏ 250px trời trên
cùng, x 450–1650, giữ nguyên độ phân giải dọc). Khung dọc nên ảnh không dịch
dọc được: với ảnh gốc, tiêu đề nằm trên nền trời chạng vạng và dòng cam chỉ còn
2:1 ở 375px; đồng thời điện thoại đang nhận bản 1000w kéo giãn ~2 lần chiều cao.
`<picture>` để `display: contents` vì `grid-area` chỉ áp cho phần tử tuyệt đối là
con trực tiếp của lưới. `object-position` ở ≤1024px là 35% (dò 20–80%; 50% làm
dòng phụ 320px tụt 4,3:1).

Đo tương phản trên chính vùng chữ (lấy mẫu điểm ảnh sau từng dòng chữ, chưa
tính hiệu ứng làm mờ nên số thực tế còn cao hơn): mọi dòng đạt ngưỡng (chữ lớn
3:1, chữ thường 4,5:1) ở 320 / 375 / 768 / 1024 / 1025 / 1280 / 1440 / 1920px.
Mức thấp nhất: 4,99 (nhãn ưu đãi, 768px). Tiêu đề và dòng phụ desktop 10–14:1.
Bố cục không đổi: hai nút cao 58 = 58, bám đáy cụm polaroid, dải ưu đãi + cam
kết vẫn chạm đường ranh thẻ form, không tràn ngang.

**Hàng cam kết bỏ nền kính, icon trắng** (lần sửa 22): theo yêu cầu, bỏ hộp
kính mờ của lần sửa 21, chữ nằm thẳng trên ảnh; vòng + nét icon trắng đặc
(trước cam). Khoảng cách dải ưu đãi → cam kết trả về 38px (tablet 32, điện
thoại 26). Thêm bóng chữ hai lớp (`0 1px 3px` .7 + `0 1px 14px` .55) và
`drop-shadow` nhẹ cho vòng icon để tách khỏi đốm đèn. Điện thoại (≤760px)
dời ảnh sang `object-position: 75% 0` (dò 0–100% trên mọi dòng chữ hero, chỉ
75–78% đạt hết).

**Tương phản còn thiếu** (tính trên ảnh trần, chưa tính bóng chữ — ngưỡng 4,5:1):

| Bề ngang | Hàng cam kết (mục yếu nhất) | Ghi chú |
|---|---|---|
| 320 / 375 | 4,87 / 4,96 — **đạt** | nhờ dời ảnh 75% |
| 768 | 2,1 | mục 1 nằm trên dãy nhà sáng đèn; không mốc 0–100% nào đạt hết |
| 1024 | 2,4 | như trên |
| 1025 | 4,1 | mục 2 |
| 1280 / 1440 | 5,0 — **đạt** | trung bình đạt, nhưng 10% điểm ảnh sáng nhất sau mục 1–2 chỉ ~2,5 |
| 1920 | 3,8 | mục 2 |

Nếu cần đạt ở mọi màn mà vẫn không có "hộp": thêm một mảng tối mờ biên mềm
(không viền, không góc) sau riêng hàng này, hoặc chỉ bật lại nền kính ở dải
tablet 761–1024px.

**Tạm ẩn hàng cam kết** (lần sửa 23, theo yêu cầu): khối `<ul class="ehero__perks">`
bọc trong chú thích HTML (chưa xoá), CSS để nguyên — hiện lại chỉ cần bỏ cặp
chú thích. Cụm 2 hero giờ là dải ưu đãi → hai nút (48px desktop, 40 tablet, 32
điện thoại); desktop hai nút vẫn bám đáy cụm polaroid, dải ưu đãi vẫn chạm
đường ranh thẻ form.

Ẩn một hàng làm hero ≤1024px thấp đi, mà ở đó ảnh "cover" theo chiều cao nên
co giãn lại — mọi dòng chữ trượt sang chỗ khác trên ảnh, mốc cũ hỏng (35% làm
nhãn ưu đãi tụt 3,3–4,1; 75% làm dòng phụ tụt 4,2–4,4). Dò lại 0–100% bước 5%
trên mọi dòng chữ hero: **10%** là mốc duy nhất đạt hết ở cả 320 / 375 / 768 /
1024px (thấp nhất 5,48 / 5,46 / 5,41 / 5,36), nên bỏ luôn mốc riêng 75% của điện
thoại — một mốc 10% chung cho cả dải ≤1024px.

Desktop: dải ưu đãi tụt ~80px xuống đúng dải quán đèn vàng, nhãn cam còn
4,50:1 ở 1440px → nền kính dải ưu đãi phủ tối 50% → 60% (4,92 ở 1440, 4,99 ở
1025). Kiểm lại cả 8 bề ngang 320 → 1920px: mọi dòng chữ hero đạt, hai nút 58 =
58, không tràn ngang.

**Hiện lại hàng cam kết thì phải dò lại `object-position` ở ≤1024px** (hero cao
thêm → ảnh co giãn lại) và xem lại bảng tương phản của lần sửa 22.

**Cụm tiêu đề canh giữa dọc** (lần sửa 24, desktop ≥1025px): cụm tiêu đề + mô
tả nằm giữa đỉnh hero (mép dưới nav) và mép trên dải ưu đãi. Trước đây cụm này
đứng cố định (đệm 72px), khoảng dư dồn hết xuống dưới: ở 1440px trên 166px,
dưới 215,6px. Nay tiêu đề `margin-top: auto` (cùng dải ưu đãi) → hai lề auto chia
đôi khoảng dư; phần cố định hai bên cân bằng: lề hero `--hero-pt` (96px, nay là
biến) ở trên, `margin-bottom` mô tả = `--hero-pt − 8px` ở dưới. 8px bù hộp dòng vs
nét chữ thật (hộp chữ tiêu đề nhô 2px trên hộp dòng; hộp dòng mô tả dư 5,8px dưới
nét chữ). Bỏ luôn rule đệm 24px riêng cho dải 1025–1120px (lề auto tự lo).
Đo theo nét chữ thật: trên = dưới lệch 0,3px ở 1200–1920px (≈191px mỗi bên ở
1440), 1,3px ở 1025–1120px. Hai nút vẫn bám đáy cụm polaroid, chiều cao hero
không đổi (904 / 884px), tiêu đề + mô tả vẫn 14:1 / ~10:1. Tablet/điện thoại
không đổi.

**Banner sau cụm tiêu đề mục Châu Âu** (lần sửa 25): tiêu đề đổi thành "Tour
Châu Âu" (bỏ "cùng AVORY"). Thêm banner ảnh sáng tràn hai mép màn, từ 72px trên
nhãn "Hành trình tinh hoa" tới 150px lấn xuống ảnh thẻ tour (đúng khung khách
vẽ), đáy tan dần vào nền trang (45% dưới, nằm sau ảnh thẻ). Nhãn + tiêu đề + mô
tả bọc trong `.tours__head`; banner là `<div class="tours__banner">` bọc `<img>`,
neo vào cụm đó nên ôm đúng dù mô tả 2 hay 4 dòng. Rộng 100vw, section
`overflow-x: clip` cắt phần nhô do thanh cuộn. Chỉ mục Châu Âu có banner
(`.tours--banner`), mục Châu Đại Dương giữ nguyên.

Ảnh: không có ảnh sáng nào về điểm đến trong tour (Unsplash chặn bằng trang
kiểm tra bot — không vượt qua), nên cắt từ ảnh gốc Grand-Place 5032px của
khách — phần trời + dãy đầu hồi. Bản đầu dùng thẳng banner hero cũ: tháp toà
thị chính nằm ngay sau tiêu đề, không đọc được → cắt lại để chữ luôn nằm trên
nền trời phẳng, toà thị chính (trái) và mái vòm (phải) nằm ngoài dòng mô tả.
Một file duy nhất (266KB), không srcset: màn hẹp khung gần vuông, ảnh "cover"
theo chiều cao, bản nhỏ sẽ bị kéo giãn.

Đo ở 1920 / 1440 / 1280 / 1025 / 768 / 375 / 320px: banner cách nhãn đúng 72px,
đáy lấn thẻ đúng 150px, tràn đủ hai mép, không tràn ngang. Tương phản (nền trời
phẳng, không có điểm tối nào sau chữ): nhãn cam 2,70 · tiêu đề 9,02 · mô tả
7,45 — đều nhỉnh hơn trên nền trang trơn (2,57 · 8,59 · 7,09). Nhãn cam dưới
4,5:1 là vấn đề sẵn có của `.kicker` trên cả trang, không do banner.

**Banner Dresden + chữ trắng** (lần sửa 26): thay ảnh banner bằng ảnh Dresden
chạng vạng khách gửi; nhãn, tiêu đề, mô tả của cụm này đổi sang trắng đặc
(`--white`). Ảnh cắt dải y 120–710 (tỉ lệ = banner ở 1440px, 3,39:1) để ở màn
đầy đủ chữ nằm trên trời: Frauenkirche đứng ở lề trái ngoài bề ngang chữ, hai
ngọn tháp Hofkirche + Hausmannsturm mọc lên ngay DƯỚI dòng mô tả cuối, phố lên
đèn nằm sau thẻ tour (lộ ở khe thẻ, tan dần vào nền trang).

Ảnh phơi sáng dài có **vệt mây gần trắng** chạy ngang giữa trời (x 600–1800,
y 0–300 ảnh gốc) — đúng chỗ đặt chữ. Chữ trắng trên ảnh trần: nhãn 1,66 · tiêu
đề 1,60 (mô tả 4,53). Không có cách cắt nào tránh được vệt mây mà vẫn giữ phố
(phóng vào góc trời tối bên phải thì chỉ còn một đỉnh tháp, lại phải phóng ảnh
2000px lên). Nên thêm lớp **trời tối dần lên trên** (kiểu kính lọc ND chuyển
sắc) trong `.tours__banner::after`: xanh đêm `rgb(8,16,38)` 65% ở đỉnh → 55% ở
20% → 42% ở 36% → 20% ở 52% → hết ở 62% (trên hàng mái, phố giữ nguyên). Vệt
mây vẫn thấy, chỉ dịu đi. Dò 3 mức (A/B/C) trên điểm ảnh sau từng dòng chữ,
chọn mức B (A chỉ vừa sát ngưỡng ở 1440px).

`object-position: 50% 50%` (thay 0): chỉ có tác dụng ở màn >1440px — canh giữa
thì dòng mô tả hạ xuống vùng trời tối; neo đỉnh thì 1920px còn 4,2:1, 2560px
còn 2,4:1.

Kết quả (mức trung bình sau từng dòng, đã tính cả hai lớp phủ):

| Bề ngang | Nhãn (cần 4,5) | Tiêu đề (cần 3) | Mô tả (cần 4,5) |
|---|---|---|---|
| 2560 | 6,17 | 7,78 | 7,36 |
| 1920 | 5,44 | 5,83 | 7,34 |
| 1600 | 5,66 | 4,97 | 7,23 |
| 1440 / 1280 | 6,04 | 4,67 | 7,27 |
| 1025 / 768 | 5,95 | 4,62 | 7,33 |
| 375 / 320 | 5,95 | 4,65 | 6,25–6,32 |

Banner vẫn cách nhãn 72px, lấn thẻ 150px, không tràn ngang ở mọi bề ngang.

**Banner dài xuống 400px + banner cho mục NZ & Úc** (lần sửa 27):

- Banner Châu Âu kéo xuống tới vạch khách vẽ: lấn thẻ 150 → **400px** (ngang
  dòng mô tả trong thẻ), vẫn tan dần ở 45% dưới. Banner cao thêm 250px nên cắt
  lại ảnh cho đúng tỉ lệ mới ở 1440px (1440 × 675 → 2,13:1): dải y 120–1057 —
  giữ nguyên dòng đỉnh (chữ vẫn trên đúng vùng trời cũ), thêm bờ sông lên đèn
  + bóng nước phía dưới, lộ ở khe thẻ và hai lề.
- Lớp trời tối dần đổi mốc từ **% sang px** tính từ đỉnh banner (0 · 85 · 153
  · 221 · 264px): mốc % sẽ kéo dài lớp phủ xuống theo banner cao hơn và phủ tối
  cả phố ở khe thẻ. Màu + mức phủ + mốc giữ/tan thành biến (`--scrim`,
  `--scrim-a…d`, `--scrim-hold`, `--scrim-end`), mỗi mục một bộ.
- Mục NZ & Úc (`.tours--banner.tours--nz`): cùng cấu trúc (`.tours__head` +
  `.tours__banner`), chữ trắng, ảnh Kaikoura cắt dải y 290–1227 để dãy núi xa
  chạy ngang ngay trên mép hai thẻ (đỉnh tuyết bên phải nằm ngoài bề ngang
  chữ), biển ngọc + đồi cỏ sau thẻ, lộ ở khe giữa và hai lề.
- Trời NZ không vệt mây nhưng nhạt dần về chân trời — dòng mô tả nằm sát núi,
  chữ trắng trên ảnh trần chỉ 1,95:1 → lớp phủ giữ đậm .70 suốt cụm chữ, tan ở
  320px (lướt qua đỉnh núi). Màu phủ **xanh lam đậm sắc** `0 52 170` thay vì xanh
  đêm: cùng tương phản nhưng nền sau chữ ra rgb(44,96,190) — xanh trong ngày
  nắng; xanh đêm làm trời xám xịt rgb(56,100,150). Điện thoại (≤760px) mô tả NZ
  3 dòng xuống tới 246px → giữ đậm tới 260px, tan ở 340px.
- `object-position` dọc chung 30% (chỉ tác dụng ở >1440px): Dresden neo đỉnh
  thì mô tả leo lên vệt mây (1920 → 4,2:1, 2560 → 2,4:1); NZ 30% đặt dãy núi
  đúng mép thẻ ở 1920px.

| Bề ngang | Châu Âu: nhãn · tiêu đề · mô tả | NZ & Úc: nhãn · tiêu đề · mô tả |
|---|---|---|
| 2560 | 5,97 · 7,27 · 7,33 | 6,12 · 5,91 · 5,19 |
| 1920 | 5,43 · 5,61 · 7,30 | 6,34 · 6,01 · 5,16 |
| 1440 / 1280 | 6,04 · 4,67 · 7,27 | 6,63 · 6,17 · 5,19 |
| 1025 / 768 | 6,01 · 4,66 · 7,40 | 6,62 · 6,19 · 5,30 |
| 375 | 6,04 · 4,72 · 6,30 | 6,62 · 6,26 · 5,25 |
| 320 | 6,04 · 4,72 · 6,22 | 6,65 · 6,04 · 5,18 |

(ngưỡng: nhãn + mô tả 4,5:1, tiêu đề 3:1). Cả hai banner cách nhãn 72px, lấn thẻ
400px, không tràn ngang ở mọi bề ngang.

**Lớp tối dần mục NZ & Úc giống mục Châu Âu** (lần sửa 28, theo yêu cầu): bỏ lớp
xanh lam `0 52 170` của lần 27, dùng cùng lớp **xanh đêm `8 16 38`** và cùng dáng
đậm trên → nhạt dưới như Châu Âu, nhưng đậm hơn vì ảnh sáng hơn: `.78 / .72 /
.66 / .58` (Châu Âu `.65 / .55 / .42 / .20`), tan hết ở 310px (điện thoại giữ đậm
tới 260px, tan ở 340px — như lần 27). Dò trên điểm ảnh: dùng y nguyên mức Châu
Âu thì mô tả chỉ 2,05:1; bậc `.75/.70/.62/.52` (300px) sát ngưỡng 4,67; bậc đã
chọn 5,58. Kết quả NZ (nhãn · tiêu đề · mô tả): 2560 10,45 · 9,02 · 5,57 —
1920 10,87 · 9,22 · 5,53 — 1600 11,20 · 9,39 · 5,55 — 1440/1280 11,41 · 9,53 ·
5,58 — 1025/768 11,40 · 9,66 · 5,94 — 375 11,41 · 9,98 · 6,31 — 320 11,47 ·
8,83 · 5,70. Mục Châu Âu không đổi.

**Đổi banner hero sang Auckland** (lần sửa 29): ảnh khách gửi — Auckland hoàng
hôn. Cụm tiêu đề + dòng phụ nằm trên dải trời, phố + tháp Sky Tower + sông/cảng
vẫn trong khung.
- Desktop: khung ~1440×1072 cao hơn tỉ lệ ảnh nên ảnh "cover" theo chiều cao,
  hiện trọn chiều dọc: cụm tiêu đề trên trời tím, đường chân trời + phố lên đèn
  sau dải ưu đãi và hai nút, sông/cảng ở khe trên thẻ form, dưới cụm polaroid
  và hai lề. `object-position: 0% 0` — tháp Sky Tower rơi đúng khe giữa cột chữ
  và cụm polaroid (x 793 ở 1440px; cột chữ hết ở 717, cụm bắt đầu 892), đỉnh
  tháp (461px) ở giữa cụm tiêu đề và dải ưu đãi. ≥1600px ảnh phóng theo bề
  ngang nên không dịch ngang được — ở 1920px tháp nằm sát mép phải dải ưu đãi.
- ≤1024px: dùng thẳng bản gốc 2000px (khung dọc, "cover" theo chiều cao — bản
  cắt riêng không cần nữa vì trời nằm đúng phía trên), `object-position: 50% 0`:
  tháp đứng giữa, thẳng trục với cụm polaroid, đỉnh ngay dưới cụm chữ. Dò 0–100%
  ở 320/375/768/1024px: 0–65% đều đạt; ≥80% nút "Nhận lịch trình" còn 3,6–4,2.
- Trời hoàng hôn sáng hơn rừng Dinan nhiều — trên ảnh trần dòng tiêu đề cam chỉ
  1,56:1, dòng phụ 2,95:1 → bật lại `.eintro::before` làm lớp **tối dần xanh đêm**
  (cùng màu với banner hai mục tour, không phải lớp kem cũ): .60 ở đỉnh → .56
  (190px) → .54 (300px) → .52 (390px, đáy dòng phụ) → hết ở 490px, ngay trên đỉnh
  tháp — phố lên đèn giữ nguyên. Dòng cam là ràng buộc: bậc .55/.50/.48/.45 chỉ
  3,38; bậc đã chọn 3,73–3,85. Màn ≥2000px (ảnh phóng ×1,1–1,28, dải ưu đãi rơi
  lên vầng hồng chân trời, nhãn cam còn 3,6 ở 2200–2560px) kéo lớp phủ giữ .50
  tới 620px, tan ở 700px → 5,2.
- Đo lại mọi dòng chữ hero (tiêu đề trắng/cam, dòng phụ, dải ưu đãi, nút ghost)
  ở 320 → 2560px: đều đạt; mức thấp nhất so với ngưỡng là nhãn cam dải ưu đãi
  (4,71 ở 1960–2080px) và dòng tiêu đề cam (3,73 ở 1440px). Bố cục không đổi:
  hai nút bám đáy cụm polaroid, không tràn ngang.

**Banner hero La Haye, chữ tối, ẩn cụm polaroid** (lần sửa 30): ảnh khách gửi —
Binnenhof bên hồ Hofvijver, trời xanh sáng, cô gái cầm máy ảnh.
- **Chữ**: "CHẠM TRỜI ÂU," màu xanh logo (`--green`); dòng phụ `--ink` (cả vế đậm);
  dòng 2 "SỐNG TRỌN…" giữ cam `.brand`. Bỏ bóng chữ tối của bản ảnh đêm. Đường
  bay nét đứt về lại màu xanh.
- **Cụm 3 ảnh polaroid tạm ẩn** (thuộc tính `hidden` trên `.ehero__snaps`, xoá
  thuộc tính là hiện lại). Khung `.ehero__art` vẫn giữ chỗ nên bố cục hero không
  đổi (hai nút vẫn bám đáy khung) — ô trống nhường cho cô gái trong ảnh.
- **Khung ảnh desktop**: ảnh trọn khung (×0,80) vướng hai chỗ — dòng phụ đè lên
  tán cây bên trái (ngọn cây y ~365 ảnh gốc), cô gái đứng giữa trang, dải ưu đãi
  đè vai. Dùng bản cắt góc trên-trái 1531×1022 → "cover" ×~1,05 ở 1440px: cụm chữ
  nằm trên trời sáng (dòng 182–362 ảnh gốc, ngay trên ngọn cây), cô gái sang cột
  phải (x 909–1291; cột 897–1337), đầu + vai lộ trên thẻ form (thân dưới, máy ảnh
  khuất sau thẻ). `object-position: 0% 40%` (40% dọc chỉ tác dụng ở màn rộng,
  hạ dải ưu đãi từ mép trời xuống mặt tiền); 1025–1280px dời ngang 25%, 1025–1100px
  35% để cô gái không trôi ra ngoài mép phải (xa hơn 35% thì nhãn ưu đãi < 4,5).
- **≤1024px**: bản cắt y 0–1100 (bỏ mặt hồ dưới) → ảnh phóng thêm ~21%, mặt cô gái
  tụt xuống ngay dưới hai nút, vào ô trống của cụm polaroid (ảnh trọn khung thì
  mặt cô nằm sau hai nút ở 375px). `object-position: 54% 0` — cô đứng giữa khung.
- **Mép dưới tan ngắn**: `.eintro::before` giờ chỉ là dải 110px cuối tan vào nền
  trang (thay lớp tối dần xanh đêm của bản Auckland).
- **Nhóm 2 trên ảnh sáng**: dải ưu đãi kính tối .60 → **.80** (desktop) / **.85**
  (≤1024px) — nhãn cam trên mặt tiền nắng / mép trời chỉ còn 2,3–4,1:1. Nút "Nhận
  lịch trình & báo giá" trở lại nút viền **sáng** `.btn--outline` (nền trắng, chữ
  xanh, chấm xanh icon trắng — như trước lần sửa 21): nút ghost chữ trắng nằm trên
  trời sáng ở tablet/điện thoại chỉ ~3:1; nút trắng chữ xanh 8,6:1 trên mọi nền.
- **Đo lại** ở 320 → 2560px (12 bề ngang): tiêu đề xanh 4,0–6,9:1 (cần 3), dòng phụ
  8,3–11,2:1, dải ưu đãi chữ 7,7–9,6 · nhãn cam 4,7–6,4 — đều đạt. **Dòng cam
  "SỐNG TRỌN…" 1,3–2,1:1** — cam #f37857 trên nền sáng tối đa chỉ 2,95:1 (trên nền
  trắng tuyệt đối), không thể đạt 3:1 trên trời; cùng tình trạng với các tiêu đề
  cam trên nền kem của cả trang. Nếu cần đạt: đổi dòng 2 sang xanh logo, hoặc cam
  đậm hơn. Hai nút cao 58 = 58, bám đáy khung cột phải, không tràn ngang.

**Banner hero thung lũng New Zealand + dải ưu đãi sáng** (lần sửa 31):
- Ảnh khách gửi: trời mây sáng ~40% trên (tương phản chữ xanh logo 4–7,4:1 trên
  ảnh trần), dãy núi, rừng thông + đồng cỏ, sông uốn khúc. Không có người nên
  dùng ảnh trọn khung — bỏ bản cắt riêng và hai mốc dời ngang 1025–1280px của
  bản La Haye. Desktop "cover" theo chiều cao (×0,78 ở 1440px): cụm tiêu đề ở
  dòng 245–488 ảnh gốc, trọn trong trời, dãy núi ngay dưới dòng phụ (núi ở y
  388, dòng phụ hết ở 374); dải ưu đãi + hai nút trên rừng/đồng cỏ; khúc sông uốn
  ở cột phải (chỗ cụm polaroid đang ẩn), lộ trên thẻ form. `object-position:
  50% 30%` (30% dọc chỉ tác dụng >~1500px, giữ núi ngay dưới cụm chữ).
- ≤1024px: bản gốc 2000px (khung dọc, "cover" theo chiều cao), `object-position:
  80% 0` — khúc sông uốn trọn trong khung ở điện thoại (50–65% thì trôi ra ngoài).
  Cụm chữ + dải ưu đãi trên trời, hai nút trên dãy núi, ô trống cụm polaroid hiện
  thung lũng + sông.
- **Dải ưu đãi hết tối** (khách thấy tối quá): kính mờ tối .80/.85 → **kính mờ
  sáng** `rgba(255,255,255,.78)` + blur 10px, chữ `--text-medium`, vạch ngăn xanh
  mờ, viền đứt cam giữ (dấu hiệu chỗ chờ nội dung), icon quà `--orange-dark`.
  **Nhãn "Ưu đãi đặt sớm" đổi sang xanh logo** — chữ cam trên nền sáng không đạt
  4,5:1 (cam tối đa 2,95 ngay cả trên nền trắng tuyệt đối). Bỏ luôn mốc kính .85
  riêng cho ≤1024px.
- Đo ở 320 → 2560px: tiêu đề xanh 4,7–6,4:1 (cần 3), dòng phụ 6,7–11,6, dải ưu
  đãi chữ 5,1–7,1 · nhãn xanh 6,1–8,7 — đều đạt (kính .70 cũng đạt, chọn .78 cho
  dư). Dòng cam "SỐNG TRỌN…" vẫn 1,6–2,0:1 (như lần sửa 30). Hai nút bám đáy khung
  cột phải, không tràn ngang.

**Lớp trắng mờ dần trên banner hero** (lần sửa 32): file khách dựng
`assets/soft white gradient 01.svg` (Illustrator, viewBox 4032×2066,3 — trắng đặc
ở mép trên → trong suốt ở 80% chiều cao) làm lớp nền thứ hai của `.eintro::before`,
dưới dải tan 110px ở mép dưới. `background-size: cover` + neo trên (không dùng
100% 100%: SVG giữ tỉ lệ 1,95:1 kiểu "meet", kéo 100%×100% thì co theo bề ngang
và dải trắng không bắt đầu từ mép trên); URL viết `%20` vì tên file có dấu cách.
Mép trên hero giờ liền với thanh nav trắng; lớp trắng tan hết ở ~80% chiều cao
banner (854/1068px ở 1440) — núi, rừng, sông chỉ mờ nhẹ.
Tương phản trước → sau (đo ở 320 → 2560px, 8 bề ngang): tiêu đề xanh 4,7–6,4 →
**8,3–8,8**; dòng phụ 7,3–11,4 → **11,5–13,7**; dải ưu đãi chữ 5,1–7,0 → 6,0–7,4 ·
nhãn xanh 6,1–8,6 → 6,9–9,0; dòng cam "SỐNG TRỌN…" 1,7–2,0 → **2,5–2,6** (vẫn dưới
3:1 — cam tối đa 2,95 trên nền trắng tuyệt đối). Bố cục không đổi.

**Hiện lại cụm polaroid + ảnh mới cho cột trái thẻ form** (lần sửa 33):
- Cụm 3 ảnh polaroid hiện lại (bỏ thuộc tính `hidden` trên `.ehero__snaps`). Bố
  cục không đổi vì khung `.ehero__art` vẫn giữ chỗ suốt thời gian ẩn; hai nút
  vẫn bám đáy cụm (lệch 0px ở 1025–1920px).
- Cột trái thẻ form: ảnh cô gái cầm máy ảnh ở La Haye (`booking-hague.jpg`) thay
  `docs-tour.jpg`, **cô gái ở giữa khung**. Cô đứng ở 52,6% bề ngang ảnh gốc;
  khung desktop hẹp hơn tỉ lệ ảnh nên ảnh "cover" theo chiều cao, dư hai bên →
  `object-position: 60% 50%` (≥1201px), `56% 50%` (1025–1200px, cột trái hẹp
  438–613px) — lệch tâm ≤8px ở mọi bề ngang desktop; mặt cô (y 248–289) nằm
  trên tiêu đề (y 296–416). Tablet: dải ngang rộng, ảnh "cover" theo bề ngang →
  `60% 70%` hạ ảnh để mặt cô nằm TRÊN khối chữ (35% cũ: mặt sau tiêu đề); lệch
  tâm 18–25px là cố hữu (không dư bề ngang để dời). Điện thoại: lệch ≤4px.
- **Lớp phủ đổi từ xanh đậm sang xám đậm trung tính** `rgb(24 26 30)`, giữ các
  mức .08 → .50 (42%) → .90 (72%) → .94; nền dự phòng `.booking__intro` cũng
  xám đậm `#1f2126`. Điện thoại (≤760px): khối chữ phủ gần trọn khung, nằm lên
  vùng trời sáng của ảnh — với mức desktop tiêu đề trắng chỉ 2,6–2,8:1 → lớp xám
  đậm sớm hơn: .45 → .72 (30%) → .90 (60%) → .94.
- Đo trên điểm ảnh sau từng dòng chữ (tiêu đề trắng / mô tả + ghi chú trắng 80%):
  desktop 11,5–14,4 · 9,6–10,4 · 10,2–10,8; tablet 11,9–12,5 · 9,7–9,8 · 9,8–9,9;
  điện thoại 6,0–7,3 · 6,2–9,2 · 10,0–10,5 — đều đạt. Không tràn ngang.

**Ảnh cột trái thẻ form thành khung chân dung, lớp tối chỉ ở đáy** (lần sửa 34):
- Theo ảnh mẫu khách gửi: `booking-hague.jpg` giờ là vùng cắt 1015×889 quanh cô
  gái (đầu ở ~1/5 trên, mái Binnenhof phía sau, thân + máy ảnh + váy xuống đáy),
  thay cho cả ảnh gốc (cô gái nhỏ, lọt thỏm giữa cảnh). Tỉ lệ 1,14:1 = khung cột
  trái ở 1440px (628×552) → màn đầy đủ khít, không cắt thêm. Cô đứng giữa vùng
  cắt nên `object-position: 50% 30%` đặt cô giữa khung ở mọi bề ngang desktop
  (lệch ≤1px ở 1025–1920px) — bỏ mốc 56% riêng cho 1025–1200px. Tablet `50% 24%`:
  mặt cô trên khối chữ, đỉnh đầu còn khoảng thở (27% thì tóc chạm mép trên ở
  1024px).
- Lớp xám đậm chỉ ở ĐÁY sau khối chữ (khách: "đừng làm tối ảnh quá"): trong suốt
  hoàn toàn tới 40% chiều cao → .60 (56%) → .88 (72%) → .94. Mặt cô (y 93–204 ở
  desktop) không bị phủ chút nào (bản lần 33: mặt bị phủ ~50%). Điện thoại giữ
  lớp đậm sớm của lần 33 vì khối chữ phủ gần trọn khung.
- Đo (tiêu đề / mô tả / ghi chú): desktop 9,0–14,0 · 9,5–10,3 · 9,9–10,1; tablet
  10,3–10,8 · 8,6–9,5 · 9,7–9,9; điện thoại 5,7–10,8 · 8,8–8,9 · 10,2–10,3 — đều đạt.

**Thanh nav** (lần sửa 5): chữ menu 15 → 14px, hotline 15 → 14px, nút 14,5 →
13,5px — chỉ ghi đè trong `chau-au.css`, trong `@media (min-width: 761px)` để
không đè cỡ nút mobile của `visa.css`.

Đường bay nét đứt chỉ hiện ≥1400px, chạy dọc lề trái. Bản đầu đặt dưới cột
chữ thì nó cắt ngang dòng cam kết và hai nút.

**Bẫy:** `.snap img` phải có `height: auto`. Thuộc tính `height="619"` trên
`<img>` là chiều cao cứng, thắng `aspect-ratio` — thiếu dòng đó cả ba polaroid
dài ra thành dải 619px.

### Form

Hai vùng: ảnh + lời mời (chữ trắng trên lớp phủ xanh, đậm dần xuống đáy) | form.
Bản đầu chia ba vùng như ảnh tham khảo (ảnh | lời mời | form), nhưng form cao
547px nên cột lời mời hở ~250px trắng giữa tiêu đề và dòng bảo mật.

Trường theo file nội dung: khởi hành Hà Nội / TP.HCM (hai radio vẽ thành viên
thuốc `.seg`), khu vực (6 lựa chọn), họ tên*, SĐT*, thời gian dự kiến (chọn
tháng 10/2026 → 03/2027 — đúng các tháng có lịch khởi hành, thay cho
`type="month"` vốn không chạy trên Firefox/Safari), số khách, ghi chú. Không có
ô "đồng ý chính sách" vì file nội dung không yêu cầu. Form chỉ là markup, chưa
nối backend — như `index.html`.

### Thẻ tour

`.dcard` + `.tcard`. Mỗi thẻ: nhãn trên ảnh (câu tagline trong file nội dung) ·
dòng cam "số ngày · hãng bay" · tên tour · lộ trình · mô tả · lịch khởi hành ·
giá · hàng "điều kiện đoàn + nút".

Chân thẻ **xếp dọc** (giá một hàng, đoàn + nút một hàng): giá dạng khoảng
"125.900.000 – 128.900.000đ" rộng ~320px, xếp ngang với nút thì thẻ nào cũng
xuống dòng một kiểu. Điều kiện đoàn (≥10/15/25 khách) lấy từ cột "Ghi chú hiển
thị" của sheet bảng giá.

Iceland là `.tcard--premium` (nền `--green-deep`, nhãn "Cao cấp") vì file nội
dung ghi rõ: giá cao hơn hẳn, cần làm rõ là sản phẩm cao cấp. Cam trên nền đó
đạt 4,53:1 — vẫn AA.

**Lưới 3 + 2** (theo ảnh bố cục khách gửi): lưới 6 cột, thẻ hàng trên chiếm 2
cột (397px ở khổ 1280), thẻ hàng dưới chiếm 3 cột (610px). Mục New Zealand & Úc
(`.tours__grid--duo`) có 2 thẻ, mỗi thẻ 3 cột — cùng khổ hàng dưới Châu Âu.
Ảnh thẻ cao **cố định 224px** thay cho 16:9: giữ 16:9 thì thẻ 610px có ảnh cao
343px, hàng dưới cao hơn hàng trên ~120px; cố định thì hai hàng cùng nhịp, thẻ
rộng chỉ lấy dải ảnh toàn cảnh hơn. Panel "Tổng quan" của bản đầu đã bỏ, thay
bằng nút `.tours__more` cuối mỗi mục.

Lưới tour về **2 cột từ 1200px** (không đợi 1024 như `.dest__grid`): 3 cột ở
1025px chỉ còn thẻ 307px, hàng "đoàn + nút" hụt 48px. Thẻ lẻ thứ 5 (Iceland)
khi đó trải hết hàng và xếp ngang (ảnh 44% trái). ≤760px: 1 cột, ảnh về 16:9.
Từ 1024px xuống nhãn đoàn thu về 12px, `nowrap` — đo được vừa một hàng ở mọi
bề ngang 375 → 1920px.

### Bảng giá

`table-layout: fixed` + phần trăm cột đo bằng canvas: cột giá cần 209px cho
"125.900.000 – 128.900.000đ", tiêu đề "THỜI GIAN" cần 73px. Hai con số đó chỉ
đủ khi bảng ≥1220px nên đó cũng là `min-width` — hẹp hơn thì bảng cuộn ngang.
Ô khu vực gộp dòng (`rowspan`); ô gộp của nhóm cuối không nằm trong `<tr>` cuối
nên phải tự bỏ vạch dưới (`.ptable__group th`). Ghi chú dưới bảng lấy từ sheet
bảng giá (bản đầy đủ, có mốc 09/2026), không phải bản ngắn ở sheet 1.

### Thanh nav

6 mục (index.html chỉ 5) nên chật sớm hơn: logo 105 + menu 709 + hotline & CTA
316 = 1130px. ≤1280px ẩn số hotline (giữ icon), ≤1100px ẩn "Trang chủ" (logo đã
trỏ avory.vn), ≤960px ẩn menu, ≤360px thu logo + nút. Đo lại ở 1300 / 1281 /
1201 / 1101 / 1030 / 965 / 320px: không tràn, menu và cụm nút luôn hở ≥27px.

Script gạch chân chép từ `index.html`, khác một chỗ: ở hero / form / "Vì sao
chọn" (chưa tới mục nào trong menu) **không** gạch chân mục nào — mục đầu menu
ở đây là "Trang chủ" trỏ ra ngoài. Đã kiểm: mỗi mục sáng đúng một tab, các mục
xen giữa (bảng giá, quy trình, cam kết) giữ tab gần nhất phía trên.

> Kiểm thử trong Browser pane bị ẩn: `requestAnimationFrame` và sự kiện `scroll`
> đều không chạy khi `document.visibilityState === "hidden"`, nên script trông
> như chết. Phải thay rAF bằng `setTimeout`, chạy lại script (closure mới — cờ
> `queued` của bản cũ đã kẹt ở `true`) rồi tự bắn `new Event('scroll')`.

## Ảnh

| Vị trí | File | Nguồn |
|---|---|---|
| Banner hero | `hero-nz-valley.jpg` 2000×1378 · `-md` 1600w · `-sm` 1000w (`srcset`); ≤1024px dùng thẳng bản 2000px (`<picture>`) | **Khách gửi** (lần sửa 31) — thung lũng sông New Zealand: trời mây, dãy núi, rừng thông, sông uốn khúc. Bản 2000px là file gốc không nén lại; `-md` q84, `-sm` q82. **Cần xác nhận giấy phép** nếu ảnh lấy từ web/stock |
| _(không dùng)_ | `hero-hague.jpg` · `hero-hague-m.jpg` | Banner hero lần sửa 30 (La Haye, cô gái cầm máy ảnh) — giữ lại để đổi về |
| Cột trái thẻ form | `booking-hague.jpg` 1015×889 | **Khách gửi** (lần sửa 33) — cô gái cầm máy ảnh bên hồ Hofvijver, La Haye (cùng ảnh với banner hero lần 30). Lần sửa 34: vùng cắt chân dung x 545–1560 · y 409–1298 của ảnh gốc 2000×1335, giữ nguyên điểm ảnh, q85. Thay `docs-tour.jpg` (vẫn trong assets/). **Cần giấy phép dùng hình người** |
| _(không dùng)_ | `hero-auckland.jpg` · `-md` · `-sm` | Banner hero lần sửa 29 (Auckland hoàng hôn) — giữ lại để đổi về (kèm lớp tối dần xanh đêm + chữ trắng, xem README lần sửa 29) |
| _(không dùng)_ | `hero-dinan.jpg` · `-md` · `-sm` · `-m` | Banner hero cũ (lần sửa 20–28), Dinan lúc chạng vạng — giữ lại để đổi về |
| Banner mục "Tour Châu Âu" | `tours-banner.jpg` 2000×937 | **Khách gửi** (lần sửa 26) — Dresden lúc chạng vạng (Frauenkirche, Hofkirche, sông Elbe), cắt dải y 120–1057 của ảnh gốc 2000×1333 (lần sửa 27; lần 26 là y 120–710), q85. Thay bản Grand-Place của lần sửa 25 (cùng tên file; muốn dựng lại: ảnh gốc 5032px, vùng x 2300 · y 1000 · 2432×700). **Cần xác nhận giấy phép** nếu ảnh lấy từ web |
| Banner mục "Tour New Zealand & Úc" | `tours-banner-nz.jpg` 2000×937 | **Khách gửi** (lần sửa 27) — bờ biển Kaikoura, New Zealand (trời xanh, dãy núi xa có đỉnh tuyết, biển ngọc, đồi cỏ), cắt dải y 290–1227 của ảnh gốc 2000×1333, q85. **Cần xác nhận giấy phép** nếu ảnh lấy từ web |
| _(không dùng)_ | `eu-banner.jpg` 2200w · `-md` · `-sm` | Banner cũ, giữ lại để đổi về: Grand-Place Bruxelles, từ `Avory Travel/tourists-bog-cities-europe-summer-time.jpg`. Ảnh ban ngày, sáng: đổi về thì cột chữ hero phải về lại tông tối chữ/xanh như trước lần sửa 21 |
| Thẻ Tây Âu | `dest-schengen.jpg` | Có sẵn (Cinque Terre, Ý) |
| Polaroid Úc · thẻ Úc | `dest-au.jpg` | Có sẵn (Opera Sydney) |
| Form | `docs-tour.jpg` | Có sẵn |
| CTA cuối | `intl-2.jpg` | Có sẵn |
| Thẻ Đông Âu | `tour-prague.jpg` 1400×933 | Unsplash — cầu Charles + lâu đài Praha lúc hoàng hôn, William Zhang ([6En4WYsNYXM](https://unsplash.com/photos/charles-bridge-and-prague-castle-6En4WYsNYXM)) |
| Thẻ Trung & Đông Âu | `tour-munich.jpg` 1400×855 | Unsplash — chợ Giáng Sinh Munich, Jahanzeb Ahsan ([ZseiLBRnP-k](https://unsplash.com/photos/ZseiLBRnP-k)) |
| Thẻ Pháp – Thụy Sĩ – Đức | `tour-paris.jpg` 1400×1040 | Unsplash — tháp Eiffel + vườn Trocadéro, Anthony Delanoix ([Q0-fOL2nqZc](https://unsplash.com/photos/eiffel-tower-during-daytime-Q0-fOL2nqZc)); **đã cắt** 1040px dưới của ảnh dọc 1400×2100 |
| Thẻ Iceland · polaroid Iceland | `tour-iceland.jpg` 1400×934 | Unsplash — cực quang trên hồ Álftavatn, Jonatan Pie ([e2MnKlEFcTg](https://unsplash.com/photos/e2MnKlEFcTg)) |
| Thẻ New Zealand · polaroid NZ | `tour-nz.jpg` 1400×933 | Unsplash — vịnh Milford Sound (có đỉnh Mitre), Sébastien Goldberg ([oXgPDa0OtAk](https://unsplash.com/photos/body-of-water-near-mountain-under-blue-sky-during-daytime-oXgPDa0OtAk)) |

Năm ảnh Unsplash (lần sửa 12, 2026-09-24) thay cho 5 ảnh giữ chỗ nền xanh —
cùng tên file nên không sửa code, chỉ cập nhật `width`/`height` trong HTML.
Giấy phép Unsplash: dùng thương mại tự do, không bắt buộc ghi nguồn. Tải qua
CDN `images.unsplash.com/photo-<id>?w=1400&q=80&fm=jpg&fit=max` (endpoint
`/download` bị chặn bot — xem mục ảnh bài viết ở trên). Đã kiểm magic bytes
`ffd8ff` trước khi chép vào `assets/` (tổng ~1,4 MB).

**Tháp Eiffel không vừa trọn trong thẻ:** ảnh gốc là ảnh dọc, tháp cao ~1040px
(từ chóp y≈710 tới chân y≈1750) còn khung thẻ 16:9 trên ảnh rộng 1400px chỉ cao
788px. Đã chọn giữ chân tháp + vườn Trocadéro mùa thu, cắt mất đoạn chóp mảnh.
Muốn thấy trọn tháp thì cần một ảnh Eiffel chụp ngang.

Ghi chú: ảnh hero là Bruxelles — không nằm trong lịch trình nào (chỉ là ảnh
"trời Âu" độ phân giải cao duy nhất có sẵn). Cinque Terre ở thẻ Tây Âu đúng nước
(Ý) nhưng không phải điểm trong lịch trình (Venice, Pisa, Roma, Vatican).

Icon footer mới vẽ theo đúng nét của bộ có sẵn (trắng 80%, nét 1.125–1.33):
`footer-mail.svg`, `footer-web.svg`, `footer-social-zalo.svg`,
`footer-social-tiktok.svg`.

## Còn phải xử lý trước khi lên production

1. **Ưu đãi đặt sớm** ở hero: file nội dung ghi `[CẦN AVORY XÁC NHẬN]` + "NẾU
   CÓ". Đang hiện dải viền đứt ghi rõ chờ xác nhận. Không có ưu đãi thì xoá
   nguyên khối `<p class="ehero__offer">`.
2. ~~5 ảnh giữ chỗ~~ — đã thay bằng ảnh Unsplash (xem bảng Ảnh). Ảnh kho, không
   phải ảnh riêng của AVORY; thay bằng ảnh đoàn thật khi có.
3. **Hai mục chưa dựng**: "Hình ảnh khách hàng thực tế" và "Khách hàng nói gì
   về AVORY?" — file nội dung ghi `[CẦN THU THẬP]` ảnh/review thật, "không tự
   dựng". Có comment đánh dấu chỗ chèn trong HTML (sau mục Quy trình). Mục menu
   "Hình ảnh thực tế" cũng tạm bỏ theo.
4. **Cam kết**: file nội dung ghi `[CẦN AVORY XÁC NHẬN]` có hoàn tiền bằng văn
   bản khi vi phạm cam kết hay không — trang **không** nhắc tới hoàn tiền.
5. **Link còn `#`**: Zalo (nút CTA cuối + nút nổi), Messenger, Facebook/Zalo/
   TikTok ở footer, Chính sách bảo mật, Điều khoản.
6. **Địa chỉ footer khác `index.html`**: trang này dùng địa chỉ trong file nội
   dung ("Số 9, A16-NV6, KĐT Lê Trọng Tấn, Tây Mỗ"), `index.html` ghi "Ô số
   10/NV6, mặt Đại Lộ Thăng Long…". Cần AVORY chốt một địa chỉ.
7. **FAQ câu 1** giữ nguyên văn "15/17 nước" — cách viết dễ hiểu nhầm, nên hỏi
   lại ý định. FAQ câu 7 đã sửa chính tả "Galleries" → "Galeries Lafayette".
8. Mô tả ngắn ở 3 thẻ dịch vụ (vé máy bay, combo, HDV riêng) do mình viết thêm —
   file nội dung chỉ có tên + nút.
