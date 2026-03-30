import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PasswordProtected from '../components/PasswordProtected';
import ProtectionUX from '../assets/Nozomi-UX-3.png'
import DetailPage from '../assets/process-03.png'
import DropdownNozomi from '../assets/Nozomi-dropdown.png'
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
    tags: ['Branding', 'UI/UX Design', 'Dashboard', 'Rapid Prototyping'],
    info: [
      { key: 'Client',   val: 'Nozomi Networks' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'OT & IoT Security' },
      { key: 'Role',     val: 'UX Designer' },
    ],
    deliverables: ['Brand Strategy', 'UI Design', 'Dashboard Design', 'Design System'],
    blocks: [
      { type: 'full',     src: '/assets/Nozomi-UX-04.mp4', alt: 'Hero' },
      { type: 'splitText', src: '/assets/recbac-blue.mp4', alt: 'Recbac Blue',
        text: 'The brief was clear: security analysts were drowning in data. Our job was to bring structure to chaos — designing an interface that makes critical information impossible to miss.' },
      { type: 'headline', text: 'Complexity, made legible.' },
      { type: 'body',     text: 'We started with a week of shadowing analysts in the field. The existing dashboard demanded too much — too many clicks, too much context switching. The redesign began by removing, not adding.' },
      { type: 'full',     src: '/assets/Nozomi-02-hero.mp4', alt: 'Dashboard overview' },
      { type: 'grid2', items: [
        { src: ProtectionUX, alt: 'Architecture' },
        { src: DetailPage,   alt: 'Data viz' },
      ]},
      { type: 'headline', text: 'Hierarchy before aesthetics.' },
      { type: 'body',     text: 'Every artboard went through three rounds of information hierarchy review. We asked one question constantly: if an analyst has 10 seconds, what do they need to see first? That question shaped every layout decision.' },
      { type: 'full',     src: DropdownNozomi, alt: 'Data charts', className: 'pd-block-padded' },
      { type: 'full',     src: '/assets/deploy-sens.mp4', alt: 'Deploy Sensor' },
      { type: 'full',     src: '/assets/expansion.mp4', alt: 'Expansion', className: 'pd-block-centered' },
      { type: 'quote',    text: 'From source to destination. The protocol speaks. The interface listens.' },
      { type: 'body',     text: 'The final system reduced time to first insight from 12 minutes to under 90 seconds. More importantly, analysts reported feeling in control — not overwhelmed — for the first time.' },
      { type: 'full',     src: '/assets/video-integration.mp4', alt: 'Video Integration' },
      { type: 'full',     src: nozomiInstall1, alt: 'Installation' },
      { type: 'full',     src: nozomiInstall2, alt: 'Installation' },
      { type: 'full',     src: nozomiInstall4, alt: 'Installation' },
      { type: 'full',     src: nozomiInstallEnd, alt: 'Installation' },
     
      { type: 'full',     src: nozomiSlide, alt: 'Nozomi Slide' },
    ],
    prev: { id: 4, title: 'Rokt' },
    next: { id: 'rtk', title: 'Solidform' },
  },
  3: {
    title: 'CoStar Group',
    subtitle: 'Finding home should not feel like searching in the dark.',
    tags: ['UX/UI Design', 'Real Estate App', 'Branding'],
    info: [
      { key: 'Client',   val: 'Telary Studio' },
      { key: 'Year',     val: '2024' },
      { key: 'Industry', val: 'Real Estate' },
      { key: 'Role',     val: 'Lead UX/UI Designer' },
    ],
    deliverables: ['UX Strategy', 'UI Design', 'Design System', 'Prototyping', 'Handoff'],
    blocks: [
      { type: 'full',     src: telaryHero, alt: 'Telary Hero' },
      { type: 'headline', text: 'Home is not a filter.' },
      { type: 'body',     text: 'Not a price range. Not a pin on a map. We redesigned Telary from the ground up — so that searching for a place to live feels as human as the decision itself.' },
      { type: 'full',     src: telaryCover03, alt: 'Studio overview' },
      { type: 'grid2', items: [
        { src: telaryCover04, alt: 'Process' },
        { src: telaryCover05, alt: 'Exploration' },
      ]},
      { type: 'quote',    text: 'Every space tells a story. We built the interface to listen.' },
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
      { type: 'body',     text: 'Bounce rate dropped by 35% and average session duration doubled after the redesigned experience launched.' },
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
      { type: 'body',     text: 'Solidform is a 3D printing production provider operating at industrial scale. The challenge: a technology built on precision had a digital experience that felt anything but. We were brought in to close that gap — designing an interface as exact as the processes it controls.' },
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