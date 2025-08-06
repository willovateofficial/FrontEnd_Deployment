import { Plan } from "../types/plan";

export function getDemoPlans(billing: string): Plan[] {
  return [
    {
      id: "trial",
      name: "Trial",
      price: 0,
      durationDays: 5,
      features: [
        "Digital Menu (Up to 10 Items)",
        "Basic Order Taking",
        "Simple Billing",
        "Community Support",
        "Reports & Analytics (Disabled)",
        "Inventory Tracking (Disabled)",
        "Third-Party Integrations (Disabled)",
      ],
    },
    {
      id: "basic",
      name: "Basic",
      price: billing === "monthly" ? 399 : 4599,
      durationDays: billing === "monthly" ? 30 : 365,
      features: [
        "Digital Menu (Up to 25 Items)",
        "Order Management Dashboard",
        "Daily Sales Reports",
        "Offers & Promotions",
        "Customer Feedback Form",
        "Inventory Management (Disabled)",
        "QR Table Ordering (Disabled)",
        "CRM & Loyalty Program (Disabled)",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: billing === "monthly" ? 599 : 6599,
      durationDays: billing === "monthly" ? 30 : 365,
      features: [
        "Unlimited Menu Items",
        "QR Table Ordering",
        "Customer Feedback System",
        "Offers & Promotions",
        "Analytics Dashboard",
        "Inventory Management",
        "Third-Party App Integration",
        "CRM & Loyalty Program (Disabled)",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: billing === "monthly" ? 799 : 8599,
      durationDays: billing === "monthly" ? 30 : 365,
      features: [
        "All Pro Features",
        "Multi-Branch Support",
        "Staff Role Management",
        "Real-Time Inventory",
        "CRM & Loyalty Program",
        "Kitchen Display System (KDS)",
        "24/7 Premium Support",
      ],
    },
  ];
}
