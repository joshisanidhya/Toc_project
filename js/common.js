/* ===== COMMON HELPER FUNCTIONS ===== */
function setResult(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerText = text;
        el.className = 'result-box ' + type;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const toggleBtn  = document.getElementById('sidebarToggle');
    const closeBtn   = document.getElementById('sidebarClose');
    const sidebar    = document.getElementById('sidebar');

    if (!sidebar) return;

    /* ── On desktop (≥900px): sidebar starts open, toggle hides/shows it ── */
    /* ── On mobile  (<900px): sidebar starts closed (off-canvas)         ── */

    function isMobile() { return window.innerWidth < 900; }

    function openSidebar() {
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('open');
    }

    function closeSidebar() {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('open');
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('collapsed')) {
            openSidebar();
        } else {
            closeSidebar();
        }
    }

    /* Initial state */
    if (isMobile()) {
        closeSidebar();
    } else {
        openSidebar();
    }

    /* ☰ Modules button toggles the sidebar */
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    /* ✕ Close button inside sidebar */
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSidebar();
        });
    }

    /* Click outside closes on mobile */
    document.addEventListener('click', (e) => {
        if (isMobile() &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            toggleBtn && !toggleBtn.contains(e.target)) {
            closeSidebar();
        }
    });

    /* Re-evaluate on resize */
    window.addEventListener('resize', () => {
        if (!isMobile() && sidebar.classList.contains('collapsed')) {
            openSidebar();
        }
    });
});
