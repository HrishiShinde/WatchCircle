<div align="center">

```
██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗ ██████╗██╗██████╗  ██████╗██╗     ███████╗
██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║██╔════╝██║██╔══██╗██╔════╝██║     ██╔════╝
██║ █╗ ██║███████║   ██║   ██║     ███████║██║     ██║██████╔╝██║     ██║     █████╗  
██║███╗██║██╔══██║   ██║   ██║     ██╔══██║██║     ██║██╔══██╗██║     ██║     ██╔══╝  
╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║╚██████╗██║██║  ██║╚██████╗███████╗███████╗
 ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
```

**Track. Rate. Discover. Together.**

*A collaborative movie tracking app for you and your circle.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=flat-square)](https://www.themoviedb.org)

</div>

---

## What is WatchCircle?

WatchCircle is a collaborative movie tracking web app built for groups of friends who want to share, rate, and discover movies together. Add movies to a shared list, rate them after watching, and let **CirclePicks** surprise you with a random unwatched pick for movie night.

**Phase 2** will introduce private *Circles* — friend groups with their own watchlists, Circle Ratings, and shared discovery features.

---

## Features

### 🎬 Movie Management
- Add movies via **live TMDB search** — poster, genre, runtime, and release year auto-fill instantly
- Can't find a movie? Add it **manually** with custom details
- **Edit** any movie you added — title, genres, platform, watch link, and poster
- **Delete** movies you added (moderators can edit/delete any movie)
- Movies are shared across all users in real time

### ⭐ Ratings & Watching
- Rate movies out of 10 to mark them as watched
- Per-user watched status — your watch history is your own
- Community **average rating** auto-computed across all user ratings via a Postgres trigger
- Rating labels from *Terrible* to *Masterpiece*

### 🎲 CirclePicks
- Hit **CirclePicks** and get a dramatically revealed random unwatched movie suggestion
- Jump straight into the movie detail to rate it or add a watch link

### 🔍 Search & Filter
- **Search** by title or genre
- Filter by **All / Watched / Unwatched**
- **Genre filter pills** — auto-built from your actual movie list, color-coded per genre
- Stats bar showing total movies, watched count, unwatched count, and average rating

### 🎨 Design
- Dark charcoal cinema aesthetic with yellow / red / teal accents
- **Bebas Neue** display font + **Outfit** body font
- Genre-colored gradient poster fallbacks when no TMDB image is available
- Full **light / dark mode** toggle, persisted across sessions
- Responsive — works on mobile and desktop

### 🔐 Auth & Permissions
- Email/password sign up and login via Supabase Auth
- Profiles auto-created on signup with display name
- **Moderator flag** — moderators can edit or delete any movie
- Row Level Security (RLS) enforced at the database level

---

## Security Notes

- RLS is enabled on all tables — the anon key alone gives no unauthorized access
- `auth.uid()` is injected server-side by Supabase on every request
- The service role key is never used in the frontend
- Add your production domain to Supabase's **Allowed Origins** for extra hardening

---

## Acknowledgements

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org)
- Built with [Supabase](https://supabase.com), [Vite](https://vitejs.dev), and [React](https://react.dev)
- Icons by [Lucide](https://lucide.dev)
- Fonts: [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) + [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts

---

<div align="center">

Made with 🎬 and a lot of ☕

*Built by Hrishi with a little help from Sauce 🤌*

</div>