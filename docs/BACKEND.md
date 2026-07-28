# Backend — Görev Listesi ve Teknik Notlar

Bkz. `PROJE.md` genel bağlam için.

## 1. v1 Kararı: Supabase ile Hesap + Senkron (2026-07-28'de güncellendi)

Önceki karar "v1'de backend yok, local-first" idi; Berkan'ın kararıyla değiştirildi (karar kaydı PROJE.md Bölüm 10'da). Yeni kapsam:

- **Kayıt/giriş zorunlu.** Yöntemler: e-posta+şifre (önce) + Google/Apple sosyal girişleri (development build'e geçince).
- **Altyapı: Supabase** (Auth + Postgres + RLS). Uygulama `supabase-js` ile doğrudan konuşur — v1'de Fastify sunucusu YOK; özel API ihtiyacı (webhook, topluluk sayacı) doğunca eklenir.
- **Yerel depo kalır** ama rolü değişir: önbellek/çevrimdışı katman. Kaynak-of-truth girişli kullanıcının Supabase'deki verisidir; çevrimdışı biriken veri bağlantı gelince push edilir.
- Apple girişi App Store'da sosyal giriş sunulduğunda **zorunlu** (Apple politikası) ve Apple Developer hesabı ister; hesap silme akışı da store zorunluluğudur, v1'de olacak.

## 2. v1 Hesap/Senkron Görevleri

- [ ] Supabase projesi kurulumu (Berkan: hesap + proje oluşturma; `EXPO_PUBLIC_SUPABASE_URL` ve `EXPO_PUBLIC_SUPABASE_ANON_KEY` env değerleri)
- [ ] Şema: `profiles`, `sessions` (seans kayıtları), `progress` (toplam saat, streak, bestStreak, unlock durumu), `custom_tags`, `settings` — hepsi `user_id` ile, RLS "sadece kendi satırların"
- [ ] `supabase-js` kurulumu, oturum persist (AsyncStorage adapter)
- [ ] Kayıt/giriş ekranları (zorunlu gate: oturum yoksa uygulama açılışında auth ekranı)
- [ ] Google/Apple girişleri (development build sonrası)
- [ ] Senkron: girişte pull → yerel merge (en güncel `updatedAt` kazanır), seans bitiminde push, çevrimdışı kuyruk
- [ ] Çıkış yap + hesap silme akışları (ayarlar ekranında)

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
