/* Blog data — migrated from the legacy static blog (legacy/blog.html +
   public/blog-content.js). Article bodies are the original HTML, verbatim. */

import type { Tint } from "@/lib/content";

export interface BlogPost {
  /** Also the URL hash that deep-links to the article (/blog#blog1). */
  id: string;
  /** Two-digit index shown on the card. */
  number: string;
  title: string;
  excerpt: string;
  tag: string;
  tint: Tint;
  /** Original article body (trusted, authored HTML). */
  html: string;
}

/* Page chrome copy carried over from the legacy blog page. */
export const blogPage = {
  kicker: { fig: "David Saputra / Blog", label: "Notes & tutorials" },
  headingLines: ["Writing that keeps", "the craft clear."],
  lede: "Tutorials, guides and field notes on web development — Git workflows, Laravel setup, and the modern tooling I use every day.",
  countLabel: "articles published",
  readLabel: "Read article",
  dialog: {
    kicker: "Article",
    closeLabel: "Tutup artikel",
  },
  share: {
    label: "Share",
    /** Appended to the post title in shared text. */
    textSuffix: " - David Saputra Blog",
    copyLabel: "Copy Link",
    copiedLabel: "Copied!",
  },
  code: {
    copyLabel: "Copy",
    copiedLabel: "Copied!",
  },
} as const;

export const blogPosts: BlogPost[] = [
  {
    id: "blog1",
    number: "01",
    title: "Cara Membuat Repository di GitHub",
    excerpt:
      "Panduan langkah demi langkah membuat repository pertama kamu — dari setup awal, clone, sampai push commit pertama.",
    tag: "Git & GitHub",
    tint: "peach",
    html: `
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
  },
  {
    id: "blog2",
    number: "02",
    title: "Git Collaboration: Kerja Bareng dengan Tim",
    excerpt:
      "Branching strategy, pull request, dan penyelesaian merge conflict — workflow kolaborasi yang proper untuk kerja tim.",
    tag: "Git · Teamwork",
    tint: "mint",
    html: `
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
  },
  {
    id: "blog3",
    number: "03",
    title: "Install Laravel: Setup Development Environment",
    excerpt:
      "Setup environment development Laravel dari nol — Composer, struktur project, sampai aplikasi pertama berjalan.",
    tag: "Laravel",
    tint: "lilac",
    html: `
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
  },
  {
    id: "blog4",
    number: "04",
    title: "Git Commands yang Wajib Kamu Tahu",
    excerpt:
      "Kumpulan perintah Git esensial untuk kerja sehari-hari, lengkap dengan contoh penggunaan dan kapan memakainya.",
    tag: "Git · Cheatsheet",
    tint: "butter",
    html: `
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
  },
  {
    id: "blog5",
    number: "05",
    title: "GitHub Actions: Automate Your Workflow",
    excerpt:
      "Otomasi build, test, dan deploy dengan GitHub Actions — workflow, matrix strategy, caching, dan conditional execution.",
    tag: "CI/CD",
    tint: "sky",
    html: `
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
  `,
  },
];

export const getBlogPost = (id: string): BlogPost | undefined =>
  blogPosts.find((post) => post.id === id);
