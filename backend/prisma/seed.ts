import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin@123";
  
  // Delete old admin account if it exists with different email
  const oldAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (oldAdmin && oldAdmin.email !== adminEmail) {
    await prisma.user.delete({ where: { id: oldAdmin.id } });
    console.log(`Deleted old admin account: ${oldAdmin.email}`);
  }
  
  // Upsert admin account (update if exists, create if not)
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash, // Update password hash
      name: "Admin",
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: adminEmail,
      passwordHash: passwordHash, // bcrypt hash of "admin@123"
      role: "ADMIN",
    }
  });
  console.log(`Admin account ready: ${admin.email}`);

  // Define resources with images
  const resourceData = [
    {
      name: "CS Lecture Hall A",
      type: "ROOM" as const,
      location: "Block C, Floor 2",
      capacity: 80,
      images: [
        "https://picsum.photos/id/1015/640/360",
        "https://picsum.photos/id/1018/640/360",
        "https://picsum.photos/id/1025/640/360"
      ],
      amenities: ["Projector", "WiFi", "AC"],
      isActive: true
    },
    {
      name: "Electronics Lab",
      type: "LAB" as const,
      location: "Block B, Floor 1",
      capacity: 30,
      images: [
        "https://picsum.photos/id/1/640/360",
        "https://picsum.photos/id/2/640/360",
        "https://picsum.photos/id/3/640/360"
      ],
      amenities: ["Oscilloscopes", "Soldering Stations", "ESD Mats"],
      isActive: true
    },
    {
      name: "Basketball Court",
      type: "SPORTS" as const,
      location: "Sports Complex",
      capacity: 20,
      images: [
        "https://picsum.photos/id/1035/640/360",
        "https://picsum.photos/id/1036/640/360",
        "https://picsum.photos/id/1037/640/360"
      ],
      amenities: ["Lighting", "Seating"],
      isActive: true
    }
  ];

  // Create resources if they don't exist, or update images if they exist
  for (const data of resourceData) {
    const existing = await prisma.resource.findFirst({
      where: { name: data.name }
    });

    if (existing) {
      // Update existing resource with images
      await prisma.resource.update({
        where: { id: existing.id },
        data: { images: data.images }
      });
      console.log(`Updated images for: ${data.name}`);
    } else {
      // Create new resource
      await prisma.resource.create({ data });
      console.log(`Created resource: ${data.name}`);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
