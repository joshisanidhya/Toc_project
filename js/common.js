/* ===== COMMON HELPER FUNCTIONS ===== */
function setResult(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerText = text;
        el.className = 'result-box ' + type;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        // Toggle function
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
        });

        // Close when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1000 && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                sidebar.classList.add('collapsed');
            }
        });
    }
});
