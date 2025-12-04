// Blog content database
const blogContent = {
  blog1: `
    <h1>📦 Cara Membuat Repository di GitHub</h1>
    <p>Repository adalah tempat penyimpanan project kode kamu di GitHub. Mari kita belajar cara membuat repository dari awal!</p>

    <h2>1. Persiapan Awal</h2>
    <p>Sebelum membuat repository, pastikan kamu sudah:</p>
    <ul>
      <li>Punya akun GitHub (daftar di <code>github.com</code>)</li>
      <li>Install Git di komputer</li>
      <li>Setup Git config dengan nama dan email kamu</li>
    </ul>

    <h2>2. Membuat Repository Baru</h2>
    <h3>Lewat GitHub Website:</h3>
    <ol>
      <li>Login ke GitHub</li>
      <li>Klik tombol <strong>"+"</strong> di pojok kanan atas</li>
      <li>Pilih <strong>"New repository"</strong></li>
      <li>Isi nama repository (contoh: <code>my-first-project</code>)</li>
      <li>Tambahkan deskripsi (opsional)</li>
      <li>Pilih Public atau Private</li>
      <li>Centang "Add README file" (recommended)</li>
      <li>Klik <strong>"Create repository"</strong></li>
    </ol>

    <h2>3. Clone Repository ke Local</h2>
    <pre><code>git clone https://github.com/username/my-first-project.git
cd my-first-project</code></pre>

    <h2>4. Menambahkan File dan Push</h2>
    <pre><code># Buat file baru
echo "# My Project" > index.html

# Add file ke staging
git add .

# Commit perubahan
git commit -m "Initial commit: add index.html"

# Push ke GitHub
git push origin main</code></pre>

    <h2>5. Tips Best Practices</h2>
    <ul>
      <li>Gunakan nama repository yang <strong>jelas</strong> dan <strong>deskriptif</strong></li>
      <li>Selalu tambahkan <code>README.md</code> untuk dokumentasi</li>
      <li>Buat <code>.gitignore</code> untuk exclude files yang tidak perlu</li>
      <li>Gunakan commit message yang <strong>meaningful</strong></li>
    </ul>

    <h3>Contoh .gitignore:</h3>
    <pre><code># Node modules
node_modules/

# Environment files
.env

# OS files
.DS_Store
Thumbs.db</code></pre>

    <p>Selamat! Kamu sudah berhasil membuat repository GitHub pertama kamu! 🎉</p>
  `,

  blog2: `
    <h1>👥 Git Collaboration: Kerja Bareng dengan Tim</h1>
    <p>Belajar berkolaborasi dengan tim menggunakan Git workflow yang proper!</p>

    <h2>1. Git Branching Strategy</h2>
    <p>Branch adalah cara untuk develop fitur baru tanpa mengganggu main branch.</p>

    <h3>Membuat Branch Baru:</h3>
    <pre><code># Buat dan pindah ke branch baru
git checkout -b feature/login-page

# Atau dengan cara baru
git switch -c feature/login-page</code></pre>

    <h2>2. Workflow Collaboration</h2>
    <ol>
      <li><strong>Clone repository</strong> tim kamu</li>
      <li><strong>Buat branch</strong> untuk fitur baru</li>
      <li><strong>Develop</strong> fitur di branch tersebut</li>
      <li><strong>Commit</strong> perubahan secara berkala</li>
      <li><strong>Push</strong> branch ke remote</li>
      <li>Buat <strong>Pull Request</strong> untuk review</li>
      <li>Merge setelah approved</li>
    </ol>

    <h2>3. Menangani Merge Conflicts</h2>
    <p>Conflict terjadi ketika dua orang edit file yang sama. Begini cara handlenya:</p>

    <pre><code># Update main branch terlebih dahulu
git checkout main
git pull origin main

# Pindah ke branch kamu
git checkout feature/login-page

# Merge main ke branch kamu
git merge main

# Jika ada conflict, resolve manually
# Edit file yang conflict
# Lalu add dan commit

git add .
git commit -m "Resolve merge conflict"</code></pre>

    <h2>4. Pull Request Best Practices</h2>
    <ul>
      <li>Buat <strong>PR title</strong> yang jelas</li>
      <li>Tambahkan <strong>description</strong> lengkap tentang perubahan</li>
      <li>Link ke <strong>issue</strong> terkait jika ada</li>
      <li>Request <strong>review</strong> dari teammates</li>
      <li>Respond to feedback dengan baik</li>
    </ul>

    <h2>5. Git Commands untuk Collaboration</h2>
    <pre><code># Fetch semua perubahan dari remote
git fetch origin

# Pull perubahan dari main
git pull origin main

# Push branch ke remote
git push origin feature/login-page

# Delete branch setelah merge
git branch -d feature/login-page
git push origin --delete feature/login-page</code></pre>

    <h3>Tips Pro:</h3>
    <ul>
      <li>Selalu <code>pull</code> sebelum mulai coding</li>
      <li>Commit sering dengan message yang jelas</li>
      <li>Review kode teammates dengan konstruktif</li>
      <li>Gunakan branch naming convention: <code>feature/</code>, <code>bugfix/</code>, <code>hotfix/</code></li>
    </ul>

    <p>Happy collaborating! 🚀</p>
  `,

  blog3: `
    <h1>🚀 Install Laravel: Setup Development Environment</h1>
    <p>Laravel adalah framework PHP modern yang powerful. Mari setup environment untuk development!</p>

    <h2>1. Prerequisites</h2>
    <p>Sebelum install Laravel, pastikan sudah install:</p>
    <ul>
      <li><strong>PHP</strong> >= 8.1</li>
      <li><strong>Composer</strong> (PHP dependency manager)</li>
      <li><strong>Database</strong> (MySQL/PostgreSQL/SQLite)</li>
      <li><strong>Node.js & npm</strong> (untuk asset compilation)</li>
    </ul>

    <h2>2. Install Composer</h2>
    <p>Download dan install dari <code>getcomposer.org</code></p>

    <h3>Verifikasi Installation:</h3>
    <pre><code>composer --version</code></pre>

    <h2>3. Install Laravel via Composer</h2>
    <h3>Metode 1: Laravel Installer (Recommended)</h3>
    <pre><code># Install Laravel Installer globally
composer global require laravel/installer

# Buat project baru
laravel new my-app

# Atau dengan version spesifik
laravel new my-app --version=10.x</code></pre>

    <h3>Metode 2: Via Composer Create-Project</h3>
    <pre><code>composer create-project laravel/laravel my-app

# Dengan version spesifik
composer create-project laravel/laravel my-app "10.*"</code></pre>

    <h2>4. Setup Environment</h2>
    <pre><code># Masuk ke folder project
cd my-app

# Copy .env.example ke .env
cp .env.example .env

# Generate app key
php artisan key:generate</code></pre>

    <h2>5. Konfigurasi Database</h2>
    <p>Edit file <code>.env</code>:</p>
    <pre><code>DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_app
DB_USERNAME=root
DB_PASSWORD=</code></pre>

    <h3>Buat Database:</h3>
    <pre><code># Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE my_app;

# Exit
exit;</code></pre>

    <h2>6. Run Migration</h2>
    <pre><code>php artisan migrate</code></pre>

    <h2>7. Start Development Server</h2>
    <pre><code># Start Laravel development server
php artisan serve

# Server akan running di:
# http://127.0.0.1:8000</code></pre>

    <h2>8. Install Frontend Dependencies</h2>
    <pre><code># Install npm packages
npm install

# Compile assets
npm run dev

# Atau watch untuk auto-compile
npm run watch</code></pre>

    <h2>9. Struktur Folder Laravel</h2>
    <ul>
      <li><code>app/</code> - Application logic (Models, Controllers)</li>
      <li><code>routes/</code> - Route definitions</li>
      <li><code>resources/</code> - Views, assets</li>
      <li><code>database/</code> - Migrations, seeders</li>
      <li><code>public/</code> - Publicly accessible files</li>
      <li><code>config/</code> - Configuration files</li>
    </ul>

    <h2>10. Useful Artisan Commands</h2>
    <pre><code># Lihat semua commands
php artisan list

# Make controller
php artisan make:controller UserController

# Make model dengan migration
php artisan make:model Post -m

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear</code></pre>

    <p>Selamat! Laravel development environment kamu sudah siap! 🎉</p>
  `,

  blog4: `
    <h1>⚡ Git Commands yang Wajib Kamu Tahu</h1>
    <p>Daftar lengkap Git commands essential untuk workflow development sehari-hari!</p>

    <h2>1. Setup & Configuration</h2>
    <pre><code># Set username
git config --global user.name "Your Name"

# Set email
git config --global user.email "your@email.com"

# Check config
git config --list</code></pre>

    <h2>2. Repository Basics</h2>
    <pre><code># Initialize new repo
git init

# Clone existing repo
git clone https://github.com/user/repo.git

# Check status
git status

# Check remote
git remote -v</code></pre>

    <h2>3. Staging & Committing</h2>
    <pre><code># Add specific file
git add filename.js

# Add all changes
git add .

# Commit with message
git commit -m "Add new feature"

# Commit with detailed message
git commit -m "Title" -m "Detailed description"

# Amend last commit
git commit --amend</code></pre>

    <h2>4. Branching</h2>
    <pre><code># List all branches
git branch

# Create new branch
git branch feature/new-feature

# Switch to branch
git checkout feature/new-feature

# Create and switch (shorthand)
git checkout -b feature/new-feature

# Delete branch
git branch -d feature/new-feature

# Force delete branch
git branch -D feature/new-feature</code></pre>

    <h2>5. Merging</h2>
    <pre><code># Merge branch into current branch
git merge feature/new-feature

# Abort merge
git merge --abort</code></pre>

    <h2>6. Remote Operations</h2>
    <pre><code># Fetch changes from remote
git fetch origin

# Pull changes (fetch + merge)
git pull origin main

# Push to remote
git push origin main

# Push new branch
git push -u origin feature/new-feature

# Force push (dangerous!)
git push --force</code></pre>

    <h2>7. Viewing History</h2>
    <pre><code># View commit history
git log

# Compact log
git log --oneline

# Graph view
git log --graph --oneline --all

# Show specific commit
git show <commit-hash>

# View file changes
git diff

# View staged changes
git diff --staged</code></pre>

    <h2>8. Undoing Changes</h2>
    <pre><code># Discard changes in working directory
git checkout -- filename.js

# Unstage file
git reset HEAD filename.js

# Reset to previous commit (keep changes)
git reset --soft HEAD~1

# Reset to previous commit (discard changes)
git reset --hard HEAD~1

# Revert commit (create new commit)
git revert <commit-hash></code></pre>

    <h2>9. Stashing</h2>
    <pre><code># Stash changes
git stash

# Stash with message
git stash save "Work in progress"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply specific stash
git stash apply stash@{0}

# Pop stash (apply + delete)
git stash pop

# Delete stash
git stash drop</code></pre>

    <h2>10. Useful Shortcuts</h2>
    <pre><code># Quick commit
git commit -am "Message"  # add + commit

# Pull with rebase
git pull --rebase

# Show branch with last commit
git branch -v

# Delete remote branch
git push origin --delete branch-name

# Clean untracked files
git clean -fd</code></pre>

    <h3>Git Aliases (Bonus!):</h3>
    <p>Buat shortcut custom di <code>~/.gitconfig</code>:</p>
    <pre><code>[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all</code></pre>

    <p>Sekarang kamu bisa pakai: <code>git st</code> instead of <code>git status</code>! 🔥</p>
  `,

  blog5: `
    <h1>🤖 GitHub Actions: Automate Your Workflow</h1>
    <p>Belajar membuat CI/CD pipeline dengan GitHub Actions untuk automate testing dan deployment!</p>

    <h2>1. Apa itu GitHub Actions?</h2>
    <p>GitHub Actions adalah platform CI/CD yang built-in di GitHub. Kamu bisa automate:</p>
    <ul>
      <li>Running tests</li>
      <li>Building applications</li>
      <li>Deploying ke production</li>
      <li>Code linting & formatting</li>
    </ul>

    <h2>2. Struktur Workflow File</h2>
    <p>Workflow file disimpan di <code>.github/workflows/</code></p>

    <h3>Basic Workflow Example:</h3>
    <pre><code># .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Dependencies
      run: npm install

    - name: Run Tests
      run: npm test</code></pre>

    <h2>3. CI untuk Laravel Project</h2>
    <pre><code>name: Laravel CI

on: [push, pull_request]

jobs:
  laravel-tests:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, mysql

    - name: Install Dependencies
      run: composer install

    - name: Copy .env
      run: php -r "copy('.env.example', '.env');"

    - name: Generate Key
      run: php artisan key:generate

    - name: Run Tests
      run: php artisan test</code></pre>

    <h2>4. Deploy ke Netlify</h2>
    <pre><code>name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-deploy: true
      env:
        NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}</code></pre>

    <h2>5. Environment Secrets</h2>
    <p>Setup secrets di GitHub:</p>
    <ol>
      <li>Go to repository <strong>Settings</strong></li>
      <li>Click <strong>Secrets and variables</strong> → <strong>Actions</strong></li>
      <li>Click <strong>New repository secret</strong></li>
      <li>Add your secrets</li>
    </ol>

    <h3>Using Secrets:</h3>
    <pre><code>- name: Deploy
  env:
    API_KEY: \${{ secrets.API_KEY }}
    DATABASE_URL: \${{ secrets.DATABASE_URL }}
  run: npm run deploy</code></pre>

    <h2>6. Matrix Strategy</h2>
    <p>Test pada multiple versions:</p>
    <pre><code>jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16, 18, 20]

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}

    - run: npm install
    - run: npm test</code></pre>

    <h2>7. Useful Actions dari Marketplace</h2>
    <ul>
      <li><code>actions/checkout@v3</code> - Clone repository</li>
      <li><code>actions/setup-node@v3</code> - Setup Node.js</li>
      <li><code>actions/setup-python@v4</code> - Setup Python</li>
      <li><code>shivammathur/setup-php@v2</code> - Setup PHP</li>
      <li><code>docker/build-push-action@v4</code> - Build Docker images</li>
    </ul>

    <h2>8. Conditional Execution</h2>
    <pre><code>steps:
  - name: Deploy to Production
    if: github.ref == 'refs/heads/main'
    run: npm run deploy:prod

  - name: Deploy to Staging
    if: github.ref == 'refs/heads/develop'
    run: npm run deploy:staging</code></pre>

    <h2>9. Caching Dependencies</h2>
    <pre><code>- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-</code></pre>

    <h3>Benefits:</h3>
    <ul>
      <li>⚡ Faster workflow execution</li>
      <li>💰 Reduced build minutes usage</li>
      <li>🚀 Better developer experience</li>
    </ul>

    <p>Now automate everything! 🤖✨</p>
  `
};

// Open blog modal
function openBlogModal(blogId) {
  const modal = document.getElementById('blogModal');
  const modalBody = document.getElementById('blogModalBody');

  // Get blog title for sharing
  const blogTitles = {
    blog1: 'Cara Membuat Repository di GitHub',
    blog2: 'Git Collaboration: Kerja Bareng dengan Tim',
    blog3: 'Install Laravel: Setup Development Environment',
    blog4: 'Git Commands yang Wajib Kamu Tahu',
    blog5: 'GitHub Actions: Automate Your Workflow'
  };

  const blogTitle = blogTitles[blogId];
  const pageUrl = encodeURIComponent(window.location.href);
  const blogText = encodeURIComponent(blogTitle + ' - David Saputra Blog');

  // Create share buttons HTML
  const shareButtons = `
    <div class="share-buttons">
      <a href="https://twitter.com/intent/tweet?text=${blogText}&url=${pageUrl}" target="_blank" class="share-btn twitter">
        <svg viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
        Share
      </a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" class="share-btn facebook">
        <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Share
      </a>
      <a href="https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${blogText}" target="_blank" class="share-btn linkedin">
        <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        Share
      </a>
      <a href="https://wa.me/?text=${blogText}%20${pageUrl}" target="_blank" class="share-btn whatsapp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        Share
      </a>
      <button onclick="copyBlogLink()" class="share-btn copy">
        <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        Copy Link
      </button>
    </div>
  `;

  modalBody.innerHTML = shareButtons + blogContent[blogId];
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Add copy code buttons to all code blocks
  setTimeout(() => {
    addCopyCodeButtons();
  }, 100);
}

// Close blog modal
function closeBlogModal() {
  const modal = document.getElementById('blogModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.getElementById('blogModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeBlogModal();
  }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeBlogModal();
  }
});

// Apply tilt to blog cards
setTimeout(() => {
  const blogCards = document.querySelectorAll('.blog-card');
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(blogCards, {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2
    });
  }
}, 1500);

// Copy blog link function
function copyBlogLink() {
  const url = window.location.href;

  navigator.clipboard.writeText(url).then(() => {
    const copyBtn = document.querySelector('.share-btn.copy');
    const originalText = copyBtn.innerHTML;

    copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('copied');
    }, 2000);
  });
}

// Add copy buttons to code blocks
function addCopyCodeButtons() {
  const codeBlocks = document.querySelectorAll('.blog-modal-body pre');

  codeBlocks.forEach((block) => {
    // Skip if button already exists
    if (block.querySelector('.copy-code-btn')) return;

    // Wrap code block
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copy';

    copyBtn.addEventListener('click', function() {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });

    wrapper.appendChild(copyBtn);
  });
}

// Text Scramble Effect for Headings
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble effect on hover
setTimeout(() => {
  const scrambleElements = document.querySelectorAll('.scramble-text');
  scrambleElements.forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.textContent;

    el.addEventListener('mouseenter', () => {
      fx.setText(originalText);
    });
  });
}, 2000);
