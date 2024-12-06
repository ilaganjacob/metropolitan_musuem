import { getToken } from "./authenticate";

//same function so we can reuse instead of writing again and again
async function requestMake(route, method) {
  const token = getToken();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route}`, {
      method,
      headers: {
        "content-type": "application/json",
        Authorization: `JWT ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Request failed: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

export async function addToFavourites(id) {
  return await requestMake(`favourites/${id}`, "PUT");
}

export async function removeFromFavourites(id) {
  return await requestMake(`favourites/${id}`, "DELETE");
}

export async function getFavourites() {
  return await requestMake(`favourites`, "GET");
}

export async function addToHistory(id) {
  return await requestMake(`history/${id}`, "PUT");
}

export async function removeFromHistory(id) {
  return await requestMake(`history/${id}`, "DELETE");
}

export async function getHistory() {
  return await requestMake(`history`, "GET");
}
