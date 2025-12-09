const { User } = require("../models");
const { Op } = require("sequelize"); 
module.exports = {
  // GET /api/users
  async getAll(req, res) {
    try {
      // Pagination
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      // Search
      const search = req.query.search || "";
      const searchFields = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
      const where = search ? { [Op.or]: searchFields } : {};

      // Ordering
      const ordering = req.query.ordering || "id";
      const order = ordering.startsWith("-")
        ? [[ordering.slice(1), "DESC"]]
        : [[ordering, "ASC"]];

      const offset = (page - 1) * page_size;

      // Fetch users
      const { rows, count } = await User.findAndCountAll({
        where,
        order,
        offset,
        limit: page_size,
      });

      // Pagination links
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
      const total_pages = Math.ceil(count / page_size);

      res.json({
        count,
        total_pages,
        current_page: page,
        next: page < total_pages ? `${baseUrl}?page=${page + 1}&page_size=${page_size}` : null,
        previous: page > 1 ? `${baseUrl}?page=${page - 1}&page_size=${page_size}` : null,
        page_size,
        data: rows
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  },

  // GET /api/users/:id
  async getOne(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT / PATCH /api/users/:id
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });

      // Update attributes (PUT or PATCH)
      Object.assign(user, req.body);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/users/:id
  async delete(req, res) {
    try {
      const deleted = await User.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
