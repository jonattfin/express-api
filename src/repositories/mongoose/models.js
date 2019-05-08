import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ImageSchema = new Schema({
  guid: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true },
});

const TopicSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  order: { type: Number, required: true, unique: true },
  createdOn: { type: Number },
  lastUpdatedOn: { type: Number },
});

const CommentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: ObjectId, ref: 'users', required: true },
  post: { type: ObjectId, ref: 'posts', required: true },
  createdOn: { type: Number },
  lastUpdatedOn: { type: Number },
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  profilePicture: { type: ImageSchema, required: false },
  posts: [{ type: ObjectId, ref: 'posts' }],
  subscribedTopics: [{ type: ObjectId, ref: 'topics', required: true }],
  favoritePosts: [{ type: ObjectId, ref: 'posts' }],
  createdOn: { type: Number },
  lastUpdatedOn: { type: Number },
});

UserSchema.pre('save', async function save(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt, null);
      this.password = hash;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  return next();
});

const DeviceSchema = new Schema({
  name: { type: String, required: true },
  token: { type: String, required: true },
  owner: { type: ObjectId, ref: 'users', required: true },
  createdOn: { type: Number },
  lastUpdatedOn: { type: Number },
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  images: [ImageSchema],
  archived: { type: Boolean, default: false },
  topics: [{ type: ObjectId, ref: 'topics', required: true }],
  comments: [{ type: ObjectId, ref: 'comments', required: true }],
  author: { type: ObjectId, ref: 'users', required: true },
  createdOn: { type: Number },
  lastUpdatedOn: { type: Number },
});

const SessionSchema = new Schema({
  userId: { type: ObjectId, ref: 'users', required: true },
  token: { type: String, required: true },
  issuedTime: { type: String, required: true },
});

const SensorSchema = new Schema({
  sensorId: { type: String, required: true },
  position: { type: String, required: true },
  comments: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
});

const MeasureSchema = new Schema({
  sensorId: { type: String, required: true },
  stamp: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Number },
});

export const Post = mongoose.model('posts', PostSchema);
export const Topic = mongoose.model('topics', TopicSchema);
export const User = mongoose.model('users', UserSchema);
export const Device = mongoose.model('devices', DeviceSchema);
export const Comment = mongoose.model('comments', CommentSchema);
export const Session = mongoose.model('sessions', SessionSchema);

export const Measure = mongoose.model('measures', MeasureSchema);
export const Sensor = mongoose.model('sensors', SensorSchema);
