# Backend — Görev Listesi ve Teknik Notlar

Bkz. `PROJE.md` genel bağlam için.

## 1. v1 İçin Karar: Backend Gerekli Değil

MVP tamamen **local-first** kurgulanıyor — kullanıcı verisi cihazda (MMKV) tutuluyor, satın alma doğrulaması RevenueCat üzerinden yapılıyor. Bunun nedenleri:

- Sunucu maliyeti sıfır, ölçeklenme derdi yok
- Gizlilik açısından avantajlı (kullanıcı hesabı/kimlik toplamıyoruz)
- Geliştirme hızı artıyor — tek kişilik bir projede bakım yükü en büyük risk

**Sonuç:** v1 lansmanında bu dosyadaki görevlerin hiçbiri MVP kapsamında değil. Bu doküman v2 ve sonrası için bir plan niteliğinde.

## 2. v2 Tetikleyicileri

Aşağıdaki sinyallerden biri gerçekleşirse backend çalışmasına başla:

- Kullanıcılardan "yeni telefona geçtim, verim gitti" şikayeti gelmeye başlarsa → senkron ihtiyacı doğrulanmış demektir
- Gerçek bağış ortaklığı (barınağa mama bağışı) kararlaştırılırsa → topluluk sayaç sistemi gerekir
- Sosyal özellik (arkadaşlarla streak yarışı) talebi belirginleşirse

Erken backend yatırımı yapmamak bilinçli bir tercih — talep kanıtlanmadan altyapı kurmak zaman israfı olur.

## 3. v2 Teknoloji Yığını (öneri)

| Alan          | Seçim                                                                           | Not                                                                    |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Framework     | Fastify                                                                         | Mevcut tecrübeye uygun, hafif ve hızlı                                 |
| Veritabanı    | Supabase (Postgres)                                                             | Auth + DB + Realtime tek serviste, hızlı kurulum                       |
| Auth          | Supabase Auth (anonim/cihaz bazlı → isteğe bağlı e-posta)                       | Kullanıcıyı zorla hesap açmaya itmemek önemli                          |
| Barındırma    | Fly.io veya Railway                                                             | Docker Compose ile yerel geliştirmeye uygun, düşük maliyetli başlangıç |
| IAP doğrulama | App Store Server API + Google Play Developer API (RevenueCat webhook üzerinden) | Sahte satın alma / fraud önleme                                        |

## 4. Faz A — Senkronizasyon (v2 öncelik 1)

- [ ] Supabase projesi kurulumu, şema tasarımı (`users`, `sessions`, `unlocked_cats`, `purchases`)
- [ ] Anonim cihaz kimliği ile otomatik hesap oluşturma (kullanıcı fark etmeden)
- [ ] `POST /sync` — cihazdaki yerel veriyi sunucuyla birleştirme (conflict resolution: en güncel `updatedAt` kazanır)
- [ ] `GET /sync` — yeni cihazda restore akışı
- [ ] İsteğe bağlı e-posta bağlama (cihaz kaybında kurtarma için)

## 5. Faz B — Satın Alma Doğrulama

- [ ] RevenueCat webhook endpoint'i (`POST /webhooks/revenuecat`) — satın alma/iptal/iade olaylarını dinle
- [ ] Sunucu tarafında kullanıcının Pro/kozmetik envanterini güncelleme
- [ ] İade durumunda erişimi geri alma mantığı

## 6. Faz C — Topluluk Bağışı (opsiyonel, pazarlama değeri yüksek)

- [ ] Toplam kullanıcı odaklanma saatini toplayan sayaç (`GET /community/total-hours`)
- [ ] Eşik aşıldığında (ör. her 10.000 saat) bağış tetikleme — otomatik değil, manuel onaylı süreç önerilir (mali/hukuki sorumluluk nedeniyle)
- [ ] Şeffaflık sayfası: "şu ana kadar bağışlanan mama miktarı" gibi bir gösterge — bu güven inşa eder ve organik paylaşım yaratır

## 7. Güvenlik ve Gizlilik Notları

- Kullanıcıdan gereğinden fazla veri toplama — sadece işlevsellik için gerekli olanı sakla (KVKK uyumu için de kritik)
- IAP doğrulamasını asla sadece istemci tarafında yapma — sahte satın alma bildirimini sunucu tarafında da doğrula
- Supabase Row Level Security (RLS) politikalarını en baştan sıkı tanımla, sonradan gevşetmek sonradan sıkılaştırmaktan kolaydır
