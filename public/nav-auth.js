// ponytail: shared auth nav updater, included on every page
(function() {
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;
  const userData = localStorage.getItem('fcc_user');
  if (userData) {
    try {
      const u = JSON.parse(userData);
      navAuth.textContent = `Lv.${u.level} ${u.email}`;
      navAuth.href = '/profile';
    } catch { /* ignore */ }
  }
})();
