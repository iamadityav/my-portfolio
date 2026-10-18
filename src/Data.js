// src/data.js: single source of truth, taken from the resume
export const profile = {
  name: 'Aditya Verma',
  role: 'React Native Developer',
  company: 'SDE 2 @ CloudHire AI',
  email: 'iamadityav@gmail.com',
  linkedin: 'https://linkedin.com/in/aditya-verma-b05604195',
  github: 'https://github.com/iamadityav',
  resume: `${import.meta.env.BASE_URL}resume.pdf`, // put the PDF at public/resume.pdf
};

export const skills = [
  'React Native', 'TypeScript', 'JavaScript', 'Node.js', 'React.js', 'Redux', 'Zustand',
  'Re.Pack', 'Firebase', 'PostgreSQL', 'OpenAI', 'Anthropic', 'Razorpay', 'Mixpanel',
];

export const stats = [
  ['3+', 'Years shipping RN'],
  ['30K+', 'Monthly users at Digit'],
  ['~40%', 'Faster builds'],
  ['250+', 'LeetCode solved'],
];

export const projects = [
  {
    id: 'cloudhire', name: 'CloudHire', icon: 'cloud', period: '2026', badge: 'SDE 2 / CURRENT',
    headline: 'End-to-End Mobile App Architecture',
    subtitle: 'AI job search app for job seekers across India and globally',
    metric: { value: 'iOS + Android', label: 'shipped solo to App Store and Play Store' },
    points: [
      'Sole React Native developer: architected, built and shipped the B2C app to both stores.',
      'Job discovery with personalized feeds, infinite scroll, smart filters and swipe-to-apply.',
      'Auto Apply module: LinkedIn OTP login, 2FA handling and Unipile inbox sync (Gmail, Outlook, Yahoo).',
      'AI resume generation and mock interviews (OpenAI, Anthropic), Razorpay subscriptions with a unified paywall, in-app chat and FCM push.',
      'Analytics stack (Mixpanel, Meta App Events, Firebase) with referral deep linking; Zustand across onboarding and the application tracker.',
    ],
    stack: ['React Native', 'Zustand', 'OpenAI', 'Anthropic', 'Razorpay', 'FCM', 'Mixpanel', 'Unipile'],
    store: '', // add your App Store / Play Store link here to show the "Open live build" button
    repo: '',
  },
  {
    id: 'digit', name: 'Digit', icon: 'shield', period: '2023 to 2026', badge: '30K+ MAU',
    headline: 'Insurance Journeys at Scale',
    subtitle: 'Motor Claims, Bike Insurance and My Policy',
    metric: { value: '~40%', label: 'faster dev builds via Re.Pack' },
    points: [
      'Built and maintained Motor Claims, Bike Insurance and My Policy, used by 30K+ customers monthly.',
      'Led the Webpack to Re.Pack migration, cutting dev build times by ~40% and improving CI/CD throughput. Won the Tech Titan Award (2025).',
      'Cut initial load time ~20% and improved navigation on mid-range and low-end Android devices.',
      'Improved crash analytics and logging, reducing recurring production issues by ~30%.',
    ],
    stack: ['React Native', 'Re.Pack', 'TypeScript'],
    store: '',
    repo: '',
  },
  {
    id: 'voice', name: 'Voice Notes', icon: 'mic', period: '2025', badge: 'PRODUCTIVITY / AI',
    headline: 'Speech-to-Text Notes',
    subtitle: 'Cross-platform note-taking with reminders',
    metric: { value: 'OpenAI', label: 'speech-to-text transcription' },
    points: [
      'Cross-platform note-taking app with OpenAI speech-to-text transcription.',
      'Reminders powered by Node.js APIs.',
    ],
    stack: ['React Native', 'OpenAI', 'Node.js'],
    store: '',
    repo: '',
  },
  {
    id: 'buildspace', name: 'Buildspace', icon: 'zap', period: '2024', badge: 'OFFLINE CACHING',
    headline: 'Real-Time Cross-Platform App',
    subtitle: 'Built for Buildspace Season 5',
    metric: { value: 'Offline', label: 'caching with Firebase data sync' },
    points: ['Real-time cross-platform app focused on offline caching and Firebase data sync.', 'Clean TypeScript architecture.'],
    stack: ['React Native', 'TypeScript', 'Firebase'],
    store: '',
    repo: '',
  },
  {
    id: 'portfolio', name: 'Portfolio', icon: 'globe', period: '2025', badge: 'FPS',
    headline: 'Interactive Portfolio Engine',
    subtitle: 'The site you are on right now',
    metric: { value: 'Live', label: 'FPS monitor and in-browser JS playground' },
    points: ['Animated sections, a release-history timeline and a native-bridge JS playground.', 'Responsive layout built with Tailwind CSS and Framer Motion.'],
    stack: ['React', 'Tailwind', 'Framer Motion'],
    store: '',
    repo: `${profile.github}/my-portfolio`, // assumes the repo is named my-portfolio. Adjust if not.
  },
];