
export type WorkflowType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  useCases: string[];
  popularity: number; // 1-100 scale
};

export const workflowTypes: WorkflowType[] = [
  {
    id: "residential-renovation",
    title: "Residential Renovation Permits",
    description: "Streamline permits for home renovations, additions, and remodels with AI-guided document preparation and local code compliance.",
    icon: "home",
    benefits: [
      "Pre-filled forms based on project type and location",
      "Automatic checks against local residential codes",
      "Timeline estimates based on similar projects",
      "Common rejection reasons and how to avoid them"
    ],
    useCases: [
      "Kitchen and bathroom remodels",
      "Home additions",
      "Basement finishing",
      "Structural modifications"
    ],
    popularity: 92
  },
  {
    id: "commercial-construction",
    title: "Commercial Construction Permits",
    description: "Navigate complex commercial permitting requirements with specialized workflows for new construction, tenant improvements, and change of use.",
    icon: "building",
    benefits: [
      "Multi-department permit coordination",
      "Accessibility compliance verification",
      "Fire safety requirement checks",
      "Zoning and land use validation"
    ],
    useCases: [
      "New commercial buildings",
      "Tenant improvements",
      "Change of occupancy",
      "Mixed-use developments"
    ],
    popularity: 85
  },
  {
    id: "specialty-permits",
    title: "Specialty Trade Permits",
    description: "Focused workflows for electrical, plumbing, mechanical, and other specialty permits with technical requirement guidance.",
    icon: "plug",
    benefits: [
      "Trade-specific code requirement checks",
      "Required inspection scheduling assistance",
      "Technical drawing review guidelines",
      "License and insurance verification"
    ],
    useCases: [
      "Electrical system upgrades",
      "HVAC installations",
      "Plumbing modifications",
      "Fire protection systems"
    ],
    popularity: 78
  },
  {
    id: "expedited-review",
    title: "Expedited Review Process",
    description: "Fast-track permit approval with optimized application packages and pre-submission reviews to minimize revision cycles.",
    icon: "zap",
    benefits: [
      "Pre-submission application review",
      "Common error identification and correction",
      "Priority processing strategies",
      "Jurisdiction-specific expediting tips"
    ],
    useCases: [
      "Time-sensitive projects",
      "Simple projects with standard requirements",
      "Emergency repairs and replacements",
      "Projects with financing deadlines"
    ],
    popularity: 89
  },
  {
    id: "zoning-compliance",
    title: "Zoning & Land Use Compliance",
    description: "Analyze zoning requirements, setbacks, and land use restrictions before submitting permits to prevent costly revisions.",
    icon: "map",
    benefits: [
      "Automatic zoning district identification",
      "Setback and height restriction analysis",
      "Conditional use and variance guidance",
      "Historical district compliance checks"
    ],
    useCases: [
      "New construction siting",
      "Property subdivision",
      "Accessory dwelling units",
      "Mixed-use developments"
    ],
    popularity: 76
  },
  {
    id: "sustainable-building",
    title: "Green Building & Energy Permits",
    description: "Streamline permits for sustainable building projects with specialized workflows for energy efficiency, renewables, and green certifications.",
    icon: "leaf",
    benefits: [
      "Energy code compliance verification",
      "Solar and renewable system permitting",
      "Green building certification guidance",
      "Incentive program application support"
    ],
    useCases: [
      "Solar panel installations",
      "Energy efficiency retrofits",
      "LEED certification projects",
      "Net-zero energy buildings"
    ],
    popularity: 81
  }
];
