import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

const originalHero = `    <section class="landing-page-container" id="home">
      <div class="blob"></div>

      <div class="akito-hero-content">
        <h1 class="akito-hero-title" data-aos="fade-up" data-aos-delay="0">
          DAVID<br>SAPUTRA
        </h1>
        <h2 class="akito-hero-subtitle" data-aos="fade-up" data-aos-delay="200">
          DESIGN & CODE
        </h2>
        <p class="akito-hero-desc" data-aos="fade-up" data-aos-delay="400">
          Web Developer with experience in Digital Concept Arts and Frontend Web Designs. I focus on minimalist
          brutalism, clean patterns, and thoughtful interactions.
        </p>
        <div class="contact-btn-div" data-aos="fade-up" data-aos-delay="800">
          <a href="mailto:davidsaputra2704@gmail.com" tabindex="-1">
            <button class="letsTalkBtn">
              <p class="letsTalkBtn-text">Let's Talk!</p>
              <span class="letsTalkBtn-BG"></span>
            </button></a>
        </div>
        <!-- contact-btn-div -->
      </div>

    </section>`;

async function updateFile(filePath) {
  let content = await readFile(filePath, 'utf8');

  // Replace from start of landing-page-container until about-section-container
  const heroStart = content.indexOf('<section class="landing-page-container');
  const aboutStart = content.indexOf('<section class="about-section-container"');

  if (heroStart !== -1 && aboutStart !== -1) {
    content = content.substring(0, heroStart) + originalHero + '\n    <!-- landing page ends here -->\n\n    ' + content.substring(aboutStart);
    await writeFile(filePath, content, 'utf8');
    console.log(`Restored: ${filePath}`);
  }
}

await updateFile(path.join(rootDir, 'index.html'));
await updateFile(path.join(rootDir, 'legacy', 'index.html'));
