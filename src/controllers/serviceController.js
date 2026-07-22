import Service from "../models/Service.js";

export async function listServices(req, res) {

    const services = await Service.find();

    res.render("services/index", {
        title: "Services",
        services
    });

}

export async function serviceDetail(req, res) {

    const service = await Service.findOne({
        slug: req.params.slug
    });

    if (!service) {
        return res.status(404).render("404", {
            title: "Not Found"
        });
    }

    res.render("services/detail", {
        title: service.title,
        service
    });

}