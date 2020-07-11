const db = require("../db/index.js")

const getAllItin = async (req, res, next) => {
  let itins = await db.any("SELECT * FROM itineraries")

  try {
    res.status(200).json({
      status: "Success",
      message: "All itineraries have been retrieved.",
      payload: itins
    })
  } catch (err) {
    res.status(404).json({
      status: "Error",
      message: "Unable to fetch itineraries",
      payload: null
    })
  }
}

const addItin = async (req, res, next) => {
  let data = req.body
  let itin = await db.one("INSERT INTO itineraries (user_id,itinerary_date,title) VALUES (${user_id}, ${itinerary_date}, ${title}) RETURNING *", data)

  try {
    res.status(200).json({
      status: "Success",
      message: "Itinerary has been successfully created.",
      payload: itin
    })
  } catch(err) {
    res.status(500).json({
      status: "Error",
      message: "Unable to create new itinerary.",
      payload: null
    })
  }
}