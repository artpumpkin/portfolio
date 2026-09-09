import {
  ArrowDown,
  ArrowUpRight,
  Download,
  CodeXml,
  Mail,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { LachkarLogo } from "@/components/lachkar-logo";
import { Navigation } from "@/components/navigation";
import { ChessPuzzle } from "@/components/chess-puzzle";
import { Reveal } from "@/components/reveal";
import { ProjectArt } from "@/components/project-art";
import {
  education,
  experiences,
  profile,
  projects,
  skills,
} from "@/data/portfolio";
import { portfolioStructuredData } from "@/data/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <section id="home" className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="availability-dot" /> OPEN TO REMOTE OPPORTUNITIES
            </div>
            <h1>
              Salah-Eddine
              <br />
              <span>
                Lachkar<span className="name-period">.</span>
              </span>
            </h1>
            <p className="hero-statement">
              Thoughtful code.
              <br />
              <em>Playful possibilities.</em>
            </p>
            <p className="hero-description">
              I’m a full-stack developer who brings ideas to life through
              considered interfaces, dependable systems, and a healthy dose of
              curiosity.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#work">
                Explore my work <ArrowUpRight size={17} />
              </a>
              <a className="button-text" href={profile.cv} download>
                Download CV <Download size={15} />
              </a>
            </div>
            <div className="hero-location">
              <span>BASED IN CASABLANCA, MOROCCO</span>
              <span>BUILDING FOR EVERYWHERE ↗</span>
            </div>
          </div>
          <ChessPuzzle />
        </section>
        <div className="intro-strip section-shell">
          <span>DEVELOPER. TEAMMATE. CURIOUS HUMAN.</span>
          <a href="#journey">
            There’s a story behind the code <ArrowDown size={15} />
          </a>
        </div>
        <section id="journey" className="section-shell journey section-space">
          <Reveal>
            <div className="section-heading">
              <span className="section-number">01 / THE JOURNEY</span>
              <h2>
                Every move
                <br />
                led <em>somewhere.</em>
              </h2>
              <p>
                From automating the small things to helping teams build the
                bigger ones. A few chapters along the way.
              </p>
            </div>
          </Reveal>
          <div className="timeline">
            {experiences.map((e, i) => (
              <Reveal key={e.company}>
                <article className="timeline-row">
                  <div className="timeline-date">
                    <span
                      className={
                        i === 0 ? "timeline-dot current" : "timeline-dot"
                      }
                    />
                    {e.period}
                    {i === 0 && (
                      <span className="now-badge">CURRENT CHAPTER</span>
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="experience-title">
                      <h3>{e.company}</h3>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="role">{e.role}</p>
                    <p className="location">{e.location}</p>
                    <p className="experience-description">{e.description}</p>
                    <div className="tags">
                      {e.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="work" className="work-section section-space">
          <div className="section-shell">
            <Reveal>
              <div className="section-heading work-heading">
                <span className="section-number">02 / SELECTED WORK</span>
                <h2>
                  Ideas made
                  <br />
                  <em>tangible.</em>
                </h2>
                <p>
                  A selection of products, interfaces, and experiments I’ve
                  helped bring into the world.
                </p>
              </div>
            </Reveal>
            <div className="project-grid">
              {projects.map((p) => (
                <Reveal key={p.id} className={`project project-${p.visual}`}>
                  <article>
                    <div className="project-visual">
                      <ProjectArt kind={p.visual} />
                    </div>
                    <div className="project-category">
                      <span>{p.category}</span>
                      <span>/{p.id}</span>
                    </div>
                    <h3>
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {p.name}
                          <ArrowUpRight size={23} />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        p.name
                      )}
                    </h3>
                    {p.period && (
                      <div className="project-period">{p.period}</div>
                    )}
                    <p>{p.description}</p>
                    <div className="project-role">{p.role}</div>
                    <div className="tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section
          id="about"
          className="section-shell section-space about-section"
        >
          <Reveal>
            <div className="section-heading about-intro">
              <span className="section-number">03 / BEHIND THE WORK</span>
              <h2>
                A builder’s mindset.
                <br />
                <em>A beginner’s curiosity.</em>
              </h2>
              <p>
                I care about how things feel, how they work, and the people
                building them together.
              </p>
            </div>
          </Reveal>
          <div className="about-grid">
            <div className="skills-list">
              {skills.map((s, i) => (
                <Reveal key={s.title}>
                  <div className="skill-row">
                    <span>0{i + 1}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.detail}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="ai-note">
              <Sparkles size={23} />
              <span className="section-number">A NEW WAY TO BUILD</span>
              <h3>
                Human intention.
                <br />
                <em>AI-assisted making.</em>
              </h3>
              <p>
                I use coding agents from requirements through implementation,
                then test, review, and refine. I also build skills and plugins
                for article validation, image creation, social content, and
                everyday workflows.
              </p>
              <p>
                Curiosity accelerates the process. Judgment stays part of it.
              </p>
              <div className="note-signature">
                Always learning, always making. <MoveUpRight size={18} />
              </div>
            </Reveal>
          </div>
          <div className="education">
            <div>
              <span className="section-number">THE FOUNDATIONS</span>
              <h3>
                Learning to
                <br />
                <em>connect the dots.</em>
              </h3>
            </div>
            <div>
              {education.map((e) => (
                <article key={e.degree}>
                  <span className="education-date">{e.period}</span>
                  <h4>{e.degree}</h4>
                  <p>{e.school}</p>
                  <p>{e.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="spoken-languages">Languages · English & Arabic</p>
        </section>
        <section id="contact" className="contact-section">
          <div className="section-shell">
            <span className="section-number">04 / YOUR NEXT MOVE</span>
            <h2>
              Something in mind?
              <br />
              <em>Let’s make it real.</em>
              <ArrowUpRight className="contact-arrow" />
            </h2>
            <div className="contact-bottom">
              <p>
                A product to build, a team to join,
                <br />
                or just a good conversation.
              </p>
              <a href={`mailto:${profile.email}`} className="contact-email">
                {profile.email}
                <ArrowUpRight size={21} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="section-shell">
          <div className="footer-main">
            <div className="footer-identity">
              <a href="#home" className="wordmark" aria-label="Lachkar home">
                <LachkarLogo />
              </a>
              <p>
                Full-stack development.
                <br />
                From the first idea to the details that matter.
              </p>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#work">
                Selected work <ArrowUpRight size={15} />
              </a>
              <a href={profile.cv} download>
                Download CV <Download size={15} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
              >
                GitHub <CodeXml size={15} />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email Salah">
                Email me <Mail size={15} />
              </a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Salah-Eddine Lachkar</span>
            <span className="footer-availability">
              <i aria-hidden="true" />
              Casablanca · Open to remote work
            </span>
            <a href="#home" className="back-to-top">
              Back to top <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
