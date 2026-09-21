import axios from "axios"
import { env } from "./runtimeEnv"

axios.defaults.baseURL = env.VITE_FINANCES_API_URL

export default axios
