import type { Context } from '../types/express/index.d.js'; // Ensure Context is imported
import  {signToken}  from '../services/auth.js'; // Ensure signToken is imported
import User from '../models/User.js'; // Ensure User model is imported

export const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: Context) => {
        if (context.req) {
            const userData = await User.findById(context.req.user).select('-__v -password');
            return userData;
        }
        throw new Error('You need to be logged in!');
        }
    },
    Mutation: {
        addUser: async (_parent: unknown, input: { username: string; email: string; password: string }, context: Context) => {
        const user = await User.create(input);
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
        },
        login: async (_parent: unknown, { username, password }: { username: string; password: string }, context: Context) => {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            throw new Error('Incorrect credentials');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
        }
        },
        saveBook: async (
            _parent: unknown,
            { bookId, authors, description, title, image, link }: { bookId: string; authors: string[]; description: string; title: string; image: string; link: string },
            context: Context
        ) => {
            if (context.req.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.req.user?._id,
                    { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new Error('You need to be logged in!');
        },
        removeBook: async (
            _parent: unknown,
            { bookId }: { bookId: string },
            context: Context
        ) => {
            if (context.req.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.req.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new Error('You need to be logged in!');
        },
    };
