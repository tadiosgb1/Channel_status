const { Op } = require("sequelize");
const db = require("../models");
const Cron_local_report = db.Cron_local_report;
const Daily_cron_local_report = db.Daily_cron_local_report;

module.exports = {

  // ------------------ getAll ------------------
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
          ExecutionTime: null,
          createdAt: null,
          updatedAt: null
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
          ExecutionTime: null,
          createdAt: null,
          updatedAt: null
        });
      }

      // Construct the final response including createdAt/updatedAt
      res.json({
        status: true,
        message: parsedData.message || "Report fetched successfully",
        data: parsedData.data || {},
        individualExecutionTime: parsedData.individualExecutionTime || {},
        ExecutionTime: parsedData.ExecutionTime || null,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      });


    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch data",
        error: error.message,
        data: null,
        individualExecutionTime: null,
        ExecutionTime: null,
        createdAt: null,
        updatedAt: null
      });
    }
  },

  // ------------------ Original Chart Report ------------------
async getChartReport(req, res) {
  try {
    const { type, date, month, year, week, start, end } = req.query;

    if (!type) {
      return res.status(400).json({
        status: false,
        message: "type is required (daily, weekly, monthly, quarterly, yearly, range)"
      });
    }

    let records;

    if (type == "daily") {
      records = await Daily_cron_local_report.findAll({
        order: [["id", "ASC"]],
      });
    } else {
      records = await Cron_local_report.findAll({
        order: [["id", "ASC"]],
      });
    }

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
    if (type === "quarterly") labels = ["Q1 (Jan–Mar)","Q2 (Apr–Jun)","Q3 (Jul–Sep)","Q4 (Oct–Dec)"];
    if (type === "yearly") labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // ---------- RANGE type setup ----------
    let rangeLabels = [];
    let rangeStart, rangeEnd;
    if (type === "range") {
      if (!start || !end) {
        return res.status(400).json({
          status: false,
          message: "start and end query params are required for range type"
        });
      }

      rangeStart = new Date(start);
      rangeEnd = new Date(end);
      if (rangeEnd < rangeStart) {
        return res.status(400).json({
          status: false,
          message: "end date must be after start date"
        });
      }

      // generate list of days
      const tempLabels = [];
      const curr = new Date(rangeStart);
      while (curr <= rangeEnd) {
        tempLabels.push(curr.toISOString().slice(0, 10));
        curr.setDate(curr.getDate() + 1);
      }
      rangeLabels = tempLabels;
      labels = rangeLabels; // use for series mapping
    }

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

        const dayIndex = (d.getDay() + 6) % 7; // Mon=0
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

      // QUARTERLY → 4 quarters of the year
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

      // RANGE → by day
      if (type === "range") {
        const dayStr = d.toISOString().slice(0, 10);
        if (d < rangeStart || d > rangeEnd) return;
        label = dayStr;
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
  // ------------------ USSD Chart Report ------------------
// ------------------ USSD Chart Report ------------------
async getUssdChartReport(req, res) {
  try {
    const { type, date, month, year, week, start, end } = req.query;
    if (!type) return res.status(400).json({ status: false, message: "type is required" });

   let records;

    if (type === "daily") {
      records = await Daily_cron_local_report.findAll({
        order: [["id", "ASC"]],
      });

      console.log("records",records);

    } else {
      records = await Cron_local_report.findAll({
        order: [["id", "ASC"]],
      });
    }



    if (!records.length)
      return res.json({ status:true, labels:[], series:{}, individualExecutionTime:{}, ExecutionTime:null, createdAt:null, updatedAt:null });

    const toNumber = (v) => Number(String(v||0).replace(/,/g,"")) || 0;
    let buckets = {}, labels = [];

    if(type==="daily") labels = [...Array(24).keys()].map(h => h.toString().padStart(2,"0"));
    if(type==="weekly") labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    if(type==="monthly") labels = ["Week 1 (1–7)","Week 2 (8–14)","Week 3 (15–21)","Week 4 (22–end)"];
    if(type==="quarterly") labels = ["Q1 (Jan–Mar)","Q2 (Apr–Jun)","Q3 (Jul–Sep)","Q4 (Oct–Dec)"];
    if(type==="yearly") labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    let rangeStart, rangeEnd;
    if(type==="range") {
      if(!start || !end) return res.status(400).json({ status:false, message:"start and end required" });
      rangeStart = new Date(start);
      rangeEnd = new Date(end);
      if(rangeEnd < rangeStart) return res.status(400).json({ status:false, message:"end must be after start" });
      const tempLabels = [];
      let curr = new Date(rangeStart);
      while(curr <= rangeEnd) { tempLabels.push(curr.toISOString().slice(0,10)); curr.setDate(curr.getDate()+1); }
      labels = tempLabels;
    }

    records.forEach(r => {
      const parsed = JSON.parse(r.data);
      const data = parsed.data || {};
      const d = new Date(data.datecheck || r.createdAt);
      let label;

      if(type==="daily"){ const target = date?new Date(date):new Date(); if(d.toDateString()!==target.toDateString()) return; label=d.getHours().toString().padStart(2,"0"); }
      if(type==="weekly"){ if(!year||!month||!week) return; if(d.getFullYear()!==Number(year)) return; if(d.getMonth()+1!==Number(month)) return; const dayOfMonth=d.getDate(); const weekNo=dayOfMonth<=7?1:dayOfMonth<=14?2:dayOfMonth<=21?3:4; if(weekNo!==Number(week)) return; label=labels[(d.getDay()+6)%7]; }
      if(type==="monthly"){ if(!year||!month) return; if(d.getFullYear()!==Number(year)) return; if(d.getMonth()+1!==Number(month)) return; const dayOfMonth=d.getDate(); label=dayOfMonth<=7?labels[0]:dayOfMonth<=14?labels[1]:dayOfMonth<=21?labels[2]:labels[3]; }
      if(type==="quarterly"){ if(!year) return; if(d.getFullYear()!==Number(year)) return; const mi=d.getMonth(); label=mi<3?labels[0]:mi<6?labels[1]:mi<9?labels[2]:labels[3]; }
      if(type==="yearly"){ if(!year) return; if(d.getFullYear()!==Number(year)) return; label=labels[d.getMonth()]; }
      if(type==="range"){ if(d<rangeStart||d>rangeEnd) return; label=d.toISOString().slice(0,10); }

      if(!label) return; 
      if(!buckets[label]) buckets[label]={};

     Object.keys(data).forEach(key => {
  // Include u_ prefixed keys AND ussd_count
  if (key.startsWith("u_") || key === "ussd_count") {
    buckets[label][key] = (buckets[label][key]||0) + toNumber(data[key]);
  }
});
    });

    const series = {};
    labels.forEach(label => { const metrics=buckets[label]||{}; Object.keys(metrics).forEach(metric=>{ if(!series[metric]) series[metric]=[]; }); });
    Object.keys(series).forEach(metric=>{ series[metric] = labels.map(l=>buckets[l]?.[metric]||0); });

    const lastRecord = records[records.length-1];
    const parsedLast = JSON.parse(lastRecord.data);

    res.json({
      status:true,
      labels,
      series,
      individualExecutionTime: parsedLast.individualExecutionTime||{},
      ExecutionTime: parsedLast.ExecutionTime||null,
      createdAt: lastRecord.createdAt,
      updatedAt: lastRecord.updatedAt
    });

  } catch(err){ 
    res.status(500).json({ status:false, message:"Failed to generate USSD chart report", error:err.message });
  }
},

// ------------------ Mobile/App Chart Report ------------------
async getMobileChartReport(req, res) {
  try {
    const { type, date, month, year, week, start, end } = req.query;
    if(!type) return res.status(400).json({ status:false, message:"type is required" });

    let records;

    if (type == "daily") {
      records = await Daily_cron_local_report.findAll({
        order: [["id", "ASC"]],
      });
    } else {
      records = await Cron_local_report.findAll({
        order: [["id", "ASC"]],
      });
    }


    if(!records.length)
      return res.json({ status:true, labels:[], series:{}, individualExecutionTime:{}, ExecutionTime:null, createdAt:null, updatedAt:null });

    const toNumber = (v)=>Number(String(v||0).replace(/,/g,""))||0;
    let buckets={}, labels=[];

    if(type==="daily") labels=[...Array(24).keys()].map(h=>h.toString().padStart(2,"0"));
    if(type==="weekly") labels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    if(type==="monthly") labels=["Week 1 (1–7)","Week 2 (8–14)","Week 3 (15–21)","Week 4 (22–end)"];
    if(type==="quarterly") labels=["Q1 (Jan–Mar)","Q2 (Apr–Jun)","Q3 (Jul–Sep)","Q4 (Oct–Dec)"];
    if(type==="yearly") labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    let rangeStart, rangeEnd;
    if(type==="range"){ 
      if(!start||!end) return res.status(400).json({ status:false,message:"start and end required" }); 
      rangeStart=new Date(start); 
      rangeEnd=new Date(end); 
      if(rangeEnd<rangeStart) return res.status(400).json({status:false,message:"end must be after start"}); 
      const tempLabels=[]; let curr=new Date(rangeStart); while(curr<=rangeEnd){ tempLabels.push(curr.toISOString().slice(0,10)); curr.setDate(curr.getDate()+1);} 
      labels=tempLabels; 
    }

    records.forEach(r=>{
      const parsed=JSON.parse(r.data); const data=parsed.data||{}; const d=new Date(data.datecheck||r.createdAt); let label;

      if(type==="daily"){ const target=date?new Date(date):new Date(); if(d.toDateString()!==target.toDateString()) return; label=d.getHours().toString().padStart(2,"0"); }
      if(type==="weekly"){ if(!year||!month||!week) return; if(d.getFullYear()!==Number(year)) return; if(d.getMonth()+1!==Number(month)) return; const dayOfMonth=d.getDate(); const weekNo=dayOfMonth<=7?1:dayOfMonth<=14?2:dayOfMonth<=21?3:4; if(weekNo!==Number(week)) return; label=labels[(d.getDay()+6)%7]; }
      if(type==="monthly"){ if(!year||!month) return; if(d.getFullYear()!==Number(year)) return; if(d.getMonth()+1!==Number(month)) return; const dayOfMonth=d.getDate(); label=dayOfMonth<=7?labels[0]:dayOfMonth<=14?labels[1]:dayOfMonth<=21?labels[2]:labels[3]; }
      if(type==="quarterly"){ if(!year) return; if(d.getFullYear()!==Number(year)) return; const mi=d.getMonth(); label=mi<3?labels[0]:mi<6?labels[1]:mi<9?labels[2]:labels[3]; }
      if(type==="yearly"){ if(!year) return; if(d.getFullYear()!==Number(year)) return; label=labels[d.getMonth()]; }
      if(type==="range"){ if(d<rangeStart||d>rangeEnd) return; label=d.toISOString().slice(0,10); }
      if(!label) return; if(!buckets[label]) buckets[label]={};
      Object.keys(data).forEach(key => {
  // Include m_ prefixed keys AND app_count
  if (key.startsWith("m_") || key === "app_count") {
    buckets[label][key] = (buckets[label][key]||0) + toNumber(data[key]);
  }
});
    });

    const series={};
    labels.forEach(label=>{ const metrics=buckets[label]||{}; Object.keys(metrics).forEach(metric=>{ if(!series[metric]) series[metric]=[]; }); });
    Object.keys(series).forEach(metric=>{ series[metric] = labels.map(l=>buckets[l]?.[metric]||0); });

    const lastRecord=records[records.length-1];
    const parsedLast=JSON.parse(lastRecord.data);

    res.json({status:true, labels, series, individualExecutionTime:parsedLast.individualExecutionTime||{}, ExecutionTime:parsedLast.ExecutionTime||null, createdAt:lastRecord.createdAt, updatedAt:lastRecord.updatedAt});

  } catch(err){ 
    res.status(500).json({status:false,message:"Failed to generate Mobile chart report", error:err.message});
  }
}
,

async metricBasedChart(req, res) {
  try {
    const { type, date, month, year, week, start, end, metrics } = req.query;

    if (!type) {
      return res.status(400).json({
        status: false,
        message: "type is required (daily, weekly, monthly, quarterly, yearly, range)"
      });
    }

    if (!metrics) {
      return res.status(400).json({
        status: false,
        message: "metrics query param is required (comma-separated)"
      });
    }

    const metricList = metrics.split(","); // ["app_count","ussd_count",...]

    const records = await Cron_local_report.findAll({ order: [["id", "ASC"]] });

    if (!records.length) {
      return res.json({ status: true, labels: [], series: {} });
    }

    const toNumber = (v) => Number(String(v || 0).replace(/,/g, "")) || 0;
    const buckets = {}; // { label: { metric: sum } }
    let labels = [];

    // ---------- Define labels ----------
    if (type === "daily") labels = [...Array(24).keys()].map(h => h.toString().padStart(2, "0"));
    if (type === "weekly") labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    if (type === "monthly") labels = ["Week 1 (1–7)","Week 2 (8–14)","Week 3 (15–21)","Week 4 (22–end)"];
    if (type === "quarterly") labels = ["Q1 (Jan–Mar)","Q2 (Apr–Jun)","Q3 (Jul–Sep)","Q4 (Oct–Dec)"];
    if (type === "yearly") labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // ---------- RANGE type setup ----------
    if (type === "range") {
      if (!start || !end) {
        return res.status(400).json({ status: false, message: "start and end query params are required for range type" });
      }

      const rangeStart = new Date(start);
      const rangeEnd = new Date(end);
      if (rangeEnd < rangeStart) {
        return res.status(400).json({ status: false, message: "end date must be after start date" });
      }

      labels = [];
      const curr = new Date(rangeStart);
      while (curr <= rangeEnd) {
        labels.push(curr.toISOString().slice(0, 10));
        curr.setDate(curr.getDate() + 1);
      }
    }

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

      // WEEKLY → 7 days
      if (type === "weekly") {
        if (!year || !month || !week) return;
        if (d.getFullYear() !== Number(year)) return;
        if (d.getMonth() + 1 !== Number(month)) return;

        const dayOfMonth = d.getDate();
        const weekNo = dayOfMonth <= 7 ? 1 : dayOfMonth <= 14 ? 2 : dayOfMonth <= 21 ? 3 : 4;
        if (weekNo !== Number(week)) return;

        const dayIndex = (d.getDay() + 6) % 7; // Mon=0
        label = labels[dayIndex];
      }

      // MONTHLY → 4 weeks
      if (type === "monthly") {
        if (!year || !month) return;
        if (d.getFullYear() !== Number(year)) return;
        if (d.getMonth() + 1 !== Number(month)) return;

        const dayOfMonth = d.getDate();
        label = dayOfMonth <= 7 ? labels[0] :
                dayOfMonth <= 14 ? labels[1] :
                dayOfMonth <= 21 ? labels[2] :
                labels[3];
      }

      // QUARTERLY → 4 quarters
      if (type === "quarterly") {
        if (!year) return;
        if (d.getFullYear() !== Number(year)) return;

        const monthIndex = d.getMonth();
        label = monthIndex < 3 ? labels[0] :
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

      // RANGE → by day
      if (type === "range") {
        const dayStr = d.toISOString().slice(0, 10);
        if (d < new Date(start) || d > new Date(end)) return;
        label = dayStr;
      }

      if (!label) return;
      if (!buckets[label]) buckets[label] = {};

      metricList.forEach(metric => {
        if (data[metric] !== undefined) {
          buckets[label][metric] = (buckets[label][metric] || 0) + toNumber(data[metric]);
        }
      });
    });

    // ---------- Fill series ----------
    const series = {};
    metricList.forEach(metric => {
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


};
