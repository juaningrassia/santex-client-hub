
export interface Client {
  id: number;
  name: string;
  industry: string;
  status: 'Active' | 'At Risk' | 'Inactive';
  revenue: number;
  growth: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  startDate: string;
  notes: string;
}

export const clients: Client[] = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    status: "Active",
    revenue: 125000,
    growth: 12.5,
    contactName: "John Smith",
    contactEmail: "john@acmecorp.com",
    contactPhone: "(555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    startDate: "2020-05-12",
    notes: "Enterprise client with multiple product lines."
  },
  {
    id: 2,
    name: "Globex Industries",
    industry: "Manufacturing",
    status: "Active",
    revenue: 87500,
    growth: -2.3,
    contactName: "Jane Doe",
    contactEmail: "jane@globex.com",
    contactPhone: "(555) 234-5678",
    address: "456 Market St, Chicago, IL",
    startDate: "2019-11-03",
    notes: "Recently reduced their product order due to economic slowdown."
  },
  {
    id: 3,
    name: "Soylent Corp",
    industry: "Food & Beverage",
    status: "Inactive",
    revenue: 65000,
    growth: 5.7,
    contactName: "Robert Johnson",
    contactEmail: "robert@soylent.com",
    contactPhone: "(555) 345-6789",
    address: "789 Park Ave, New York, NY",
    startDate: "2021-02-28",
    notes: "Currently paused services for review."
  },
  {
    id: 4,
    name: "Initech LLC",
    industry: "Financial Services",
    status: "Active",
    revenue: 32500,
    growth: 18.2,
    contactName: "Michael Bolton",
    contactEmail: "michael@initech.com",
    contactPhone: "(555) 456-7890",
    address: "101 Tech Plaza, Austin, TX",
    startDate: "2022-01-15",
    notes: "Fast-growing client with potential for upselling."
  },
  {
    id: 5,
    name: "Umbrella Corp",
    industry: "Healthcare",
    status: "At Risk",
    revenue: 225000,
    growth: -8.5,
    contactName: "Albert Wesker",
    contactEmail: "wesker@umbrella.com",
    contactPhone: "(555) 567-8901",
    address: "202 Science Dr, Boston, MA",
    startDate: "2018-07-22",
    notes: "Client experiencing budget constraints; needs attention."
  },
  {
    id: 6,
    name: "Stark Industries",
    industry: "Defense",
    status: "Active",
    revenue: 315000,
    growth: 22.1,
    contactName: "Tony Stark",
    contactEmail: "tony@stark.com",
    contactPhone: "(555) 678-9012",
    address: "10880 Malibu Point, Malibu, CA",
    startDate: "2019-04-17",
    notes: "Premium client with multiple long-term contracts."
  },
  {
    id: 7,
    name: "Wayne Enterprises",
    industry: "Conglomerate",
    status: "Active",
    revenue: 287500,
    growth: 8.3,
    contactName: "Bruce Wayne",
    contactEmail: "bruce@wayne.com",
    contactPhone: "(555) 789-0123",
    address: "1007 Mountain Drive, Gotham, NY",
    startDate: "2020-09-30",
    notes: "Diverse portfolio client with interests in multiple sectors."
  },
  {
    id: 8,
    name: "Cyberdyne Systems",
    industry: "Robotics",
    status: "At Risk",
    revenue: 175000,
    growth: -12.7,
    contactName: "Miles Dyson",
    contactEmail: "miles@cyberdyne.com",
    contactPhone: "(555) 890-1234",
    address: "18144 El Camino Real, Sunnyvale, CA",
    startDate: "2021-11-05",
    notes: "Facing regulatory challenges; may need to adjust service plan."
  },
  {
    id: 9,
    name: "Oscorp Industries",
    industry: "Biotech",
    status: "Active",
    revenue: 142500,
    growth: 15.8,
    contactName: "Norman Osborn",
    contactEmail: "norman@oscorp.com",
    contactPhone: "(555) 901-2345",
    address: "5th Avenue, New York, NY",
    startDate: "2022-03-12",
    notes: "Growing client with focus on innovative research projects."
  },
  {
    id: 10,
    name: "LexCorp",
    industry: "Technology",
    status: "Active",
    revenue: 195000,
    growth: 5.2,
    contactName: "Lex Luthor",
    contactEmail: "lex@lexcorp.com",
    contactPhone: "(555) 012-3456",
    address: "1700 Broadway, Metropolis, DE",
    startDate: "2020-12-08",
    notes: "Stable client with consistent growth."
  }
];
