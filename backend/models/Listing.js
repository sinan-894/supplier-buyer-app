// backend/models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['raw_material','service','other'], required: true },
  name: { type: String, required: true },
  description: { type: String },
  quantity_available: { type: Number, default: 0 },
  unit: { type: String },
  location_country: { type: String },
  pricing_mode: { type: String, enum: ['fixed','rfq_only'], required: true },
  unit_price: { type: Number, default: null },
  active: { type: Boolean, default: true }
}, { timestamps: true });

ListingSchema.pre('save', function(next) {
  if (this.pricing_mode === 'fixed' && (this.unit_price === undefined || this.unit_price === null)) {
    return next(new Error('unit_price is required for fixed pricing'));
  }
  next();
});

module.exports = mongoose.model('Listing', ListingSchema);
