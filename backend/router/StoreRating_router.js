const express = require('express');
const router = express.Router();
const { verifyJWT, isNormalUser, isAdmin, isStoreOwner } = require('../middelware/verifyJWT'); 
router.post('/rate', verifyJWT, isNormalUser, async (req, res) => {
  const { storeID, rating, userId, name, email } = req.body;

  if (!storeID || !rating || !userId || !name || !email) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if rating already exists
    const [existing] = await req.db.query(
      "SELECT * FROM store_ratings WHERE storeID = ? AND userId = ?",
      [storeID, userId]
    );

    if (existing.length > 0) {
      // Update existing rating
      await req.db.execute(
        "UPDATE store_ratings SET rating = ? WHERE storeID = ? AND userId = ?",
        [rating, storeID, userId]
      );
      return res.status(200).json({ msg: "Rating Updated Successfully" });
    } else {
      // Insert new rating
      await req.db.execute(
        "INSERT INTO store_ratings (storeID, rating, userId, name , email) VALUES (?, ?, ?, ? , ?)",
        [storeID, rating, userId, name, email]
      );
      return res.status(200).json({ msg: "Rating Added Successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server error", error });
  }
});
router.get('/getStoreinfo/:email', verifyJWT, isStoreOwner, async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ success: false, msg: "Store ID is required" });
    }

    // Fetch store details (excluding password for security)
    const [stores] = await req.db.query(
      "SELECT id, name, email, address, ispasswordupdated, created_at FROM stores WHERE email = ?",
      [email]
    );

    if (stores.length === 0) {
      return res.status(404).json({ success: false, msg: "Store not found" });
    }

    return res.status(200).json({
      success: true,
      store: stores[0],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
});
router.get('/getUsersWhoRated/:id', verifyJWT, isStoreOwner, async (req, res) => {
  const id = req.params.id; 
   try{
  if (!id) {
    return res.status(400).json({ msg: "Please provide a valid store ID" });
  }
  const [rates] = await req.db.query(
      "SELECT id, name, email, rating FROM store_ratings WHERE id = ?",
      [id]
    );
    if(rates.length===0){
      return res.status(404).json({ success: false, msg: "Rate not found" });

    }
     return res.status(200).json({
      success: true,
      rates: rates,
    });
  }

  catch (error) {
    return res.status(500).json({msg:"Internal Server error", error})
  }
});



router.get('/getRatingCount', verifyJWT, isAdmin, async (req, res) => {
    try {
        const sql = 'SELECT COUNT(*) AS ratingCount FROM store_ratings';
        const [rows] = await req.db.query(sql);
        const ratingCount = rows[0].ratingCount;
        const success = true;
        return res.status(200).json({ ratingCount, success });

    } catch (error) {
        console.error(error); 
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
});



module.exports = router;

