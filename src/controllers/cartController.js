import Service from "../models/Service.js";

function getCart(req) {
  if (!Array.isArray(req.session.cart)) {
    req.session.cart = [];
  }

  return req.session.cart;
}

function calculateCartTotal(cart) {
  return cart.reduce((total, item) => total + Number(item.price), 0);
}

export function showCart(req, res) {
  const cart = getCart(req);
  const total = calculateCartTotal(cart);

  res.render("cart/index", {
    title: "Shopping Cart | CraftShop",
    cart,
    total
  });
}

export async function addToCart(req, res) {
  const { serviceId, packageIndex } = req.body;

  if (!serviceId || packageIndex === undefined) {
    req.flash("error", "Please select a valid service package.");
    return res.redirect("/services");
  }

  const service = await Service.findById(serviceId);

  if (!service) {
    req.flash("error", "The selected service could not be found.");
    return res.redirect("/services");
  }

  const selectedPackage = service.packages[Number(packageIndex)];

  if (!selectedPackage) {
    req.flash("error", "The selected package could not be found.");
    return res.redirect(`/services/${service.slug}`);
  }

  const cart = getCart(req);

  const cartItem = {
    id: crypto.randomUUID(),
    serviceId: service._id.toString(),
    serviceSlug: service.slug,
    serviceTitle: service.title,
    serviceIcon: service.icon,
    packageName: selectedPackage.name,
    packageIndex: Number(packageIndex),
    price: Number(selectedPackage.price),
    deliveryDays: Number(selectedPackage.deliveryDays),
    features: selectedPackage.features ?? []
  };

  cart.push(cartItem);

  req.session.cart = cart;

  req.flash(
    "success",
    `${service.title} — ${selectedPackage.name} was added to your cart.`
  );

  return res.redirect("/cart");
}

export function removeFromCart(req, res) {
  const cart = getCart(req);
  const { itemId } = req.params;

  const updatedCart = cart.filter((item) => item.id !== itemId);

  if (updatedCart.length === cart.length) {
    req.flash("error", "Cart item not found.");
  } else {
    req.flash("success", "Item removed from your cart.");
  }

  req.session.cart = updatedCart;

  return res.redirect("/cart");
}

export function clearCart(req, res) {
  req.session.cart = [];

  req.flash("success", "Your cart has been cleared.");

  return res.redirect("/cart");
}