import './nw-boilerplate/context_menu';
import './nw-boilerplate/dev_helper';
import './nw-boilerplate/env_config';
import './nw-boilerplate/external_links';
import './nw-boilerplate/window_state';

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
