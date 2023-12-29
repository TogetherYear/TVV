import { EventSystem } from "@/libs/EventSystem";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Axios请求
 */
class AppRequest extends EventSystem {
    private constructor() { super() }

    private static instance = new AppRequest()

    public static get Instance() { return this.instance }

    private request!: AxiosInstance

    public get R() { return this.request }

    private static isLogSuccess = false

    private static outCode = 401

    public Run() {
        if (!window.Debug) {
            (window as any).AppRequest = this
        }
        this.CreateRequest()
    }

    private CreateRequest() {
        this.request = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        })
        this.SetRequest()
        this.SetResponse()
    }

    private SetRequest() {
        this.R.interceptors.request.use(
            (config: any) => {
                if (config && config.headers) {
                    config.headers['x-auth-token'] = this.GetAuthToken()
                    config.baseURL = import.meta.env.VITE_APP_SERVER_PORT
                    return config
                }

            },
            error => {
                return Promise.reject(error)
            },
        )
    }

    private SetResponse() {
        this.R.interceptors.response.use(
            response => {
                if (AppRequest.isLogSuccess) {
                    Debug.Warn('URL: ' + response.config.baseURL + response.config.url, '\nData: ', response.data, '\nResponse:', response)
                }
                if (response.data.code && response.data.code !== 0) {
                    Debug.Error(response.data.message)
                    Message.error(response.data.message)
                }
                return response
            },
            err => {
                if (err.response?.status == AppRequest.outCode) {
                    Dialog.destroyAll()
                    Dialog.error({
                        title: 'Token过期',
                        content: '请重新登录更新Token',
                        positiveText: '确定',
                        closable: false,
                        maskClosable: false,
                        onPositiveClick: () => {
                            this.ResetAccount()
                            Message.error('登录凭证过期')
                        }
                    })
                }
                return Promise.reject(err)
            },
        )
    }

    private ResetAccount() {
        this.SetAuthToken('')
        this.SetUserName('')
    }

    public GetAuthToken() {
        return localStorage.getItem('TAURITOKEN') || ''
    }

    public SetAuthToken(token: string) {
        localStorage.setItem('TAURITOKEN', token)
    }

    public GetUserName() {
        return localStorage.getItem('TAURIUSERNAME') || ''
    }

    public SetUserName(name: string) {
        localStorage.setItem('TAURIUSERNAME', name)
    }

    public SetRemember(e: boolean) {
        localStorage.setItem('TAURIREMEMBER', e ? '1' : '0')
    }

    public GetRemember() {
        const r = localStorage.getItem('TAURIREMEMBER')
        return !r || r == '1'
    }

    public Get(url: string, config?: AxiosRequestConfig) {
        if (this.R) {
            return this.R.get(url, config)
        }
    }

    public Post(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) {
        if (this.R) {
            return this.R.post(url, data, config)
        }
    }
}

export { AppRequest }
