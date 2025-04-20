export const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
        if (context.user) {
            const userData = await context.models.User.findById(context.user._id).select('-__v -password');
            return userData;
        }
        throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        addUser: async (_parent, { username, email, password }, context) => {
        const user = await context.models.User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
        },
        login: async (_parent, { email, password }, context) => {
        const user = await context.models.User.findOne({ email });
        if (!user) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
        if (context.user) {
            const updatedUser = await context.models.User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: input } },
            { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
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