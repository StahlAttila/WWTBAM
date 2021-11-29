const FIREBASE_DOMAIN =
  "https://react-api-ad59c-default-rtdb.europe-west1.firebasedatabase.app";
const API_KEY = process.env.REACT_APP_API_KEY;

export async function signIn(credentials) {
  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
      API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error.message || "Authentication failed!");
  }

  const userDetailsResponse = await getUserDataByEmail(credentials.email);

  let userDetails;

  for (const key in userDetailsResponse) {
    if (userDetailsResponse[key].email === credentials.email) {
      userDetails = { ...userDetailsResponse[key] };
    }
  }

  return {
    tokenData: {
      token: data.idToken,
      refreshToken: data.refreshToken,
      expirationTime: new Date(new Date().getTime() + +data.expiresIn * 1000),
    },
    userData: userDetails,
  };
}

export async function signUp(credentials) {
  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication error!");
  }

  addUserToDatabase({
    username: credentials.username,
    email: credentials.email,
  });

  return data;
}

async function getUserDataByEmail(email) {
  const response = await fetch(`${FIREBASE_DOMAIN}/users.json`);
  const data = response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch User data.");
  }

  return data;
}

async function addUserToDatabase(user) {
  //validation to not be able to add username that already exists

  //store any kind of user related infos
  const response = await fetch(`${FIREBASE_DOMAIN}/users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not add new user!");
  }

  return null;
}

// export async function getAllQuotes() {
//   const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not fetch quotes.');
//   }

//   const transformedQuotes = [];

//   for (const key in data) {
//     const quoteObj = {
//       id: key,
//       ...data[key],
//     };

//     transformedQuotes.push(quoteObj);
//   }

//   return transformedQuotes;
// }

// export async function getSingleQuote(quoteId) {
//   const response = await fetch(`${FIREBASE_DOMAIN}/quotes/${quoteId}.json`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not fetch quote.');
//   }

//   const loadedQuote = {
//     id: quoteId,
//     ...data,
//   };

//   return loadedQuote;
// }

// export async function addQuote(quoteData) {
//   const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`, {
//     method: 'POST',
//     body: JSON.stringify(quoteData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not create quote.');
//   }

//   return null;
// }

// export async function addComment(requestData) {
//   const response = await fetch(`${FIREBASE_DOMAIN}/comments/${requestData.quoteId}.json`, {
//     method: 'POST',
//     body: JSON.stringify(requestData.commentData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not add comment.');
//   }

//   return { commentId: data.name };
// }

// export async function getAllComments(quoteId) {
//   const response = await fetch(`${FIREBASE_DOMAIN}/comments/${quoteId}.json`);

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not get comments.');
//   }

//   const transformedComments = [];

//   for (const key in data) {
//     const commentObj = {
//       id: key,
//       ...data[key],
//     };

//     transformedComments.push(commentObj);
//   }

//   return transformedComments;
// }
