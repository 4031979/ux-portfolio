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
      { type: 'full', src: target01, alt: 'Target 01' },
      { type: 'full', src: target02, alt: 'Target 02' },

      { type: 'full', src: PlanConfig, alt: 'Data charts', className: 'pd-block-padded' },
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
  