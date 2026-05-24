import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PasswordProtected from '../components/PasswordProtected';
import ProtectionUX from '../assets/Nozomi-UX-3.png'
import flowOnBoard from '../assets/flow-onBoard.png'
import DetailPage from '../assets/process-03.png'
import DropdownNozomi from '../assets/Nozomi-dropdown.png'
import kiosk01 from '../assets/kiosk-01.png'
import kiosk02 from '../assets/kiosk-02.png'
import kiosk03 from '../assets/kiosk-03.png'
import nozomiSlide from '../assets/Slide-16_9-25-min.jpg';
import nozomiInstall1 from '../assets/install-01.png';
import nozomiInstall2 from '../assets/install-02.png';
import nozomiInstall4 from '../assets/install-04.png';
import nozomiInstallEnd from '../assets/install-end.png';

// Telary Studio assets
import telaryHero    from '../assets/cover-home-02.jpg';
import telaryCover03 from '../assets/cover-home-03.jpg';
import telaryCover04 from '../assets/cover-home-04.jpg';
import telaryCover05 from '../assets/cover-home-05.jpg';
import telaryScreen1 from '../assets/screen-01.jpg';
import telaryScreen2 from '../assets/screen-02.jpg';
import telaryScreen3 from '../assets/screen-03.jpg';
import telaryScreen4 from '../assets/screen-04.jpg';

// RTK assets
import rtkCoverSolid from '../assets/Cover-solidF.png';
import rtkHero   from '../assets/Slide-16_9-3.jpg';
import rtkSlide1 from '../assets/Slide-16_9-41.jpg';
import rtkSlide2 from '../assets/Slide-16_9.jpg';
import rtkFrame  from '../assets/Frame-1410092609-min.jpg';
import rtkCase   from '../assets/Case-RTK-8-min-1.jpg';
import rtkQuote1 from '../assets/quotation-01.jpg';
import rtkQuote2 from '../assets/quotation-02.jpg';
import rtkQuote3 from '../assets/quotation-03.jpg';

// Hanglage / Exylus assets
import exylusBasic from '../assets/Exylus-basic.png';
import exylusCPR   from '../assets/Exylus-CPRmax.png';
import exylusDem   from '../assets/Exylus-dem.png';
import exylusDrop  from '../assets/Exylus-drop.png';
import exylusGt    from '../assets/Exylus-gt.png';
import exylusRec   from '../assets/Exylus-rec.png';
import exylusTarg2 from '../assets/Exylus-targ-2.png';
import exylusTarg  from '../assets/Exylus-targ.png';
import exylusGif   from '../assets/Exylus.gif';

import './ProjectDetail.css';

const isVideo = (src) => typeof src === 'string' && /\.(mp4|mov|webm)$/i.test(src);

// ── Carousel component ───────────────────────────────────────────────────────
const CarouselBlock = ({ items }) => {
  const [current, setCurrent] = React.useState(0);
  const prev = () => setCurrent(i => (i - 1 + items.length) % items.length);
  const next = () => setCurrent(i => (i + 1) % items.length);
  const item = items[current];
  return (
    <div className="pd-carousel">
      <div className="pd-carousel-stage">
        {isVideo(item.src)
          ? <video src={item.src} autoPlay loop muted playsInline />
          : <img src={item.src} alt={item.alt || ''} />
        }
      </div>
      <div className="pd-carousel-controls">
        <button className="pd-carousel-btn" onClick={prev}>←</button>
        <div className="pd-carousel-info">
          <span className="pd-carousel-label">{item.label}</span>
          <div className="pd-carousel-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`pd-carousel-dot${i === current ? ' pd-carousel-dot--active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
        <button className="pd-carousel-btn" onClick={next}>→</button>
      </div>
    </div>
  );
};

const projects = {
  1: {
    title: 'SAV',
    subtitle: 'Financial Planning Reimagined',
    tags: ['UI/UX Design', 'Branding', 'Mobile App'],
    info: [
      { key: 'Client',   val: 'SAV' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'Fintech' },
      { key: 'Role',     val: 'Lead Designer' },
    ],
    deliverables: ['UX Research', 'UI Design', 'Prototyping', 'Design System', 'Branding'],
    blocks: [
      { type: 'full',     src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80', alt: 'SAV Hero' },
      { type: 'headline', text: 'Money, simplified.' },
      { type: 'body',     text: 'SAV was built to remove the friction from everyday money management. We designed a system that feels invisible — one that guides users toward better habits without demanding their attention.' },
      { type: 'full',     src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80', alt: 'SAV Dashboard' },
      { type: 'grid2', items: [
        { src: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80', alt: 'User research' },
        { src: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=800&q=80', alt: 'Wireframes' },
      ]},
      { type: 'quote',    text: 'The best financial tool is the one people actually use.' },
      { type: 'full',     src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1400&q=80', alt: 'SAV Mobile' },
      { type: 'headline', text: 'Habit by design.' },
      { type: 'body',     text: 'We mapped every friction point in the onboarding flow and eliminated it. The result: a product people return to — not because they have to, but because it works.' },
      { type: 'grid2', items: [
        { src: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80', alt: 'Components' },
        { src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', alt: 'Mobile screens' },
      ]},
      { type: 'body',     text: 'Onboarding completion increased by 40%. Users reported feeling more in control of their finances within the first week of use.' },
      { type: 'full',     src: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1400&q=80', alt: 'SAV Final' },
    ],
    prev: null,
    next: null,
  },
  2: {
    title: 'Nozomi Networks',
    subtitle: 'Redesigning clarity for one of the world\'s most complex security platforms.',
    tags: ['UI/UX Design', 'Dashboard', 'Rapid Prototyping'],
    info: [
      { key: 'Client',   val: 'Nozomi Networks' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'OT & IoT Security' },
      { key: 'Role',     val: 'UX Designer' },
    ],
    deliverables: ['Brand Strategy', 'UI Design', 'Dashboard Design', 'Design System'],
    blocks: [

      // ── HERO ──
      { type: 'full', src: '/assets/Nozomi-UX-04.mp4', alt: 'Hero' },

      // ── THE BRIEF ──
      { type: 'section-intro',
        label: 'The Brief',
        texts: [
          'Nozomi Networks had built powerful technology. What they hadn\'t built was a product experience. The platform was full of raw functionality — configuration panels, sensor management, protocol queries — but no coherent user journey connecting any of it.',
          'I was brought in to start from scratch: sketch the flows on paper, understand what users actually needed to do on day one, and turn a collection of features into something that felt designed. The brief wasn\'t to redesign an interface. It was to create one.',
        ]
      },

      { type: 'grid2', items: [
        { src: DetailPage, alt: 'Data viz' },
        { src: '/assets/recbac-blue.mp4', alt: 'Recbac Blue' },
      ]},

      // ── THE PROBLEM ──
      { type: 'section-intro',
        label: 'The Problem',
        texts: [
          'Nozomi\'s platform monitors critical infrastructure in real time — power grids, hospitals, industrial plants. The users are security analysts whose job is to detect threats before they become incidents. But the interface was working against them. There was no visual hierarchy, no design system, and no coherent flow.',
          'The most common failure mode wasn\'t confusion about features. It was disorientation — analysts couldn\'t quickly understand where they were, what needed their attention, or what to do next. In a high-stakes environment, that disorientation has real consequences.',
        ]
      },

      { type: 'insight',
        label: 'Core Problem',
        text: 'Complexity, made legible. The platform had the data. The interface was hiding it.'
      },

      // ── RESEARCH ──
      { type: 'section-intro',
        label: 'Research',
        texts: [
          'The sensor onboarding flow was one of the most critical — and most broken — parts of the platform. It was the first thing a new analyst had to complete, and it was causing significant drop-off. Users were abandoning setup before they had seen a single piece of value from the product.',
          'We mapped the existing journey step by step and found three core problems: manual sensor ID entry was error-prone and slow, there were no progress indicators so users had no sense of how far they were or what came next, and the flow asked for configuration decisions before explaining what those decisions meant.',
          'The redesign was built around one principle: earn the next step before asking for it. QR scanning replaced manual ID entry entirely. Each screen confirms the previous action before requesting the next input. The result is a flow where the user always knows where they are, what just happened, and what to do next.',
        ]
      },

      { type: 'full', src: flowOnBoard, alt: 'Guardian Air onboarding flow' },

      { type: 'full', src: '/assets/Nozomi-02-hero.mp4', alt: 'Dashboard overview' },
      // ── DESIGN APPROACH ──
      { type: 'section-intro',
        label: 'Design Approach',
        texts: [
          'My approach was deliberate: solve the UX before touching the UI. That meant mapping every core task — alert triage, asset investigation, sensor deployment, network expansion — and designing the flow logic before a single high-fidelity frame was produced.',
          'Only once every flow was validated did we move to visual design. Hierarchy before aesthetics. Information architecture before colour. Structure before style. This sequence is what separates a polished product from a polished-looking one.',
        ]
      },

      { type: 'insight',
        label: 'Design Principle',
        text: 'Flow first. Pixels second. If the flow is wrong, the visual layer is irrelevant.'
      },

      { type: 'full', src: ProtectionUX, alt: 'Architecture' },

      // ── DESIGN DECISIONS ──
      { type: 'section-intro',
        label: 'Key Decision',
        texts: [
          'Every screen went through the same question: if an analyst has 10 seconds, what do they need to see first? That question overrode every other design preference. It meant removing elements that felt important to stakeholders but added cognitive load for users.',
        ]
      },

      { type: 'full', src: kiosk01, alt: 'Kiosk 01' },
      { type: 'full', src: kiosk02, alt: 'Kiosk 02' },
      { type: 'full', src: kiosk03, alt: 'Kiosk 03' },

      { type: 'full', src: DropdownNozomi, alt: 'Data charts', className: 'pd-block-padded' },
      { type: 'full', src: '/assets/deploy-sens.mp4', alt: 'Deploy Sensor' },
      { type: 'full', src: '/assets/expansion.mp4', alt: 'Expansion', className: 'pd-block-centered' },

      // ── ENGINEERING COLLABORATION ──
      { type: 'section-intro',
        label: 'Engineering',
        texts: [
          'I worked directly and continuously with the engineering team throughout — not handing off at the end, but designing in close collaboration from the start. That meant understanding technical constraints early and being present through implementation.',
          'The design system we built together — 120+ components — became the shared language between design and engineering. It reduced ambiguity, accelerated development, and gave the product a visual consistency it had never had before.',
        ]
      },

      { type: 'quote', text: 'From source to destination. The protocol speaks. The interface listens.' },

      { type: 'full', src: '/assets/video-integration.mp4', alt: 'Video Integration' },

      // ── INSTALLATION FLOWS ──
      { type: 'section-intro',
        label: 'Every Flow',
        texts: [
          'The Arc sensor installation was a seven-step process: launch the setup wizard, accept the license agreement, wait for the software to install, connect to a Guardian or Vantage endpoint using a sync token, choose dependencies, select the Arc installation path, and confirm completion. Simple on paper — but the original flow had no clear progress feedback, cryptic error states, and no guidance on where to find the token.',
          'We redesigned each step to be self-contained and unambiguous. Every screen tells the user exactly what is happening, what they need to do, and what comes next. Error messages were rewritten to be actionable rather than technical. The result: analysts could complete installation independently, without needing to contact support.',
        ]
      },

      { type: 'full', src: nozomiInstall1,   alt: 'Installation step 1' },
      { type: 'full', src: nozomiInstall2,   alt: 'Installation step 2' },
      { type: 'full', src: nozomiInstall4,   alt: 'Installation step 3' },
      { type: 'full', src: nozomiInstallEnd, alt: 'Installation step 4' },

      // ── OUTCOME ──
      { type: 'insight',
        label: 'Outcome',
        text: 'In control, for the first time. Time to first insight dropped from 12 minutes to under 90 seconds. Analyst satisfaction reached 94%.'
      },

      { type: 'section-intro',
        label: 'Takeaway',
        texts: [
          'That shift — from a platform that demanded effort to one that communicated clearly — was the goal from day one. And it was only possible because we started with research, solved the flow before the UI, and built in partnership with engineering throughout.',
        ]
      },

      { type: 'full', src: nozomiSlide, alt: 'Nozomi Slide' },
    ],
    prev: { id: 4, title: 'Rokt' },
    next: { id: 'rtk', title: 'Solidform' },
  },
  3: {
    title: 'CoStar Group',
    subtitle: 'Finding home should not feel like searching in the dark.',
    tags: ['Visual Design', 'Real Estate App', 'Branding'],
    info: [
      { key: 'Client',   val: 'Telary Studio' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'Real Estate' },
      { key: 'Role',     val: 'Lead UX/UI Designer' },
    ],
    deliverables: ['UX Strategy', 'UI Design', 'Design System', 'Prototyping', 'Handoff'],
    blocks: [
      { type: 'full',     src: telaryHero, alt: 'Telary Hero' },
      { type: 'section-intro',
        label: 'The Brief',
        texts: [
          'This project was a collaboration with Ron Design Lab, an award-winning UX/UI studio whose work spans Samsung, Ford, and Huawei. Together we led the end-to-end redesign of the CoStar Group consumer property search experience — combining strategic UX thinking with a high standard of visual craft.',
        ]
      },
      { type: 'headline', text: 'Home is not a filter.' },
      { type: 'body',     text: 'Not a price range. Not a pin on a map. We redesigned Telary from the ground up — so that searching for a place to live feels as human as the decision itself.' },
      { type: 'full',     src: telaryCover03, alt: 'Studio overview' },
      { type: 'grid2', items: [
        { src: telaryCover04, alt: 'Process' },
        { src: telaryCover05, alt: 'Exploration' },
      ]},

      { type: 'headline', text: 'Location. Light. Layout.' },
      { type: 'body',     text: 'The things that matter most are rarely the ones in the listing. We brought them to the surface — giving buyers language for what they already felt.' },
      { type: 'grid2', items: [
        { src: telaryScreen1, alt: 'Screen 1' },
        { src: telaryScreen2, alt: 'Screen 2' },
      ]},
      { type: 'grid2', items: [
        { src: telaryScreen3, alt: 'Screen 3' },
        { src: telaryScreen4, alt: 'Screen 4' },
      ]},
    ],
    prev: { id: 'rtk', title: 'Solidform' },
    next: { id: 4, title: 'Rokt' },
  },
  4: {
    title: 'Rokt',
    subtitle: 'Redesigning the next biggest ads management platform — from the ground up.',
    tags: ['UX Research', 'UI/UX Design', 'B2B Platform', 'Rapid Prototyping'],
    info: [
      { key: 'Client',   val: 'Rokt' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'AdTech' },
      { key: 'Role',     val: 'Lead UX/UI Designer' },
    ],
    deliverables: ['UX Research', 'Usability Testing', 'UI Design', 'Prototyping', 'Design System'],
    blocks: [
      { type: 'full',     src: exylusGif,   alt: 'Rokt Hero' },
      { type: 'headline', text: 'Ads at scale. Designed for humans.' },
      { type: 'body',     text: 'Rokt set out to become the next major ads management platform — alongside Facebook Ads Manager and Google Ads. Before scaling, they needed to know: does the beta actually work? We ran a full usability audit and determined which features to prioritise for the next iteration.' },
      { type: 'full',     src: exylusBasic, alt: 'Basic view' },
      { type: 'headline', text: 'Start with what breaks.' },
      { type: 'body',     text: 'We mapped every friction point in the beta — from campaign setup to targeting configuration. The most critical issues weren\'t bugs. They were moments where users lost confidence in what the platform was doing.' },
      { type: 'grid2', items: [
        { src: exylusDem,   alt: 'Demographics' },
        { src: exylusDrop,  alt: 'Dropdown' },
      ]},
      { type: 'full',     src: exylusCPR,   alt: 'CPR Max view' },
      { type: 'grid2', items: [
        { src: exylusTarg,  alt: 'Targeting' },
        { src: exylusTarg2, alt: 'Targeting 2' },
      ]},
      { type: 'quote',    text: 'Complexity is expected. Confusion is not.' },
      { type: 'grid2', items: [
        { src: exylusGt,    alt: 'GT view' },
        { src: exylusRec,   alt: 'Recommendations' },
      ]},
      { type: 'body',     text: 'The redesign established a clearer information hierarchy across all campaign views — reducing the cognitive load for media buyers managing multiple accounts simultaneously.' },
    ],
    prev: { id: 3, title: 'CoStar Group' },
    next: { id: 2, title: 'Nozomi Networks' },
  },
  rtk: {
    title: 'Solidform',
    subtitle: 'Crafting intuitive UX/UI and seamless digital experiences for a next-generation 3D platform',
    tags: ['Branding', 'UX/UI Design', 'Development'],
    info: [
      { key: 'Client',   val: 'RTK' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'Technology' },
      { key: 'Role',     val: 'Lead UX/UI Designer' },
    ],
    deliverables: ['Brand Identity', 'UX Design', 'UI Design', 'Development'],
    blocks: [
      { type: 'full',     src: rtkCoverSolid, alt: 'Solidform Cover' },
      { type: 'headline', text: 'Precision, layer by layer.' },
      { type: 'body',     text: <>Solidform is a 3D printing production provider operating at industrial scale. <strong>The challenge:</strong> a technology built on precision had a digital experience that felt anything but. We were brought in to close that gap — designing an interface as exact as the processes it controls.</> },
      { type: 'full',     src: rtkQuote1, alt: 'Solidform Hero' },
      { type: 'headline', text: 'Built to perform.' },
      { type: 'body',     text: 'Solidform needed a digital presence as sharp as the technology behind it. We stripped everything back — and rebuilt from first principles.' },
      { type: 'full',     src: rtkHero,   alt: 'Solidform Overview' },
      { type: 'full',     src: rtkFrame,  alt: 'Solidform Detail 2', className: 'pd-block-narrow' },
      { type: 'quote',    text: 'Precision is not a feature. It is the foundation.' },
      { type: 'full',     src: rtkCase,   alt: 'Solidform Detail 3' },
      { type: 'full',     src: rtkQuote3, alt: 'Solidform Detail 4' },
      { type: 'headline', text: 'Identity meets interface.' },
      { type: 'body',     text: 'Every interaction was designed to communicate speed, trust, and clarity — the three things Solidform\'s users needed most.' },
      { type: 'grid2', items: [
        { src: rtkSlide1, alt: 'Solidform Slide 1' },
        { src: rtkSlide2, alt: 'Solidform Slide 2' },
      ]},
      { type: 'full',     src: rtkQuote2, alt: 'Solidform Final' },
    ],
    prev: { id: 2, title: 'Nozomi Networks' },
    next: { id: 3, title: 'CoStar Group' },
  },
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const project = projects[id];

  if (!project) {
    return (
      <div className="hc-main-wrapper pd-page" style={{ color: '#64748B', paddingTop: '4rem' }}>
        Project not found.
      </div>
    );
  }

  const renderBlock = (block, i) => {
    switch (block.type) {
      case 'full':
        return (
          <div key={i} className={`pd-full ${block.className || ''}`}>
            {isVideo(block.src)
              ? <video src={block.src} autoPlay loop muted playsInline />
              : <img src={block.src} alt={block.alt || ''} />
            }
          </div>
        );
      case 'headline':
        return <h2 key={i} className="pd-headline">{block.text}</h2>;
      case 'body':
        return <p key={i} className="pd-body-text">{block.text}</p>;
      case 'quote':
        return (
          <blockquote key={i} className="pd-pull-quote">
            <p>"{block.text}"</p>
          </blockquote>
        );
      case 'splitText':
        return (
          <div key={i} className="pd-split">
            <div className="pd-split-media">
              {isVideo(block.src)
                ? <video src={block.src} autoPlay loop muted playsInline />
                : <img src={block.src} alt={block.alt || ''} />
              }
            </div>
            <div className="pd-split-text">
              <p>{block.text}</p>
            </div>
          </div>
        );
      case 'grid2':
        return (
          <div key={i} className="pd-grid2">
            {block.items.map((item, j) => (
              isVideo(item.src)
                ? <video key={j} src={item.src} autoPlay loop muted playsInline />
                : <img key={j} src={item.src} alt={item.alt || ''} />
            ))}
          </div>
        );
      case 'grid3':
        return (
          <div key={i} className="pd-grid3">
            {block.items.map((item, j) => (
              isVideo(item.src)
                ? <video key={j} src={item.src} autoPlay loop muted playsInline />
                : <img key={j} src={item.src} alt={item.alt || ''} />
            ))}
          </div>
        );
      case 'carousel':
        return <CarouselBlock key={i} items={block.items} />;

      // ── Section intro: label left + text right ──
      case 'section-intro':
        return (
          <div key={i} className="pd-section-intro">
            <div className="pd-section-intro-label">{block.label}</div>
            <div className="pd-section-intro-content">
              {block.texts.map((t, j) => (
                <p key={j} className="pd-section-intro-text">{t}</p>
              ))}
            </div>
          </div>
        );

      // ── Insight: dark callout block ──
      case 'insight':
        return (
          <div key={i} className="pd-insight">
            <div className="pd-insight-inner">
              <span className="pd-insight-eyebrow">{block.label}</span>
              <p className="pd-insight-text">{block.text}</p>
            </div>
          </div>
        );

      // ── Stats block ──
      case 'stats':
        return (
          <div key={i} className="pd-stats">
            <div className="pd-stats-header">
              <h3 className="pd-stats-label">{block.label}</h3>
              <p className="pd-stats-description">{block.description}</p>
            </div>
            <div className="pd-stats-circles">
              {block.items.map((item, j) => {
                const size = 200;
                const stroke = 14;
                const r = (size - stroke) / 2;
                const circ = 2 * Math.PI * r;
                const pct = item.pct !== undefined ? item.pct : 100;
                const filled = (pct / 100) * circ;
                const gradId = `grad-${i}-${j}`;
                return (
                  <div key={j} className="pd-stat-circle">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block'}}>
                      <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0033cc" />
                          <stop offset="100%" stopColor="#3b8bff" />
                        </linearGradient>
                      </defs>
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#dde8ff" strokeWidth={stroke} />
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#${gradId})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${filled} ${circ}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
                      <text x={size/2} y={size/2 - 14} textAnchor="middle" dominantBaseline="middle" fill="#0a2fa0" fontFamily="Syne, sans-serif" fontSize="32" fontWeight="800" letterSpacing="-1">{item.value}</text>
                      {item.label.split(' ').reduce((lines, word) => {
                        const last = lines[lines.length - 1];
                        if (last && (last + ' ' + word).length <= 14) { lines[lines.length - 1] = last + ' ' + word; } else { lines.push(word); }
                        return lines;
                      }, []).map((line, li) => (
                        <text key={li} x={size/2} y={size/2 + 18 + li * 16} textAnchor="middle" dominantBaseline="middle" fill="#0a2fa0" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="700">{line}</text>
                      ))}
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PasswordProtected projectId={id}>
      <div className={`hc-main-wrapper pd-page ${id === '3' ? 'pd-page--compact' : ''}`}>
        <header className="pd-header">
          <Link to="/" className="pd-back">← Back to Home</Link>
          <div className="pd-tags">
            {project.tags.map((t, i) => <span key={i} className="pd-tag">{t}</span>)}
          </div>
          <h1 className="pd-title">{project.title}</h1>
          <p className="pd-subtitle">{project.subtitle}</p>
        </header>

        <div className="pd-blocks">
          {project.blocks.map((block, i) => (
            <div key={i} className={`pd-block pd-block--${block.type}`}>
              {renderBlock(block, i)}
            </div>
          ))}
        </div>

        {(project.prev || project.next) && (
          <div className="pd-prevnext">
            {project.prev && (
              <Link to={`/work/${project.prev.id}`} className="pd-prevnext-item">
                <span className="pd-prevnext-label">← Prev</span>
                <span className="pd-prevnext-title">{project.prev.title}</span>
              </Link>
            )}
            {project.next && (
              <Link to={`/work/${project.next.id}`} className="pd-prevnext-item pd-prevnext-next">
                <span className="pd-prevnext-label">Next →</span>
                <span className="pd-prevnext-title">{project.next.title}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </PasswordProtected>
  );
};

export default ProjectDetailPage;