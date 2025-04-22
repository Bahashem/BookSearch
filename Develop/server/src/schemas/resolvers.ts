import { Context } from './types'; // Ensure Context is imported
import { signToken } from './auth'; // Ensure signToken is imported
import { User } from './models/User'; // Ensure User model is imported

export const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: Context) => {
        if (context.user) {
            const userData = await context.models.User.findById(context.user._id).select('-__v -password');
            return userData;
    Mutation: {
        addUser: async (_parent: unknown, input: AddUserArgs) => {
        const user = await context.models.User.create(input);
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
        },
        login: async (_parent: unknown, { username, password }: LoginArgs) => {
        const user = await context.models.User.findOne({ username });
        if (!user) {
            throw new Error('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            throw new Error('Incorrect credentials');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
            throw new Error('Incorrect credentials');
        }
        const token = signToken(user.username, user.email, user.password);
        return { token, user };
        },
        saveBook: async (_parent: unknown, {bookId, authors, description, title, image, link}: SaveBookArgs, context) => {
        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: {bookId, authors, description, title, image, link} } },
            { new: true }
            ).populate('savedBooks');   
            return updatedUser;
        }
        throw new Error('You need to be logged in!');
        },
        removeBook: async (_parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await context.models.User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
        },
    },
};