const { Router } = require("express");
const router = Router();
const { supabase } = require("../db");

router.get("/departments", async (req, res) => {
  try {
    const { data } = await supabase.from("departments").select("*");
    if (!data) {
      return res.status(404).json({
        message: "no departments found!",
      });
    }
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "OOPs something went wrong !",
    });
  }
});

router.get("/top-doctors", async (req, res) => {
  try {
    const result = await supabase
      .from("doctors")
      .select("*")
      .order("rating", { ascending: false });
    return res.status(200).json(result.data);
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
    const doctors = await supabase
      .from("doctors")
      .select("*")
      .eq("departmentId", id);
    if (!doctors.data) {
      return res.status(404).json({
        message: "Sorry ! No doctors available right now",
      });
    }
    return res.status(200).json(doctors.data);
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
  const doctorDetails = await supabase
    .from("doctors")
    .select(`*`)
    .eq("id", id)
    .single();

  const { data: doctorDatesAndSlots } = await supabase
    .from("doctor_dates")
    .select(
      `*,
    slots (id,startTime,endTime,available)`
    )
    .eq("doctorId", id);

  return res.status(200).json({
    ...doctorDetails.data,
    dates: doctorDatesAndSlots,
  });
});

module.exports = router;
