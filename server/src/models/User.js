import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: ''
    },
    provider: {
      type: String,
      enum: ['google', 'email'],
      default: 'email'
    }
  },
  {
    timestamps: true
  }
);

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);
export default User;
