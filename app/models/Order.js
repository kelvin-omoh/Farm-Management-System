import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  name: String,
  email: String,
  city: String,
  address: String,
  line_items: Array,
  paid: Boolean,
  metaData: {
    reference: String,
    amount: Number,
    currency: String
  }
}, {
  timestamps: true,
});

const Order = models.Order || model('Order', OrderSchema);

export default Order