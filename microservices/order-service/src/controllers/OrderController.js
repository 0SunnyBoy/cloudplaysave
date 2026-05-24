const OrderModel = require('../models/OrderModel');

const generateOrderNum = () => 'NXP-' + Math.floor(Math.random() * 900000 + 100000);

module.exports = {
  async checkout(req, res) {
    const { cart, payMethod, total } = req.body;
    if (!cart || cart.length === 0)
      return res.status(400).json({ success: false, message: 'Carrinho vazio.' });

    const items = cart.map(g => ({ id: g.id, title: g.title, price: g.price, image: g.image }));
    const order = await OrderModel.create({
      orderNum: generateOrderNum(),
      userId: req.user.id,
      payMethod, total, items,
    });

    console.log(`[order] ${order.orderNum} | user=${req.user.email} | R$ ${total}`);
    return res.json({
      success: true,
      message: 'Compra processada com sucesso!',
      orderNum: order.orderNum,
      items: order.items,
    });
  },

  async history(req, res) {
    return res.json(await OrderModel.findByUserId(req.user.id));
  },
};
