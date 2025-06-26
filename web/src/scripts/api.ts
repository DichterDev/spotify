import { useAuthStore } from "@/stores/auth";
import ky, { HTTPError } from "ky";

export const spotify = ky.create({ 
  prefixUrl: 'https://api.spotify.com/v1/', 
  timeout: 3000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = useAuthStore().getToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        console.log(response.status)
        if (response.status === 401) {
          useAuthStore().logout()
        }
      }
    ],
    beforeError: [
      err => {
          const error: HTTPError = err
          const { response } = error

          return error
      }
    ]
  }
})