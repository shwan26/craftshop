export function showHomePage(req, res) {
  const featuredServices = [
    {
      title: "Website Development",
      description:
        "Responsive websites for businesses, portfolios, and creators.",
      price: 99,
      icon: "bi-code-slash"
    },
    {
      title: "Canva Design",
      description:
        "Professional social media posts, presentations, and marketing designs.",
      price: 15,
      icon: "bi-palette"
    },
    {
      title: "Resume Design",
      description:
        "Modern, professional resumes designed to make a strong impression.",
      price: 20,
      icon: "bi-file-earmark-person"
    }
  ];

  res.render("home", {
    title: "CraftShop | Digital Services",
    featuredServices
  });
}