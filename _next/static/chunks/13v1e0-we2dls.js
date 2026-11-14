(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52482,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(74080),i=e.i(88653),n=e.i(46932),o=e.i(64978),l=e.i(72328),s=e.i(10542),c=e.i(91994),d=e.i(42875),m=e.i(487),p=e.i(43397),u=e.i(89170);let h="David Saputra / Blog",g="Notes & tutorials",b=["Writing that keeps","the craft clear."],f="Article",x="Tutup artikel",k="Share",v=" - David Saputra Blog",y="Copy Link",w="Copied!",j="Copy",_="Copied!",C=[{id:"blog1",number:"01",title:"Cara Membuat Repository di GitHub",excerpt:"Panduan langkah demi langkah membuat repository pertama kamu — dari setup awal, clone, sampai push commit pertama.",tag:"Git & GitHub",tint:"peach",html:`
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
  `},{id:"blog2",number:"02",title:"Git Collaboration: Kerja Bareng dengan Tim",excerpt:"Branching strategy, pull request, dan penyelesaian merge conflict — workflow kolaborasi yang proper untuk kerja tim.",tag:"Git · Teamwork",tint:"mint",html:`
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
  `},{id:"blog3",number:"03",title:"Install Laravel: Setup Development Environment",excerpt:"Setup environment development Laravel dari nol — Composer, struktur project, sampai aplikasi pertama berjalan.",tag:"Laravel",tint:"lilac",html:`
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
  `},{id:"blog4",number:"04",title:"Git Commands yang Wajib Kamu Tahu",excerpt:"Kumpulan perintah Git esensial untuk kerja sehari-hari, lengkap dengan contoh penggunaan dan kapan memakainya.",tag:"Git · Cheatsheet",tint:"butter",html:`
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
  `},{id:"blog5",number:"05",title:"GitHub Actions: Automate Your Workflow",excerpt:"Otomasi build, test, dan deploy dengan GitHub Actions — workflow, matrix strategy, caching, dan conditional execution.",tag:"CI/CD",tint:"sky",html:`
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
  `}],N=e=>C.find(t=>t.id===e);var S=e.i(8803),A=e.i(33209);let D=[.16,1,.3,1],P=/<pre><code>([\s\S]*?)<\/code><\/pre>/g;function R(e){return e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&")}let E=(0,A.cn)("blog-prose text-[0.98rem] leading-[1.75] text-ink sm:text-[1.02rem]","[&_h1]:display [&_h1]:mb-5 [&_h1]:text-[clamp(1.9rem,5.2vw,3.1rem)] [&_h1]:leading-[0.98] [&_h1]:text-balance","[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-sans [&_h2]:text-[1.3rem] [&_h2]:leading-snug [&_h2]:font-bold [&_h2]:tracking-[-0.01em] sm:[&_h2]:text-[1.45rem]","[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-mono [&_h3]:text-[0.74rem] [&_h3]:font-medium [&_h3]:tracking-[0.12em] [&_h3]:text-sage-ink [&_h3]:uppercase","[&_p]:mb-4 [&_p]:text-ink-soft [&_h1+p]:text-[1.08rem] [&_h1+p]:text-ink","[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-ink-soft [&_ul]:marker:text-accent","[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-ink-soft [&_ol]:marker:font-mono [&_ol]:marker:text-[0.8em] [&_ol]:marker:text-sage-ink","[&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink","[&_code]:rounded-md [&_code]:border [&_code]:border-line [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.84em] [&_code]:break-words [&_code]:text-ink","[&_a]:font-medium [&_a]:text-accent-ink [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:hover:text-ink","[&_blockquote]:my-6 [&_blockquote]:rounded-2xl [&_blockquote]:border [&_blockquote]:border-line [&_blockquote]:bg-butter [&_blockquote]:px-5 [&_blockquote]:py-4","[&_img]:my-6 [&_img]:h-auto [&_img]:rounded-2xl [&_img]:border [&_img]:border-line [&_img]:shadow-soft","[&_hr]:my-8 [&_hr]:border-line","[&_table]:my-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-[0.9rem]","[&_th]:border-b [&_th]:border-line [&_th]:bg-card [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-mono [&_th]:text-[0.72rem] [&_th]:tracking-[0.1em] [&_th]:uppercase","[&_td]:border-b [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top","[&>*:first-child]:mt-0 [&>*:last-child]:mb-0");function L({d:e,className:a}){return(0,t.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",className:a,children:(0,t.jsx)("path",{d:e})})}let B="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",M="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",H=[{name:"X / Twitter",href:(e,t)=>`https://twitter.com/intent/tweet?text=${t}&url=${e}`,icon:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"},{name:"Facebook",href:e=>`https://www.facebook.com/sharer/sharer.php?u=${e}`,icon:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"},{name:"LinkedIn",href:(e,t)=>`https://www.linkedin.com/shareArticle?mini=true&url=${e}&title=${t}`,icon:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"},{name:"WhatsApp",href:(e,t)=>`https://wa.me/?text=${t}%20${e}`,icon:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"}];function T(){let[e,t]=(0,a.useState)(!1),r=(0,a.useRef)(null);return(0,a.useEffect)(()=>()=>{null!==r.current&&window.clearTimeout(r.current)},[]),{copied:e,copy:(0,a.useCallback)(e=>{navigator.clipboard&&navigator.clipboard.writeText(e).then(()=>{t(!0),null!==r.current&&window.clearTimeout(r.current),r.current=window.setTimeout(()=>t(!1),2e3)},()=>void 0)},[])}}function I({code:e}){let{copied:a,copy:r}=T();return(0,t.jsxs)("div",{className:"my-6 overflow-hidden rounded-2xl border border-ink bg-ink text-bg shadow-soft",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between gap-3 border-b border-bg/10 py-2 pr-2 pl-4",children:[(0,t.jsxs)("span",{"aria-hidden":"true",className:"flex gap-1.5",children:[(0,t.jsx)("span",{className:"size-2.5 rounded-full bg-pink"}),(0,t.jsx)("span",{className:"size-2.5 rounded-full bg-butter"}),(0,t.jsx)("span",{className:"size-2.5 rounded-full bg-mint"})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>r(e),className:(0,A.cn)("label-mono inline-flex h-8 items-center gap-1.5 rounded-[4px] border-[1.5px] px-3 text-[0.64rem]","transition-colors duration-300 focus-visible:outline-bg",a?"border-mint bg-mint text-ink":"border-bg/25 bg-bg/10 text-bg hover:bg-bg hover:text-ink"),children:[(0,t.jsx)(L,{d:a?M:B,className:"size-3"}),(0,t.jsx)("span",{"aria-live":"polite",children:a?_:j})]})]}),(0,t.jsx)("pre",{className:"overflow-x-auto overscroll-x-contain px-4 py-4 font-mono text-[0.8rem] leading-[1.7] sm:px-5 sm:text-[0.84rem]",children:(0,t.jsx)("code",{children:e})})]})}function G({post:e}){let{copied:r,copy:i}=T(),[n]=(0,a.useState)(()=>`${window.location.origin}${window.location.pathname}#${e.id}`),o=encodeURIComponent(n),l=encodeURIComponent(e.title+v),s=(0,A.cn)("tab tab-press label-mono inline-flex h-9 items-center gap-2 bg-card px-3.5 text-[0.66rem] text-ink [--tab-depth:2px]");return(0,t.jsxs)("ul",{className:"mb-8 flex flex-wrap gap-2 border-b border-line pb-6",children:[H.map(e=>(0,t.jsx)("li",{children:(0,t.jsxs)("a",{href:e.href(o,l),target:"_blank",rel:"noopener noreferrer","aria-label":`${k} — ${e.name}`,className:s,children:[(0,t.jsx)(L,{d:e.icon,className:"size-3.5"}),k]})},e.name)),(0,t.jsx)("li",{children:(0,t.jsxs)("button",{type:"button",onClick:()=>i(n),className:(0,A.cn)(s,r&&"bg-mint"),children:[(0,t.jsx)(L,{d:r?M:B,className:"size-3.5"}),(0,t.jsx)("span",{"aria-live":"polite",children:r?w:y})]})})]})}function z({post:e,onClose:r}){let i=(0,l.useReducedMotion)(),d=(0,o.useIsPresent)(),m=(0,a.useRef)(null),p=(0,a.useRef)(null),u=(0,a.useRef)(null),h=(0,a.useMemo)(()=>(function(e){let t=[],a=0;for(let r of e.matchAll(P)){let i=r.index??0,n=e.slice(a,i);n.trim()&&t.push({kind:"html",html:n}),t.push({kind:"code",code:R(r[1]??"")}),a=i+r[0].length}let r=e.slice(a);return r.trim()&&t.push({kind:"html",html:r}),t})(e.html),[e.html]),{scrollYProgress:g}=(0,s.useScroll)({container:p}),b=(0,c.useSpring)(g,{stiffness:220,damping:32,restDelta:.001});(0,a.useEffect)(()=>{u.current?.focus({preventScroll:!0})},[]),(0,a.useEffect)(()=>{if(!d)return;let e=document.documentElement,t=Math.max(0,window.innerWidth-e.clientWidth);return e.style.overflow="hidden",t>0&&(e.style.paddingRight=`${t}px`),e.style.setProperty("--sbw",`${t}px`),()=>{e.style.overflow="",e.style.paddingRight="",e.style.removeProperty("--sbw")}},[d]),(0,a.useEffect)(()=>{if(!d)return;let e=e=>{if("Escape"===e.key){e.preventDefault(),r();return}if("Tab"!==e.key)return;let t=m.current;if(!t)return;let a=Array.from(t.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')),i=a[0],n=a[a.length-1];if(!i||!n)return;let o=document.activeElement;t.contains(o)?e.shiftKey&&o===i?(e.preventDefault(),n.focus()):e.shiftKey||o!==n||(e.preventDefault(),i.focus()):(e.preventDefault(),i.focus())};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[r,d]);let k={duration:0};return(0,t.jsxs)("div",{"data-lenis-prevent":!0,className:(0,A.cn)("fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6 lg:p-10",!d&&"pointer-events-none"),children:[(0,t.jsx)(n.motion.div,{"aria-hidden":"true",onClick:r,className:"absolute inset-0 bg-ink/45 backdrop-blur-[6px]",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:i?k:{duration:.5,ease:D}}),(0,t.jsxs)(n.motion.div,{ref:m,role:"dialog","aria-modal":"true","aria-label":e.title,className:(0,A.cn)("relative flex w-full max-w-[52rem] flex-col overflow-hidden border border-line bg-bg shadow-lift","h-[94dvh] rounded-t-[1.75rem] sm:h-auto sm:max-h-[min(90dvh,60rem)] sm:rounded-[2rem]"),initial:i?{opacity:0}:{opacity:0,y:64,scale:.97},animate:i?{opacity:1}:{opacity:1,y:0,scale:1},exit:i?{opacity:0}:{opacity:0,y:40,scale:.98},transition:i?k:{duration:.7,ease:D},children:[(0,t.jsxs)("header",{className:"relative flex shrink-0 items-center justify-between gap-3 border-b border-line py-3 pr-3 pl-5 sm:pl-7",style:{backgroundColor:(0,S.tintVar)(e.tint)},children:[(0,t.jsxs)("p",{className:"label-mono flex min-w-0 items-center gap-2.5 text-ink",children:[(0,t.jsxs)("span",{className:"shrink-0",children:[f," ",(0,t.jsx)("span",{"aria-hidden":"true",children:"·"})," ",e.number]}),(0,t.jsx)("span",{className:"truncate rounded-full border border-ink/15 bg-card/70 px-2.5 py-1 text-[0.64rem]",children:e.tag})]}),(0,t.jsx)("button",{ref:u,type:"button",onClick:r,"aria-label":x,className:(0,A.cn)("tab tab-press group/close grid size-10 shrink-0 place-items-center bg-card text-ink","hover:bg-ink hover:text-bg"),children:(0,t.jsx)("svg",{viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",className:"size-3.5 transition-transform duration-500 ease-out-expo group-hover/close:rotate-90",children:(0,t.jsx)("path",{d:"M3 3l10 10M13 3 3 13",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})})}),(0,t.jsx)(n.motion.span,{"aria-hidden":"true",className:"absolute inset-x-0 -bottom-px h-[3px] origin-left bg-accent",style:{scaleX:i?g:b}})]}),(0,t.jsxs)("div",{ref:p,"data-lenis-prevent":!0,tabIndex:0,className:"relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 pt-7 pb-12 focus-visible:outline-offset-[-4px] sm:px-10 sm:pt-9 sm:pb-14",children:[(0,t.jsx)(G,{post:e}),(0,t.jsx)("article",{children:h.map((e,a)=>"code"===e.kind?(0,t.jsx)(I,{code:e.code},a):(0,t.jsx)("div",{className:E,dangerouslySetInnerHTML:{__html:e.html}},a))})]})]})]})}function $({post:e,featured:r,onOpen:i,registerTrigger:n}){let o=(0,a.useMemo)(()=>r?function(e,t=7){P.lastIndex=0;let a=P.exec(e);return(P.lastIndex=0,a)?R(a[1]??"").split("\n").filter(e=>e.trim().length>0).slice(0,t):[]}(e.html):[],[r,e.html]),l=(0,S.tintVar)(e.tint);return(0,t.jsxs)("article",{className:(0,A.cn)("group card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-8","transition-[transform,box-shadow,border-color] duration-700 ease-out-expo","hover:-translate-y-1.5 hover:border-ink/15 hover:shadow-lift motion-reduce:transform-none",r&&"md:min-h-[22rem] md:flex-row md:items-stretch md:gap-10 lg:p-10"),children:[(0,t.jsx)("span",{"aria-hidden":"true",className:(0,A.cn)("pointer-events-none absolute -top-20 -right-20 size-56 rounded-full","transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.35] motion-reduce:transform-none"),style:{backgroundColor:l}}),(0,t.jsxs)("div",{className:"relative flex min-w-0 flex-1 flex-col",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between gap-3",children:[(0,t.jsx)("span",{className:"label-mono text-ink-soft",children:e.number}),(0,t.jsx)("span",{className:"label-mono rounded-full border border-ink/10 px-3 py-1.5 text-[0.66rem] whitespace-nowrap text-ink",style:{backgroundColor:l},children:e.tag})]}),(0,t.jsx)("h2",{className:(0,A.cn)("display mt-8 text-[clamp(1.6rem,5.4vw,2.2rem)] leading-[1.02] text-balance sm:mt-10",r&&"md:text-[clamp(2.2rem,4vw,3.4rem)]"),children:(0,t.jsx)("button",{ref:t=>n(e.id,t),type:"button","aria-haspopup":"dialog",onClick:()=>i(e.id),className:(0,A.cn)("text-left uppercase after:absolute after:inset-0 after:rounded-[1.75rem]","focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-ink"),children:e.title})}),(0,t.jsx)("p",{className:(0,A.cn)("mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-ink-soft",r&&"md:text-[1.05rem]"),children:e.excerpt}),(0,t.jsxs)("div",{className:"mt-auto flex items-center justify-between gap-4 pt-8",children:[(0,t.jsx)("span",{className:"label-mono text-ink",children:"Read article"}),(0,t.jsx)("span",{"aria-hidden":"true",className:(0,A.cn)("grid size-11 place-items-center rounded-[4px] border-[1.5px] border-ink text-ink","transition-[background-color,color] duration-500 ease-out-expo","group-hover:bg-ink! group-hover:text-bg"),style:{backgroundColor:l},children:(0,t.jsx)(p.ArrowIcon,{className:"size-4 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0 group-focus-within:rotate-0 motion-reduce:rotate-0"})})]})]}),r&&o.length>0&&(0,t.jsx)("div",{"aria-hidden":"true",className:"relative hidden w-[42%] max-w-[26rem] shrink-0 items-center md:flex",children:(0,t.jsxs)("div",{className:(0,A.cn)("w-full rotate-[2.5deg] overflow-hidden rounded-2xl border border-ink bg-ink text-bg shadow-lift","transition-transform duration-700 ease-out-expo group-hover:-translate-y-1 group-hover:rotate-[1deg] motion-reduce:transform-none"),children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 border-b border-bg/10 px-4 py-2.5",children:[(0,t.jsxs)("span",{className:"flex gap-1.5",children:[(0,t.jsx)("span",{className:"size-2.5 rounded-full bg-pink"}),(0,t.jsx)("span",{className:"size-2.5 rounded-full bg-butter"}),(0,t.jsx)("span",{className:"size-2.5 rounded-full bg-mint"})]}),(0,t.jsx)("span",{className:"label-mono truncate text-[0.62rem] text-bg/70",children:e.tag})]}),(0,t.jsx)("pre",{className:"overflow-hidden px-4 py-4 font-mono text-[0.74rem] leading-[1.75]",children:o.map((e,a)=>(0,t.jsx)("span",{className:(0,A.cn)("block truncate",e.trimStart().startsWith("#")&&"text-bg/50"),children:e},a))})]})})]})}let q=["top-0 left-4 -rotate-6","top-3 right-0 rotate-[5deg]","top-[4.5rem] left-16 rotate-3","top-[8.5rem] left-0 -rotate-3","top-[8rem] right-4 rotate-[8deg]","top-[12.5rem] left-24 -rotate-[5deg]"];function K(){let e=String(C.length).padStart(2,"0");return(0,t.jsx)("section",{className:"overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,7vw,5.5rem))] pb-[clamp(2.5rem,6vw,4.5rem)]",children:(0,t.jsxs)("div",{className:"shell",children:[(0,t.jsx)(u.Reveal,{y:16,children:(0,t.jsx)(d.default,{fig:h,label:g})}),(0,t.jsx)(u.RevealTitle,{as:"h1",immediate:!0,delay:.1,lines:b,className:"display mt-6 text-[clamp(1.85rem,9vw,9rem)] sm:mt-8"}),(0,t.jsxs)("div",{className:"mt-8 grid items-start gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16",children:[(0,t.jsxs)(u.Reveal,{delay:.35,className:"max-w-[38rem]",children:[(0,t.jsx)("p",{className:"text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-ink",children:"Tutorials, guides and field notes on web development — Git workflows, Laravel setup, and the modern tooling I use every day."}),(0,t.jsxs)("p",{className:"label-mono mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-card py-2 pr-4 pl-2 text-ink shadow-soft",children:[(0,t.jsx)("span",{className:"grid h-7 min-w-7 place-items-center rounded-full bg-butter px-2",children:e}),(0,t.jsxs)("span",{children:[(0,t.jsxs)("span",{className:"sr-only",children:[C.length," "]}),"articles published"]})]})]}),(0,t.jsx)(u.Reveal,{delay:.5,className:"hidden lg:block",children:(0,t.jsx)("ul",{"aria-hidden":"true",className:"relative h-[16rem] w-[24rem] xl:w-[27rem]",children:C.map((e,a)=>(0,t.jsx)("li",{className:(0,A.cn)("absolute",q[a%q.length]),children:(0,t.jsx)("span",{className:"label-mono block animate-float rounded-full border border-ink/10 px-4 py-2.5 whitespace-nowrap text-ink shadow-soft",style:{backgroundColor:(0,S.tintVar)(e.tint),animationDelay:`${-1.3*a}s`},children:e.tag})},e.id))})})]})]})})}e.s(["default",0,function(){let[e,n]=(0,a.useState)(null),[o,l]=(0,a.useState)(!1),s=(0,a.useRef)(null),c=(0,a.useRef)(!1),d=(0,a.useRef)(new Map),h=(0,a.useCallback)((e,t)=>{t?d.current.set(e,t):d.current.delete(e)},[]),b=(0,a.useCallback)(e=>{let t=s.current;s.current=e,n(e),null===e&&t&&d.current.get(t)?.focus({preventScroll:!0})},[]);(0,a.useEffect)(()=>{l(!0);let e=()=>{let e=(()=>{try{return decodeURIComponent(window.location.hash.slice(1))}catch{return""}})(),t=!!N(e);t||(c.current=!1),b(t?e:null)};return e(),window.addEventListener("popstate",e),window.addEventListener("hashchange",e),()=>{window.removeEventListener("popstate",e),window.removeEventListener("hashchange",e)}},[b]);let f=(0,a.useCallback)(e=>{s.current!==e&&(window.history.pushState(null,"",`#${e}`),c.current=!0,b(e))},[b]),x=(0,a.useCallback)(()=>{null!==s.current&&(c.current?(c.current=!1,b(null),window.history.back()):(window.history.replaceState(null,"",window.location.pathname+window.location.search),b(null)))},[b]),k=e?N(e):void 0,v=(0,a.useMemo)(()=>C.map(e=>e.tag),[]),y=null;return o&&(y=(0,r.createPortal)((0,t.jsx)(i.AnimatePresence,{children:k&&(0,t.jsx)(z,{post:k,onClose:x},k.id)}),document.body)),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(K,{}),(0,t.jsx)(m.default,{items:v,duration:36,className:"border-y border-line bg-card py-4 sm:py-5",itemClassName:"display text-[clamp(1.4rem,3.2vw,2.4rem)] leading-none text-ink",separatorClassName:"text-[clamp(1.1rem,2.4vw,1.8rem)]"}),(0,t.jsx)("section",{"aria-label":g,className:"py-[clamp(3rem,7vw,6rem)]",children:(0,t.jsxs)("div",{className:"shell",children:[(0,t.jsx)("ul",{className:"grid gap-5 md:grid-cols-2 lg:gap-7",children:C.map((e,a)=>(0,t.jsx)(u.Reveal,{as:"li",delay:a%2*.08,className:(0,A.cn)(0===a&&"md:col-span-2"),children:(0,t.jsx)($,{post:e,featured:0===a,onOpen:f,registerTrigger:h})},e.id))}),(0,t.jsx)(u.Reveal,{className:"mt-[clamp(2.5rem,6vw,4.5rem)] flex justify-center border-t border-line pt-[clamp(2rem,5vw,3.5rem)]",children:(0,t.jsx)(p.default,{href:S.blog.backHome.href,variant:"white",children:S.blog.backHome.label})})]})}),y]})}],52482)}]);