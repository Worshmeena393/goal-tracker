import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((event) => {
    // Ignore if user is typing in an input field
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true') {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Navigation shortcuts
    if (alt && key === 'h') {
      event.preventDefault();
      navigate('/');
    } else if (alt && key === 'g') {
      event.preventDefault();
      navigate('/goals');
    } else if (alt && key === 'n') {
      event.preventDefault();
      navigate('/goals/new');
    }

    // Action shortcuts
    if (ctrl && key === 'k') {
      event.preventDefault();
      // Focus search input
      const searchInput = document.querySelector('[data-testid="search-input"]');
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Theme shortcuts
    if (ctrl && shift && key === 't') {
      event.preventDefault();
      // Toggle theme
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }

    // Export shortcuts
    if (ctrl && key === 'e') {
      event.preventDefault();
      // Trigger export
      const exportButton = document.querySelector('[data-testid="export-button"]');
      if (exportButton) {
        exportButton.click();
      }
    }

    // Help shortcut
    if (key === '?') {
      event.preventDefault();
      // Show help modal or navigate to help
      console.log('Help: Keyboard Shortcuts');
      console.log('Alt+H: Home');
      console.log('Alt+G: Goals');
      console.log('Alt+N: New Goal');
      console.log('Ctrl+K: Search');
      console.log('Ctrl+Shift+T: Toggle Theme');
      console.log('Ctrl+E: Export');
      console.log('?: Help');
    }

    // Number shortcuts for quick navigation
    if (alt && key >= '1' && key <= '9') {
      event.preventDefault();
      const num = parseInt(key);
      // Navigate to specific goal or section based on number
      console.log(`Navigate to item ${num}`);
    }

    // Escape to close modals or go back
    if (key === 'escape') {
      event.preventDefault();
      // Close any open modals or go back in history
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const closeButton = modal.querySelector('[data-testid="close-button"]') || 
                          modal.querySelector('button[aria-label="Close"]') ||
                          modal.querySelector('.MuiIconButton-root');
        if (closeButton) {
          closeButton.click();
        }
      } else {
        window.history.back();
      }
    }

    // Accessibility shortcuts
    if (ctrl && key === 'a') {
      event.preventDefault();
      // Select all text in focused element
      const activeElement = document.activeElement;
      if (activeElement && activeElement.select) {
        activeElement.select();
      }
    }

    // Quick create goal
    if (ctrl && shift && key === 'n') {
      event.preventDefault();
      navigate('/goals/new');
    }

    // Refresh data
    if (ctrl && key === 'r') {
      event.preventDefault();
      // Refresh current page data
      window.location.reload();
    }

    // Focus management
    if (ctrl && key === 'tab') {
      event.preventDefault();
      // Cycle through main navigation elements
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts: {
      navigation: {
        'Alt+H': 'Home',
        'Alt+G': 'Goals',
        'Alt+N': 'New Goal',
        'Escape': 'Close/Back'
      },
      actions: {
        'Ctrl+K': 'Search',
        'Ctrl+E': 'Export',
        'Ctrl+Shift+N': 'Quick New Goal',
        'Ctrl+R': 'Refresh'
      },
      theme: {
        'Ctrl+Shift+T': 'Toggle Theme'
      },
      accessibility: {
        'Ctrl+A': 'Select All',
        'Ctrl+Tab': 'Focus Navigation',
        '?': 'Show Help'
      }
    }
  };
};

export default useKeyboardShortcuts;
