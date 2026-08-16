# Movie / Show Watchlist

Full-stack app: Django REST Framework backend + React (Vite) frontend.
Track titles to watch, mark them watched, and rate them 1-5 stars.

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit SECRET_KEY etc. as needed
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API runs at `http://localhost:8000/api/`.

- `POST /api/auth/token/` — { username, password } -> { access, refresh }
- `GET/POST /api/media/` — list / create watchlist items
- `GET/PATCH/DELETE /api/media/<id>/` — retrieve, update (e.g. rating), delete
- `/api/media/?status=WATCHED` or `?status=UNWATCHED` — filter

By default it uses SQLite. To use PostgreSQL instead, set `POSTGRES_DB`,
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` in `.env`.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`. Log in with the superuser (or any user)
you created above — the app calls the JWT token endpoint to authenticate.

## How it fits together

**Backend**
- `IsAuthenticated` is the global default permission (`REST_FRAMEWORK` in
  `settings.py`) — every endpoint requires a valid access token unless
  explicitly opened up.
- `Media.owner` is a `ForeignKey(User)`, and `MediaViewSet.get_queryset()`
  filters on `owner=request.user`, so accounts never see each other's data.
- `TokenObtainPairView` issues an access token (1 hour) and a refresh token
  (1 day) at `POST /api/auth/token/`; `TokenRefreshView` exchanges a valid
  refresh token for a new access token at `POST /api/auth/token/refresh/`.

**Frontend**
- `src/context/AuthContext.jsx` holds the logged-in user globally and
  exposes `login()` / `logout()`.
- `src/api/axiosClient.js` is a shared Axios instance:
  - a **request interceptor** attaches `Authorization: Bearer <access>` to
    every outgoing call automatically, and
  - a **response interceptor** catches `401`s, calls the refresh endpoint
    once (in-flight refreshes are shared across concurrent requests),
    stores the new access token, and silently retries the original
    request. If the refresh itself fails, it clears tokens and redirects
    to `/login`.
- `src/components/ProtectedRoute.jsx` reads `AuthContext`; if there's no
  user it redirects to `/login`, otherwise it renders the page.
- `WatchlistPage` (behind `ProtectedRoute`) is where the tabs and star
  ratings live. Clicking a star calls `PATCH /api/media/<id>/`; the
  serializer flips `status` to `WATCHED`, so the item jumps tabs on its
  own — no extra client-side logic needed.

## Next steps / ideas

- Add a "reset rating" (unwatch) action.
- Add search/sort on the watchlist.
- Deploy backend to Render/Railway with a managed Postgres add-on, and the
  frontend to Vercel/Netlify, pointing `VITE_API_BASE_URL` at the deployed API.
