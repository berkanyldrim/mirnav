@AGENTS.md

# Mırnav

Forest tarzı, sokak kedisi temalı odaklanma uygulaması. React Native + Expo (managed), TypeScript. v1'de Supabase ile zorunlu kullanıcı hesabı (e-posta+şifre, sonra Google/Apple) ve bulut senkronu; yerel depo çevrimdışı önbellek.

## Kaynak Öncelik Sırası

1. `docs/PROJE.md` — ürün kapsamı, core loop, gelir modeli
2. `docs/PROJE_KURALLARI.md` — kod, tasarım, i18n, mağaza kuralları
3. `docs/FRONTEND.md` — teknoloji seçimleri, klasör yapısı, faz planı
4. `docs/BACKEND.md` — sadece v2, MVP kapsamı dışında

## Kritik Kurallar (özet — detay docs/PROJE_KURALLARI.md)

- Kod tamamen İngilizce (identifier, i18n key, commit, branch). Tek istisna: kedi isimleri (Boncuk, Duman, Pamuk, Zeytin).
- Kullanıcıya görünen metin hardcoded yazılmaz, `src/locales/{tr,en}.json` üzerinden gelir. Birincil dil Türkçe.
- Yorum satırı yazılmaz. `any` yasak. Fonksiyonel bileşen + hooks.
- Karanlık mod zorunlu, her ekran iki modda çalışmalı.
- Reklam ve pay-to-focus asla yok. Gelir: Mırnav Pro aboneliği + tekil kozmetik satış; hiçbir satın alma odaklanmayı veya ilerlemeyi hızlandırmaz, çekirdek döngü Free'de kısıtlanmaz.
- Commit: Conventional Commits, İngilizce.
- `main`'e doğrudan commit yok: her iş güncel `main`'den, işin adını taşıyan branch'te yapılır (`home-page`, `settings-page` gibi, prefix yok). Push → MR → merge → `main` pull, sonraki branch yine `main`'den.
- Sabitler `src/constants/` altında tutulur.
