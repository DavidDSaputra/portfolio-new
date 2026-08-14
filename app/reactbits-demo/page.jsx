import {
  BlurText,
  BorderGlow,
  Card,
  CardSwap,
  ClickSpark,
  CountUp,
  SoftAurora,
} from "../../components/reactbits";

export const metadata = {
  title: "React Bits Demo",
  description: "Showcase komponen React Bits yang terpasang di project ini.",
};

const panelStyle = {
  borderRadius: "30px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  background: "rgba(18, 18, 22, 0.56)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
};

const lightButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  minHeight: "52px",
  padding: "0 22px",
  borderRadius: "999px",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  background: "#f7f3ea",
  color: "#18161c",
  fontSize: "0.95rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textDecoration: "none",
};

export default function ReactBitsDemoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 18px 88px",
        background:
          "radial-gradient(circle at top left, rgba(214, 162, 255, 0.26), transparent 22%), radial-gradient(circle at 80% 10%, rgba(75, 191, 255, 0.2), transparent 22%), linear-gradient(180deg, #0c0911 0%, #17131c 40%, #0d0c13 100%)",
        color: "#f5efe8",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto", display: "grid", gap: "26px" }}>
        <section
          style={{
            ...panelStyle,
            position: "relative",
            overflow: "hidden",
            minHeight: "520px",
            padding: "40px",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.95 }}>
            <SoftAurora
              speed={0.6}
              scale={1.5}
              brightness={1.15}
              color1="#f6f0ff"
              color2="#8d4dff"
              noiseFrequency={2.3}
              noiseAmplitude={1}
              bandHeight={0.55}
              bandSpread={1.05}
              octaveDecay={0.1}
              layerOffset={0.25}
              colorSpeed={1}
              enableMouseInteraction
              mouseInfluence={0.18}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
              gap: "28px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  fontSize: "0.84rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "24px",
                }}
              >
                React Bits Showcase
              </div>

              <BlurText
                text="Semua komponen React Bits yang kamu minta sekarang sudah terpasang di project ini."
                animateBy="words"
                direction="top"
                delay={70}
                className="reactbits-demo-title"
              />

              <p
                style={{
                  maxWidth: "680px",
                  marginTop: "18px",
                  marginBottom: "28px",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "rgba(245, 239, 232, 0.74)",
                }}
              >
                Saya pasang <code>BorderGlow</code>, <code>SoftAurora</code>, <code>CardSwap</code>,{" "}
                <code>ClickSpark</code>, plus starter component sebelumnya. Kamu bisa pakai semuanya dari folder{" "}
                <code>components/reactbits</code>.
              </p>

              <ClickSpark sparkColor="#fff3cf" sparkSize={14} sparkRadius={24} sparkCount={10} duration={520}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                  <a href="#components" style={lightButtonStyle}>
                    Lihat Components
                  </a>
                  <a
                    href="#usage"
                    style={{
                      ...lightButtonStyle,
                      background: "transparent",
                      color: "#f7f3ea",
                    }}
                  >
                    Cara Pakai
                  </a>
                </div>
              </ClickSpark>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              <BorderGlow
                edgeSensitivity={28}
                glowColor="285 85 78"
                backgroundColor="#141019"
                borderRadius={24}
                glowRadius={34}
                colors={["#d6a2ff", "#ff7ab6", "#5ac8ff"]}
              >
                <div style={{ padding: "22px" }}>
                  <div style={{ fontSize: "0.86rem", opacity: 0.65, marginBottom: "10px" }}>Components Added</div>
                  <div style={{ fontSize: "2.6rem", fontWeight: 800 }}>
                    <CountUp to={6} duration={1.5} />
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow
                edgeSensitivity={28}
                glowColor="35 90 82"
                backgroundColor="#141019"
                borderRadius={24}
                glowRadius={34}
                colors={["#ffe08a", "#f472b6", "#5ac8ff"]}
              >
                <div style={{ padding: "22px" }}>
                  <div style={{ fontSize: "0.86rem", opacity: 0.65, marginBottom: "10px" }}>Dependencies</div>
                  <div style={{ fontSize: "2.6rem", fontWeight: 800 }}>
                    <CountUp to={3} duration={1.5} />
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow
                edgeSensitivity={28}
                glowColor="190 90 82"
                backgroundColor="#141019"
                borderRadius={24}
                glowRadius={34}
                colors={["#5ac8ff", "#7ef0c2", "#d6a2ff"]}
              >
                <div style={{ padding: "22px" }}>
                  <div style={{ fontSize: "0.86rem", opacity: 0.65, marginBottom: "10px" }}>Mode</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>JS + CSS</div>
                </div>
              </BorderGlow>

              <BorderGlow
                edgeSensitivity={28}
                glowColor="340 88 80"
                backgroundColor="#141019"
                borderRadius={24}
                glowRadius={34}
                colors={["#ff9cc3", "#d6a2ff", "#5ac8ff"]}
              >
                <div style={{ padding: "22px" }}>
                  <div style={{ fontSize: "0.86rem", opacity: 0.65, marginBottom: "10px" }}>Build Status</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>Working</div>
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        <section
          id="components"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 460px)",
            gap: "26px",
            alignItems: "stretch",
          }}
        >
          <BorderGlow
            edgeSensitivity={30}
            glowColor="205 90 82"
            backgroundColor="#100e14"
            borderRadius={30}
            glowRadius={42}
            colors={["#5ac8ff", "#d6a2ff", "#ff8ec2"]}
            animated
          >
            <div style={{ padding: "30px" }}>
              <div
                style={{
                  display: "inline-flex",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                BorderGlow
              </div>
              <h2 style={{ fontSize: "2rem", margin: "0 0 12px", lineHeight: 1.1 }}>
                Interactive edge glow untuk kartu, panel, atau CTA utama.
              </h2>
              <p style={{ margin: 0, lineHeight: 1.8, color: "rgba(245,239,232,0.72)" }}>
                Gerakkan pointer ke tepi panel untuk melihat mesh glow yang mengikuti arah cursor. Cocok
                dipakai buat feature cards atau pricing highlight.
              </p>
            </div>
          </BorderGlow>

          <div
            style={{
              ...panelStyle,
              position: "relative",
              minHeight: "420px",
              overflow: "hidden",
              padding: "24px",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: 0.78 }}>
              <SoftAurora
                speed={0.52}
                scale={1.9}
                brightness={1}
                color1="#ffffff"
                color2="#ff67d4"
                noiseFrequency={2.6}
                noiseAmplitude={1}
                bandHeight={0.48}
                bandSpread={1}
                octaveDecay={0.12}
                layerOffset={0.1}
                colorSpeed={0.9}
                enableMouseInteraction
                mouseInfluence={0.22}
              />
            </div>
            <div style={{ position: "relative", zIndex: 1, maxWidth: "260px" }}>
              <div
                style={{
                  display: "inline-flex",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                SoftAurora
              </div>
              <h3 style={{ fontSize: "1.8rem", lineHeight: 1.1, margin: "0 0 10px" }}>Shader background halus</h3>
              <p style={{ margin: 0, lineHeight: 1.8, color: "rgba(245,239,232,0.74)" }}>
                Cocok untuk hero section, testimonial wall, atau background promo yang ingin terasa premium.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            ...panelStyle,
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 0.95fr)",
            gap: "28px",
            padding: "30px",
            minHeight: "560px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              CardSwap + ClickSpark
            </div>
            <h2 style={{ fontSize: "2.1rem", margin: "0 0 12px", lineHeight: 1.08 }}>
              Stack kartu animasi untuk hero, roadmap, atau showcase proyek.
            </h2>
            <p style={{ margin: 0, lineHeight: 1.85, color: "rgba(245,239,232,0.74)", maxWidth: "520px" }}>
              CardSwap saya pasang dengan kartu dark editorial, dan area ini dibungkus ClickSpark supaya setiap klik
              memberi efek spark kecil. Ini enak dipakai untuk section yang lebih playful.
            </p>

            <ClickSpark sparkColor="#ffd7a8" sparkSize={18} sparkRadius={28} sparkCount={12} duration={540}>
              <div
                style={{
                  marginTop: "26px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div style={{ ...lightButtonStyle, width: "fit-content" }}>Click Around This Section</div>
                <div
                  style={{
                    padding: "18px 20px",
                    borderRadius: "22px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    lineHeight: 1.8,
                    color: "rgba(245,239,232,0.72)",
                  }}
                >
                  Tip: kamu bisa pakai `onCardClick` di CardSwap kalau nanti mau menghubungkan kartu ini ke modal,
                  detail proyek, atau route lain.
                </div>
              </div>
            </ClickSpark>
          </div>

          <div style={{ position: "relative", minHeight: "500px" }}>
            <CardSwap width={360} height={240} cardDistance={46} verticalDistance={56} delay={3800} pauseOnHover>
              <Card
                style={{
                  padding: "22px",
                  background:
                    "linear-gradient(180deg, rgba(23,25,30,0.96) 0%, rgba(13,13,18,0.98) 100%)",
                  color: "#fff7f1",
                }}
              >
                <div style={{ fontSize: "0.82rem", opacity: 0.65, marginBottom: "14px", letterSpacing: "0.08em" }}>
                  01 / HERO CARD
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: "1.6rem" }}>Aurora Landing</h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(255,247,241,0.72)" }}>
                  Cocok untuk headline promosional dengan background shader yang lembut.
                </p>
              </Card>

              <Card
                style={{
                  padding: "22px",
                  background:
                    "linear-gradient(180deg, rgba(31,19,37,0.96) 0%, rgba(18,14,25,0.98) 100%)",
                  color: "#fff7f1",
                }}
              >
                <div style={{ fontSize: "0.82rem", opacity: 0.65, marginBottom: "14px", letterSpacing: "0.08em" }}>
                  02 / FEATURE CARD
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: "1.6rem" }}>Glow Feature</h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(255,247,241,0.72)" }}>
                  BorderGlow terasa pas buat panel yang ingin terlihat premium dan interaktif.
                </p>
              </Card>

              <Card
                style={{
                  padding: "22px",
                  background:
                    "linear-gradient(180deg, rgba(11,28,40,0.96) 0%, rgba(10,17,24,0.98) 100%)",
                  color: "#fff7f1",
                }}
              >
                <div style={{ fontSize: "0.82rem", opacity: 0.65, marginBottom: "14px", letterSpacing: "0.08em" }}>
                  03 / INTERACTION
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: "1.6rem" }}>Spark Click</h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(255,247,241,0.72)" }}>
                  ClickSpark memberi micro-interaction cepat tanpa menambah UI yang berat.
                </p>
              </Card>
            </CardSwap>
          </div>
        </section>

        <section
          id="usage"
          style={{
            ...panelStyle,
            padding: "32px",
          }}
        >
          <h2 style={{ fontSize: "1.7rem", margin: "0 0 16px" }}>Import Paths</h2>
          <pre
            style={{
              margin: 0,
              overflowX: "auto",
              fontSize: "0.94rem",
              lineHeight: 1.8,
              background: "#0c0c10",
              color: "#f5f5f5",
              padding: "18px",
              borderRadius: "20px",
            }}
          >
            <code>{`import {
  BlurText,
  BorderGlow,
  CardSwap,
  Card,
  ClickSpark,
  CountUp,
  SoftAurora,
} from "../../components/reactbits";`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}
