const { Op } = require("sequelize");
const db = require("../models");
const Cron_local_report = db.Cron_local_report;

module.exports = {
async getAll(req, res) {
  try {
    // Get the latest record
    const record = await Cron_local_report.findOne({
      order: [["id", "DESC"]]
    });

    if (!record) {
      return res.json({
        status: false,
        message: "No data found",
        data: null,
        individualExecutionTime: null,
        ExecutionTime: null
      });
    }

    // Convert instance to plain object
    let obj = record.toJSON();

    // Parse the JSON stored in `data`
    let parsedData = {};
    try {
      parsedData = JSON.parse(obj.data);
    } catch (err) {
      console.log("JSON parse error:", err);
      return res.json({
        status: false,
        message: "Invalid stored JSON data",
        data: null,
        individualExecutionTime: null,
        ExecutionTime: null
      });
    }

    // Construct the final response
    res.json({
      status: true,
      message: parsedData.message || "Report fetched successfully",
      data: parsedData.data || {},
      individualExecutionTime: parsedData.individualExecutionTime || {},
      ExecutionTime: parsedData.ExecutionTime || null
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch data",
      error: error.message,
      data: null,
      individualExecutionTime: null,
      ExecutionTime: null
    });
  }
}

,

  async getOne(req, res) {
    try {
      const include = [].filter(Boolean);
      const opts = include.length ? { include } : {};
      const data = await Cron_local_report.findByPk(req.params.id, opts);
      if (!data) return res.status(404).json({ error: "Not found" });

      const obj = data.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      
      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      const data = await Cron_local_report.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      await Cron_local_report.update(body, { where: { id: req.params.id } });
      const updated = await Cron_local_report.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await Cron_local_report.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
