import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './model/user.model';
import { Injectable } from '@nestjs/common';
import { Post, PostDocument } from './model/post.model';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async createUser(data: Partial<UserDocument>): Promise<UserDocument> {
    const user = new this.userModel({
      ...data,
    });

    return user.save();
  }
  // async createPost(data: Partial<PostDocument>): Promise<PostDocument> {
  //   const post = new this.postModel({
  //     ...data,
  //   });
  //   return post.save();
  // }
  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
  async find({ limit, offset }): Promise<User[]> {
    return this.userModel.find().skip(offset).limit(limit).exec();
  }
  async findPost({ limit, offset }): Promise<PostDocument[]> {
    return this.postModel.find().skip(offset).limit(limit).exec();
  }
  async countPost(): Promise<number> {
    return this.postModel.countDocuments().exec();
  }
}
