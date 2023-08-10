import axios from "axios";
export default function Unsplash() {
  axios.create({
    //create an instance of an axios client
    baseURL: "https://api.unsplash.com",
    headers: {
      Authorization: "Client-ID 5c3Oqk6IPEjEQCoslGF_jKPZyNodVyl8aqbdCTAhepI",
    },
  });
}
