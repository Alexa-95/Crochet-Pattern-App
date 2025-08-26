# Pixel Art App (React + Appwrite)

Aplikacja umożliwia:
- Rejestrację i logowanie wykorzystując Appwrite
- Tworzenie rysunków Pixel Art w edytorze (siatka 8–64 px)
- Zapisywanie wzorów w Appwrite Database
- Przeglądanie i otwieranie zapisanych wzorów
- Eksport wzoru do PNG (zapisywany lokalnie po stronie przeglądarki)

## Szybki start

1. **Zainstaluj zależności**
   ```bash
   npm install
   ```

2. **Skonfiguruj Appwrite** – patrz instrukcje w pliku `APPWRITE_SETUP_PL.md`.

3. **Utwórz plik `.env.local` w katalogu głównym projektu** i ustaw wartości:
   ```env
   VITE_APPWRITE_ENDPOINT=https://<TWÓJ-ENDPOINT-APPWRITE>
   VITE_APPWRITE_PROJECT_ID=<PROJECT_ID>
   VITE_APPWRITE_DATABASE_ID=<DATABASE_ID>
   VITE_APPWRITE_COLLECTION_ID=<COLLECTION_ID>
   ```

4. **Start dev server**
   ```bash
   npm run dev
   ```

5. Wejdź na `http://localhost:5173`.
