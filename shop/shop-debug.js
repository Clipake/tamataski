console.log('shop-debug.js loaded in popup:', location.href);
document.addEventListener('DOMContentLoaded', () => {
  console.log('shop-debug DOMContentLoaded — shop-window exists?', !!document.querySelector('.shop-window'));
});