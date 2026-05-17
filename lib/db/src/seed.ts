import "dotenv/config";
import { db, servicesTable } from "./index";

async function seed() {
  console.log("Seeding services...");

  const services = [
    {
      name: "Classic Haircut",
      description: "A precision haircut tailored to your style, including a wash and basic styling.",
      price: "1500",
      durationMinutes: 45,
      category: "Hair",
      imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Hair Coloring",
      description: "Professional hair coloring services, from root touch-ups to full balayage.",
      price: "4500",
      durationMinutes: 120,
      category: "Hair",
      imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430863?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Luxury Facial",
      description: "Deep cleansing and rejuvenating facial treatment using premium products.",
      price: "3500",
      durationMinutes: 60,
      category: "Skincare",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Manicure & Pedicure",
      description: "Complete nail care for hands and feet, including scrub and massage.",
      price: "2500",
      durationMinutes: 90,
      category: "Nails",
      imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Bridal Makeup",
      description: "Exquisite bridal makeup artistry for your special day.",
      price: "15000",
      durationMinutes: 180,
      category: "Makeup",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
    },
  ];

  for (const service of services) {
    await db.insert(servicesTable).values(service).onConflictDoNothing();
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
