import bitcore from "bitcore-lib";
import axios from 'axios'
import mempoolJS from "@mempool/mempool.js";
import QueryApi from './Query'
import MempoolApi from './Mempool'
import BlockstreamApi from './Blockstream'
import ErrorLog from './errorlog'


// QueryApi 同步至 MempoolApi
export async function syncFromQueryToMempool() {
  try {
    const blocka = new QueryApi('https://query-api.unisat.io')
    const blockb = new MempoolApi('https://mempool.space')
    const list = await blocka.getMempool()

    // let itemI = 0
    // for (let i = 0; i < list.length; i++) {
    //   if (list[i] == '') {
    //     itemI = i
    //     console.log('下标', i, '-----')
    //   }
    // }

    // console.log('start',list.length)

    let synced_count = 0
    let skipped_count = 0
    for (let i = 0; i < list.length; i++) {
      const txid = list[i]
      const txInfo = await blockb.getTx(txid)
      if (!txInfo) {
        console.log('synced', txid)
        const rawtx = await blocka.getRawTx(txid)
        // console.log('-----------------------', rawtx)
        await blockb.pushTx(rawtx)
        synced_count++
      } else {
        skipped_count++
        console.log('skipped', txid, ` ${i}/${list.length - 1} `)
      }
    }
    //总数多少                同步多少                  跳过多少
    // console.log('total',total_count,' synced',synced_count,' skipped',skipped_count)
    console.log('total', list.length, ' synced', synced_count, ' skipped', skipped_count)

  } catch (e) {
    console.log('其他错误-------', e.response.config.method)
  }

}


//A------------C
export async function syncFromQueryToBlockstream() {
  const blocka = new QueryApi('https://query-api.unisat.io')
  const blockc = new BlockstreamApi('https://blockstream.info')

  const list = await blocka.getMempool()
  list.forEach(async (item) => {
    const txInfo = await blockc.getTx(item)
    if (!txInfo) {
      const rawtx = await blocka.getRawTx(item)
      await blockc.pushTx(rawtx)
    }
  })

}



export async function syncTx2(value: string) {
  syncFromQueryToMempool()
}

export async function checkBlockStatus() {
  try {
    const queryApi = new QueryApi('https://query-api.unisat.io')
    const mempoolApi = new MempoolApi('https://mempool.space')
    const blockstreamApi = new BlockstreamApi('https://blockstream.info')
    console.log(`${await queryApi.blocks()}--------${await mempoolApi.blocks()}---------${await blockstreamApi.blocks()}`)
    if (await queryApi.blocks() == await mempoolApi.blocks() && await queryApi.blocks() == await blockstreamApi.blocks()) {
      console.log(await queryApi.blocks() + ' block the same ')
    } else {
      throw new Error('block different')
    }

  } catch (e) {
    console.log(e)
  }
}
//检测数据是否同步
function testAndVerifyIf(res1: any, res2: any, url1: string, url2: string, urlName: string) {


  const errorLog = new ErrorLog()
  let data: any = []
  let resLength: number = res1.length >= res2.length ? res1.length : res2.length
  for (let i = 0; i < resLength; i++) {
    if (JSON.stringify(res1[i]) != JSON.stringify(res2[i]) && data != true) {
      let resLengthj: number = res1[i].length >= res2[i].length ? res1[i].length : res2[i].length
      for (let j = 0; j < resLengthj; j++) {
        if (res1[i][j].height != res2[i][j].height || res1[i][j].total != res2[i][j].total || res1[i][j].start != res2[i][j].start) {
          data.push({ url: `${url1}${urlName}`, data: { height: res1[i][j].height, total: res1[i][j].total, start: res1[i][j].start } })
          data.push({ url: `${url2}${urlName}`, data: { height: res2[i][j].height, total: res2[i][j].total, start: res2[i][j].start, gn: '/-----------------/' } })
          errorLog.addTest(data, 1)
          return
        } else {
          if (JSON.stringify(res1[i][j].detail) != JSON.stringify(res2[i][j].detail)) {
            let detailLength: number = res1[i][j].detail.length >= res2[i][j].detail.length ? res1[i][j].detail.length : res2[i][j].detail.length
            for (let d = 0; d < detailLength; d++) {
              if (JSON.stringify(res1[i][j].detail[d]) != JSON.stringify(res2[i][j].detail[d])) {
                data.push({ url: `${url1}${urlName}`, data: { detail: res1[i][j].detail[d] } })
                data.push({ url: `${url2}${urlName}`, data: { detail: res2[i][j].detail[d], gn: '/-----------------/' } })
                errorLog.addTest(data, 1)
                return 
              }
            }
          }
        }
      }
    }
  }
}

function statusFun(res1: any, res2: any, url1: string, url2: string, urlName: string) {
  const errorLog = new ErrorLog()
  let data: any = []
  if ((res1.height != res2.height || res1.total != res2.total || res1.start != res2.start) && (data != true)) {
    data.push({ url: `${url1}${urlName}`, data: { height: res1.height, total: res1.total, start: res1.start } })
    data.push({ url: `${url2}${urlName}`, data: { height: res2.height, total: res2.total, start: res2.start, gn: '/-----------------/' } })
    errorLog.addTest(data, 1)
  } else {
    if ((JSON.stringify(res1.detail) != JSON.stringify(res2.detail)) && (data != true)) {
      let detailLength = res1.detail.length >= res2.detail.length ? res1.detail.length : res2.detail.length
      for (let i = 0; i < detailLength; i++) {
        if (JSON.stringify(res1.detail[i]) != JSON.stringify(res2.detail[i])) {
          data.push({ url: `${url1}${urlName}`, data: { detail: res1.detail[i] } })
          data.push({ url: `${url2}${urlName}`, data: { detail: res2.detail[i], gn: '/-----------------/' } })
          errorLog.addTest(data, 1)
        }
      }
    }
  }

}

async function checkIsQueryApisConsistent(res1: object, res2: object, url1: string, url2: string) {
  const errorLog = new ErrorLog()
  let data: any = []

  let obj = {
    consistent: true,
    msg: 'different data'
  }

  if (JSON.stringify(res1[0]) != JSON.stringify(res2[0])) {
    obj.consistent = false
    obj.msg = 'data consistency'
    console.log(`不一致数据接口1${url1}/brc20/bestheight-----${url2}/brc20/bestheight`)
    data.push({ url: `${url1}/brc20/bestheight`, data: res1[0] })
    data.push({ url: `${url2}/brc20/bestheight`, data: res2[0] })
    errorLog.addTest(data, 1)
  }

  if (JSON.stringify(res1[1]) != JSON.stringify(res2[1])) {
    obj.consistent = false
    obj.msg = 'data consistency'
    console.log(`不一致数据接口2${url1}/brc20/status-----${url2}/brc20/status${await res1[1][0]}`)
    statusFun(res1[1], res2[1], url1, url2, '/brc20/status')
  }

  if (JSON.stringify(res1[2][0]) != JSON.stringify(res2[2][0])) {
    obj.consistent = false
    obj.msg = 'data consistency'
    console.log(`不一致数据接口3${url1}/brc20/{ticker}/history-----${url2}/brc20/{ticker}/history`)
    testAndVerifyIf(res1[2][0], res2[2][0], url1, url2, '/brc20/{ticker}/history')
  }

  if (JSON.stringify(res1[2][1]) != JSON.stringify(res1[2][1])) {
    obj.consistent = false
    obj.msg = 'data consistency'
    console.log(`不一致数据接口4${url1}/brc20/{ticker}/holders-----${url2}/brc20/{ticker}/holders`)
    testAndVerifyIf(res1[2][1], res2[2][1], url1, url2, '/brc20/{ticker}/holders')
  }
  if (JSON.stringify(res1[2][2]) != JSON.stringify(res1[2][2])) {
    obj.consistent = false
    obj.msg = 'data consistency'
    console.log(`不一致数据接口5${url1}/brc20/{ticker}/info-----${url2}/brc20/{ticker}/info`)
    testAndVerifyIf(res1[2][2], res2[2][2], url1, url2, '/brc20/{ticker}/info')
  }
  return obj
}

export async function queryContrast() {
  try {
    let url1 = 'https://query-api.unisat.io/api-t1'
    let url2 = 'https://query-api.unisat.io/api-t2'

    // const queryApi1= new QueryApi("https://query-api.unisat.io/api-brc20")
    // const queryApi2= new QueryApi("https://query-api.unisat.io/api-inscribe")

    // const queryApi1 = new QueryApi('https://query-api.unisat.io/api-m2')
    // const queryApi2 = new QueryApi('https://query-api.unisat.io/api-brc20')

    const queryApi1 = new QueryApi(url1)
    const queryApi2 = new QueryApi(url2)
    const res1 = await queryApi1.contrast()
    const res2 = await queryApi2.contrast()
    // console.log('1-1-1--1-1--1--1-1-1-1-1--1-1-1--1-',res1[1][0])
    const { consistent, msg } = await checkIsQueryApisConsistent(res1, res2, url1, url2)
    if (consistent) {
      console.log("两边数据一致")
    } else {
      console.log("两边数据不一致", msg)
    }
  } catch (e) {
    console.log('报错Error-------', e.response.config.method)
    console.log(e.response.config.url)
    console.log(e.response.config.data)
    console.log(e.response.status)
    // console.log(e.response.data)
  }

}



// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   return config;
//   console.log('错误--------------12345',config)
// }, function (error) {
//   // 对请求错误做些什么
//   console.log('错误--------------123',error)
//   return Promise.reject(error);
// });

// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   console.log('对响应数据做点什么',response)
//   return response;
// }, function (error) {
//   // 对响应错误做点什么
//   console.log('对响应错误做点什么',error,'d--------------------111111111111111111111111111111111111111')
//   return Promise.reject(error);
// });

// const erry ='sendrawtransaction RPC error: {"code":-27,"message":"Transaction already in block chain"}'

// class BlockstreamApi {

//   async getRawTx(txid: string) {
//     const _res = await axios.get<string>(`https://blockstream.info/api/tx/${txid}/hex`);
//     if (_res.status != 200) {
//       throw new Error('request faield')
//     }
//     return _res.data
//   }

//   async getTx() {

//   }

//   async pushTx(txHex: string) {
//     const _res = await axios.post<string>(`https://blockstream.info/api/tx`, txHex);
//     if (_res.status != 200 ) {
//       throw new Error('request faield')
//     }
//     return _res.data
//   }
// }

// class MempoolApi {
//   async getRawTx(txid: string) {
//     const dataTxid2 = await axios.get<string>(`https://mempool.space/api/tx/${txid}/hex`);
//     if (dataTxid2.status != 200) {
//       throw new Error('request faield')
//     }
//     return dataTxid2.data
//   }
//   async getTx() {

//   }
//   async pushTx(txHex: string) {
//     const res = await axios.post<string>('https://mempool.space/api/tx', txHex);
//     if (res.status != 200) {
//       throw new Error('request faield')
//     }
//     return res.data
//   }
// }
// export async function syncTx2(value: string) {
//   try {
//     const txid = value;
//     const blockstreamApi = new BlockstreamApi();
//     const mempoolApi = new MempoolApi();
//     const rawtx = await blockstreamApi.getRawTx(txid)
//     const _res1=await mempoolApi.pushTx(rawtx)      //

//     const rawtx2 = await mempoolApi.getRawTx(txid)
//     const _res2=await blockstreamApi.pushTx(rawtx)  //
//     if(_res1&&_res2){
//       return true
//     }else{
//       return false
//     }
//   } catch (e) {
//     const err ='sendrawtransaction RPC error: {"code":-27,"message":"Transaction already in block chain"}'
//     if(e.response.data!=err){
//       console.log(e)
//       return false
//     }else{
//       return true
//     }
//   }

// }

// class QueryApi {
//  async getMempool(){
//     const list =await axios.get<object,any>('https://query-api.unisat.io/api-brc20/getrawmempool');
//     // console.log(list.data.data)
//     return list.data.data

//   }

//   async getRawTx(txid:string){
//     const res = await axios.get<string>(`https://mempool.space/api/tx/${txid}/hex`)
//     return res.data

//   }

// }

// class Queryapi2 {
//   async getTx(txid:string){
//     const res = await axios.get<string>(`https://blockstream.info/api/tx/${txid}/hex`)
//     return res.data
//   }

//   async pushTx(txHex:string){
//     const _res = await axios.post<string>('https://blockstream.info/api/tx')
//     return _res.data
//   }


// }



// export async function syncTx2(value:string){
//   const queryApi = new QueryApi();
//   const queryapi2 = new Queryapi2()
//   const list = await queryApi.getMempool();
//   console.log(`${list.length} need to synced.`)
//   let syncedCount = 0;
//   for(let i=0;i<10;i++){
//     const txid = list[i];
//     const txinfo = await queryapi2.getTx(txid)
//     if(!txinfo){
//       console.log(syncedCount)
//       const rawtx = await queryApi.getRawTx(txid);
//       await queryapi2.pushTx(rawtx)
//       console.log('push success',txid)
//       syncedCount++;
//     }
//   }
//   console.log('sync finish',syncedCount)
// }


//data: 'sendrawtransaction RPC error: {"code":-27,"message":"Transaction already in block chain"}'

// class QueryApi{
//   //https://query-api.unisat.io
//   baseUrl:string=''
//   constructor(url:string){
//     this.baseUrl=url
//   }
//   async getMempool(){
//     const list =await axios.get<{
//       code:number;
//       msg:string;
//       data:any
//     }>(`${this.baseUrl}/api-brc20/getrawmempool`);
//     const {code,msg,data} = list.data
//     console.log(data,'-----------')
//     return data
//   }
//   async getRawTx(txid:string){
//     const _res=await axios.get<string>(`${this.baseUrl}/api-brc20/tx/${txid}`)
//     return _res.data
//   }
//   async blocks(){
//     const _res1=await axios.get<{
//       code:number;
//       msg:string;
//       data:{
//           blocks:number;
//       }
//     }>(`${this.baseUrl}/api-brc20/blockchain/info`)
//     const {code,msg,data} = _res1.data;
//     if(code!==0){
//       throw new Error(msg)
//     }
//     return data.blocks;
//   }

// }


// class MempoolApi{
//   //https://mempool.space
//   baseUrl:string=''
//   constructor(url:string){
//     this.baseUrl=url
//   }


//   async getTx(txid:string){
//     const res=await axios.get<string>(`${this.baseUrl}/api/tx/${txid}/hex`)
//     return res.data
//   }

//   async pushTx(txHex:string){
//     const _res=await axios.post<string>(`${this.baseUrl}/api/tx`,{txHex})
//     return _res.data
//   }

//   async blocks(){
//     const _res1=await axios.get<object>(`${this.baseUrl}/api/v1/blocks`)
//     return _res1.data[0].height
//   }

// }


// class BlockstreamApi{

//    //https://blockstream.info
//    baseUrl:string=''
//    constructor(url:string){
//      this.baseUrl=url
//    }

//   async getTx(txid:string){
//     const res=await axios.get<string>(`${this.baseUrl}/tx/${txid}/hex`)
//     return res.data
//   }

//   async pushTx(txHex:string){
//     const _res=await axios.post<string>(`${this.baseUrl}/api/tx`,{txHex})
//     return _res.data
//   }

//   async blocks(){
//     const _res1=await axios.get<object>(`${this.baseUrl}/api/blocks`)
//     return _res1.data[0].height
//   }

// }

//A-----------B
// export async function syncFromQueryToMempool(){
//   const blocka=new QueryApi('https://query-api.unisat.io')
//   const blockb=new MempoolApi('https://mempool.space')
//   const list =await blocka.getMempool()
//   let synced_count=0
//   let skipped_count=0
//   for(let i=0;i<list.length;i++){
//     const txid=list[i]
//     const txInfo=await blockb.getTx(txid)
//     if(!txInfo){
//        const rawtx = await blocka.getRawTx(txid)
//       await blockb.pushTx(rawtx)
//       console.log('synced',txid)
//       synced_count++
//     }else{
//       skipped_count++
//       console.log('skipped',txid)
//     }
//   }
//                         //总数多少                同步多少                  跳过多少
//   // console.log('total',total_count,' synced',synced_count,' skipped',skipped_count)
//   console.log('total',list.length,' synced',synced_count,' skipped',skipped_count)
// }


// //A------------C
// export async function syncFromQueryToBlockstream(){
//   const blocka=new QueryApi('https://query-api.unisat.io')
//   const blockc=new BlockstreamApi('https://blockstream.info')
//   const list =await blocka.getMempool()
//   list.forEach(async (item)=>{
//     const txInfo=await blockc.getTx(item)
//     if(!txInfo){
//        const rawtx = await blocka.getRawTx(item)
//       await blockc.pushTx(rawtx)
//     }
//   })

// }



// export async function syncTx2(value:string){
//   syncFromQueryToMempool()
// }






// class CheckBlockContrast{
//   async heightConstrast(){


//     const _res1=await axios.get<object,any>('https://query-api.unisat.io/api-brc20/blockchain/info')
//     const _res2=await axios.get<object>('https://mempool.space/api/v1/blocks')
//     const _res3=await axios.get<object>('https://blockstream.info/api/blocks')


//     console.log(_res1.data.data.blocks)
//     console.log(_res2.data[0].height)
//     console.log(_res3.data[0].height)
//     const _res1Block=_res1.data.data.blocks
//     const _res2Block=_res2.data[0].height
//     const _res3Block=_res3.data[0].height
//     if(_res1Block==_res2Block&&_res1Block==_res3Block){
//       console.log(_res1.data.data.blocks+' block the same ')
//     }else{
//       throw new Error('block different')
//     }
//   }
// }


// export async function checkBlockStatus(){
//   try{
//     const queryApi=new QueryApi('https://query-api.unisat.io')
//     const mempoolApi=new MempoolApi('https://mempool.space')
//     const blockstreamApi=new BlockstreamApi('https://blockstream.info')
//     console.log(`${await queryApi.blocks()}--------${await mempoolApi.blocks()}---------${await blockstreamApi.blocks()}`)
//     if(await queryApi.blocks()==await mempoolApi.blocks()&&await queryApi.blocks()==await blockstreamApi.blocks()){
//       console.log(await queryApi.blocks()+' block the same ')
//     }else{
//       throw new Error('block different')
//     }

//   }catch(e){
//     console.log(e)
//   }
// }


