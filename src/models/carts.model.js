import mongoose from "mongoose"

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({ 
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  cart: [
    {
      type: [
        {
          cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
          },
        }
      ]
    },
  ],
  rol: String
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)