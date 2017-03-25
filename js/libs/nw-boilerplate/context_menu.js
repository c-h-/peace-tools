// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

(function () {
  const gui = require('nw.gui');

  const cut = new gui.MenuItem({
    label: 'Cut',
    click() {
      document.execCommand('cut');
    },
  });

  const copy = new gui.MenuItem({
    label: 'Copy',
    click() {
      document.execCommand('copy');
    },
  });

  const paste = new gui.MenuItem({
    label: 'Paste',
    click() {
      document.execCommand('paste');
    },
  });

  const textMenu = new gui.Menu();
  textMenu.append(cut);
  textMenu.append(copy);
  textMenu.append(paste);

  document.addEventListener('contextmenu', (e) => {
    switch (e.target.nodeName) {
      case 'TEXTAREA':
      case 'INPUT':
        e.preventDefault();
        textMenu.popup(e.x, e.y);
        break;
    }
  }, false);
}());
