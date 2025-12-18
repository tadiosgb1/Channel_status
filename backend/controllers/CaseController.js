const { Op } = require("sequelize");
const db = require("../models");
const Case = db.Case;

module.exports = {
  // GET /api/cases
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      let search = req.query.search || "";
      let ordering = req.query.ordering || "id";
      let status = req.query.status || "all"; // new: filter by status

      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      // Search conditions
      const searchableFields = ["case_title", "description"];
      const searchConditions = searchableFields.map(field => ({
        [field]: { [Op.like]: "%" + search + "%" }
      }));
      const where = search ? { [Op.or]: searchConditions } : {};

      // Status filter
      if (status === "pending") {
        where.status = "pending";
      } else if (status === "resolved") {
        where.status = "resolved";
      } // else "all" -> no filter

      // Ordering & pagination
      const order = ordering.startsWith("-")
        ? [[ordering.slice(1), "DESC"]]
        : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const include = [db.User].filter(Boolean);
      const findOptions = { where, order, offset, limit: page_size };
      if (include.length) findOptions.include = include;

      const { rows, count } = await Case.findAndCountAll(findOptions);

      const total_pages = Math.ceil(count / page_size);
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

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
      res.status(500).json({ error: e.message });
    }
  },

  // GET /api/cases/:id
  async getOne(req, res) {
    try {
      const include = [db.User].filter(Boolean);
      const opts = include.length ? { include } : {};
      const data = await Case.findByPk(req.params.id, opts);
      if (!data) return res.status(404).json({ error: "Not found" });

      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // POST /api/cases
  async create(req, res) {
    try {
      const body = { ...req.body };
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const data = await Case.create({
        ...body,
        user_id: userId,
        status: body.status || "pending"
      });

      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // PATCH /api/cases/:id
  async update(req, res) {
    try {
      const caseItem = await Case.findByPk(req.params.id);
      if (!caseItem) return res.status(404).json({ error: "Not found" });

      const allowedFields = ["case_type", "case_title", "description", "status"];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) caseItem[field] = req.body[field];
      });

      await caseItem.save();
      res.json(caseItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // PATCH /api/cases/:id/resolve
  async resolve(req, res) {
    try {
      const caseItem = await Case.findByPk(req.params.id);
      if (!caseItem) return res.status(404).json({ error: "Not found" });

      caseItem.status = "resolved";
      await caseItem.save();

      res.json({ message: "Case resolved", case: caseItem });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // DELETE /api/cases/:id
  async delete(req, res) {
    try {
      const caseItem = await Case.findByPk(req.params.id);
      if (!caseItem) return res.status(404).json({ error: "Not found" });

      await caseItem.destroy();
      res.json({ message: "Case deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
