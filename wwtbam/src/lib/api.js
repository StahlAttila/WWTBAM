const FIREBASE_DOMAIN = process.env.REACT_APP_BASE_URL;
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

  const userDetails = await getUserDataByEmail(credentials.email);

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

  // const userDetailsResponse = await data.json();
  const userDetailsResponse = await data;

  let userDetails;

  for (const key in userDetailsResponse) {
    if (userDetailsResponse[key].email === email) {
      userDetails = { ...userDetailsResponse[key] };
    }
  }

  return userDetails;
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
