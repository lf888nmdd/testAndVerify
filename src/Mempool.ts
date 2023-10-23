import axios from "axios"
import ErrorLog from './errorlog'
class MempoolApi {
    //https://mempool.space
    baseUrl: string = ''
    constructor(url: string) {
        this.baseUrl = url
    }


    async getTx(txid: string) {
        try {
            const res = await axios.get<string, any>(`${this.baseUrl}/api/tx/${txid}/hex`)
            if (res.status == 200) {
                return res.data
            }
        } catch (e) {
            // console.log('错误回调----------', e, '终止-----------1', e.response.status, '终止-----------2', e.response.data, '终止-----------3')
            if (e.response.status == 404 && e.response.data == 'Transaction not found') {
                return false
            } else {
                throw new Error(e)
            }
        }

    }

    async pushTx(txHex: string) {
        try {
            const _res = await axios.post<string>(`${this.baseUrl}/api/tx`, txHex)
            return _res.data

        } catch (e) {
            console.log('同步失败-------', e.response.config.method)
            console.log(e.response.config.url)
            console.log(e.response.config.data)
            console.log(e.response.status)
            console.log(e.response.data)
            const errorLog = new ErrorLog()
            errorLog.addTest(e.response,0)
            if (!e.response.status) {
                throw new Error('错误------')
            }
        }



    }

    async blocks() {
        const _res1 = await axios.get<object>(`${this.baseUrl}/api/v1/blocks`)
        return _res1.data[0].height
    }

}


export default MempoolApi