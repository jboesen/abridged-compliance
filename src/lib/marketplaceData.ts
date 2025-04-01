
export type WorkflowType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  useCases: string[];
  popularity: number; // 1-100 scale
  price: number; // Price in USD
};

export const workflowTypes: WorkflowType[] = [
  {
    id: "utility-trenching-sanjose",
    title: "Utility Trenching Permits - San Jose",
    description: "Streamline the complex process of obtaining trenching permits in San Jose with this specialized workflow for utility contractors and civil engineers.",
    icon: "map",
    benefits: [
      "Auto-populated forms with project specifications",
      "Pre-configured compliance checks for San Jose regulations",
      "Automated traffic control plan generation",
      "Integrated notification system for utility marking requirements"
    ],
    useCases: [
      "Fiber optic cable installation",
      "Water line repairs and upgrades",
      "Electrical conduit installation",
      "Gas line maintenance projects"
    ],
    popularity: 95,
    price: 249
  },
  {
    id: "road-repair-oakland",
    title: "Road Repair & ROW Permits - Oakland",
    description: "Comprehensive workflow for road repair and right-of-way permits in Oakland, optimized for civil engineering firms and contractors.",
    icon: "building",
    benefits: [
      "Built-in compliance with Oakland-specific regulations",
      "Automated encroachment permit application process",
      "Integrated fee calculator based on project parameters",
      "Pre-approved traffic diversion templates"
    ],
    useCases: [
      "Pothole and pavement repairs",
      "Sidewalk replacement projects",
      "Curb and gutter modifications",
      "ADA ramp installations"
    ],
    popularity: 87,
    price: 199
  },
  {
    id: "sidewalk-improvement-sf",
    title: "Sidewalk Improvement Workflow - San Francisco",
    description: "Navigate San Francisco's complex sidewalk permitting process with this specialized workflow designed for civil engineers and contractors.",
    icon: "building",
    benefits: [
      "SF-specific compliance verification",
      "Automated notification to adjacent property owners",
      "Integration with DPW notification requirements",
      "Pre-formatted accessibility compliance documentation"
    ],
    useCases: [
      "Commercial frontage improvements",
      "Residential sidewalk repairs",
      "Tree well installations and modifications",
      "ADA compliance upgrades"
    ],
    popularity: 82,
    price: 279
  },
  {
    id: "stormwater-compliance",
    title: "Stormwater Compliance Package - Bay Area",
    description: "Comprehensive workflow for managing stormwater permits and compliance across Bay Area jurisdictions.",
    icon: "zap",
    benefits: [
      "Multi-jurisdiction compatibility (9 Bay Area counties)",
      "Automated BMP selection based on project parameters",
      "Pre-formatted SWPPP documentation",
      "Integrated reporting templates for inspections"
    ],
    useCases: [
      "Construction site runoff control",
      "Post-construction stormwater management",
      "Municipal storm drain connections",
      "Erosion control planning"
    ],
    popularity: 89,
    price: 349
  },
  {
    id: "utility-coordination",
    title: "Utility Coordination Workflow",
    description: "Streamline multi-utility notifications and permit applications for complex infrastructure projects.",
    icon: "plug",
    benefits: [
      "Automated 811 notification integration",
      "Conflict identification with existing utilities",
      "Coordination timeline management",
      "Joint trench application templates"
    ],
    useCases: [
      "Multi-utility installation projects",
      "Joint trench coordination",
      "Conflict resolution with existing infrastructure",
      "Emergency repair coordination"
    ],
    popularity: 76,
    price: 229
  },
  {
    id: "environmental-compliance",
    title: "Environmental Compliance Package",
    description: "Ensure environmental compliance for civil engineering projects with this specialized permit workflow.",
    icon: "leaf",
    benefits: [
      "CEQA compliance documentation generator",
      "Automated environmental impact assessments",
      "Habitat conservation notification integration",
      "Air quality compliance management"
    ],
    useCases: [
      "Projects near sensitive habitats",
      "Work in waterway buffer zones",
      "Projects with significant excavation",
      "Construction in air quality management districts"
    ],
    popularity: 81,
    price: 399
  }
];
