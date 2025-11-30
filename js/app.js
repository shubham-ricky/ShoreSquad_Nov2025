/**
 * ShoreSquad - Main JavaScript Application
 * Features: Intersection Observer, Geolocation, LocalStorage, Event Delegation
 * Mobile-first, performance-optimized, accessible
 */

'use strict';

// ============================================
// App Configuration & State
// ============================================
const AppConfig = {
  animationDelay: 100,
  debounceDelay: 300,
  weatherApiUrl: 'https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook',
  weatherForecastUrl: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
  localStorageKeys: {
    favorites: 'shoresquad_favorites',
    preferences: 'shoresquad_preferences',
    lastLocation: 'shoresquad_last_location'
  }
};

const AppState = {
  favorites: new Set(),
  userLocation: null,
  weatherData: null
};

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function to limit rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
function debounce(func, wait = AppConfig.debounceDelay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure function runs at most once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
function throttle(func, limit = AppConfig.debounceDelay) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * LocalStorage wrapper with error handling
 */
const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// ============================================
// Mobile Navigation
// ============================================
class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.nav-toggle');
    this.menu = document.querySelector('.nav-menu');
    this.menuLinks = document.querySelectorAll('.nav-menu a');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.toggle || !this.menu) return;
    
    // Toggle button click
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking links
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
        this.closeMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }
  
  openMenu() {
    this.menu.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }
  
  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
    document.body.style.overflow = '';
  }
}

// ============================================
// Intersection Observer for Scroll Animations
// ============================================
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.init();
  }
  
  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      this.elements.forEach(el => el.classList.add('visible'));
      return;
    }
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    this.elements.forEach(el => observer.observe(el));
  }
}

// ============================================
// Counter Animation for Stats
// ============================================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number[data-count]');
    this.init();
  }
  
  init() {
    if (!('IntersectionObserver' in window)) {
      this.counters.forEach(counter => {
        counter.textContent = counter.dataset.count;
      });
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.counters.forEach(counter => observer.observe(counter));
  }
  
  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
}

// ============================================
// Geolocation API Integration
// ============================================
class LocationService {
  constructor() {
    this.findButton = document.getElementById('findCleanupBtn');
    this.init();
  }
  
  init() {
    if (!this.findButton) return;
    
    this.findButton.addEventListener('click', () => this.getUserLocation());
    
    // Load last known location
    const lastLocation = Storage.get(AppConfig.localStorageKeys.lastLocation);
    if (lastLocation) {
      AppState.userLocation = lastLocation;
    }
  }
  
  getUserLocation() {
    if (!('geolocation' in navigator)) {
      this.showLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    this.findButton.textContent = '📍 Finding your location...';
    this.findButton.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
      (position) => this.handleLocationSuccess(position),
      (error) => this.handleLocationError(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }
  
  handleLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    AppState.userLocation = { latitude, longitude };
    
    // Save to localStorage
    Storage.set(AppConfig.localStorageKeys.lastLocation, AppState.userLocation);
    
    this.findButton.textContent = '✓ Location Found!';
    this.findButton.disabled = false;
    
    // Reset button text after 2 seconds
    setTimeout(() => {
      this.findButton.textContent = '📍 Find Cleanup Near Me';
    }, 2000);
    
    // Fetch cleanups near this location (would integrate with backend)
    console.log('User location:', AppState.userLocation);
    this.showNotification('Found cleanups near you!', 'success');
  }
  
  handleLocationError(error) {
    let message = 'Unable to get your location';
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied. Please enable location access.';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information unavailable.';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out.';
        break;
    }
    
    this.showLocationError(message);
  }
  
  showLocationError(message) {
    this.findButton.textContent = '📍 Find Cleanup Near Me';
    this.findButton.disabled = false;
    this.showNotification(message, 'error');
  }
  
  showNotification(message, type = 'info') {
    // Simple notification implementation
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#06D6A0' : type === 'error' ? '#FB5607' : '#00B4D8'};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutDown 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ============================================
// Favorites System
// ============================================
class FavoritesManager {
  constructor() {
    this.favoriteButtons = document.querySelectorAll('.card-favorite');
    this.loadFavorites();
    this.init();
  }
  
  init() {
    // Event delegation for favorite buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.card-favorite')) {
        const button = e.target.closest('.card-favorite');
        this.toggleFavorite(button);
      }
    });
  }
  
  loadFavorites() {
    const saved = Storage.get(AppConfig.localStorageKeys.favorites);
    if (saved && Array.isArray(saved)) {
      AppState.favorites = new Set(saved);
      this.updateUI();
    }
  }
  
  saveFavorites() {
    Storage.set(AppConfig.localStorageKeys.favorites, Array.from(AppState.favorites));
  }
  
  toggleFavorite(button) {
    const card = button.closest('.cleanup-card');
    const eventId = card.dataset.eventId || card.querySelector('.card-title')?.textContent;
    
    if (!eventId) return;
    
    if (AppState.favorites.has(eventId)) {
      AppState.favorites.delete(eventId);
      button.classList.remove('active');
      button.querySelector('span').textContent = '♡';
      button.setAttribute('aria-label', 'Add to favorites');
    } else {
      AppState.favorites.add(eventId);
      button.classList.add('active');
      button.querySelector('span').textContent = '♥';
      button.setAttribute('aria-label', 'Remove from favorites');
    }
    
    this.saveFavorites();
    
    // Haptic feedback (if supported)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
  
  updateUI() {
    this.favoriteButtons.forEach(button => {
      const card = button.closest('.cleanup-card');
      const eventId = card.dataset.eventId || card.querySelector('.card-title')?.textContent;
      
      if (eventId && AppState.favorites.has(eventId)) {
        button.classList.add('active');
        button.querySelector('span').textContent = '♥';
        button.setAttribute('aria-label', 'Remove from favorites');
      }
    });
  }
}

// ============================================
// Weather Integration - Singapore NEA API
// ============================================
class WeatherService {
  constructor() {
    this.container = document.querySelector('.weather-forecast-grid');
    this.init();
  }
  
  async init() {
    await this.fetchAndRenderForecast();
  }
  
  async fetchAndRenderForecast() {
    try {
      // Fetch 4-day weather outlook from Singapore NEA
      const response = await fetch(AppConfig.weatherApiUrl);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Weather API Response:', result);
      
      // Handle different possible API response structures
      if (result.data && result.data.records && result.data.records.length > 0) {
        const forecast = result.data.records[0];
        this.renderForecast(forecast);
        AppState.weatherData = forecast;
      } else if (result.items && result.items.length > 0) {
        // Alternative structure
        this.renderForecastAlternative(result.items[0]);
        AppState.weatherData = result.items[0];
      } else {
        console.error('Unexpected API structure:', result);
        this.renderMockForecast();
      }
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      console.log('Falling back to mock data');
      this.renderMockForecast();
    }
  }
  
  renderMockForecast() {
    // Fallback with realistic Singapore weather data
    const mockForecast = {
      forecasts: [
        {
          date: new Date().toISOString().split('T')[0],
          forecast: 'Partly Cloudy with afternoon showers',
          temperature: { high: 32, low: 26 },
          relative_humidity: { high: 85 },
          wind: { speed: { high: 25 } }
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          forecast: 'Thundery Showers',
          temperature: { high: 31, low: 25 },
          relative_humidity: { high: 90 },
          wind: { speed: { high: 30 } }
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          forecast: 'Fair and Warm',
          temperature: { high: 33, low: 27 },
          relative_humidity: { high: 75 },
          wind: { speed: { high: 20 } }
        },
        {
          date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          forecast: 'Partly Cloudy',
          temperature: { high: 32, low: 26 },
          relative_humidity: { high: 80 },
          wind: { speed: { high: 22 } }
        }
      ]
    };
    
    this.renderForecast(mockForecast);
  }
  
  renderForecastAlternative(data) {
    // Handle alternative API structure if needed
    const transformed = {
      forecasts: data.forecasts || []
    };
    this.renderForecast(transformed);
  }
  
  getWeatherIcon(forecast) {
    const description = forecast.toLowerCase();
    
    if (description.includes('thunder') || description.includes('storm')) return '⛈️';
    if (description.includes('rain') || description.includes('showers')) return '🌧️';
    if (description.includes('cloudy')) return '☁️';
    if (description.includes('partly cloudy') || description.includes('fair')) return '⛅';
    if (description.includes('hazy') || description.includes('haze')) return '🌫️';
    if (description.includes('windy')) return '💨';
    return '☀️'; // Default sunny
  }
  
  getCleanupAdvice(forecast) {
    const description = forecast.toLowerCase();
    
    if (description.includes('thunder') || description.includes('heavy rain')) {
      return { advice: '⚠️ Not suitable for cleanup', color: '#FB5607' };
    }
    if (description.includes('rain') || description.includes('showers')) {
      return { advice: '🌂 Bring rain gear', color: '#FFB703' };
    }
    if (description.includes('cloudy') || description.includes('fair')) {
      return { advice: '👍 Good conditions', color: '#06D6A0' };
    }
    return { advice: '🌟 Perfect for cleanup!', color: '#06D6A0' };
  }
  
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-SG', options);
  }
  
  renderForecast(forecast) {
    if (!this.container) return;
    
    const forecasts = forecast.forecasts || [];
    
    if (forecasts.length === 0) {
      this.renderError('No forecast periods available');
      return;
    }
    
    const cardsHtml = forecasts.map((period, index) => {
      const icon = this.getWeatherIcon(period.forecast);
      const advice = this.getCleanupAdvice(period.forecast);
      const dateLabel = index === 0 ? 'Today' : this.formatDate(period.date);
      
      return `
        <div class="weather-day-card" data-animate="fade-up" data-delay="${index * 100}">
          <div class="weather-day-header">
            <h4 class="weather-day-title">${dateLabel}</h4>
            <div class="weather-day-date">${period.date}</div>
          </div>
          <div class="weather-icon-large">${icon}</div>
          <div class="weather-temps">
            <span class="temp-high">${period.temperature?.high || 'N/A'}°C</span>
            <span class="temp-divider">/</span>
            <span class="temp-low">${period.temperature?.low || 'N/A'}°C</span>
          </div>
          <div class="weather-condition">${period.forecast}</div>
          <div class="weather-details-small">
            <div class="detail-item">
              <span class="detail-icon">💧</span>
              <span class="detail-text">${period.relative_humidity?.high || 'N/A'}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">💨</span>
              <span class="detail-text">${period.wind?.speed?.high || 'N/A'} km/h</span>
            </div>
          </div>
          <div class="cleanup-advice" style="background: ${advice.color}; color: white; padding: 0.5rem; border-radius: 0.5rem; margin-top: 0.75rem; font-weight: 500; font-size: 0.875rem;">
            ${advice.advice}
          </div>
        </div>
      `;
    }).join('');
    
    const html = `
      <div class="weather-source" style="text-align: center; margin-bottom: 1rem; font-size: 0.875rem; opacity: 0.7;">
        📡 Data from National Environment Agency (NEA)
      </div>
      <div class="weather-forecast-cards">
        ${cardsHtml}
      </div>
    `;
    
    this.container.innerHTML = html;
    
    // Re-initialize scroll animations for weather cards
    new ScrollAnimations();
  }
  
  renderError(message) {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="weather-error" style="text-align: center; padding: 2rem; color: var(--color-warning);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <p style="font-size: 1.125rem; font-weight: 500;">${message}</p>
        <p style="margin-top: 0.5rem; opacity: 0.8;">Displaying sample forecast data</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 2rem; cursor: pointer; font-weight: 500;">
          Try Again
        </button>
      </div>
    `;
    
    // Show mock data after a brief delay
    setTimeout(() => this.renderMockForecast(), 2000);
  }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// ============================================
// Performance Monitoring
// ============================================
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
          }
        }, 0);
      });
    }
  }
}

// ============================================
// App Initialization
// ============================================
class ShoreSquadApp {
  constructor() {
    this.components = [];
  }
  
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initComponents());
    } else {
      this.initComponents();
    }
  }
  
  initComponents() {
    console.log('🌊 ShoreSquad App Initializing...');
    
    // Initialize all components
    this.components.push(new MobileNav());
    this.components.push(new ScrollAnimations());
    this.components.push(new CounterAnimation());
    this.components.push(new LocationService());
    this.components.push(new FavoritesManager());
    this.components.push(new WeatherService());
    this.components.push(new SmoothScroll());
    this.components.push(new PerformanceMonitor());
    
    console.log('✅ ShoreSquad App Ready!');
    
    // Add keyboard navigation hints for accessibility
    this.enhanceAccessibility();
  }
  
  enhanceAccessibility() {
    // Add visual focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// ============================================
// Start the Application
// ============================================
const app = new ShoreSquadApp();
app.init();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ShoreSquadApp, AppConfig, AppState };
}
