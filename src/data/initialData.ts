import { Skill, Role } from '../types'

export const skills: Skill[] = [
  {
    id: 'html-css',
    name: 'HTML & CSS',
    description: 'Fundamental web technologies for structuring and styling web pages.',
    category: 'Frontend',
    resources: [
      {
        type: 'doc',
        title: 'MDN HTML Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description: 'Complete HTML reference guide'
      },
      {
        type: 'doc',
        title: 'MDN CSS Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        description: 'Complete CSS reference guide'
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Programming language for web development.',
    category: 'Frontend',
    resources: [
      {
        type: 'doc',
        title: 'MDN JavaScript Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        description: 'Complete JavaScript learning guide'
      }
    ]
  },
  {
    id: 'react',
    name: 'React',
    description: 'A JavaScript library for building user interfaces.',
    category: 'Frontend',
    resources: [
      {
        type: 'doc',
        title: 'React Official Documentation',
        url: 'https://react.dev',
        description: 'Official React documentation and tutorials'
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Typed superset of JavaScript that compiles to plain JavaScript.',
    category: 'Frontend',
    resources: [
      {
        type: 'doc',
        title: 'TypeScript Handbook',
        url: 'https://www.typescriptlang.org/docs/',
        description: 'Official TypeScript documentation'
      }
    ]
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
    category: 'Backend',
    resources: [
      {
        type: 'doc',
        title: 'Node.js Documentation',
        url: 'https://nodejs.org/docs/',
        description: 'Official Node.js documentation'
      }
    ]
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'Principles and patterns for designing scalable systems.',
    category: 'Architecture',
    resources: [
      {
        type: 'book',
        title: 'System Design Interview',
        url: 'https://github.com/donnemartin/system-design-primer',
        description: 'System design primer for interviews'
      }
    ]
  },
  {
    id: 'leadership',
    name: 'Team Leadership',
    description: 'Skills for leading development teams.',
    category: 'Management',
    resources: [
      {
        type: 'course',
        title: 'Engineering Leadership',
        url: 'https://www.pluralsight.com/courses/engineering-leadership',
        description: 'Course on engineering leadership'
      }
    ]
  }
]

export const roles: Role[] = [
  {
    id: 'junior-frontend',
    title: 'Junior Frontend Developer',
    description: 'Entry-level developer focused on implementing user interfaces and basic interactions.',
    category: 'Frontend',
    salaryRange: { min: 50000, max: 75000 },
    skills: ['html-css', 'javascript', 'react'],
    requirements: [
      'Basic understanding of HTML, CSS, and JavaScript',
      'Familiarity with React or similar framework',
      'Understanding of responsive design principles'
    ],
    responsibilities: [
      'Implement UI components based on designs',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Debug and fix frontend issues'
    ],
    level: 'entry',
    position: { x: 100, y: 200 }
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Mid-level developer responsible for creating complex user interfaces and interactions.',
    category: 'Frontend',
    salaryRange: { min: 75000, max: 110000 },
    skills: ['html-css', 'javascript', 'react', 'typescript'],
    requirements: [
      'Strong proficiency in JavaScript and TypeScript',
      'Experience with React and modern frontend tools',
      'Understanding of state management patterns',
      'Knowledge of testing frameworks'
    ],
    responsibilities: [
      'Develop complex frontend features',
      'Optimize application performance',
      'Mentor junior developers',
      'Collaborate with designers and backend developers'
    ],
    level: 'mid',
    position: { x: 400, y: 200 }
  },
  {
    id: 'senior-frontend',
    title: 'Senior Frontend Developer',
    description: 'Senior developer leading frontend architecture and complex feature development.',
    category: 'Frontend',
    salaryRange: { min: 110000, max: 150000 },
    skills: ['html-css', 'javascript', 'react', 'typescript', 'system-design'],
    requirements: [
      'Expert knowledge of JavaScript and TypeScript',
      'Deep understanding of React ecosystem',
      'Experience with system architecture design',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Design and implement complex frontend systems',
      'Lead technical decisions and architecture',
      'Mentor team members',
      'Optimize for scalability and performance'
    ],
    level: 'senior',
    position: { x: 700, y: 200 }
  },
  {
    id: 'frontend-architect',
    title: 'Frontend Architect',
    description: 'Technical leader responsible for frontend platform and architecture decisions.',
    category: 'Frontend',
    salaryRange: { min: 150000, max: 200000 },
    skills: ['html-css', 'javascript', 'react', 'typescript', 'system-design'],
    requirements: [
      'Extensive experience in frontend development',
      'Strong system design and architecture skills',
      'Leadership experience',
      'Deep understanding of web performance'
    ],
    responsibilities: [
      'Define frontend architecture and standards',
      'Lead technical strategy and roadmap',
      'Make critical technology decisions',
      'Drive engineering excellence across teams'
    ],
    level: 'lead',
    position: { x: 1000, y: 200 }
  },
  {
    id: 'engineering-manager',
    title: 'Engineering Manager',
    description: 'Manager responsible for team leadership, project management, and technical guidance.',
    category: 'Management',
    salaryRange: { min: 140000, max: 190000 },
    skills: ['system-design', 'leadership'],
    requirements: [
      'Strong technical background',
      'Leadership and management experience',
      'Project management skills',
      'Excellent communication skills'
    ],
    responsibilities: [
      'Manage engineering team performance',
      'Drive project planning and execution',
      'Facilitate technical decision making',
      'Support career development of team members'
    ],
    level: 'lead',
    position: { x: 700, y: 400 }
  },
  {
    id: 'cto',
    title: 'Chief Technology Officer',
    description: 'Executive responsible for technology strategy and company-wide technical vision.',
    category: 'Executive',
    salaryRange: { min: 200000, max: 350000 },
    skills: ['system-design', 'leadership'],
    requirements: [
      'Extensive technical leadership experience',
      'Strategic thinking and vision',
      'Strong business acumen',
      'Executive presence and communication'
    ],
    responsibilities: [
      'Define company technology strategy',
      'Lead technical organization',
      'Drive innovation and R&D',
      'Align technology with business objectives'
    ],
    level: 'principal',
    position: { x: 1000, y: 400 }
  }
]

// Create initial graph nodes from roles
export const initialNodes = roles.map(role => ({
  id: role.id,
  type: 'roleNode' as const,
  position: role.position,
  data: {
    role,
    isSelected: false,
    isCompleted: false
  }
}))

// Create initial graph edges representing career progression
export const initialEdges = [
  {
    id: 'junior-to-frontend',
    source: 'junior-frontend',
    target: 'frontend-developer',
    type: 'smoothstep' as const,
    data: {
      label: '2-3 years',
      difficulty: 'medium' as const
    }
  },
  {
    id: 'frontend-to-senior',
    source: 'frontend-developer',
    target: 'senior-frontend',
    type: 'smoothstep' as const,
    data: {
      label: '3-5 years',
      difficulty: 'hard' as const
    }
  },
  {
    id: 'senior-to-architect',
    source: 'senior-frontend',
    target: 'frontend-architect',
    type: 'smoothstep' as const,
    data: {
      label: '5+ years',
      difficulty: 'hard' as const
    }
  },
  {
    id: 'senior-to-manager',
    source: 'senior-frontend',
    target: 'engineering-manager',
    type: 'smoothstep' as const,
    data: {
      label: 'Management path',
      difficulty: 'medium' as const
    }
  },
  {
    id: 'architect-to-cto',
    source: 'frontend-architect',
    target: 'cto',
    type: 'smoothstep' as const,
    data: {
      label: 'Executive path',
      difficulty: 'hard' as const
    }
  },
  {
    id: 'manager-to-cto',
    source: 'engineering-manager',
    target: 'cto',
    type: 'smoothstep' as const,
    data: {
      label: 'Executive path',
      difficulty: 'hard' as const
    }
  }
]
