const leaderboardURL = "https://wedev-api.sky.pro/api/leaderboard";

export async function getLeaders() {
  const response = await fetch(leaderboardURL, {
    method: "GET",
  });
  if (response.status !== 200) {
    throw new Error("Невозможно получить список лидеров");
  } else {
    const data = await response.json();
    console.log(data);

    return data;
  }
}

export async function addLeader({ name, time }) {
  const response = await fetch(leaderboardURL, {
    method: "POST",
    body: JSON.stringify({ name, time }),
  });
  if (response.status === 201) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Не удалось загрузить список лидеров, попробуйте снова");
  }
}
