// Translations
import './I18n';

/**
 * Web only libs
 */
// enable icons fonts
import './fonts';

// add blueprint css
import '../../node_modules/@blueprintjs/core/dist/blueprint.css';

// enable offline support on web platform
if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}
