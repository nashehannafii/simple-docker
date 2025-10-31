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

Updated ports and separate compose files:
- Frontend: http://localhost:5000 (container runs nginx on port 80)
- Backend: http://localhost:5001 (container runs Express on port 8000)
- MySQL: port 5555 (host) -> 3306 (container), credentials root/rootpassword, database `testdb`

There are now three separate docker-compose files you can use individually:

Run only DB:

```bash
docker-compose -f docker-compose.db.yml up --build
```

Run only backend (backend expects a DB at `db` if you run it together; for local dev you can run DB compose too):

```bash
docker-compose -f docker-compose.backend.yml up --build
```

Notes for running backend alone:
- The `docker-compose.backend.yml` defaults DB host to `host.docker.internal:5555` so the backend container will attempt to reach a MySQL instance listening on the host at port 5555 (this works on macOS/Windows Docker). If you started the DB using `docker-compose.db.yml`, it maps container 3306 to host 5555 so the backend will connect to it.
- Alternatively, run the DB and backend together with two compose files:

```bash
docker-compose -f docker-compose.db.yml -f docker-compose.backend.yml up --build
```

Run frontend alone:

```bash
docker-compose -f docker-compose.frontend.yml up --build
```

Frontend note:
- The frontend fetches the backend at `http://localhost:5001/users`. When you run the frontend container and access it from your browser at `http://localhost:5000` the browser will request `http://localhost:5001` on the host — make sure the backend is running and mapped to 5001 (either by running the main `docker-compose.yml` or `docker-compose.backend.yml`).

Run only frontend:

```bash
docker-compose -f docker-compose.frontend.yml up --build
```

If you want to bring up the full stack together, use the main `docker-compose.yml` which has all three services wired and will map the host ports 5000/5001/5555.

Catatan singkat:
- Frontend fetch ke `http://localhost:8000/users` supaya mudah diakses saat pengembangan lokal (karena compose memetakan port backend ke host). Jika ingin memakai proxy reverse dari nginx, bisa tambahkan konfigurasi nginx untuk proxy `/api` ke backend.

Next steps (opsional):
- Tambah env file atau secret management untuk password.
- Gunakan docker networks dan nginx proxy untuk membuat frontend memanggil backend secara relatif.
