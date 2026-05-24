const OrderModel = require('../models/OrderModel');

function generateOrderNum() {
  return 'NXP-' + Math.floor(Math.random() * 900000 + 100000);
}

const OrderController = {
  // POST /api/checkout
  async checkout(req, res) {
    const { cart, payMethod, total } = req.body;

    if (!cart || cart.length === 0)
      return res.status(400).json({ success: false, message: 'Carrinho vazio.' });

    const items = cart.map(g => ({ id: g.id, title: g.title, price: g.price, image: g.image }));

    const order = await OrderModel.create({
      orderNum: generateOrderNum(),
      userId: req.user.id,
      payMethod,
      total,
      items,
    });

    console.log(`[ORDER ${order.orderNum}] ${req.user.email} | R$ ${total} | ${items.map(i => i.title).join(', ')}`);

    return res.json({
      success: true,
      message: 'Compra processada com sucesso!',
      orderNum: order.orderNum,
      items: order.items,
    });
  },

  // GET /api/checkout/history
  async history(req, res) {
    const orders = await OrderModel.findByUserId(req.user.id);
    return res.json(orders);
  },
};

module.exports = OrderController;
