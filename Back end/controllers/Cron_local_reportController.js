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

async getChartReport(req, res) {
  try {
    const { type, date, month, year, week } = req.query;

    if (!type) {
      return res.status(400).json({
        status: false,
        message: "type is required (daily, weekly, monthly, quarterly, yearly)"
      });
    }

    const records = await Cron_local_report.findAll({
      order: [["id", "ASC"]]
    });

    if (!records.length) {
      return res.json({ status: true, labels: [], series: {} });
    }

    const toNumber = (v) => Number(String(v || 0).replace(/,/g, "")) || 0;

    const buckets = {}; // { label: { metric: sum } }
    let labels = [];

    // ---------- Define labels ----------
    if (type === "daily") labels = [...Array(24).keys()].map(h => h.toString().padStart(2, "0"));

    if (type === "weekly") labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    if (type === "monthly") labels = [
      "Week 1 (1–7)",
      "Week 2 (8–14)",
      "Week 3 (15–21)",
      "Week 4 (22–end)"
    ];

    if (type === "quarterly") labels = ["Q1","Q2","Q3","Q4"];

    if (type === "yearly") labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // ---------- Aggregate records ----------
    records.forEach(r => {
      const parsed = JSON.parse(r.data);
      const data = parsed.data || {};
      const d = new Date(data.datecheck || r.createdAt);

      let label;

      // DAILY → by hours
      if (type === "daily") {
        const target = date ? new Date(date) : new Date();
        if (d.toDateString() !== target.toDateString()) return;
        label = d.getHours().toString().padStart(2, "0");
      }

      // WEEKLY → 7 days of given week/month/year
      if (type === "weekly") {
        if (!year || !month || !week) return;
        if (d.getFullYear() !== Number(year)) return;
        if (d.getMonth() + 1 !== Number(month)) return;

        const dayOfMonth = d.getDate();
        const weekNo =
          dayOfMonth <= 7 ? 1 :
          dayOfMonth <= 14 ? 2 :
          dayOfMonth <= 21 ? 3 : 4;

        if (weekNo !== Number(week)) return;

        // Convert JS Sunday=0 to Mon=0
        const dayIndex = (d.getDay() + 6) % 7;
        label = labels[dayIndex];
      }

      // MONTHLY → 4 weeks of given month
      if (type === "monthly") {
        if (!year || !month) return;
        if (d.getFullYear() !== Number(year)) return;
        if (d.getMonth() + 1 !== Number(month)) return;

        const dayOfMonth = d.getDate();
        label =
          dayOfMonth <= 7 ? labels[0] :
          dayOfMonth <= 14 ? labels[1] :
          dayOfMonth <= 21 ? labels[2] :
          labels[3];
      }

      // QUARTERLY → Q1–Q4 of year
      if (type === "quarterly") {
        if (!year) return;
        if (d.getFullYear() !== Number(year)) return;

        const monthIndex = d.getMonth();
        label =
          monthIndex < 3 ? labels[0] :
          monthIndex < 6 ? labels[1] :
          monthIndex < 9 ? labels[2] :
          labels[3];
      }

      // YEARLY → Jan–Dec
      if (type === "yearly") {
        if (!year) return;
        if (d.getFullYear() !== Number(year)) return;
        label = labels[d.getMonth()];
      }

      if (!label) return;

      if (!buckets[label]) buckets[label] = {};

      Object.keys(data).forEach(key => {
        if (key === "datecheck") return;
        buckets[label][key] = (buckets[label][key] || 0) + toNumber(data[key]);
      });
    });

    // ---------- Fill missing labels with 0 ----------
    const series = {};
    labels.forEach(label => {
      const metrics = buckets[label] || {};
      Object.keys(metrics).forEach(metric => {
        if (!series[metric]) series[metric] = [];
      });
    });

    Object.keys(series).forEach(metric => {
      series[metric] = labels.map(l => buckets[l]?.[metric] || 0);
    });

    res.json({
      status: true,
      labels,
      series
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to generate chart report",
      error: error.message
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
