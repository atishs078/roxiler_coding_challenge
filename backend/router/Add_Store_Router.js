const express = require("express");
const router = express.Router();
const { verifyJWT, isAdmin, isStoreOwner } = require('../middelware/verifyJWT');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/addStore", verifyJWT, isAdmin, async (req, res) => {
    const { name, email, address, password } = req.body;

    try {
        if (!name || !email || !address || !password) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert into stores table
        const sqlStore = "INSERT INTO stores (name, email, address, password, ispasswordupdated) VALUES (?, ?, ?, ?, ?)";
        const [storeResult] = await req.db.execute(sqlStore, [name, email, address, hashedPassword,"false"]);


        // ✅ Insert into users table with role = "store"
        const sqlUser = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
        const [userResult] = await req.db.execute(sqlUser, [name, email, hashedPassword, address, "storeOwner"]);

        // ✅ Generate JWT for store (optional)
        const token = jwt.sign(
            { id: userResult.insertId, email, role: "store" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            msg: "Store Added Successfully",
            storeId: storeResult.insertId,
            userId: userResult.insertId,
            token
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ success: false, msg: "A store with this email already exists." });
        }
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal Server Error", error });
    }
});
router.put('/updatepass/:email', verifyJWT, async (req, res) => {
  const { email } = req.params; 
  const { password, changedPassword } = req.body;

  try {
    if (!email) {
      return res.status(404).json({ success: false, msg: "Please Login" });
    }

    if (!password || !changedPassword) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // Check store by ID
    const [stores] = await req.db.query("SELECT * FROM stores WHERE email = ?", [email]);
    if (stores.length === 0) {
      return res.status(404).json({ success: false, msg: "Store not found" });
    }

    const store = stores[0];

    // Match old password
    const isMatch = await bcrypt.compare(password, store.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changedPassword, 10);

    // Update password + ispasswordupdated = 1
    await req.db.execute(
      "UPDATE stores SET password = ?, ispasswordupdated = ? WHERE email = ?",
      [hashedPassword, 1, email]
    );
    await req.db.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword,  email]
    );

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully. Please login again with new password",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
});



router.get('/getStores', verifyJWT, async (req, res) => {
    try {
        const sql = `
            SELECT 
                s.id, 
                s.name, 
                s.email, 
                s.address, 
                s.created_at,
                -- Use COALESCE to return 0 if AVG is NULL (no ratings)
                COALESCE(AVG(r.rating), 0) AS averageRating 
            FROM 
                stores AS s
            LEFT JOIN 
                store_ratings AS r ON s.id = r.storeID
            GROUP BY 
                s.id
            ORDER BY
                s.id;
        `;

        const [stores] = await req.db.query(sql);
        const success = true;
        return res.status(200).json({ stores, success });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
});
router.get('/storeCount', verifyJWT, isAdmin, async (req, res) => {
    try {
        const sql = 'SELECT COUNT(*) AS storeCount FROM stores';

        const [rows] = await req.db.query(sql);
        const getStoreCount = rows[0].storeCount;
        const success = true;
        return res.status(200).json({ getStoreCount, success });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
});
router.get('/getRatingCountByStore/:storeID', verifyJWT, isStoreOwner, async (req, res) => {
  const { storeID } = req.params;

  try {
    const sql = `
      SELECT COUNT(*) AS storeRatingCount
      FROM store_ratings
      WHERE storeID = ?
    `;
    const [rows] = await req.db.query(sql, [storeID]);

    const getStoreCount = rows[0].storeRatingCount;

    return res.status(200).json({ success: true, getStoreCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
});
router.get('/averageRating/:storeID', verifyJWT, isStoreOwner, async (req, res) => {
  const { storeID } = req.params;

  try {
    const sql = `
      SELECT AVG(rating) AS averageRating
      FROM store_ratings
      WHERE storeID = ?
    `;
    const [rows] = await req.db.query(sql, [storeID]);
    const averageRating = parseFloat(rows[0].averageRating || 0).toFixed(1);

    return res.status(200).json({ success: true, averageRating: Number(averageRating) });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
router.get('/getStoreByEmail/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Please provide email" });
  }

  try {
    const [store] = await req.db.query(
      "SELECT * FROM stores WHERE email = ?",
      [email]
    );

    if (store.length === 0) {
      return res.status(404).json({ success: false, msg: "No store found with this email" });
    }

    return res.status(200).json({ success: true, store: store[0] });
  } catch (error) {
    console.error("Error fetching store by email:", error);
    return res.status(500).json({ success: false, msg: "Error fetching store" });
  }
});

module.exports = router;