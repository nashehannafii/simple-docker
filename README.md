# simple-docker

Tiga service docker:

- frontend: React (Vite) — dibuild dan disajikan oleh nginx, dipublish di host port 3000
- backend: FastAPI (Python) — mendengarkan di 0.0.0.0:8000
- db: MySQL 8

Cara menjalankan (macOS / Linux):

1. Pastikan Docker & Docker Compose terinstall.
2. Jalankan dari direktori project:

```bash
cd /path/to/simple-docker
docker-compose up --build
```

Layanan:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000 (endpoints: `/health`, `/users`)
- MySQL: port 3306 (root/rootpassword), database `testdb`

Catatan singkat:
- Frontend fetch ke `http://localhost:8000/users` supaya mudah diakses saat pengembangan lokal (karena compose memetakan port backend ke host). Jika ingin memakai proxy reverse dari nginx, bisa tambahkan konfigurasi nginx untuk proxy `/api` ke backend.

Next steps (opsional):
- Tambah env file atau secret management untuk password.
- Gunakan docker networks dan nginx proxy untuk membuat frontend memanggil backend secara relatif.
