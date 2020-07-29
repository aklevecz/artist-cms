import { AUTH_ERROR } from "./constants"
import refreshToken from "./refresh-token"

export default error => {
  if (error.message === AUTH_ERROR) {
    refreshToken()
  }
}
