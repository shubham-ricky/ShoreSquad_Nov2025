# 🌊 ShoreSquad

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

## 📋 Project Overview

ShoreSquad is a mobile-first web application designed to mobilize young people to clean beaches by combining weather tracking, interactive maps, and social features to make eco-action fun and connected.

## 🎨 Brand Identity

### Color Palette
- **Primary (Ocean Blue):** `#00B4D8` - Trust, water, action
- **Secondary (Sunset Orange):** `#FFB703` - Energy, warmth, call-to-action
- **Accent (Seafoam Green):** `#06D6A0` - Eco-friendly, fresh, success
- **Neutral Dark (Deep Ocean):** `#023047` - Text, contrast
- **Neutral Light (Sand White):** `#F8F9FA` - Backgrounds
- **Warning (Coral):** `#FB5607` - Alerts, pollution awareness

## ✨ Key Features

### JavaScript Features Implemented
- **Intersection Observer API** - Smooth scroll animations and lazy loading
- **Geolocation API** - Find nearby beach cleanups
- **LocalStorage** - Save user preferences and favorites
- **Event Delegation** - Optimized event handling for performance
- **Debouncing/Throttling** - Optimize scroll and resize events
- **Counter Animations** - Engaging number animations for stats
- **Mobile Navigation** - Responsive hamburger menu with accessibility

### UX Design Principles
1. **Mobile-First Design** - Optimized for phones at beaches
2. **Thumb-Friendly Navigation** - Easy one-handed use
3. **High Contrast** - Readable in bright sunlight
4. **Progressive Disclosure** - Essential info first
5. **Accessibility First** - ARIA labels, keyboard navigation, screen reader support
6. **Fast Load Times** - Optimized performance
7. **Gesture-Based Interactions** - Intuitive touch controls

## 📁 Project Structure

```
ShoreSquad/
├── .vscode/
│   └── settings.json          # Live Server configuration
├── css/
│   └── styles.css             # Modern CSS with custom properties
├── js/
│   └── app.js                 # Modular JavaScript application
├── .gitignore                 # Git ignore file
├── index.html                 # HTML5 boilerplate
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd ShoreSquad
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Start Live Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Or use keyboard shortcut: `Alt+L Alt+O`

The website will open in your default browser at `http://localhost:5500`

## 🎯 Features Overview

### 1. Hero Section
- Eye-catching gradient design
- Call-to-action buttons
- Animated statistics counters

### 2. Weather Widget
- Real-time beach conditions display
- Integration-ready for weather APIs
- Visual weather indicators

### 3. Cleanup Events
- Grid layout of upcoming cleanups
- Favorite/bookmark functionality
- Responsive card design

### 4. Interactive Map
- Placeholder for map integration
- Ready for Google Maps, Mapbox, or OpenStreetMap

### 5. Location Services
- Geolocation API integration
- Find nearby cleanups
- Save last known location

## 🔧 Customization

### Adding Weather API

To integrate a real weather API, update the `WeatherService` class in `js/app.js`:

```javascript
const apiKey = 'YOUR_API_KEY';
const weatherService = new WeatherService();
await weatherService.fetchWeather(lat, lon, apiKey);
```

### Customizing Colors

Edit CSS custom properties in `css/styles.css`:

```css
:root {
  --color-primary: #00B4D8;
  --color-secondary: #FFB703;
  /* Add your custom colors */
}
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

ShoreSquad is built with accessibility in mind:
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences respected

## 🎓 Learning Resources

This project demonstrates:
- Modern HTML5 best practices
- CSS Grid & Flexbox layouts
- CSS Custom Properties (Variables)
- Mobile-first responsive design
- JavaScript ES6+ features
- Class-based architecture
- LocalStorage API
- Geolocation API
- Intersection Observer API
- Event delegation patterns

## 📝 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Real-time weather data
- [ ] Interactive map with markers
- [ ] Push notifications
- [ ] Progressive Web App (PWA) features
- [ ] Social sharing capabilities
- [ ] Photo upload for cleanups
- [ ] Leaderboard and gamification

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📄 License

This project is created for educational purposes.

## 🌟 Credits

Created for C240 AI Essentials and Innovations  
**Project Name:** ShoreSquad  
**One-Line Pitch:** Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

---

Made with 💚 for the ocean 🌊
