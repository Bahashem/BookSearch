import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {  
    loginUser(useremail: $useremail, password: $password) {
      token
      user {
        id
        username
        email
        bookCount
        savedBooks {
          bookId
          author
          description
          title
          image
          link
        }
      }
    }
  };
`;
export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(username: $userName, email: $email, password: $password) {
    _id
        username
        email
        password
        }   
    token
    user {
      _id
        username
        email
        bookCount
        savedBooks {
          bookId
          author
          description
          title
          image
          link
        }
    }
    `;
   
export const SAVE_BOOK = gql`
  mutation SaveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      author
      description
      title
      bookId
      image
      link
    }
      user {
      _id
        username
        email
        bookCount
        savedBooks {
          bookId
          author
          description
          title
          image
          link
  }
  }
  }
 `;  

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        description
        image
        link
      }
    }
  }

  token
}
}
`;