import os
import shutil
import glob
import re

# 1. MOVEMENT & PATHS
if os.path.exists('html/index.html'):
    shutil.move('html/index.html', 'index.html')

if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        idx_content = f.read()

    # Paths back to root standard
    idx_content = idx_content.replace('href="../css/', 'href="css/')
    idx_content = idx_content.replace('src="../js/', 'src="js/')
    idx_content = idx_content.replace('src="../images/', 'src="images/')
    idx_content = idx_content.replace('href="../images/', 'href="images/')
    
    # Fix nested HTML links
    idx_content = idx_content.replace('href="dfa.html"', 'href="html/dfa.html"')
    idx_content = idx_content.replace('href="regex.html"', 'href="html/regex.html"')
    idx_content = idx_content.replace('href="cfg.html"', 'href="html/cfg.html"')
    idx_content = idx_content.replace('href="pda.html"', 'href="html/pda.html"')
    idx_content = idx_content.replace('href="tm.html"', 'href="html/tm.html"')
    idx_content = idx_content.replace('href="decidability.html"', 'href="html/decidability.html"')
    idx_content = idx_content.replace("window.location.href='dfa", "window.location.href='html/dfa")
    idx_content = idx_content.replace("window.location.href='regex", "window.location.href='html/regex")
    idx_content = idx_content.replace("window.location.href='cfg", "window.location.href='html/cfg")
    idx_content = idx_content.replace("window.location.href='pda", "window.location.href='html/pda")
    idx_content = idx_content.replace("window.location.href='tm", "window.location.href='html/tm")
    idx_content = idx_content.replace("window.location.href='decidability", "window.location.href='html/decidability")
    
    # Actually wait! The previous script gave index.html `href="index.html"`. Let's fix that.
    idx_content = idx_content.replace('href="../index.html"', 'href="index.html"')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx_content)

html_files = glob.glob('html/*.html')
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('href="index.html"', 'href="../index.html"')
    c = c.replace("window.location.href='index.html'", "window.location.href='../index.html'")
    with open(hf, 'w', encoding='utf-8') as f:
        f.write(c)

# 2. BACKGROUND MAPPING in CSS
bg_maps = {
    'dfa': 'dfa_bg.avif',
    'regex': 'rg_bg.avif',
    'pda': 'pda_bg.jpg',
    'cfg': 'cfg_bg.jpg',
    'tm': 'tm_bg.jpg',
    'decidability': 'decid_bg.jpg'
}

for prefix, img_name in bg_maps.items():
    css_file = f"css/{prefix}.css"
    if os.path.exists(css_file):
        with open(css_file, 'r', encoding='utf-8') as f:
            c = f.read()
            
        # Replace the dfa_bg.png fallback with specific file
        c = re.sub(r"url\([^)]*dfa_bg[^)]*\)", f"url('../images/{img_name}')", c)
        
        # Note: If it says bg_transition.avif in the `#app-page::before`, wait, the `#app-page::before` block 
        # specifically had `url('dfa_bg.png')`. My python parsing regex handles it correctly.
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(c)

# 3. SIDEBAR DRAWER AND BUTTON MODIFICATIONS

sidebar_css = """
/* ===== SIDEBAR COLLAPSE ===== */
.sidebar {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
}

/* On standard view, it might be open or closed depending on user */
.sidebar.collapsed {
    transform: translateX(-110%);
    position: absolute;
    height: 100%;
}

.sidebar-toggle-btn {
    display:flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--text-white);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-full);
    padding: 8px 16px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 101;
}
.sidebar-toggle-btn:hover {
    background: rgba(255,255,255,0.05);
}

.return-home-btn {
    background: #e5ff4d;
    color: #000000 !important;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 800;
    margin-left: 12px;
    text-decoration: none;
    font-size: 0.85rem;
    transition: var(--transition);
}
.return-home-btn:hover {
    background: #d4ec3c;
    transform: translateY(-2px);
}
"""

# Inject CSS to common.css
if os.path.exists('css/common.css'):
    with open('css/common.css', 'r', encoding='utf-8') as f:
        c = f.read()
    if 'SIDEBAR COLLAPSE' not in c:
        with open('css/common.css', 'a', encoding='utf-8') as f:
            f.write(sidebar_css)
for css in glob.glob('css/*.css'):
    if 'landing' in css: continue
    with open(css, 'r', encoding='utf-8') as f: c = f.read()
    if 'SIDEBAR COLLAPSE' not in c:
        with open(css, 'a', encoding='utf-8') as f: f.write(sidebar_css)

# Inject JS to common.js
js_sidebar = """
window.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        // Automatically start closed on mobile or let user toggle
        sidebar.classList.add('collapsed');
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
});
"""

if os.path.exists('js/common.js'):
    with open('js/common.js', 'r', encoding='utf-8') as f:
        c = f.read()
    if 'sidebarToggle' not in c:
        with open('js/common.js', 'a', encoding='utf-8') as f:
            f.write(js_sidebar)


# Fix HTML structure
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()

    # Move 'Back to Home' out of Sidebar
    content = re.sub(r'<div class="sidebar-divider"></div>\s*<button class="sidebar-btn back-btn".*?</button>', '', content, flags=re.DOTALL)
    
    # Add Return to Home to Navbar rightmost
    if 'return-home-btn' not in content:
        # Find where nav-links end
        content = content.replace('</div>\n    </nav>', '    <a href="../index.html" class="nav-link return-home-btn">Return to Home</a>\n        </div>\n    </nav>')
        
    # Inject Toggle Button inside app-layout, right before sidebar
    if 'sidebarToggle' not in content:
        toggle_btn = '<button id="sidebarToggle" class="sidebar-toggle-btn">☰ Modules</button>'
        content = content.replace('<aside class="sidebar">', f'{toggle_btn}\n            <aside class="sidebar">')
        
    with open(hf, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates applied")
