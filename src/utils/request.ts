import axios, {
  RawAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";

// Set base URL for the API
axios.defaults.baseURL = "http://localhost:3000/api";

axios.interceptors.response.use((response) => response, axiosErrorHandler);
axios.interceptors.request.use((request) => request, axiosErrorHandler);

type TError = {
  status: number;
  data: any;
  message: any;
  config: AxiosRequestConfig<any> | undefined;
};

function axiosErrorHandler(error: AxiosError) {
  // let err = {};
  // if (error.response) {
  //   // The request was made and the server responded with a status code
  //   // that falls out of the range of 2xx
  //   const errRes = error.response;

  //   err = { ...errRes, message: error.message };
  // } else if (error.request) {
  //   // The request was made but no response was received
  //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //   // http.ClientRequest in node.js
  //   // console.log(error.request);
  // } else {
  //   // Something happened in setting up the request that triggered an Error
  //   // console.log("Error", error.message);
  // }
  return new Promise((_, rej) => rej(error));
}

const defaultRequestConfig: RawAxiosRequestConfig = {
  validateStatus(status: number) {
    return status.toString().at(0) !== "5" && status.toString().at(0) !== "4";
  },
};

export const getRequest = <T>(
  path: string,
  config = defaultRequestConfig
): Promise<AxiosResponse<T, RawAxiosRequestConfig<T>>> => {
  return axios.get<T, AxiosResponse<T>, RawAxiosRequestConfig<T>>(path, {
    ...config,
  });
};

export const postRequest = <T>(
  path: string,
  data: T,
  config = defaultRequestConfig
): Promise<AxiosResponse<T, RawAxiosRequestConfig<T>>> => {
  return axios.post(path, data, { ...config });
};

export const patchRequest = <T>(
  path: string,
  data: T,
  config = defaultRequestConfig
): Promise<AxiosResponse<T, RawAxiosRequestConfig<T>>> => {
  return axios.patch(path, data, { ...config });
};

export const putRequest = <T>(
  path: string,
  data: T,
  config = defaultRequestConfig
): Promise<AxiosResponse<T, RawAxiosRequestConfig<T>>> => {
  return axios.put(path, data, { ...config });
};

export const deleteRequest = <T>(
  path: string,
  config = defaultRequestConfig
): Promise<AxiosResponse<T, RawAxiosRequestConfig<T>>> => {
  return axios.delete(path, { ...config });
};
