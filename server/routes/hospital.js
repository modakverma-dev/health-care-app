const { Router } = require("express");
const router = Router();
const { pgClient } = require("../db");

router.get("/departments", async (req, res) => {
  try {
    const departments = await pgClient.query(`SELECT * FROM departments;`);
    if (!departments.rows[0]) {
      return res.status(404).json({
        message: "no departments found!",
      });
    }
    return res.status(200).json(departments.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "OOPs something went wrong !",
    });
  }
});

router.get("/top-doctors", async (req, res) => {
  try {
    const result = await pgClient.query(
      `SELECT * FROM doctors ORDER BY rating DESC`
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
});

router.get("/dept-doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "undefined") {
      return res.status(400).json({
        message: "Invalid department id",
      });
    }
    const doctors = await pgClient.query(
      `SELECT * FROM doctors WHERE departmentid=$1`,
      [id]
    );
    if (!doctors.rows[0]) {
      return res.status(404).json({
        message: "Sorry ! No doctors available right now",
      });
    }
    return res.status(200).json(doctors.rows);
  } catch (err) {
    console.log(err);
  }
});

router.get("/doctors/:id", async (req, res) => {
  const { id } = req.params;
  if (id === "undefined") {
    return res.status(400).json({
      message: "Invalid doctor id",
    });
  }
  const doctorDetails = await pgClient.query(
    `SELECT * FROM doctors WHERE doctorid=$1;`,
    [id]
  );
  const doctorDates = await pgClient.query(
    `SELECT d.date,d.date_id FROM dates d JOIN doctor_dates dd ON d.date_id = dd.date_id WHERE dd.doctorid = $1 ;`,
    [id]
  );
  const slots = await pgClient.query(
    `SELECT * FROM slots s JOIN doctor_dates dd ON s.date_id=dd.date_id WHERE doctorid=$1;`,
    [id]
  );
  let dateWithSlots = [];
  for (i = 0; i < doctorDates.rows.length; i++) {
    const date_id = doctorDates.rows[i].date_id;
    const slotsArr = slots.rows.filter((date) => date.date_id === date_id);
    dateWithSlots = [
      ...dateWithSlots,
      { ...doctorDates.rows[i], slots: slotsArr },
    ];
  }

  console.log(dateWithSlots, "slots modiSS");
  return res.status(200).json({
    ...doctorDetails.rows[0],
    dates: dateWithSlots,
  });
});

module.exports = router;
