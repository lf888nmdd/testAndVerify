import axios from "axios"
class BlockstreamApi{

    //https://blockstream.info
    baseUrl:string=''
    constructor(url:string){
      this.baseUrl=url
    }
 
   async getTx(txid:string){
     const res=await axios.get<string>(`${this.baseUrl}/tx/${txid}/hex`)
     return res.data
   }
 
   async pushTx(txHex:string){
     const _res=await axios.post<string>(`${this.baseUrl}/api/tx`,txHex)
     return _res.data
   }
 
   async blocks(){
     const _res1=await axios.get<object>(`${this.baseUrl}/api/blocks`)
     return _res1.data[0].height
   }
 
 }

 export default BlockstreamApi