import { Plan } from "../types/plan";

export function getDemoPlans(billing: string): Plan[] {
  return [
    {
      id: "trial",
      name: "Trial",
      price: 0,
      durationDays: 28,
      features: [
        "Digital Menu (Limited Items)",
        "Basic Order Taking",
        "Trial Access Features",
        "Community Support",
        "Limited Analytics (Disabled)",
      ],
    },
    {
      id: "basic",
      name: "Basic",
      price: billing === "monthly" ? 399 : 4599,
      durationDays: billing === "monthly" ? 30 : 365,
      features: [
        "Digital Menu (Up to 25 Items)",
        "Order Management",
        "Daily Sales Report",
        "Promotions & Offers",
        "Advanced Analytics (Disabled)",
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
        "Analytics Dashboard (Disabled)",
        "Inventory Management (Disabled)",
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
        "Loyalty Program Integration",
        "24/7 Premium Support",
      ],
    },
  ];
}
