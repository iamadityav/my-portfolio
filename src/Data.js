// src/data.js: single source of truth, taken from the resume
export const profile = {
  name: 'Aditya Verma',
  role: 'React Native Engineer',
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
  ['~30%', 'Fewer prod issues'],
];

export const projects = [
  {
    id: 'cloudhire', name: 'CloudHire', icon: 'cloud', period: '2026', badge: 'SDE 2 / CURRENT',
    headline: 'AI job search app, designed, built and shipped solo',
    subtitle: 'B2C app for job seekers across India and globally, live on the App Store and Play Store',
    metric: { value: 'Solo', label: 'one engineer, from architecture to both stores' },
    points: [
      'Owned the full lifecycle as the sole React Native engineer: architecture, build, release and store submission.',
      'Job discovery: personalized feeds, infinite scroll, smart filters and a swipe-to-apply flow.',
      'Auto Apply: LinkedIn OTP login, 2FA handling and Unipile inbox sync across Gmail, Outlook and Yahoo.',
      'AI features: resume generation and mock interviews using OpenAI and Anthropic APIs.',
      'Monetization: Razorpay subscriptions (Blue and Elite plans) behind a unified paywall.',
      'Growth: Mixpanel, Meta App Events and Firebase analytics with referral deep linking, plus in-app chat and FCM push.',
    ],
    stack: ['React Native', 'Zustand', 'OpenAI', 'Anthropic', 'Razorpay', 'FCM', 'Mixpanel', 'Unipile'],
    store: '', // add your App Store / Play Store link to show the "Open live build" button
    repo: '',
  },
  {
    id: 'digit', name: 'Digit', icon: 'shield', period: '2023 to 2026', badge: '30K+ MAU',
    headline: 'Production insurance app serving 30K+ customers monthly',
    subtitle: 'Motor Claims, Bike Insurance and My Policy',
    metric: { value: '~40%', label: 'faster dev builds after the Re.Pack migration' },
    points: [
      'Shipped and maintained Motor Claims, Bike Insurance and My Policy, core journeys used by 30K+ customers every month.',
      'Led the Webpack to Callstack Re.Pack migration: dev builds ~40% faster and higher CI/CD throughput. Recognized with the Tech Titan Award (2025).',
      'Cut initial load time ~20% through bundle and rendering optimization, with smoother navigation on mid-range and low-end Android.',
      'Strengthened crash analytics and logging, bringing recurring production issues down ~30% across releases.',
    ],
    stack: ['React Native', 'Re.Pack', 'TypeScript'],
    store: '',
    repo: '',
  },
  {
    id: 'voice', name: 'Voice Notes', icon: 'mic', period: '2025', badge: 'PRODUCTIVITY / AI',
    headline: 'AI voice notes with reminders',
    subtitle: 'Side project: cross-platform note-taking app',
    metric: { value: 'OpenAI', label: 'speech-to-text transcription' },
    points: [
      'Speech-to-text transcription powered by OpenAI.',
      'Reminders driven by Node.js APIs.',
    ],
    stack: ['React Native', 'OpenAI', 'Node.js'],
    store: '',
    repo: '',
  },
  {
    id: 'buildspace', name: 'Buildspace', icon: 'zap', period: '2024', badge: 'OFFLINE-FIRST',
    headline: 'Offline-first real-time app',
    subtitle: 'Built during Buildspace Season 5',
    metric: { value: 'Offline', label: 'caching with Firebase data sync' },
    points: ['Real-time cross-platform app focused on offline caching and Firebase data sync.', 'Clean TypeScript architecture.'],
    stack: ['React Native', 'TypeScript', 'Firebase'],
    store: '',
    repo: '',
  },
];