import React from "react"

const bb =
  "Mzc2NDdmMzNlNzA0NDRkYmIxYzU3ODYzZTA5OTkzOGQ6YzQyZjhkODM4ZjE2NGQ5MTg5MmJhNzdkOWE3NTk1ZjE"
const Callback = () => {
  const code = window.location.search.split("?code=")[1]
  const redirect_uri = "http://localhost:8000/callback"
  fetch("https://accounts.spotify.com/api/token", {
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}`,
    headers: {
      Authorization: "Basic " + bb,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then(r => r.json())
    .then(data => {
      localStorage.setItem("refrashT", data.refresh_token)
      localStorage.setItem("arcsasT", data.access_token)
      window.close()
    })
    .catch(error => {
      localStorage.setItem("error", error)
      window.close()
    })

  return <div style={{ fontSize: 100, color: "white" }}>YAY</div>
}

export default Callback
