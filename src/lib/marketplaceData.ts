
// Workflow types for the marketplace
export const workflowTypes = [
  {
    id: "la-utility-trenching",
    title: "LA County Utility Trenching Permit Workflow",
    description: "Complete workflow for utility trenching permits in Los Angeles County.",
    agency: "LA County Public Works",
    permitType: "utility",
    rating: 4.8,
    reviews: 24,
    price: 299,
    verified: true,
    benefits: [
      "Reduces permit approval time by 60%",
      "Auto-fills all required LA County forms",
      "Includes pre-approved traffic control plans",
      "Automated document validation",
      "Direct submission to LA County Public Works"
    ],
    useCases: [
      "Utility line installations",
      "Telecommunications infrastructure",
      "Water line repairs",
      "Gas line installations",
      "Underground electrical work"
    ]
  },
  {
    id: "la-traffic-control",
    title: "LA County Traffic Control Plan Package",
    description: "Traffic control plan templates and automated permit generation for LA County.",
    agency: "LA Department of Transportation",
    permitType: "traffic",
    rating: 4.6,
    reviews: 18,
    price: 249,
    verified: true,
    benefits: [
      "Pre-approved traffic control plan templates",
      "Automated lane closure scheduling",
      "Real-time agency requirement updates",
      "Notification system for affected residents",
      "Expedited review process"
    ],
    useCases: [
      "Road construction projects",
      "Utility work in high-traffic areas",
      "Special event road closures",
      "Emergency repair work",
      "Construction site access planning"
    ]
  },
  {
    id: "la-sidewalk",
    title: "LA County Sidewalk Construction Workflow",
    description: "Step-by-step workflow for sidewalk construction permits in LA County.",
    agency: "LA County Public Works",
    permitType: "sidewalk",
    rating: 4.5,
    reviews: 12,
    price: 199,
    verified: true,
    benefits: [
      "ADA compliance verification",
      "Automated dimension calculations",
      "Material specification templates",
      "Pedestrian safety plan generation",
      "Integration with LA County inspection scheduling"
    ],
    useCases: [
      "New sidewalk installations",
      "Sidewalk repair projects",
      "Curb and gutter installations",
      "ADA ramp construction",
      "Public walkway improvements"
    ]
  },
  {
    id: "la-road-repair",
    title: "LA County Road Repair & ROW Permits",
    description: "Comprehensive workflow for road repair and right-of-way permits in LA County.",
    agency: "LA County Public Works",
    permitType: "road",
    rating: 4.7,
    reviews: 15,
    price: 279,
    verified: false,
    benefits: [
      "Automated pavement assessment forms",
      "Material quantity calculations",
      "Traffic impact analysis automation",
      "Right-of-way documentation templates",
      "Inspection scheduling integration"
    ],
    useCases: [
      "Pothole repairs",
      "Full road resurfacing",
      "Road widening projects",
      "Median construction",
      "Shoulder repair and maintenance"
    ]
  },
  {
    id: "la-storm-drain",
    title: "LA County Storm Drain Installation Package",
    description: "Complete permit workflow for storm drain installations in LA County.",
    agency: "LA County Flood Control District",
    permitType: "utility",
    rating: 4.4,
    reviews: 9,
    price: 229,
    verified: false,
    benefits: [
      "Hydraulic calculation templates",
      "Environmental compliance automation",
      "Material specification guides",
      "Integration with LA County Flood Control District systems",
      "Maintenance schedule generation"
    ],
    useCases: [
      "New storm drain installations",
      "Drainage system upgrades",
      "Flood control projects",
      "Culvert installations",
      "Stormwater management compliance"
    ]
  },
];
