export interface GuideArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  summary: string;
  sections: {
    title: string;
    formula?: string;
    content: string[];
    example?: string;
  }[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'flooring-calculator',
    title: 'How to Calculate Flooring Materials & Box Counts',
    subtitle: 'Turn accurate measurements into an exact, print-ready materials list with zero spreadsheet headaches.',
    category: 'Field Guide / 01',
    readTime: '4 min read',
    summary: 'Planning a new floor? Before buying a single box, learn how to turn rectangular measurements into required square footage, waste allowances, and ceiling-rounded carton quantities.',
    sections: [
      {
        title: '01. Calculate your floor area',
        formula: 'Floor area = width × length',
        content: [
          'For a rectangular room, multiply the interior width by the interior length.',
          'Always measure the finished floor baseboards-to-baseboards rather than estimating from furniture placement or builder blueprints.',
        ],
        example: 'For a room that is 12 ft wide and 18 ft long, the floor area is 12 × 18 = 216 ft².',
      },
      {
        title: '02. Include a waste allowance',
        formula: 'Required coverage = floor area × (1 + waste % ÷ 100)',
        content: [
          'Material is lost to edge trimming, perimeter cuts, end-of-row offcuts and unexpected damage.',
          'A planning allowance of 10% is standard for straight installations. For diagonal or complex layouts, budget 15% to 20%.',
        ],
        example: 'At 10% allowance on 216 ft²: 216 × 1.10 = 237.6 ft² required.',
      },
      {
        title: '03. Convert area into whole boxes',
        formula: 'Boxes to purchase = ceil(required coverage ÷ coverage per box)',
        content: [
          'Flooring is packaged in whole cartons with manufacturer coverage specifications.',
          'Divide required coverage by the square footage printed on the box, then ALWAYS round up to the next integer. Flooring cannot be purchased in fractional boxes.',
        ],
        example: 'With 24 ft² per box: 237.6 ÷ 24 = 9.9, so you must purchase 10 whole boxes.',
      },
      {
        title: '04. Estimate your materials budget',
        formula: 'Material cost = boxes × price per box (+ optional sales tax)',
        content: [
          'Multiply your rounded carton quantity by the verified price per box.',
          'Apply regional sales tax separately to avoid hidden intermediate rounding.',
        ],
        example: '10 boxes at $45 per box equals $450 before tax.',
      },
      {
        title: 'Important exclusions and limitations',
        content: [
          'A material estimate is not a substitute for a physical site inspection or cutting layout.',
          'Excludes subfloor leveling, self-leveling compound, moisture barriers, foam underlayment, baseboards, transition strips, adhesives, and labor.',
          'For stairs, closets, and irregular alcoves, verify quantities with your installer.',
        ],
      },
    ],
  },
  {
    slug: 'laying-patterns',
    title: 'Choosing the Right Laying Pattern: Straight vs Staggered vs Herringbone',
    subtitle: 'How installation pattern choices impact visual length, room flow, and cutting waste percentages.',
    category: 'Design & Engineering / 02',
    readTime: '5 min read',
    summary: 'Explore how different laying angles influence perceived room dimensions, joint stability, and the amount of cutting waste you must budget for.',
    sections: [
      {
        title: '01. Staggered Planks (The Standard)',
        content: [
          'Planks are laid parallel to the longest wall or primary light source with joints offset by at least 6–8 inches.',
          'Generates approximately 8–10% cutting waste because offcuts from the end of one row can frequently be used to begin the next row.',
        ],
      },
      {
        title: '02. Straight Grid (Tiles & Minimalist Rooms)',
        content: [
          'Planks or tiles align in both directions along continuous grid lines.',
          'Requires meticulous subfloor flatness and alignment to avoid visible joint drift.',
        ],
      },
      {
        title: '03. Diagonal and Herringbone (Architectural Accent)',
        content: [
          'Laying flooring at a 45-degree angle makes narrow rooms appear wider and adds distinctive architectural flair.',
          'Requires 15% to 20% waste allowance because every perimeter board requires a custom angled cut that cannot always be reused.',
        ],
      },
    ],
  },
];
