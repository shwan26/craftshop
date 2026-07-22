import "dotenv/config";

import mongoose from "mongoose";
import Service from "./models/Service.js";

await mongoose.connect(process.env.MONGODB_URI);

await Service.deleteMany();

await Service.insertMany([
  {
    title: "Website Development",
    slug: "website-development",
    icon: "bi-window",

    description:
      "Professional business websites built with modern technologies.",

    packages: [
      {
        name: "Starter",
        price: 99,
        deliveryDays: 3,
        features: [
          "1 Page",
          "Responsive",
          "Contact Form"
        ]
      },

      {
        name: "Business",
        price: 399,
        deliveryDays: 7,
        features: [
          "5 Pages",
          "SEO",
          "Dashboard"
        ]
      }
    ]
  },

  {
    title: "Canva Design",
    slug: "canva-design",
    icon: "bi-palette",

    description:
      "Professional social media graphics and presentations.",

    packages: [
      {
        name: "Basic",
        price: 15,
        deliveryDays: 2,
        features: [
          "3 Designs",
          "PNG",
          "Editable"
        ]
      },

      {
        name: "Premium",
        price: 45,
        deliveryDays: 3,
        features: [
          "10 Designs",
          "Editable",
          "Brand Kit"
        ]
      }
    ]
  },

  {
    title: "Resume Design",
    slug: "resume-design",
    icon: "bi-file-earmark-person",

    description:
      "Professional ATS-friendly resume design.",

    packages: [
      {
        name: "Standard",
        price: 20,
        deliveryDays: 2,
        features: [
          "PDF",
          "DOCX",
          "ATS Friendly"
        ]
      }
    ]
  }
]);

console.log("Database seeded.");

await mongoose.disconnect();