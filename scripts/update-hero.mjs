import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

const heroMarkup = `    <!-- ========================================================
         EXACT NEO-BRUTALISM HERO BANNER (REPLICA OF IMAGE 1)
         ======================================================== -->
    <section class="landing-page-container neo-exact-hero-section" id="home">
      <!-- Hidden compatibility hooks for Next.js replacements -->
      <div class="blob" style="display:none;"></div>
      <div class="akito-hero-content" style="display:none;"></div>

      <div class="neo-hero-master-card" id="neoHeroMasterCard">

        <!-- Huge Main Headline: NEO BRUTALISM -->
        <div class="neo-card-headline-zone">
          <div class="neo-headline-sub">NEO</div>
          <h1 class="neo-headline-stretched">BRUTALISM</h1>
        </div>

        <!-- Sliding Window Split Area -->
        <div class="neo-window-split-container" id="neoWindowSplit">
          
          <!-- White Split Side (Left) -->
          <div class="neo-split-side neo-side-white" id="neoSideWhite">
            <div class="neo-side-white-inner">
              
              <div class="neo-white-left-col">
                <!-- Yellow Action Button -->
                <div class="neo-button-wrapper">
                  <a href="#projects" class="neo-yellow-pill-btn">
                    <span>Learn more</span>
                    <span class="neo-pill-arrow-circle">➔</span>
                  </a>
                </div>

                <!-- Circular Arrow Group -->
                <div class="neo-circle-nav-group">
                  <button class="neo-round-btn" aria-label="Previous">❮</button>
                  <button class="neo-round-btn" aria-label="Next">❯</button>
                </div>

                <!-- Stats Box Card -->
                <div class="neo-metrics-block">
                  <div class="neo-metric-row">
                    <span class="neo-metric-digits">84,900</span>
                    <span class="neo-metric-desc">Satisfied Clients</span>
                  </div>
                  <div class="neo-metric-line"></div>
                  <div class="neo-metric-row">
                    <span class="neo-metric-digits">3.2M+</span>
                    <span class="neo-metric-desc">Downloads</span>
                  </div>
                  <div class="neo-metric-line"></div>
                  <div class="neo-metric-row">
                    <span class="neo-metric-digits">21,394</span>
                    <span class="neo-metric-desc">Customer Reviews</span>
                  </div>
                </div>
              </div>

              <!-- Left Pink Runner Mascot Column -->
              <div class="neo-white-mascot-col">
                <div class="neo-mascot-runner-container">
                  <img src="/src/png/mascot-runner.png" alt="Neo Brutalism Running Mascot" class="neo-mascot-character neo-mascot-running" />
                </div>
              </div>

              <!-- Bottom copyright mark inside white side -->
              <div class="neo-card-copyright">
                © 2026 Neo Brutalism, Inc. All rights reserved.
              </div>

            </div>
          </div>

          <!-- Pink Split Side (Right) -->
          <div class="neo-split-side neo-side-pink" id="neoSidePink">
            <div class="neo-side-pink-inner">
              
              <!-- Right Noodle Box Mascot -->
              <div class="neo-mascot-noodle-container">
                <img src="/src/png/mascot-noodle.png" alt="Neo Brutalism Noodle Box Mascot" class="neo-mascot-character neo-mascot-waving" />
              </div>

              <!-- Bottom Social Pills on Pink Side -->
              <div class="neo-pink-social-row">
                <a href="https://discord.com" target="_blank" class="neo-social-circle" aria-label="Discord">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" class="neo-social-circle" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com/DavidDSaputra" target="_blank" class="neo-social-circle" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>

            </div>
          </div>

          <!-- Middle Floating Projects 19k+ Card & Hand-Drawn Arrow -->
          <div class="neo-center-floating-widget" id="neoProjectsBadge">
            <svg class="neo-doodle-arrow" viewBox="0 0 90 70" width="80" height="60" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 45 C 30 10, 55 10, 75 40 M65 40 L75 40 L75 30" />
            </svg>
            <div class="neo-purple-stat-box">
              <span class="neo-stat-subtitle">Projects</span>
              <span class="neo-stat-bignum">19k+</span>
            </div>
          </div>

          <!-- The Sliding Window Split Divider with Grip Handle -->
          <div class="neo-window-slider-divider" id="neoWindowDivider">
            <div class="neo-window-handle" title="Slide Window Left/Right">
              <span class="neo-handle-icon">❮ ❯</span>
            </div>
          </div>

        </div><!-- /.neo-window-split-container -->

      </div><!-- /.neo-hero-master-card -->

      <!-- Y2K NEO-BRUTALISM STICKER CLUSTERS (FROM IMAGE 2) -->
      <div class="neo-y2k-stickers-layer" aria-hidden="true">
        <!-- 4-point chrome star sparkle -->
        <div class="y2k-asset y2k-star-4p-1">
          <svg viewBox="0 0 100 100" width="60" height="60">
            <path d="M50 0 C50 30, 70 50, 100 50 C70 50, 50 70, 50 100 C50 70, 30 50, 0 50 C30 50, 50 30, 50 0 Z" fill="#000000" stroke="#000000" stroke-width="2"/>
          </svg>
        </div>
        <!-- 4-point chrome star sparkle outline -->
        <div class="y2k-asset y2k-star-4p-2">
          <svg viewBox="0 0 100 100" width="45" height="45">
            <path d="M50 0 C50 30, 70 50, 100 50 C70 50, 50 70, 50 100 C50 70, 30 50, 0 50 C30 50, 50 30, 50 0 Z" fill="#FFDE59" stroke="#000000" stroke-width="4"/>
          </svg>
        </div>
        <!-- Y2K Orbit Ring Planet -->
        <div class="y2k-asset y2k-orbit-ring">
          <svg viewBox="0 0 120 70" width="90" height="50">
            <ellipse cx="60" cy="35" rx="55" ry="20" fill="none" stroke="#000000" stroke-width="3.5" transform="rotate(-15 60 35)"/>
            <circle cx="60" cy="35" r="16" fill="#FF66C4" stroke="#000000" stroke-width="3"/>
          </svg>
        </div>
        <!-- 8-Point Starburst Badge -->
        <div class="y2k-asset y2k-starburst-badge">
          <svg viewBox="0 0 100 100" width="75" height="75">
            <polygon points="50,0 62,25 90,10 75,38 100,50 75,62 90,90 62,75 50,100 38,75 10,90 25,62 0,50 25,38 10,10 38,25" fill="#00FF87" stroke="#000000" stroke-width="4"/>
            <text x="50" y="55" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="900" fill="#000000" text-anchor="middle">2026</text>
          </svg>
        </div>
        <!-- Y2K Barcode Sticker -->
        <div class="y2k-asset y2k-barcode-sticker">
          <div class="y2k-barcode-card">
            <span class="y2k-barcode-label">DEV // VALIDATED</span>
            <div class="y2k-barcode-lines">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <span class="y2k-barcode-code">DS-704-2026</span>
          </div>
        </div>
        <!-- Checkerboard Rave Banner -->
        <div class="y2k-asset y2k-checkerboard-strip">
          <div class="y2k-checker-pattern"></div>
        </div>
      </div>

    </section>
    <!-- landing page ends here -->`;

const skillsMarkup = `    <section class="skills-section-container" id="skills">
      <div class="skills-section">
        <div class="section-heading" data-aos="fade-up">
          <h2 class="section-heading-article" tabindex="0" aria-label="skills heading">
            &#60;/Skills&#62;
          </h2>
          <p class="sectionHeadingP"></p>
        </div>

        <div class="frontend-dev-section">
          <h3 class="frontend-dev-heading" data-aos="fade-up" tabindex="0"
            aria-label="As a frontend a developer these are the skills i have">
            Tech Stack
          </h3>
          <ul class="tech-stack-wrapper">
            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/htmllogo.png" alt="Html skill" class="tech-stack-logo" />
                <span class="tooltip">HTML</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/csslogo.png" alt="css skill" class="tech-stack-logo" />
                <span class="tooltip">CSS</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/jslogo.png" alt="js skill" class="tech-stack-logo" />
                <span class="tooltip">JS</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/tailwind.png" alt="tailwind skill" class="tech-stack-logo" />
                <span class="tooltip">TAILWIND</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/reactlogo.png" alt="react skill" class="tech-stack-logo" />
                <span class="tooltip">REACTJS</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/nextlogo.png" alt="nextjs skill" class="tech-stack-logo" />
                <span class="tooltip">NEXTJS</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/node.png" alt="nodejs skill" class="tech-stack-logo" />
                <span class="tooltip">NODEJS</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/githublogo.png" alt="github skill" class="tech-stack-logo needtobeinvert" />
                <span class="tooltip">GITHUB</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/gitlogo.png" alt="git skill" class="tech-stack-logo" />
                <span class="tooltip">GIT</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://en.wikipedia.org/wiki/C_(programming_language)" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/clogo.png" alt="c language skill" class="tech-stack-logo" />
                <span class="tooltip">C</span>
              </a>
            </li>

            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://cplusplus.com/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/cpplogo.png" alt="c++ language skill" class="tech-stack-logo" />
                <span class="tooltip">C++</span>
              </a>
            </li>
            <li class="tech-stack-box" data-aos="fade-up">
              <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer">
                <img src="./src/png/figmalogo.png" alt="figma skill" class="tech-stack-logo" />
                <span class="tooltip">FIGMA</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>`;

async function updateFile(filePath) {
  let content = await readFile(filePath, 'utf8');

  // Replace from landing-page-container up to projects-section-container
  const projectsIndex = content.indexOf('<section class="projects-section-container"');
  if (projectsIndex === -1) {
    throw new Error('Cannot find projects-section-container in ' + filePath);
  }

  // Find start of landing-page-container or header mobiletogglemenu
  const mobileMenuEnd = content.indexOf('<!-- mobile toggle menu ends -->');
  if (mobileMenuEnd === -1) {
    throw new Error('Cannot find mobile toggle menu in ' + filePath);
  }

  // Extract about section
  const aboutMatch = content.match(/<section class="about-section-container"[\s\S]*?<\/section>/);
  let aboutContent = '';
  if (aboutMatch) {
    aboutContent = aboutMatch[0];
  } else {
    aboutContent = `    <section class="about-section-container" id="about" data-aos="fade-up">
      <div class="about-section">
        <div class="section-heading">
          <h2 class="section-heading-article" tabindex="0" aria-label="About me heading">
            &#60;/AboutMe&#62;
          </h2>
          <p class="sectionHeadingP"></p>
        </div>

        <div class="info-dp-section">
          <div class="about-info">
            <p tabindex="0">
              Instead of creating an online Concepts Art website, I started
              enjoying web development. Creating custom things for web taught
              me a lot about design &amp; development!
            </p>
            <br />
            <p tabindex="0">
              My main focus these days is building interesting &amp; creative web
              designs. I like to code things from scratch, and enjoy bringing
              ideas to life in the browser.
            </p>
            <!-- Resume button -->
            <button class="resume-btn" id="resume-btn" onclick="openURL()">
              <div class="sign">
                <svg viewBox="0 0 640 512">
                  <path
                    d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z" />
                </svg>
              </div>

              <div class="text">Resume</div>
            </button>
          </div>

          <div class="dp" data-aos="fade-up">
            <img src="src/webp/about.png" alt="David Saputra" tabindex="0" aria-label="image of david" />
          </div>
        </div>
      </div>
    </section>`;
  }

  const beforeSection = content.substring(0, mobileMenuEnd + '<!-- mobile toggle menu ends -->'.length);
  const afterSection = content.substring(projectsIndex);

  const updatedContent = `${beforeSection}\n\n${heroMarkup}\n\n${aboutContent}\n\n${skillsMarkup}\n\n    ${afterSection}`;

  await writeFile(filePath, updatedContent, 'utf8');
  console.log(`Updated: ${filePath}`);
}

await updateFile(path.join(rootDir, 'index.html'));
await updateFile(path.join(rootDir, 'legacy', 'index.html'));
