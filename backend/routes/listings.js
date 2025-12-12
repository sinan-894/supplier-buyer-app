// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const verifyToken = require('../middleware/verifyToken');

// Create listing (authenticated supplier)
router.post('/', verifyToken, async (req, res) => {
  try {
    // req.user should contain user id (example: { id: "...", role: "supplier" })
    const supplierId = req.user.id || req.user._id;
    const { category, name, description, quantity_available, unit, location_country, pricing_mode, unit_price } = req.body;

    // basic validation (server side)
    if (!category || !name || !pricing_mode) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    if (pricing_mode === 'fixed' && (unit_price === undefined || unit_price === null)) {
      return res.status(400).json({ msg: 'unit_price required for fixed pricing' });
    }

    const listing = new Listing({
      supplier: supplierId,
      category,
      name,
      description,
      quantity_available,
      unit,
      location_country,
      pricing_mode,
      unit_price
    });

    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Get all public listings (for buyers)
router.get('/', async (req, res) => {
  try {
    const q = { active: true };
    if (req.query.category) q.category = req.query.category;
    const items = await Listing.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get current supplier's listings
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const supplierId = req.user.id || req.user._id;
    const items = await Listing.find({ supplier: supplierId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete (supplier only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Not found' });
    if (listing.supplier.toString() !== (req.user.id || req.user._id)) return res.status(403).json({ msg: 'Not allowed' });
    await listing.deleteOne();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
