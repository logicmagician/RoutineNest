# RoutineNest 🏠

A **free**, **offline-first** personal productivity web app. Manage daily routines, track habits, plan meals, and budget food expenses—all without signing up, with zero cost, and complete privacy.

**Built with:** Plain HTML5, CSS3, and vanilla JavaScript (no frameworks, no dependencies)

**Status:** Phase 1 ✅ Foundation complete

---

## ✨ Features

### Current (Phase 1)
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 🎨 **Light & Dark Modes** — Automatic theme based on system preference
- 📝 **Adjustable Font Size** — 4 size options for accessibility
- 🧭 **5-Page Dashboard**
  - 🏠 **Home** — Daily overview, next task, budget summary
  - 📋 **Daily Routine** — Today's tasks with completion actions
  - 💰 **Food Budget** — Expense tracking, budget visualization
  - 📊 **Progress** — Weekly stats, habit tracking
  - ⚙️ **Settings** — Preferences, backup/restore, data management

### Coming Soon (Phases 2–6)
- ✅ Task creation, editing, and deletion with localStorage
- 🔔 Browser notifications (while app is open)
- 💾 JSON backup and restore
- 📊 Progress charts and analytics
- 📱 PWA installation to home screen
- 🚀 GitHub Pages deployment

---

## 🚀 Quick Start

### Option 1: Open Locally (Easiest)
```bash
# Download and extract the project
cd routine_nest

# Open in browser
open index.html  # macOS
start index.html # Windows
firefox index.html # Linux
```

### Option 2: Local Web Server (Recommended)
```bash
# Using Python 3 (already installed on most systems)
python3 -m http.server 8000

# Then open: http://localhost:8000
```

### Option 3: VS Code Live Server (Best for Development)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically with auto-refresh on save

---

## 📖 User Guide

### Navigation
- Click the **5 tabs** at the bottom (mobile) or top (desktop) to switch pages
- **Keyboard shortcuts:** Alt+H (Home), Alt+R (Routine), Alt+B (Budget), Alt+P (Progress), Alt+S (Settings)

### Settings Page
- **Dark Mode** — Toggle light/dark theme (respects system preference)
- **Font Size** — Choose from 4 sizes (90%, 100%, 110%, 120%)
- **Notifications** — Enable/disable (requires browser permission)
- **Budget & Currency** — Set daily budget and choose currency (default: BDT)
- **Quiet Hours** — Set notification quiet times
- **Backup** — Download all data as JSON file
- **Restore** — Upload a JSON backup to restore data
- **Delete All** — Erase all data (use carefully!)

---

## 🔒 Privacy & Data

✅ **Your data is completely private:**
- All data stored **locally in your browser** (localStorage)
- **No server**, no sign-up, no accounts
- **No analytics**, no tracking, no third-party services
- You control your data (export, import, delete)

⚠️ **Data Limitations:**
- Data only persists in that browser on that device
- Clearing browser cache will erase all data (use backup/restore!)
- ~10 MB localStorage limit (enough for 5,000–10,000 tasks/expenses)

---

## 🌐 Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Full support, recommended |
| Firefox | ✅ | ✅ | Full support |
| Safari | ✅ | ✅ | iOS 12+, full support |
| Edge | ✅ | ✅ | Full support |
| Opera | ✅ | ✅ | Full support |

---

## 📱 Mobile & PWA

### Install to Home Screen
1. **Android Chrome:** Tap menu → "Install app" or "Add to Home screen"
2. **iOS Safari:** Tap share icon → "Add to Home Screen"
3. App opens like a native app (full screen, no browser UI)

### Offline Support
- App loads offline (cached assets)
- **Data persists** in localStorage even without internet
- Browser notifications require browser to be open

---

## 🔔 Notifications

### How They Work
✅ **Notifications work when:**
- Browser is open (any tab, foreground or background)
- You've granted notification permission
- Within notification quiet hours

❌ **Notifications don't work when:**
- Browser is completely closed
- Device is sleeping/locked (browser/OS limitation)

**💡 Tip:** Install the app to home screen for easier access and notifications while app is in use.

---

## 📂 Project Structure

```
routine_nest/
├── index.html                   # Single-page app (all 5 pages)
├── manifest.json                # PWA metadata
├── service-worker.js            # Offline support
├── README.md                     # This file
├── .gitignore                    # Git ignore
│
├── css/
│   └── style.css                # All styling (responsive, light/dark)
│
├── js/
│   └── app.js                   # Routing, theme, app logic
│
├── images/
│   ├── icon-192x192.png         # App icon (small)
│   └── icon-512x512.png         # App icon (large)
│
├── PROJECT_SPEC.md              # Requirements
├── IMPLEMENTATION_PLAN.md       # Architecture
├── HANDOFF.md                   # Progress tracking
└── PHASE_1_GUIDE.md             # Phase 1 instructions
```

---

## 🛠️ Development

### Testing Locally
```bash
# Start local server
python3 -m http.server 8000

# Open http://localhost:8000 in browser
# Press F12 to open DevTools
```

### Browser DevTools (F12)
- **Console:** Check for JavaScript errors
- **Application → Local Storage:** Verify data persistence
- **Application → Service Workers:** Check PWA registration
- **Responsive Design Mode (Ctrl/Cmd+Shift+M):** Test mobile layouts
- **Network → Offline:** Test offline functionality

### Common Debugging
1. **Pages don't show?** Check `console.log` output and CSS loading
2. **Navigation doesn't work?** Verify JavaScript loaded (no errors in Console)
3. **Styling broken?** Clear browser cache (Ctrl+Shift+Delete)
4. **Responsive design wrong?** Try different viewport sizes in DevTools

---

## 🚀 Deployment

### GitHub Pages (Free Hosting)

1. **Create GitHub account** (free) at https://github.com
2. **Create new repository** named `routine_nest`
3. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Phase 1: Foundation"
   git remote add origin https://github.com/YOUR_USERNAME/routine_nest.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Select "main" branch as source
   - Save

5. **Visit your app:**
   - `https://YOUR_USERNAME.github.io/routine_nest/`
   - ✅ HTTPS automatic (required for PWA)
   - ✅ App installable to home screen

---

## 📝 Notes

### Phase 1 (Current) ✅
- ✅ Foundation complete
- ✅ 5 pages built
- ✅ Navigation working
- ✅ Theme switching works
- ✅ Font size adjustment works
- ⏳ **Data not saved yet** (Phase 2)

### Phase 2 (Next)
- localStorage implementation
- Task creation/editing
- Expense tracking
- Web Notifications API setup

### Phases 3–6
- Food budget calculations
- Settings persistence
- Progress charts
- Offline support
- GitHub Pages deployment

---

## 🤝 Contributing

This is a personal project built for learning. Feel free to:
- Fork the repository
- Modify for your own use
- Submit issues or improvements via GitHub

---

## 📜 License

Free to use, modify, and distribute. No restrictions.

---

## 🙋 Help & Support

### Issue: Pages don't load
1. Check browser console (F12) for errors
2. Verify all files exist in correct folders
3. Try refreshing (Ctrl+R or Cmd+R)
4. Clear cache and reload (Ctrl+Shift+Delete)

### Issue: Dark mode doesn't work
1. Toggle "Dark Mode" in Settings
2. Check browser DevTools: Application → Local Storage → `routineNest_theme`
3. System preference respected if not set manually

### Issue: Notifications not showing
1. Grant permission when prompted
2. Check browser is open
3. Not in quiet hours time range
4. Try Settings → Notifications → toggle on/off

### Issue: Data disappeared
⚠️ Did you clear browser cache? **Always backup first!**
- Settings → Backup → Export to download JSON file
- That file contains all your data

---

## 🎉 Thanks for Using RoutineNest!

Built with ❤️ in plain JavaScript. No frameworks, no complexity, just a simple, functional productivity app.

Happy organizing! 📚✨

---

**Version:** 1.0 (Phase 1)  
**Last Updated:** October 25, 2026  
**Status:** ✅ Foundation Complete, Ready for Phase 2# RoutineNest
