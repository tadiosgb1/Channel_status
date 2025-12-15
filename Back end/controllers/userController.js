const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // GET /api/users
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      const search = req.query.search || "";
      const searchFields = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } }
      ];
      const where = search ? { [Op.or]: searchFields } : {};

      const ordering = req.query.ordering || "id";
      const order = ordering.startsWith("-")
        ? [[ordering.slice(1), "DESC"]]
        : [[ordering, "ASC"]];

      const offset = (page - 1) * page_size;

      const { rows, count } = await User.findAndCountAll({
        where,
        order,
        offset,
        limit: page_size
      });

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

  // PATCH /api/users/:id
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });

      // Only allow safe fields to be updated
      const allowedFields = ["first_name", "last_name", "username", "email", "role", "status"];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PATCH to deactivate user
  async deactivate(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });

      user.status = "Inactive";
      await user.save();

      res.json({ message: "User deactivated", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PATCH to activate user
  async activate(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });

      user.status = "Active";
      await user.save();

      res.json({ message: "User activated", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/users/:id
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });

      await user.destroy(); // hard delete
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
